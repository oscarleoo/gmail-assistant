export const createSettingsModal = async (currentInstructions) => {
  // Remove existing modal if present
  const existingModal = document.getElementById("emailhelper-settings-modal");
  if (existingModal) {
    existingModal.remove();
    return;
  }

  // Get current settings from storage
  const result = await chrome.storage.sync.get([
    "openaiApiKey",
    "selectedModel",
  ]);
  const currentApiKey = result.openaiApiKey || "";
  const currentModel = result.selectedModel || "gpt-4o-mini";

  // Create modal overlay
  const overlay = document.createElement("div");
  overlay.id = "emailhelper-settings-modal";
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

  // Create modal content
  const modal = document.createElement("div");
  modal.style.cssText = `
    background: white;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    height: 100%;
    max-height: 80vh;
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
    font-family: 'Google Sans', Roboto, Arial, sans-serif;
    display: flex;
    flex-direction: column;
  `;

  // Modal HTML content
  modal.innerHTML = `
    <div style="padding: 24px; border-bottom: 1px solid #e8eaed;">
      <h2 style="margin: 0; color: #3c4043; font-size: 20px; font-weight: 500;">
        📧 EmailHelper Settings
      </h2>
      <p style="margin: 8px 0 0 0; color: #5f6368; font-size: 14px;">
        Configure your OpenAI API key and email generation preferences
      </p>
    </div>
    
    <div style="padding: 24px; overflow-y: auto; flex: 1; display: flex; flex-direction: column;">
      <!-- API Key Section -->
      <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; color: #3c4043; font-weight: 500; font-size: 14px;">
          OpenAI API Key
        </label>
        <input 
          type="password"
          id="api-key-input" 
          placeholder="sk-..."
          value="${currentApiKey}"
          style="
            width: 100%;
            padding: 12px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 14px;
            font-family: 'Monaco', 'Menlo', monospace;
            outline: none;
            box-sizing: border-box;
          "
        />
      </div>

      <!-- Model Selection -->
      <div style="margin-bottom: 24px;">
        <label style="display: block; margin-bottom: 8px; color: #3c4043; font-weight: 500; font-size: 14px;">
          Model
        </label>
        <select 
          id="model-select"
          style="
            width: 100%;
            padding: 12px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
            outline: none;
            box-sizing: border-box;
            background: white;
            cursor: pointer;
          "
        >
          <option value="gpt-4o-mini" ${
            currentModel === "gpt-4o-mini" ? "selected" : ""
          }>
            GPT-4o Mini (Recommended - Fast & Cost-effective)
          </option>
          <option value="gpt-4o" ${currentModel === "gpt-4o" ? "selected" : ""}>
            GPT-4o (High Quality)
          </option>
          <option value="gpt-4" ${currentModel === "gpt-4" ? "selected" : ""}>
            GPT-4 (Premium)
          </option>
          <option value="gpt-3.5-turbo" ${
            currentModel === "gpt-3.5-turbo" ? "selected" : ""
          }>
            GPT-3.5 Turbo (Budget-friendly)
          </option>
        </select>
      </div>

      <!-- AI Instructions Section -->
      <div style="flex: 1; display: flex; flex-direction: column;">
        <label style="display: block; margin-bottom: 8px; color: #3c4043; font-weight: 500; font-size: 14px;">
          AI Instructions
        </label>
        <textarea 
          id="ai-instructions" 
          placeholder="Enter instructions for the AI (e.g., 'Always use a professional tone', 'Include my company signature', 'Keep emails concise')..."
          style="
            width: 100%;
            flex: 1;
            padding: 12px;
            border: 1px solid #dadce0;
            border-radius: 4px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            outline: none;
            box-sizing: border-box;
            line-height: 1.6;
          "
        >${currentInstructions}</textarea>
      </div>
    </div>
    
    <div style="padding: 16px 24px; background: #f8f9fa; display: flex; justify-content: flex-end; gap: 12px;">
      <button 
        id="cancel-settings" 
        style="
          padding: 8px 16px;
          border: 1px solid #dadce0;
          background: white;
          color: #3c4043;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        "
      >
        Cancel
      </button>
      <button 
        id="save-settings" 
        style="
          padding: 8px 16px;
          border: none;
          background: #1a73e8;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        "
      >
        Save Settings
      </button>
    </div>
  `;

  // Add CSS animations and focus styles
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
    #ai-instructions:focus, #api-key-input:focus, #model-select:focus {
      border-color: #1a73e8 !important;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2) !important;
    }
    #save-settings:hover {
      background: #1557b0 !important;
    }
    #cancel-settings:hover {
      background: #f1f3f4 !important;
    }
    #model-select:hover {
      border-color: #1a73e8;
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Focus the API key input if empty, otherwise instructions
  const apiKeyInput = document.getElementById("api-key-input");
  const textarea = document.getElementById("ai-instructions");
  setTimeout(() => {
    if (!currentApiKey) {
      apiKeyInput.focus();
    } else {
      textarea.focus();
    }
  }, 100);

  // Event listeners
  document
    .getElementById("cancel-settings")
    .addEventListener("click", closeModal);
  document
    .getElementById("save-settings")
    .addEventListener("click", saveSettings);

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

  async function saveSettings() {
    const instructions = textarea.value.trim();
    const apiKey = apiKeyInput.value.trim();
    const selectedModel = document.getElementById("model-select").value;

    // Validate API key
    if (apiKey && !apiKey.startsWith("sk-")) {
      showError("Please enter a valid OpenAI API key (starts with 'sk-')");
      return;
    }

    try {
      // Save to Chrome storage
      await chrome.storage.sync.set({
        aiInstructions: instructions,
        openaiApiKey: apiKey,
        selectedModel: selectedModel,
      });

      // Show success feedback
      const saveButton = document.getElementById("save-settings");
      saveButton.textContent = "✓ Saved";
      saveButton.style.background = "#34a853";

      setTimeout(() => {
        closeModal();
      }, 1000);
    } catch (error) {
      console.error("Error saving settings:", error);
      showError("Error saving settings - please try again");
    }
  }

  function showError(message) {
    const saveButton = document.getElementById("save-settings");
    saveButton.textContent = message;
    saveButton.style.background = "#ea4335";

    setTimeout(() => {
      saveButton.textContent = "Save Settings";
      saveButton.style.background = "#1a73e8";
    }, 3000);
  }
};
