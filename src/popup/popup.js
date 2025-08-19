// EmailHelper Popup Script

document.addEventListener("DOMContentLoaded", function () {
  console.log("EmailHelper popup loaded");

  // Update keyboard shortcuts based on platform
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const keyElements = document.querySelectorAll(".key");

  if (isMac) {
    keyElements.forEach((element) => {
      // Update shortcuts for Mac: Alt+Shift instead of Ctrl+Shift
      element.textContent = element.textContent.replace(
        "Ctrl+Shift",
        "Alt+Shift"
      );
    });
  }

  // Add click handlers for shortcuts
  const shortcutItems = document.querySelectorAll(".shortcut-item.clickable");
  const statusElement = document.getElementById("status");

  shortcutItems.forEach((item) => {
    item.addEventListener("click", async function () {
      const command = this.dataset.command;
      await executeCommand(command);
    });
  });

  async function executeCommand(command) {
    try {
      // Show loading status
      showStatus("Executing...", "loading");

      // Check if we're on Gmail first
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.url.includes("mail.google.com")) {
        showStatus("Please open Gmail first", "error");
        return;
      }

      // Send command to background script
      const response = await chrome.runtime.sendMessage({
        action: "executeCommand",
        command: command,
      });

      if (response && response.success) {
        showStatus(getSuccessMessage(command), "success");
        // Close popup after successful execution
        setTimeout(() => window.close(), 1500);
      } else {
        showStatus(response?.error || "Command failed", "error");
      }
    } catch (error) {
      console.error("Error executing command:", error);
      showStatus("Error: " + error.message, "error");
    }
  }

  function showStatus(message, type = "") {
    statusElement.textContent = message;
    statusElement.className = `status ${type}`;

    // Clear status after 3 seconds for non-success messages
    if (type !== "success") {
      setTimeout(() => {
        statusElement.textContent = "";
        statusElement.className = "status";
      }, 3000);
    }
  }

  function getSuccessMessage(command) {
    switch (command) {
      case "open_settings":
        return "Settings opened";
      case "generate_email":
        return "Generating email...";
      case "generate_email_with_instruction":
        return "Instruction modal opened";
      default:
        return "Command executed";
    }
  }

  // Show current status on load
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url.includes("mail.google.com")) {
      showStatus("Ready on Gmail", "success");
    } else {
      showStatus("Open Gmail to use EmailHelper", "");
    }
  });
});
