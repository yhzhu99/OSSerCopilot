<template>
  <div class="main-page">
    <header class="header">
      <ProgressBar :progress="progress" />
    </header>
    <main class="content">
      <ChatBot @update-progress="updateProgress" />
      <div v-if="displayMessage" class="message-display">{{ displayMessage }}</div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ProgressBar from './components/ProgressBar.vue';
import ChatBot from './components/ChatBot.vue';

export default {
  components: {
    ProgressBar,
    ChatBot,
  },
  setup() {
    const progress = ref(0);
    const displayMessage = ref('');

    const updateProgress = (newProgress) => {
      progress.value = newProgress;
    };

    onMounted(() => {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "FROM_BACKGROUND") {
          displayMessage.value = request.message;
        }
      });
    });

    return {
      progress,
      updateProgress,
      displayMessage,
    };
  },
};
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent scroll bars */
}

.header {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f6f8fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* Prevent the header from shrinking */
}

.content {
  flex-grow: 1; /* Take up remaining space */
  padding: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.message-display {
  margin-top: 20px;
  padding: 10px;
  background-color: #e8e8e8;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
}
</style>