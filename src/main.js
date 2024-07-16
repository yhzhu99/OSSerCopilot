import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const mountApp = () => {
  const app = createApp(App);
  app.use(ElementPlus);

  const mountElement = document.getElementById('gh-next-container');
  app.mount(mountElement);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}