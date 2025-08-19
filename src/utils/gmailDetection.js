// Gmail page detection and initialization utilities

export function isGmailPage(url) {
  return url && url.includes("mail.google.com");
}

export function waitForGmail() {
  return new Promise((resolve) => {
    const checkGmail = () => {
      const basicInterface =
        document.querySelector('[role="main"]') ||
        document.querySelector(".nH");

      const hasContent =
        document.querySelector("[data-thread-perm-id]") ||
        document.querySelector("[data-message-id]") ||
        window.location.href.includes("#inbox/") ||
        window.location.href.includes("#thread-f:");

      if (basicInterface && (hasContent || isInboxView())) {
        console.log("Gmail ready with content");
        resolve();
      } else {
        setTimeout(checkGmail, 500);
      }
    };
    checkGmail();
  });
}

function isInboxView() {
  return (
    window.location.href.includes("#inbox") &&
    !window.location.href.includes("#inbox/")
  );
}
