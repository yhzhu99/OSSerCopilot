<script setup>
import { ref, onMounted } from 'vue';
import ChatBot from './components/ChatBot.vue';
import { ElButton, ElTooltip, ElMessageBox } from 'element-plus';

// 导航项的定义
const navItems = [
  { view: 'project-recommendation', text: 'Project Rec...', fullText: 'Project Recommendation' },
  { view: 'contribution-guideline', text: 'Contribu...', fullText: 'Contribution Guideline Analysis' },
  { view: 'project-structure', text: 'Project Str...', fullText: 'Project Structure Analysis' },
  { view: 'issue-recommendation', text: 'Issue Rec...', fullText: 'Issue Recommendation' },
  { view: 'issue-analysis', text: 'Issue Anal...', fullText: 'Issue Analysis' },
  { view: 'coding-help', text: 'Coding Help', fullText: 'Coding Help' },
  { view: 'testing-help', text: 'Testing Help', fullText: 'Testing Help' },
  { view: 'pre-code-review', text: 'Pre-Code Re...', fullText: 'Pre-Code Review' },
  { view: 'pr-modification', text: 'PR Modific...', fullText: 'PR Modification Help' },
];

const progress = ref(0);
const displayMessage = ref('');
const currentView = ref('project-recommendation');
const completedTasks = ref({});

// 更新进度
const updateProgress = (newProgress) => {
  progress.value = newProgress;
};

// 切换视图
const switchView = (view, index) => {
  // 顺序操作检测
  for (let i = 0; i < index; i++) {
    if (!completedTasks.value[navItems[i].view]) {
      ElMessageBox.alert('Please complete the previous steps in order.', 'Warning', {
        confirmButtonText: 'OK',
      });
      return;
    }
  }
  currentView.value = view;
};

// 标记任务完成
const markCompleted = (view) => {
  completedTasks.value[view] = true;
  // 自动跳转到下一个任务
  const currentIndex = navItems.findIndex(item => item.view === view);
  if (currentIndex < navItems.length - 1) {
    switchView(navItems[currentIndex + 1].view, currentIndex + 1);
  }
};

onMounted(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FROM_BACKGROUND") {
      displayMessage.value = request.message;
    }
  });
});
</script>

<template>
  <div class="main-page">
    <header class="header">
      <div class="nav-bar">
        <el-tooltip v-for="(item, index) in navItems" :key="item.view" :content="item.fullText" placement="bottom">
          <el-button
            :style="{ backgroundColor: completedTasks[item.view] ? '#0366d6' : '', color: completedTasks[item.view] ? 'white' : '' }"
            @click="() => switchView(item.view, index)"
            class="nav-button"
          >
            {{ item.text }}
          </el-button>
        </el-tooltip>
      </div>
    </header>
    <main class="content">
      <div v-if="currentView === 'project-recommendation'">
        <ChatBot @update-progress="updateProgress" />
        <el-button v-if="!completedTasks['project-recommendation']" @click="markCompleted('project-recommendation')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'contribution-guideline'">
        <p>This is the Contribution Guideline Analysis area.</p>
        <el-button v-if="!completedTasks['contribution-guideline']" @click="markCompleted('contribution-guideline')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'project-structure'">
        <p>This is the Project Structure Analysis area.</p>
        <el-button v-if="!completedTasks['project-structure']" @click="markCompleted('project-structure')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'issue-recommendation'">
        <p>This is the Issue Recommendation area.</p>
        <el-button v-if="!completedTasks['issue-recommendation']" @click="markCompleted('issue-recommendation')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'issue-analysis'">
        <p>This is the Issue Analysis area.</p>
        <el-button v-if="!completedTasks['issue-analysis']" @click="markCompleted('issue-analysis')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'coding-help'">
        <p>This is the Coding Help area.</p>
        <el-button v-if="!completedTasks['coding-help']" @click="markCompleted('coding-help')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'testing-help'">
        <p>This is the Testing Help area.</p>
        <el-button v-if="!completedTasks['testing-help']" @click="markCompleted('testing-help')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'pre-code-review'">
        <p>This is the Pre-Code Review area.</p>
        <el-button v-if="!completedTasks['pre-code-review']" @click="markCompleted('pre-code-review')">Completed, Next Step</el-button>
      </div>
      <div v-else-if="currentView === 'pr-modification'">
        <p>This is the PR Modification Help area.</p>
        <el-button v-if="!completedTasks['pr-modification']" @click="markCompleted('pr-modification')">Completed, Next Step</el-button>
      </div>
      <div v-if="displayMessage" class="message-display">{{ displayMessage }}</div>
    </main>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background-color: #f6f8fa;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.nav-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 10px;
  width: 100%;
  justify-content: center;
}

.nav-button {
  width: 100%;
  max-width: 150px;
  height: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  justify-self: center;
  margin-left: 0 !important; /* 覆盖 Element Plus 的默认左边距 */
}

/* 确保按钮组中的所有按钮都没有左边距 */
.nav-bar :deep(.el-button-group .el-button) {
  margin-left: 0 !important;
}

.content {
  flex-grow: 1;
  padding: 10px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.message-display {
  margin-top: 10px;
  padding: 10px;
  background-color: #e8e8e8;
  border-radius: 5px;
  font-size: 16px;
  color: #333;
}
</style>