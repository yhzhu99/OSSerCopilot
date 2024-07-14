import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './components/Sidebar.vue';

const mountApp = () => {
  const app = createApp(App);
  app.use(ElementPlus);
  
  let mountElement = document.getElementById('app');
  
  if (process.env.NODE_ENV === 'development') {
    // For local development
    if (!mountElement) {
      mountElement = document.createElement('div');
      mountElement.id = 'app';
      document.body.appendChild(mountElement);
    }
  } else {
    // For Chrome extension
    mountElement = document.getElementById('gh-next-container');
    if (!mountElement) {
      mountElement = document.createElement('div');
      mountElement.id = 'gh-next-container';
      document.body.appendChild(mountElement);
    }
  }

  app.mount(mountElement);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
};

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