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