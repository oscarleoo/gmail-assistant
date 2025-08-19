// Email generation logic

import { getThreadData } from "./gmail.js";
import generateEmail from "../utils/generateEmail.js";

export async function generateAndSendEmail(threadId, instruction = "") {
  const tab = await getCurrentGmailTab();
  if (!tab) {
    throw new Error("Not on Gmail");
  }

  // Show loading state
  await showNotification(tab.id, "showLoading", "Generating email...");

  try {
    const { settings, threadData } = await gatherEmailData(threadId);
    const result = await generateEmail(settings, threadData, instruction);
    await handleGenerationResult(tab.id, result);
    return result;
  } catch (error) {
    console.error("Error in email generation:", error);
    await showNotification(tab.id, "showError", "Failed to generate email");
    throw error;
  }
}

async function getCurrentGmailTab() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.url?.includes("mail.google.com")) {
    return null;
  }

  return tab;
}

async function gatherEmailData(threadId) {
  // Get user settings
  const result = await chrome.storage.sync.get("aiInstructions");
  const settings = result.aiInstructions || "";

  // Get thread data if available
  const threadData = threadId
    ? await getThreadData(threadId)
    : { messages: [] };

  return { settings, threadData: threadData.messages };
}

async function handleGenerationResult(tabId, result) {
  if (result.success) {
    // Send email to clipboard with success notification
    await chrome.tabs.sendMessage(tabId, {
      action: "pasteEmail",
      text: result.email,
    });
  } else {
    // Show error notification
    await showNotification(
      tabId,
      "showError",
      result.error || "Failed to generate email"
    );
  }
}

async function showNotification(tabId, type, message) {
  return chrome.tabs.sendMessage(tabId, {
    action: type,
    message: message,
  });
}
