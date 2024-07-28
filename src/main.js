import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const mountApp = () => {
  const app = createApp(App);
  app.use(ElementPlus);

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
  
  const mountElement = document.getElementById('gh-next-container');
  app.mount(mountElement);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}