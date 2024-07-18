<template>
  <div class="main-page">
    <header class="header" v-if="currentView !== 'introduction'">
      <el-steps
        class="steps"
        style="max-width: 100%"
        :active="currentTaskIndex"
        finish-status="success"
        align-center
      >
        <el-step
          v-for="(item, index) in navItems"
          :key="index"
          :title="getStepStatus(index)"
          @click="index <= currentTaskIndex && switchView(item.view, index)"
        />
      </el-steps>
      <h1 class="current-task-title">{{ currentTask }}</h1>
    </header>
    <main class="content">
      <div v-if="currentView === 'introduction'">
        <h1>Welcome to Our Experiment</h1>
        <p>We are conducting an interactive test combining GitHub and AI to enhance the GitHub user experience. In this test, you will go through various steps sequentially. Please complete each step before moving to the next.</p>
        <el-timeline style="max-width: 600px; margin: 20px auto;">
          <el-timeline-item
            v-for="(item, index) in navItems"
            :key="item.view"
            :timestamp="index + 1"
          >
            {{ item.fullText }}
          </el-timeline-item>
        </el-timeline>
        <el-button @click="startExperiment">Confirm Participation</el-button>
      </div>
      <div v-else>
        <component :is="currentComponent" />
        <el-button @click="nextTask">Completed, Next Step</el-button>
      </div>
      <div v-if="displayMessage" class="message-display">{{ displayMessage }}</div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElButton, ElMessageBox, ElTimeline, ElTimelineItem, ElSteps, ElStep } from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import ChatBot from './components/ChatBot.vue';
import ProjectRecommendationChat from './components/ProjectRecommendationChat.vue';

// 导航项的定义
const navItems = [
  { view: 'project-recommendation', fullText: 'Project Recommendation' },
  { view: 'contribution-guideline', fullText: 'Contribution Guideline Analysis' },
  { view: 'project-structure', fullText: 'Project Structure Analysis' },
  { view: 'issue-recommendation', fullText: 'Issue Recommendation' },
  { view: 'issue-analysis', fullText: 'Issue Analysis' },
  { view: 'coding-help', fullText: 'Coding Help' },
  { view: 'testing-help', fullText: 'Testing Help' },
  { view: 'pre-code-review', fullText: 'Pre-Code Review' },
  { view: 'pr-modification', fullText: 'PR Modification Help' },
];

const displayMessage = ref('');
const currentView = ref('introduction'); // 初始视图为引导页
const currentTaskIndex = ref(0);
const currentTask = computed(() => navItems[currentTaskIndex.value].fullText); // 追踪当前任务

// 获取步骤状态
const getStepStatus = (index) => {
  if (index < currentTaskIndex.value) {
    return 'OK';
  } else if (index === currentTaskIndex.value) {
    return 'Cur.';
  } else {
    return '...';
  }
};

// 切换视图
const switchView = (view, index) => {
  currentView.value = view;
  currentTaskIndex.value = index;
};

// 跳转到下一个任务
const nextTask = () => {
  if (currentTaskIndex.value < navItems.length - 1) {
    currentTaskIndex.value++;
    currentView.value = navItems[currentTaskIndex.value].view;
  } else {
    ElMessageBox.alert('You have completed all the tasks.', 'Congratulations', {
      confirmButtonText: 'OK',
    });
  }
};

const startExperiment = () => {
  currentTaskIndex.value = 0;
  currentView.value = navItems[0].view; // 设置初始任务
};

onMounted(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "FROM_BACKGROUND") {
      displayMessage.value = request.message;
    }
  });
});

// 计算当前显示的组件
const currentComponent = computed(() => {
  switch (currentView.value) {
    case 'project-recommendation':
      return ProjectRecommendationChat;
    case 'contribution-guideline':
      return ChatBot;
    case 'project-structure':
      return { template: '<p>This is the Project Structure Analysis area.</p>' };
    case 'issue-recommendation':
      return { template: '<p>This is the Issue Recommendation area.</p>' };
    case 'issue-analysis':
      return { template: '<p>This is the Issue Analysis area.</p>' };
    case 'coding-help':
      return { template: '<p>This is the Coding Help area.</p>' };
    case 'testing-help':
      return { template: '<p>This is the Testing Help area.</p>' };
    case 'pre-code-review':
      return { template: '<p>This is the Pre-Code Review area.</p>' };
    case 'pr-modification':
      return { template: '<p>This is the PR Modification Help area.</p>' };
    default:
      return { template: '<div></div>' };
  }
});
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Arial, sans-serif; /* 确保全局应用 */
  color: #333333; /* 全局字体颜色 */
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

.steps {
  width: 1800px;
  max-width: 100%;
}

.current-task-title {
  margin-top: 1px;
  margin-bottom: 1px;
  font-size: 20px;
  font-weight: bold;
  color: #444649;
  text-align: center;
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