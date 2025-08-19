// Function to be injected into Gmail page
export function createInstructionModal() {
  // Remove existing modal if present
  const existingModal = document.getElementById(
    "emailhelper-instruction-modal"
  );
  if (existingModal) {
    existingModal.remove();
    return;
  }

  // Create modal overlay
  const overlay = document.createElement("div");
  overlay.id = "emailhelper-instruction-modal";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  `;

  // Create modal content - just the input
  const modal = document.createElement("div");
  modal.style.cssText = `
    padding: 4px;
    background: white;
    border: 2px solid #e8eaed;
    border-radius: 50px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    animation: slideIn 0.3s ease-out;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
  `;

  // Modal HTML content - just input field
  modal.innerHTML = `
    <input 
      type="text"
      id="email-instruction-input" 
      placeholder="Additional instructions, hit enter to send..."
      style="
        width: 100%;
        padding: 16px 20px;
        border: none;
        border-radius: 50px;
        font-size: 16px;
        font-family: inherit;
        outline: none;
        box-sizing: border-box;
      "
    />
  `;

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px) scale(0.95); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Focus the input field
  const input = document.getElementById("email-instruction-input");
  setTimeout(() => input.focus(), 100);

  // Enter key to generate
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      generateEmail();
    }
  });

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", handleEscape);

  function handleEscape(e) {
    if (e.key === "Escape") {
      closeModal();
    }
  }

  function closeModal() {
    document.removeEventListener("keydown", handleEscape);
    overlay.style.animation = "fadeOut 0.2s ease-out";
    setTimeout(() => {
      overlay.remove();
      style.remove();
    }, 200);
  }

  function generateEmail() {
    const instruction = input.value.trim();

    // Close modal immediately
    closeModal();

    // Send message to background script to generate email
    chrome.runtime.sendMessage({
      action: "generateEmail",
      instruction: instruction,
    });
  }
}
