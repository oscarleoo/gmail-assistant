// EmailHelper Popup Script

document.addEventListener("DOMContentLoaded", function () {
  console.log("EmailHelper popup loaded");

  // Update keyboard shortcuts based on platform
  const isMac = navigator.platform.toLowerCase().includes("mac");
  const keyElements = document.querySelectorAll(".key");

  if (isMac) {
    keyElements.forEach((element) => {
      element.textContent = element.textContent.replace("Ctrl", "Cmd");
    });
  }

  // Add click event for demonstration
  document.querySelector("h1").addEventListener("click", function () {
    console.log("EmailHelper clicked!");
  });
});
