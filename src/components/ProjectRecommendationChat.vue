<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// 模拟用户历史数据
const userHistory = reactive({
  programmingLanguages: ['C++', 'Python'],
  projectExperience: 'I have worked on the design and development of deep learning frameworks',
  availableTime: '10 hours per week',
  motivation: 'Learn best practices of deep learning frameworks',
});

// 表单数据
const form = reactive({
  programmingLanguages: [],
  projectExperience: '',
  availableTime: '',
  motivation: '',
});

// 传递函数
const props = defineProps({
  onNextStep: Function
});

// 推荐项目列表
const catalog = ref(getFromLocalStorage('projectRecommendationCatalog') || []);
const recommendedProjects = ref(getFromLocalStorage('recommendedProjects') || []);
const recommendedProjects2 = ref(getFromLocalStorage('recommendedProjects2') || []);
const recommendedProjects3 = ref(getFromLocalStorage('recommendedProjects3') || []);
const formRecommendedProjects = ref(getFromLocalStorage('formRecommendedProjects') || []);
const recommendedNumber = ref(getFromLocalStorage('recommendedNumber') || 2);

// 聊天消息列表
const messages = ref(getFromLocalStorage('projectRecommendationMessages') || []);
const userInput = ref('');
const projectUrl = ref('https://github.com/pytorch/pytorch'); // 默认值设置为 pytorch 的 GitHub 仓库地址
const projectAnalysis = ref('');

// Watch for changes in the reactive data
watch(messages, (newValue) => {
  saveToLocalStorage('projectRecommendationMessages', newValue);
}, { deep: true });

watch(catalog, (newValue) => {
  saveToLocalStorage('projectRecommendationCatalog', newValue);
}, { deep: true });

watch(recommendedProjects, (newValue) => {
  saveToLocalStorage('recommendedProjects', newValue);
}, { deep: true });

watch(recommendedProjects2, (newValue) => {
  saveToLocalStorage('recommendedProjects2', newValue);
}, { deep: true });

watch(recommendedProjects3, (newValue) => {
  saveToLocalStorage('recommendedProjects3', newValue);
}, { deep: true });

watch(formRecommendedProjects, (newValue) => {
  saveToLocalStorage('formRecommendedProjects', newValue);
}, { deep: true });

watch(recommendedNumber, (newValue) => {
  saveToLocalStorage('recommendedNumber', newValue);
});

// 获取推荐项目
const getFirstRecommendedProjects = () => {
  setTimeout(() => {
    recommendedProjects.value = [
      {
        name: 'Vue.js',
        link: 'https://github.com/vuejs/vue',
        description: 'Progressive JavaScript framework',
        background: 'Vue.js is a progressive JavaScript framework for building user interfaces.',
        activity: 'Very active, with multiple PRs and issues every week',
        reason: 'Suitable for front-end developers, with many beginner-friendly issues',
        suitableIssues: [
          { number: '10252', title: 'Wrong definition of the type AsyncComponentFactory', difficulty: 'Easy' , url: 'https://github.com/vuejs/vue/issues/10252' },
          { number: '10191', title: 'Warn if colon shorthand is used on v-if/v-html/etc.', difficulty: 'Medium' , url: 'https://github.com/vuejs/vue/issues/10191' },
          ],
        },
        {
        name: 'React',
        link: 'https://github.com/facebook/react',
        description: 'JavaScript library for building user interfaces',
        background: 'React is a JavaScript library for building user interfaces.',
        activity: 'Very active, with multiple PRs and issues every day',
        reason: 'Suitable for front-end developers, with many beginner-friendly issues',
        suitableIssues: [
          { title: 'Fix component bugs', difficulty: 'Medium' },
          { title: 'Improve documentation examples', difficulty: 'Easy' }
        ],
      }
    ];
    messages.value.push({ text: 'Based on your history of activity on GitHub, the following projects are better suited for you:', 
                          sender: 'bot',
                          type: 'recommendation', 
                          data: recommendedProjects.value,
                          endText: 'You can also ask me to recommend more projects that would be suitable for you to contribute to, or to make more specific requests' });
    }, 500);
};

const getRecommendedProjects = () => {
  if (recommendedNumber.value === 2) {
    setTimeout(() => {
      recommendedProjects2.value = [
        {
          name: 'Quasar',
          link: 'https://github.com/quasarframework/quasar',
          description: 'Vue.js-based framework for building high-performance applications',
          background: 'Quasar is a Vue.js-based framework for building high-performance web, mobile, and desktop applications.',
          activity: 'Very active, with frequent updates and a vibrant community',
          reason: 'Suitable for developers who want to build applications using Vue.js with ease',
          suitableIssues: [
              { title: 'Improve component documentation', difficulty: 'Easy' },
              { title: 'Fix UI bugs', difficulty: 'Medium' }
          ]
        },
        {
          name: 'Pydantic',
          link: 'https://github.com/pydantic/pydantic',
          description: 'Data validation and settings management using Python type annotations',
          background: 'Pydantic is a data validation and settings management library using Python type annotations.',
          activity: 'Active, with regular contributions and updates',
          reason: 'Suitable for Python developers who need robust data validation',
          suitableIssues: [
            { title: 'Add new validation rules', difficulty: 'Medium' },
            { title: 'Improve error messages', difficulty: 'Easy' }
          ]
        }
      ];
      messages.value.push({ text: 'Based on your history of activity on GitHub, the following projects are better suited for you:', 
                            sender: 'bot',
                            type: 'recommendation',
                            data: recommendedProjects2.value });
    }, 500);
    recommendedNumber.value++;
  }
  else {
    setTimeout(() => {
      recommendedProjects3.value = [
        {
          name: 'Scrapy',
          link: 'https://github.com/scrapy/scrapy',
          description: 'An open-source and collaborative web crawling framework for Python',
          background: 'Scrapy is an open-source and collaborative web crawling framework for Python.',
          activity: 'Very active, with a large number of contributors and frequent updates',
          reason: 'Suitable for Python developers interested in web scraping and crawling',
          suitableIssues: [
            { title: 'Fix spider bugs', difficulty: 'Medium' },
            { title: 'Improve documentation examples', difficulty: 'Easy' }
          ]
        },
        {
          name: 'Weblate',
          link: 'https://github.com/weblate/weblate',
          description: 'A web-based continuous localization tool',
          background: 'Weblate is a web-based continuous localization tool.',
          activity: 'Active, with regular contributions and a supportive community',
          reason: 'Suitable for developers and translators working on multilingual projects',
          suitableIssues: [
            { title: 'Improve translation suggestions', difficulty: 'Easy' },
            { title: 'Add new language support', difficulty: 'Medium' }
          ]
        }
      ];
      messages.value.push({ text: 'Based on your history of activity on GitHub, the following projects are better suited for you:',
                            sender: 'bot',
                            type: 'recommendation',
                            data: recommendedProjects3.value });
      }, 500);
  }
};

// 基于表单推荐项目
const getFormRecommendedProjects = () => {
  setTimeout(() => {
    formRecommendedProjects.value = [
      {
        name: 'TensorFlow',
        link: 'https://github.com/tensorflow/tensorflow',
        description: 'Open-source machine learning platform',
        background: 'TensorFlow is an end-to-end open-source machine learning platform.',
        activity: 'Very active, with a large number of contributors',
        reason: 'Suitable for Python developers interested in machine learning',
        suitableIssues: [
          { title: 'Add new examples', difficulty: 'Medium' },
          { title: 'Improve error messages', difficulty: 'Easy' }
        ]
      },
      {
        name: 'PyTorch',
        link: 'https://github.com/pytorch/pytorch',
        description: 'Scientific computing package for deep learning',
        background: 'PyTorch is a scientific computing package for deep learning.',
        activity: 'Active, with multiple PRs and issues every week',
        reason: 'Suitable for Python developers interested in deep learning',
        suitableIssues: [
          { number: '130861', title: 'torch.fx.Tracer.record_stack_traces is broken in torch 2.4.0', difficulty: 'Medium' , url: 'https://github.com/pytorch/pytorch/issues/130861' },
          { number: '117351', title: 'Logging when executing fx.Interpreter', difficulty: 'Medium' , url: 'https://github.com/pytorch/pytorch/issues/117351' },
        ]
      }
    ];
    messages.value.push({ text: 'Based on your submitted form, the following projects are better suited for you:',
                          sender: 'bot',
                          type: 'recommendation',
                          data: formRecommendedProjects.value });
  }, 500);
};

// 分析项目
const analyzeProject = (url) => {
  console.log(`Analyzing project: ${url}`);
  setTimeout(() => {
    projectAnalysis.value = {
      summary: `The project is highly active and has many issue for newbies.The community is responsive and suitable for newbie developers.`,
    };
    messages.value.push({ text: `Analysis Results:${projectAnalysis.value.summary}`, sender: 'bot' });
  }, 500);
};

// 跳转到项目链接
const chooseProject = (link) => { 
      props.onNextStep(); // 调用传入的函数
      window.open(link, '_blank');
};

const initialized = ref(getFromLocalStorage('projectRecommendationInitialized') === 'true');
// 初始化推荐项目
onMounted(() => {
  if (!initialized.value) {
    form.programmingLanguages = userHistory.programmingLanguages;
    form.projectExperience = userHistory.projectExperience;
    form.availableTime = userHistory.availableTime;
    form.motivation = userHistory.motivation;

    getFirstRecommendedProjects();
    initialized.value = true;
    saveToLocalStorage('projectRecommendationInitialized', 'true');
  }
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
  if (input.toLowerCase().includes('recommend more')) {
    getRecommendedProjects();
  } else if (input.toLowerCase().includes('specific need')) {
    messages.value.push({ text: 'Sure! Please fill out the request form below and I will recommend a project for you with your specific needs in mind!',
                          sender: 'bot',
                          type: 'form' });
  } else if (input.toLowerCase().includes('suitable') && input.toLowerCase().includes('analyze')) {
    messages.value.push({ text: 'Sure! Please enter the url of the project you are interested in',
                          sender: 'bot',
                          type: 'project-input', });
  } else {
    messages.value.push({ text: 'System error: please try again later.', sender: 'bot' });
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
              <span>OSSNewcomerCopilot</span>
            </div>
            <img v-if="message.img" :src="message.img" class="bot-image" />
            <div v-if="message.text" class="message-margin">{{ message.text }}</div>
            <div v-if="message.type === 'recommendation'" class="message-margin">
              <el-collapse>
                <el-collapse-item v-for="project in message.data" :key="project.name" :title="project.name">
                  <div class="project-container">
                  <el-link :href="project.link" type="primary" target="_blank" :gutter="10"> {{ project.name }}</el-link>
                  <!-- <el-button type="primary" @click="props.onNextStep">Choose This Project!</el-button> -->
                  <el-button type="primary" @click="chooseProject(project.link)">Choose This Project!</el-button>
                  </div>
                  <p><strong>Project Description:</strong>{{ project.description }}</p>
                  <p><strong>Project Background:</strong>{{ project.background }}</p>
                  <p><strong>Project activity:</strong>{{ project.activity }}</p>
                  <p><strong>Recommendation Reason:</strong>{{ project.reason }}</p>
                  <div>
                    <strong>issues for newcomers:</strong>
                    <ul>
                      <li v-for="issue in project.suitableIssues" :key="issue.number">
                        <div><el-link :href="issue.url" type="primary" target="_blank"># {{ issue.number }}</el-link> - difficulty level:<el-tag :type="issue.difficulty === 'Easy' ? 'success' : 'warning'">{{ issue.difficulty }}</el-tag></div>
                        <div>{{ issue.title }}</div>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <div>
              <el-button class="message-margin" @click="getRecommendedProjects">recommend more</el-button>
              </div>
            </div>
            <div v-if="message.type === 'form'" class="message-margin">
              <el-form :model="form" label-width="120px" class="recommendation-form">
                <el-form-item label="Programming Languages">
                  <el-select v-model="form.programmingLanguages" multiple placeholder="Select the programming language of the project you want to contribute">
                    <el-option label="JavaScript" value="JavaScript" />
                    <el-option label="Python" value="Python" />
                    <el-option label="Java" value="Java" />
                    <el-option label="C" value="C" />
                    <el-option label="C++" value="C++" />
                    <el-option label="C#" value="C" />
                    <el-option label="Rust" value="Rust" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Programming Experience">
                  <el-input v-model="form.projectExperience" placeholder="Describe your project experience" />
                </el-form-item>
                <el-form-item label="Available hours">
                  <el-input v-model="form.availableTime" placeholder="Time you can spend contributing" />
                </el-form-item>
                <el-form-item label="Motivation to contribute">
                  <el-input v-model="form.motivation" type="textarea" :rows="2" placeholder="Describe your contribution motivation (e.g., study something)" />
                </el-form-item>
                <el-button type="primary" @click="getFormRecommendedProjects">Send</el-button>
              </el-form>
            </div>
            <div v-if="message.type === 'project-input'" class="message-margin">
              <el-input v-model="projectUrl" placeholder="Please enter the url" @keyup.enter="analyzeProject(projectUrl)" />
              <el-button type="primary" @click="analyzeProject(projectUrl)">Send</el-button>
            </div>
            <div v-if="message.endText">{{ message.endText }}</div>
          </el-card>
        </template>
      </div>
    </div>
    <div class="chat-inputs">
      <div class="input-row">
        <el-input v-model="userInput" placeholder="tell me something so I can help you." @keyup.enter="sendMessage" class="input-box" />
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
  font-size: 16px;
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

.project-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.message-margin {
  margin: 10px 0;
}
</style>