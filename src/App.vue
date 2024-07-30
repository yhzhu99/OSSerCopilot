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
        <h1>Welcome to the OSSNewcomerCopilot</h1>
        <p style="font-size: 16px;">I am an AI bot that guides OSS newcomers through their first few contributions to help them get started and grow better. I can help in all steps of the open source contribution (shown below).</p>
        <el-timeline style="max-width: 600px; margin: 20px auto;">
          <el-timeline-item
            v-for="(item, index) in navItems"
            :key="item.view"
            :timestamp="index + 1"
          >
            <strong>{{ item.fullText }}</strong>
          </el-timeline-item>
        </el-timeline>
        <p style="font-size: 16px;">If you're ready, click the "Start My Contribution" button below and I'll help you through the entire contribution process.</p>
        <el-button @click="startContribution">Start My Contribution</el-button>
      </div>
      <div v-else>
        <component :is="currentComponent" :on-next-step="nextStep"/>
        <el-button @click="nextStep">Completed, Next Step</el-button>
      </div>
      <!-- <div v-if="displayMessage" class="message-display">{{ displayMessage }}</div> -->
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElButton, ElMessageBox, ElTimeline, ElTimelineItem, ElSteps, ElStep } from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import ProjectRecommendationChat from './components/ProjectRecommendationChat.vue';
import ContributionGuidelineAnalysis from './components/ContributionGuidelineAnalysis.vue';
import ProjectStructureAnalysis from './components/ProjectStructureAnalysis.vue';
import IssueRecommendationChat from './components/IssueRecommendationChat.vue';
import IssueAnalysis from './components/IssueAnalysis.vue';
import CodingAndTestingHelp from './components/CodingAndTestingHelp.vue';
import PreCodeReview from './components/PreCodeReview.vue';
import PRModification from './components/PRModification.vue';
import { saveToLocalStorage, getFromLocalStorage } from './utils/storage';

// 导航项的定义
const navItems = [
  { view: 'project-recommendation', fullText: 'Project Recommendation' },
  { view: 'contribution-guideline', fullText: 'Contribution Guideline Analysis' },
  { view: 'project-structure', fullText: 'Project Structure Analysis' },
  { view: 'issue-recommendation', fullText: 'Issue Recommendation' },
  { view: 'issue-analysis', fullText: 'Issue Analysis' },
  { view: 'coding-and-testing-help', fullText: 'Coding & Testing Help' },
  { view: 'pre-code-review', fullText: 'Pre-Code Review' },
  { view: 'pr-modification', fullText: 'PR Modification Help' },
];

const displayMessage = ref('');
const currentTask = computed(() => navItems[currentTaskIndex.value].fullText); // 追踪当前任务
const currentView = ref(getFromLocalStorage('currentView') || 'introduction');
const currentTaskIndex = ref(getFromLocalStorage('currentTaskIndex') || 0);

// Watch for changes in currentView and currentTaskIndex
watch(currentView, (newValue) => {
  saveToLocalStorage('currentView', newValue);
});

watch(currentTaskIndex, (newValue) => {
  saveToLocalStorage('currentTaskIndex', newValue);
});

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
  saveToLocalStorage('currentView', view);
  saveToLocalStorage('currentTaskIndex', index);
};


// 跳转到下一个任务
const nextStep = () => {
  if (currentTaskIndex.value < navItems.length - 1) {
    currentTaskIndex.value++;
    currentView.value = navItems[currentTaskIndex.value].view;
  } else {
    ElMessageBox.alert('You have completed all the tasks.', 'Congratulations', {
      confirmButtonText: 'OK',
    });
  }
};

const startContribution = () => {
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
      return ContributionGuidelineAnalysis;
    case 'project-structure':
      return ProjectStructureAnalysis;
    case 'issue-recommendation':
      return IssueRecommendationChat;
    case 'issue-analysis':
      return IssueAnalysis;
    case 'coding-and-testing-help':
      return CodingAndTestingHelp;
    case 'pre-code-review':
      return PreCodeReview;
    case 'pr-modification':
      return PRModification;
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