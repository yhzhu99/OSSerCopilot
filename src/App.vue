<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ElButton, ElMessageBox, ElTimeline, ElTimelineItem, ElSteps, ElStep, colProps } from 'element-plus';
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

// Navigation items definition
const navItems = [
  { view: 'project-recommendation', fullText: 'Project Recommendation', color: '#409EFF'},
  { view: 'contribution-guideline', fullText: 'Contribution Guideline Analysis', color: '#67C23A' },
  { view: 'project-structure', fullText: 'Project Structure Analysis', color: '#E6A23C' },
  { view: 'issue-recommendation', fullText: 'Issue Recommendation', color: '#909399' },
  { view: 'issue-analysis', fullText: 'Issue Analysis', color: '#F56C6C' },
  { view: 'coding-and-testing-help', fullText: 'Coding & Testing Help', color: '#58B7FF' },
  { view: 'pre-code-review', fullText: 'Pre-Code Review', color: '#FFC048' },
  { view: 'pr-modification', fullText: 'PR Modification Help', color: '#409EFF' },
];

const currentView = ref(getFromLocalStorage('currentView') || 'introduction');
const currentTaskIndex = ref(getFromLocalStorage('currentTaskIndex') || 0);
const furthestReachedStep = ref(getFromLocalStorage('furthestReachedStep') || 0);
const stepStatus = ref(getFromLocalStorage('stepStatus') || navItems.map(() => 'pending'));
const formData = ref(getFromLocalStorage('formData') || {});
const currentTask = computed(() => navItems[currentTaskIndex.value].fullText);

// Watch for changes and save to localStorage
watch(currentView, (newValue) => saveToLocalStorage('currentView', newValue));
watch(currentTaskIndex, (newValue) => saveToLocalStorage('currentTaskIndex', newValue));
watch(furthestReachedStep, (newValue) => saveToLocalStorage('furthestReachedStep', newValue));
watch(stepStatus, (newValue) => saveToLocalStorage('stepStatus', newValue), { deep: true });
watch(formData, (newValue) => saveToLocalStorage('formData', newValue), { deep: true });

// Get step status
const getStepStatus = (index) => {
  if (index < currentTaskIndex.value) {
    return stepStatus.value[index] === 'completed' ? 'OK' : 'Pending';
  } else if (index === currentTaskIndex.value) {
    return 'Cur.';
  } else if (index <= furthestReachedStep.value) {
    return '...';
  } else {
    return 'Locked';
  }
};

// Navigate to a specific step
const navigateToStep = (index) => {
  if (index <= furthestReachedStep.value) {
    currentTaskIndex.value = index;
    currentView.value = navItems[index].view;
  }
};

// Move to next step
const nextStep = () => {
  stepStatus.value[currentTaskIndex.value] = 'completed';
  if (currentTaskIndex.value < navItems.length - 1) {
    currentTaskIndex.value++;
    furthestReachedStep.value = Math.max(furthestReachedStep.value, currentTaskIndex.value);
    currentView.value = navItems[currentTaskIndex.value].view;
  } else {
    ElMessageBox.alert('You have completed all the tasks.', 'Congratulations', {
      confirmButtonText: 'OK',
    });
  }
};

const startContribution = () => {
  currentTaskIndex.value = 0;
  furthestReachedStep.value = 0;
  currentView.value = navItems[0].view;
  stepStatus.value = navItems.map(() => 'pending');
};

// Compute current component
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

onMounted(() => {
  // Initialize formData for each view if not already present
  navItems.forEach(item => {
    if (!formData.value[item.view]) {
      formData.value[item.view] = {};
    }
  });
});
</script>


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
          @click="navigateToStep(index)"
        />
      </el-steps>
      <h1 class="current-task-title">{{ currentTask }}</h1>
    </header>
    <main class="content">
      <div class="content-overlay"></div>
      <div class="content-inner">
        <div v-if="currentView === 'introduction'">
          <h1>Welcome to the OSSerCopilot 🎁</h1>
          <p style="font-size: 16px;">I am an <strong>AI bot</strong> 🤖️ that guides <strong>OSS newcomers</strong> through their first few contributions to help them get started and grow better. </p>
          <p style="font-size: 16px;">I can help in all steps of the open source contribution (shown below):</p>
          <el-timeline style="max-width: 600px; margin: 20px auto;">
            <el-timeline-item
              v-for="(item, index) in navItems"
              :key="item.view"
              :timestamp="index + 1"
              :color="item.color"
            >
              <strong>{{ item.fullText }}</strong>
            </el-timeline-item>
          </el-timeline>
          <p style="font-size: 16px;">If you're ready, click the "Start My Contribution" button below and I'll help you through the entire contribution process.</p>
          <el-button @click="startContribution">Start My Contribution</el-button>
        </div>
        <div v-else>
          <component 
            :is="currentComponent" 
            :on-next-step="nextStep"
            :key="currentView"
            v-model:form-data="formData[currentView]"
          />
          <el-button @click="nextStep">Completed, Next Step</el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: Arial, sans-serif;
  color: #333333;
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
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/botbg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.3;
  z-index: 1;
}

.content-inner {
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 10px;
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