chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ adBlockerEnabled: true });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggleAdBlocker") {
    chrome.storage.local.set({ adBlockerEnabled: message.state });
  }
});
