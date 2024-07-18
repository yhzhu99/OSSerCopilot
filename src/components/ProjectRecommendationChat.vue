<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';

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

// 聊天消息列表
const messages = ref([]);
const userInput = ref('');
const projectUrl = ref('');
const projectAnalysis = ref('');

// 获取推荐项目
const getRecommendedProjects = () => {
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
    messages.value.push({ text: '推荐适合你的项目列表如下：', sender: 'bot' });
    messages.value.push({ type: 'recommendation', data: recommendedProjects.value, sender: 'bot' });
  }, 1000);
};

// 基于表单推荐项目
const getFormRecommendedProjects = () => {
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
    messages.value.push({ text: '基于表单推荐的项目列表如下：', sender: 'bot' });
    messages.value.push({ type: 'recommendation', data: formRecommendedProjects.value, sender: 'bot' });
  }, 1000);
};

// 分析项目
const analyzeProject = (url) => {
  console.log(`Analyzing project: ${url}`);
  setTimeout(() => {
    projectAnalysis.value = {
      summary: `该项目活跃度较高，有许多适合新手的issue。社区响应迅速，适合新手开发。`,
    };
    messages.value.push({ text: `项目分析结果：${projectAnalysis.value.summary}`, sender: 'bot' });
  }, 1000);
};

// 初始化推荐项目
onMounted(() => {
  form.programmingLanguages = userHistory.programmingLanguages;
  form.projectExperience = userHistory.projectExperience;
  form.frameworks = userHistory.frameworks;
  form.availableTime = userHistory.availableTime;
  form.motivation = userHistory.motivation;

  getRecommendedProjects();
});

// 发送消息
const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.push({ text: userInput.value, sender: 'user' });
    handleUserInput(userInput.value);
    userInput.value = '';
  }
};

// 处理用户输入
const handleUserInput = (input) => {
  if (input.toLowerCase().includes('更换一批')) {
    getRecommendedProjects();
  } else if (input.toLowerCase().includes('基于表单推荐')) {
    messages.value.push({ text: '请填写表单以获取推荐项目：', sender: 'bot' });
    messages.value.push({ type: 'form', sender: 'bot' });
  } else if (input.toLowerCase().includes('分析项目')) {
    messages.value.push({ text: '请输入GitHub项目地址：', sender: 'bot' });
    messages.value.push({ type: 'project-input', sender: 'bot' });
  } else {
    messages.value.push({ text: '无法识别的命令，请输入 “更换一批”、 “基于表单推荐” 或 “分析项目”', sender: 'bot' });
  }
};
</script>

<template>
  <div class="chatbot">
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.sender]">
        <template v-if="message.sender === 'user'">
          <el-card class="user-card">
            <div class="header-content">
              <el-avatar src="https://www.svgrepo.com/show/532388/user-search-alt-1.svg" class="avatar" />
              <span>User</span>
            </div>
            <div>{{ message.text }}</div>
          </el-card>
        </template>
        <template v-else>
          <el-card class="bot-card">
            <div class="header-content">
              <el-avatar src="https://www.svgrepo.com/show/35383/robot.svg" class="avatar" />
              <span>Bot</span>
            </div>
            <img v-if="message.img" :src="message.img" class="bot-image" />
            <div v-if="message.text">{{ message.text }}</div>
            <div v-if="message.type === 'recommendation'">
              <el-collapse>
                <el-collapse-item v-for="project in message.data" :key="project.name" :title="project.name">
                  <p><strong>描述：</strong>{{ project.description }}</p>
                  <p><strong>背景：</strong>{{ project.background }}</p>
                  <p><strong>活跃度：</strong>{{ project.activity }}</p>
                  <p><strong>推荐原因：</strong>{{ project.reason }}</p>
                  <div>
                    <strong>适合新手的issues：</strong>
                    <ul>
                      <li v-for="issue in project.suitableIssues" :key="issue.title">
                        {{ issue.title }} - 难度：<el-tag :type="issue.difficulty === '简单' ? 'success' : 'warning'">{{ issue.difficulty }}</el-tag>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <el-button @click="getRecommendedProjects">更换一批</el-button>
            </div>
            <div v-if="message.type === 'form'">
              <el-form :model="form" label-width="120px" class="recommendation-form">
                <el-form-item label="编程语言">
                  <el-select v-model="form.programmingLanguages" multiple placeholder="选择编程语言">
                    <el-option label="JavaScript" value="JavaScript" />
                    <el-option label="Python" value="Python" />
                    <el-option label="Java" value="Java" />
                    <el-option label="C++" value="C++" />
                  </el-select>
                </el-form-item>
                <el-form-item label="项目经历">
                  <el-input v-model="form.projectExperience" placeholder="描述你的项目经历" />
                </el-form-item>
                <el-form-item label="框架">
                  <el-select v-model="form.frameworks" multiple placeholder="选择熟悉的框架">
                    <el-option label="Vue" value="Vue" />
                    <el-option label="React" value="React" />
                    <el-option label="Angular" value="Angular" />
                    <el-option label="Django" value="Django" />
                  </el-select>
                </el-form-item>
                <el-form-item label="可投入时长">
                  <el-input v-model="form.availableTime" placeholder="每周可投入的时间" />
                </el-form-item>
                <el-form-item label="贡献动机">
                  <el-input v-model="form.motivation" type="textarea" :rows="2" placeholder="描述你的贡献动机" />
                </el-form-item>
                <el-button type="primary" @click="getFormRecommendedProjects">发送</el-button>
              </el-form>
            </div>
            <div v-if="message.type === 'project-input'">
              <el-input v-model="projectUrl.value" placeholder="输入GitHub项目地址" @keyup.enter="analyzeProject(projectUrl.value)" />
              <el-button type="primary" @click="analyzeProject(projectUrl.value)">发送</el-button>
            </div>
          </el-card>
        </template>
      </div>
    </div>
    <div class="chat-inputs">
      <div class="input-row">
        <el-input v-model="userInput" placeholder="Type your message..." @keyup.enter="sendMessage" class="input-box" />
        <el-button class="send-button" @click="sendMessage">Send</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbot {
  display: flex;
  flex-direction: column;
  height: 72vh;
  padding: 5px;
  box-sizing: border-box;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 5px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
}

.message {
  margin-bottom: 10px;
  display: flex;
  width: 100%;
}

.user, .bot {
  justify-content: flex-start;
}

.user-card, .bot-card {
  width: calc(100% - 10px);
  padding: 10px;
  border-radius: 10px;
  box-sizing: border-box;
  margin-left: 5px;
}

.user-card {
  background-color: #e1f5fe;
  border: 1px solid #b3e5fc;
}

.bot-card {
  background-color: #ffffff;
  border: 1px solid #f8bbd0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 5px;
}

.avatar {
  background-color: #ffeb3b;
  border-radius: 50%;
}

.bot-image {
  width: 100%;
  border-radius: 10px;
  margin-top: 5px;
}

.chat-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 5px;
}

.input-row {
  display: flex;
  gap: 5px;
  flex-shrink: 0;
  padding: 5px;
  border-radius: 10px;
  background-color: #f1f1f1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-box {
  flex-grow: 1;
  border-radius: 5px;
}

.send-button {
  background-color: #0366d6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.send-button:hover {
  background-color: #025bb5;
}
</style>