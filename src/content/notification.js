// notification.js - Centralized notification system

// Show loading notification for email generation
export function showLoadingNotification(message = "Generating email...") {
  removeExistingNotification();

  const notification = createNotificationElement();
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div class="loading-spinner"></div>
      <span>${message}</span>
    </div>
  `;

  // Add loading-specific styles
  notification.style.background = "#1a73e8";

  addNotificationStyles();
  document.body.appendChild(notification);

  return notification;
}

// Show success notification
export function showSuccessNotification(message) {
  removeExistingNotification();

  const notification = createNotificationElement();
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 16px;">✓</span>
      <span>${message}</span>
    </div>
  `;

  notification.style.background = "#34a853";

  addNotificationStyles();
  document.body.appendChild(notification);

  // Auto-hide success notifications
  setTimeout(() => {
    hideNotification(notification);
  }, 3000);
}

// Show error notification
export function showErrorNotification(message) {
  removeExistingNotification();

  const notification = createNotificationElement();
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 16px;">⚠️</span>
      <span>${message}</span>
    </div>
  `;

  notification.style.background = "#ea4335";

  addNotificationStyles();
  document.body.appendChild(notification);

  // Auto-hide error notifications after longer delay
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
}

// Show warning notification (for missing threadId, etc.)
export function showWarningNotification(message) {
  removeExistingNotification();

  const notification = createNotificationElement();
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 16px;">⚡</span>
      <span>${message}</span>
    </div>
  `;

  notification.style.background = "#ff9800";

  addNotificationStyles();
  document.body.appendChild(notification);

  setTimeout(() => {
    hideNotification(notification);
  }, 4000);
}

// Helper functions
function createNotificationElement() {
  const notification = document.createElement("div");
  notification.id = "emailhelper-notification";
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-family: 'Google Sans', Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideInRight 0.3s ease-out;
    min-width: 200px;
  `;

  return notification;
}

function removeExistingNotification() {
  const existing = document.getElementById("emailhelper-notification");
  if (existing) existing.remove();

  // Also remove any existing styles
  const existingStyle = document.getElementById(
    "emailhelper-notification-styles"
  );
  if (existingStyle) existingStyle.remove();
}

function addNotificationStyles() {
  // Only add styles if they don't exist
  if (document.getElementById("emailhelper-notification-styles")) return;

  const style = document.createElement("style");
  style.id = "emailhelper-notification-styles";
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  `;

  document.head.appendChild(style);
}

function hideNotification(notification) {
  if (notification && notification.parentNode) {
    notification.style.animation = "slideOutRight 0.3s ease-out";
    setTimeout(() => {
      notification.remove();
      // Clean up styles if no more notifications
      const remaining = document.getElementById("emailhelper-notification");
      if (!remaining) {
        const style = document.getElementById(
          "emailhelper-notification-styles"
        );
        if (style) style.remove();
      }
    }, 300);
  }
}

// Manually hide notification (useful for loading states)
export function hideCurrentNotification() {
  const notification = document.getElementById("emailhelper-notification");
  if (notification) {
    hideNotification(notification);
  }
}
