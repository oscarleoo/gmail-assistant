import { openSettingsModal, openInstructionModal } from "./modalManager.js";
import { generateAndSendEmail } from "./emailGeneration.js";
import { isGmailPage } from "../utils/gmailDetection.js";

let currentThread = {
  threadId: null,
  messages: [],
};

// Listen for keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Early return if not on Gmail
  if (!isGmailPage(tab.url)) {
    console.log("EmailHelper only works on Gmail");
    return;
  }

  switch (command) {
    case "open_settings":
      await openSettingsModal();
      break;

    case "generate_email":
      if (currentThread.threadId) {
        await generateAndSendEmail(currentThread.threadId);
      } else {
        // Show warning about no thread
        chrome.tabs.sendMessage(tab.id, {
          action: "showWarning",
          message: "No email thread detected. Open an email thread first.",
        });
      }
      break;

    case "generate_email_with_instruction":
      if (currentThread.threadId) {
        await openInstructionModal();
      } else {
        // Show warning about no thread
        chrome.tabs.sendMessage(tab.id, {
          action: "showWarning",
          message: "No email thread detected. Open an email thread first.",
        });
      }
      break;

    default:
      console.log("Unknown command:", command);
  }
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "saveThreadId":
      currentThread.threadId = request.threadId;
      currentThread.messages = [];
      console.log("Thread ID saved:", currentThread.threadId);
      sendResponse({ success: true });
      break;

    case "generateEmail":
      generateAndSendEmail(currentThread.threadId, request.instruction)
        .then(() => sendResponse({ success: true }))
        .catch((error) => {
          console.error("Email generation failed:", error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep message channel open for async response
      break;

    default:
      console.log("Unknown action:", request.action);
      sendResponse({ success: false, error: "Unknown action" });
  }
});
