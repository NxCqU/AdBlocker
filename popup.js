document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("toggleAdBlocker");

  function updateButtonState(enabled) {
    toggleButton.textContent = enabled ? "AdBlocker: EIN" : "AdBlocker: AUS";
    toggleButton.className = enabled ? "active" : "inactive";
  }

  chrome.storage.local.get("adBlockerEnabled", (data) => {
    const isEnabled = data.adBlockerEnabled ?? true;
    updateButtonState(isEnabled);
    chrome.storage.local.set({ adBlockerEnabled: isEnabled });
  });

  toggleButton.addEventListener("click", () => {
    chrome.storage.local.get("adBlockerEnabled", (data) => {
      const newState = !data.adBlockerEnabled;
      chrome.storage.local.set({ adBlockerEnabled: newState }, () => {
        updateButtonState(newState);
        chrome.runtime.sendMessage({ action: "toggleAdBlocker", state: newState });
      });
    });
  });
});
