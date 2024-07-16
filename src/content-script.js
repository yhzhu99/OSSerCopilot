function injectStyles(file) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(file);
  document.head.appendChild(link);
}

function injectScript(file) {
  const script = document.createElement('script');
  script.setAttribute('type', 'module');
  script.setAttribute('src', chrome.runtime.getURL(file));
  document.body.appendChild(script);
}

injectStyles('style.css');
injectScript('main.js');

// Function to determine the display message based on the URL
function determineDisplayMessage(url) {
  const repoMatch = url.match(/https:\/\/github\.com\/([^\/]+\/[^\/]+)(\/|$)/);
  const issuesMatch = url.match(/https:\/\/github\.com\/[^\/]+\/[^\/]+\/issues(\/|$)/);

  if (repoMatch) {
    return `仓库名 ${repoMatch[1]}`;
  } else if (issuesMatch) {
    return 'Enhance Issues';
  } else {
    return '';
  }
}

// Send message to the side panel
function sendMessageToSidePanel(message) {
  chrome.runtime.sendMessage({ action: "updateSidePanel", message: message });
}

// Initial send and setup listener for URL changes
sendMessageToSidePanel(determineDisplayMessage(window.location.href));

// Listen for URL changes
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    sendMessageToSidePanel(determineDisplayMessage(url));
  }
}).observe(document, { subtree: true, childList: true });