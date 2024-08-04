chrome.runtime.onInstalled.addListener(() => {
  console.log('OSSerCopilot extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateSidePanel") {
    chrome.runtime.sendMessage({ type: "FROM_BACKGROUND", message: request.message });
  }
});
