// pasteEmail.js - Simple clipboard functionality

import {
  showSuccessNotification,
  showErrorNotification,
} from "./notification.js";

export async function pasteEmailIntoCompose(emailText) {
  try {
    await navigator.clipboard.writeText(emailText);
    showSuccessNotification("Email copied to clipboard");
    console.log("Email copied to clipboard successfully");
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    showErrorNotification("Failed to copy email");
  }
}
