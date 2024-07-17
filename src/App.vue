<script setup>
import { ref, onMounted } from 'vue';
import ProgressBar from './components/ProgressBar.vue';
import ChatBot from './components/ChatBot.vue';

const progress = ref(0);
const displayMessage = ref('');
const currentView = ref('project-recommendation');

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

const switchView = (view) => {
  currentView.value = view;
};
</script>

<template>
  <div class="main-page">
    <header class="header">
      <ProgressBar :progress="progress" />
      <div class="nav-bar">
        <el-button @click="switchView('project-recommendation')">项目推荐</el-button>
        <el-button @click="switchView('contribute-docs')">贡献文档</el-button>
        <el-button @click="switchView('issue-analysis')">Issue分析</el-button>
      </div>
    </header>
    <main class="content">
      <div v-if="currentView === 'project-recommendation'">
        <ChatBot @update-progress="updateProgress" />
      </div>
      <div v-else-if="currentView === 'contribute-docs'">
        <!-- 贡献文档的组件或内容 -->
        <p>这里是贡献文档功能区。</p>
      </div>
      <div v-else-if="currentView === 'issue-analysis'">
        <!-- Issue分析的组件或内容 -->
        <p>这里是Issue分析功能区。</p>
      </div>
      <div v-if="displayMessage" class="message-display">{{ displayMessage }}</div>
    </main>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent scroll bars */
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f6f8fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0; /* Prevent the header from shrinking */
}

.nav-bar {
  display: flex;
  gap: 10px;
  margin-top: 10px;
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