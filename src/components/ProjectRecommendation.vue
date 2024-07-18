<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElButton, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElCollapse, ElCollapseItem, ElTag, ElTabs, ElTabPane } from 'element-plus';

// 模拟用户历史数据
const userHistory = reactive({
  programmingLanguages: ['JavaScript', 'Python'],
  projectExperience: '初级',
  frameworks: ['Vue', 'React'],
  availableTime: '每周10小时',
  motivation: '学习前端开发最佳实践',
});

// 表单数据
const form = reactive({
  programmingLanguages: [],
  projectExperience: '',
  frameworks: [],
  availableTime: '',
  motivation: '',
});

// 推荐项目列表
const recommendedProjects = ref([]);
const formRecommendedProjects = ref([]);

// 获取推荐项目
const getRecommendedProjects = () => {
  // 模拟API调用
  setTimeout(() => {
    recommendedProjects.value = [
      {
        name: 'Vue.js',
        description: '渐进式JavaScript框架',
        background: 'Vue.js是一套用于构建用户界面的渐进式JavaScript框架。',
        activity: '非常活跃，每周有多个PR和Issue',
        reason: '适合前端开发者，有许多适合新手的issue',
        suitableIssues: [
          { title: '改进文档', difficulty: '简单' },
          { title: '修复小型bug', difficulty: '中等' },
        ],
      },
      {
        name: 'TensorFlow',
        description: '开源机器学习平台',
        background: 'TensorFlow是一个端到端开源机器学习平台。',
        activity: '非常活跃，有大量贡献者',
        reason: '适合对机器学习感兴趣的Python开发者',
        suitableIssues: [
          { title: '添加新的示例', difficulty: '中等' },
          { title: '改进错误信息', difficulty: '简单' },
        ],
      },
    ];
  }, 1000);
};

// 基于表单推荐项目
const getFormRecommendedProjects = () => {
  // 模拟API调用
  setTimeout(() => {
    formRecommendedProjects.value = [
      {
        name: 'React',
        description: '用于构建用户界面的JavaScript库',
        background: 'React 是一个用于构建用户界面的 JavaScript 库。',
        activity: '非常活跃，每天有多个PR和Issue',
        reason: '适合前端开发者，有许多适合新手的issue',
        suitableIssues: [
          { title: '修复组件bug', difficulty: '中等' },
          { title: '改进文档示例', difficulty: '简单' },
        ],
      },
      {
        name: 'Django',
        description: '高层次Python Web框架',
        background: 'Django 是一个高级的 Python Web 框架，鼓励快速开发和简洁的设计。',
        activity: '活跃度高，每周有多个PR和Issue',
        reason: '适合对后端开发感兴趣的Python开发者',
        suitableIssues: [
          { title: '优化数据库查询', difficulty: '中等' },
          { title: '改进错误处理', difficulty: '简单' },
        ],
      },
    ];
  }, 1000);
};

// 分析项目
const analyzeProject = (url) => {
  // 模拟项目分析
  console.log(`Analyzing project: ${url}`);
  // 这里应该有实际的项目分析逻辑
  return {
    summary: `该项目活跃度较高，有许多适合新手的issue。社区响应迅速，适合新手开发。`,
  };
};

const projectAnalysis = ref('');

// 组件挂载时自动填充表单
onMounted(() => {
  form.programmingLanguages = userHistory.programmingLanguages;
  form.projectExperience = userHistory.projectExperience;
  form.frameworks = userHistory.frameworks;
  form.availableTime = userHistory.availableTime;
  form.motivation = userHistory.motivation;
});

// 刷新推荐
const refreshRecommendations = () => {
  getRecommendedProjects();
  getFormRecommendedProjects();
};
</script>

<template>
  <div class="project-recommendation">
    <ElTabs type="border-card">
      <ElTabPane label="推荐适合我的项目">
        <ElButton type="primary" @click="getRecommendedProjects">推荐适合我的项目</ElButton>
        
        <ElCollapse v-if="recommendedProjects.length > 0">
          <ElCollapseItem v-for="project in recommendedProjects" :key="project.name" :title="project.name">
            <p><strong>描述：</strong>{{ project.description }}</p>
            <p><strong>背景：</strong>{{ project.background }}</p>
            <p><strong>活跃度：</strong>{{ project.activity }}</p>
            <p><strong>推荐原因：</strong>{{ project.reason }}</p>
            <div>
              <strong>适合新手的issues：</strong>
              <ul>
                <li v-for="issue in project.suitableIssues" :key="issue.title">
                  {{ issue.title }} - 难度：<ElTag :type="issue.difficulty === '简单' ? 'success' : 'warning'">{{ issue.difficulty }}</ElTag>
                </li>
              </ul>
            </div>
          </ElCollapseItem>
        </ElCollapse>
        <ElButton v-if="recommendedProjects.length > 0" @click="refreshRecommendations">更换一批</ElButton>
      </ElTabPane>

      <ElTabPane label="基于表单的推荐">
        <ElForm :model="form" label-width="120px" class="recommendation-form">
          <ElFormItem label="编程语言">
            <ElSelect v-model="form.programmingLanguages" multiple placeholder="选择编程语言">
              <ElOption label="JavaScript" value="JavaScript" />
              <ElOption label="Python" value="Python" />
              <ElOption label="Java" value="Java" />
              <ElOption label="C++" value="C++" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="项目经历">
            <ElInput v-model="form.projectExperience" placeholder="描述你的项目经历" />
          </ElFormItem>
          <ElFormItem label="框架">
            <ElSelect v-model="form.frameworks" multiple placeholder="选择熟悉的框架">
              <ElOption label="Vue" value="Vue" />
              <ElOption label="React" value="React" />
              <ElOption label="Angular" value="Angular" />
              <ElOption label="Django" value="Django" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="可投入时长">
            <ElInput v-model="form.availableTime" placeholder="每周可投入的时间" />
          </ElFormItem>
          <ElFormItem label="贡献动机">
            <ElInput v-model="form.motivation" type="textarea" :rows="2" placeholder="描述你的贡献动机" />
          </ElFormItem>
        </ElForm>
        <ElButton type="primary" @click="getFormRecommendedProjects">推荐项目</ElButton>
        
        <ElCollapse v-if="formRecommendedProjects.length > 0">
          <ElCollapseItem v-for="project in formRecommendedProjects" :key="project.name" :title="project.name">
            <p><strong>描述：</strong>{{ project.description }}</p>
            <p><strong>背景：</strong>{{ project.background }}</p>
            <p><strong>活跃度：</strong>{{ project.activity }}</p>
            <p><strong>推荐原因：</strong>{{ project.reason }}</p>
            <div>
              <strong>适合新手的issues：</strong>
              <ul>
                <li v-for="issue in project.suitableIssues" :key="issue.title">
                  {{ issue.title }} - 难度：<ElTag :type="issue.difficulty === '简单' ? 'success' : 'warning'">{{ issue.difficulty }}</ElTag>
                </li>
              </ul>
            </div>
          </ElCollapseItem>
        </ElCollapse>
        <ElButton v-if="formRecommendedProjects.length > 0" @click="refreshRecommendations">更换一批</ElButton>
      </ElTabPane>

      <ElTabPane label="分析项目">
        <ElForm inline>
          <ElFormItem label="项目地址">
            <ElInput v-model="projectUrl" placeholder="输入GitHub项目地址" />
          </ElFormItem>
          <ElFormItem>
            <ElButton type="primary" @click="projectAnalysis.value = analyzeProject(projectUrl)">分析项目</ElButton>
          </ElFormItem>
        </ElForm>
        <div v-if="projectAnalysis.value">
          <h3>项目分析结果</h3>
          <p>{{ projectAnalysis.value.summary }}</p>
        </div>
      </ElTabPane>
    </ElTabs>
  </div>
</template>

<style scoped>
.project-recommendation {
  padding: 20px;
}

.recommendation-form {
  margin-top: 20px;
}

.el-collapse {
  margin: 20px 0;
}

.el-collapse-item__content {
  padding-left: 20px;
}
</style>
