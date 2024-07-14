<template>
  <div>
    <button @click="toggleSidebar" class="gh-next-toggle-btn" :class="{ 'gh-next-toggle-btn-open': isOpen }">
      {{ isOpen ? '>' : '<' }}
    </button>
    <div class="gh-next-sidebar" :class="{ 'gh-next-sidebar-open': isOpen }">
      <div class="gh-next-sidebar-content">
        <ProgressBar :progress="progress" />
        <ChatBot @update-progress="updateProgress" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import ProgressBar from './ProgressBar.vue';
import ChatBot from './ChatBot.vue';

export default {
  components: {
    ProgressBar,
    ChatBot,
  },
  setup() {
    const isOpen = ref(false);
    const progress = ref(0);

    const toggleSidebar = () => {
      isOpen.value = !isOpen.value;
      chrome.runtime.sendMessage({ action: 'toggleSidebar' });
    };

    const updateProgress = (newProgress) => {
      progress.value = newProgress;
    };

    return {
      isOpen,
      progress,
      toggleSidebar,
      updateProgress,
    };
  },
};
</script>

<style scoped>
.gh-next-toggle-btn {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 10001;
  width: 30px;
  height: 60px;
  background-color: #0366d6;
  color: white;
  border: none;
  border-radius: 5px 0 0 5px;
  cursor: pointer;
  font-size: 20px;
  transition: right 0.3s ease-in-out;
}

.gh-next-toggle-btn-open {
  right: 300px;
}

.gh-next-sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: #f6f8fa;
  transition: right 0.3s ease-in-out;
  z-index: 10000;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.gh-next-sidebar-open {
  right: 0;
}

.gh-next-sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>