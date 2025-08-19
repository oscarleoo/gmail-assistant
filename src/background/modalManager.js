// Modal management for settings and instructions

import { createSettingsModal } from "./createSettingsModal.js";
import { createInstructionModal } from "./createInstructionModal.js";

export async function openSettingsModal() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url.includes("mail.google.com")) {
      console.log("Not on Gmail");
      return;
    }

    // Get current settings from storage
    const result = await chrome.storage.sync.get("aiInstructions");
    const currentInstructions = result.aiInstructions || "";

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: createSettingsModal,
      args: [currentInstructions],
    });
  } catch (error) {
    console.error("Error opening settings modal:", error);
  }
}

export async function openInstructionModal() {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url.includes("mail.google.com")) {
      console.log("Not on Gmail");
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: createInstructionModal,
    });
  } catch (error) {
    console.error("Error opening instruction modal:", error);
  }
}
