function injectStyles(file) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(file);
  document.head.appendChild(link);
}

function createSidebarContainer() {
  const container = document.createElement('div');
  container.id = 'gh-next-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.right = '-300px';
  container.style.width = '300px';
  container.style.height = '100vh';
  container.style.zIndex = '10000';
  container.style.transition = 'right 0.3s ease-in-out';
  document.body.appendChild(container);
}

function injectScript(file) {
  const script = document.createElement('script');
  script.setAttribute('type', 'module');
  script.setAttribute('src', chrome.runtime.getURL(file));
  document.body.appendChild(script);
}

injectStyles('style.css');
createSidebarContainer();
injectScript('main.js');

// Listen for messages to toggle the sidebar
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggleSidebar') {
    const container = document.getElementById('gh-next-container');
    if (container) {
      if (container.style.right === '0px') {
        container.style.right = '-300px';
      } else {
        container.style.right = '0';
      }
    }
  }
});