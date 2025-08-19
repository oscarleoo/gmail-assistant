import { pasteEmailIntoCompose } from "./pasteEmail.js";
import {
  showLoadingNotification,
  showSuccessNotification,
  showErrorNotification,
  showWarningNotification,
  hideCurrentNotification,
} from "./notification.js";
import { waitForGmail } from "../utils/gmailDetection.js";
import { ThreadMonitor } from "./threadMonitor.js";

let threadMonitor;

// Initialize when Gmail is ready
waitForGmail().then(() => {
  console.log("Gmail interface detected, EmailHelper ready");
  initializeEmailHelper();
});

async function initializeEmailHelper() {
  try {
    await waitForGmail();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Initialize thread monitoring
    threadMonitor = new ThreadMonitor((threadId) => {
      // Send thread ID to background script
      chrome.runtime.sendMessage({
        action: "saveThreadId",
        threadId: threadId,
      });
    });

    threadMonitor.start();
  } catch (error) {
    console.error("Failed to initialize EmailHelper:", error);
  }
}

// Handle messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "pasteEmail":
      pasteEmailIntoCompose(request.text);
      break;
    case "showLoading":
      showLoadingNotification(request.message);
      break;
    case "showError":
      showErrorNotification(request.message);
      break;
    case "showWarning":
      showWarningNotification(request.message);
      break;
    case "hideNotification":
      hideCurrentNotification();
      break;
  }
  sendResponse({ success: true });
});
