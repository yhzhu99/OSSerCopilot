import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'content-script': 'src/content-script.js',
        background: 'src/background.js',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    cssCodeSplit: false,
  },
});