<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// 模拟用户历史数据
const userHistory = reactive({
  programmingLanguages: ['C++', 'Python'],
  availableTime: '10 hours per week',
  difficultyLevel: ['medium'],
  motivation: 'Learn best practices of deep learning frameworks',
});

// 表单数据
const form = reactive({
  programmingLanguages: [],
  difficultyLevel: '',
  availableTime: '',
  motivation: '',
});

// 传递函数
const props = defineProps({
  onNextStep: Function
});

// 推荐项目列表
const recommendedIssues = ref(getFromLocalStorage('recommendedIssues') || []);
const recommendedIssues2 = ref(getFromLocalStorage('recommendedIssues2') || []);
const recommendedIssues3 = ref(getFromLocalStorage('recommendedIssues3') || []);
const formRecommendedIssues = ref(getFromLocalStorage('formRecommendedIssues') || []);
const recommendedNumber = ref(getFromLocalStorage('issueRecommendedNumber') || 2);

// 聊天消息列表
const messages = ref(getFromLocalStorage('issueRecommendationMessages') || []);
const userInput = ref('');
const issueUrl = ref('https://github.com/pytorch/pytorch/issues/130861'); // 默认值设置为 pytorch 的 GitHub 仓库地址
const issueAnalysis = ref(getFromLocalStorage('issueAnalysis') || []);


watch(messages, (newValue) => {
  saveToLocalStorage('issueRecommendationMessages', newValue);
}, { deep: true });

watch(recommendedIssues, (newValue) => {
  saveToLocalStorage('recommendedIssues', newValue);
}, { deep: true });

watch(recommendedIssues2, (newValue) => {
  saveToLocalStorage('recommendedIssues2', newValue);
}, { deep: true });

watch(recommendedIssues3, (newValue) => {
  saveToLocalStorage('recommendedIssues3', newValue);
}, { deep: true });

watch(formRecommendedIssues, (newValue) => {
  saveToLocalStorage('formRecommendedIssues', newValue);
}, { deep: true });

watch(recommendedNumber, (newValue) => {
  saveToLocalStorage('issueRecommendedNumber', newValue);
});

watch(issueAnalysis, (newValue) => {
  saveToLocalStorage('issueAnalysis', newValue);
}, { deep: true });


// 获取推荐项目
const getFirstRecommendedIssues = () => {
  setTimeout(() => {
    recommendedIssues.value = [
      {
        number: '130861',
        link: 'https://github.com/pytorch/pytorch/issues/130861',
        title: 'torch.fx.Tracer.record_stack_traces is broken in torch 2.4.0',
        difficulty: 'Medium',
        description: [
          "<span class='code-style'>torch.fx.Tracer</span> has a <span class='code-style'>record_stack_traces</span> member. It does not give the correct stack trace, starting with torch 2.4 RC.",
          "It is not sure it is part of the external API, but it was nice to have. The following is working in 2.3, but broken in 2.4RC",
          "It was broken in this PR: #121449 where you stopped using the <span class='code-style'>find_user_frame</span> (or an equivalent function) to filter non user stack traces."
        ],
        reason: [
          "It's a bug fix in a core functionality (<span class='code-style'>torch.fx.Tracer</span>), which is a good entry point for understanding the internals of PyTorch.",
          "The issue is well-defined with a clear description of the problem and a potential solution, making it easier for a newcomer to approach.",
          "It involves working with Python and PyTorch, which are popular technologies in the machine learning community and is a perfect match for the needs you've expressed earlier.",
          "The scope seems manageable for a newcomer, as it focuses on a specific feature (<span class='code-style'>record_stack_traces</span>) rather than a large-scale change."
        ],
        gain: [
          "Completing this issue would help improve PyTorch's debugging capabilities, which is crucial for the community of developers and researchers using the framework.",
          "It provides an opportunity to learn about: a. PyTorch's internal structure and the FX module for code transformation; b. Handling stack traces in Python, which is an important debugging skill; c. The process of identifying and fixing regression bugs in open-source projects.",
          "Working on this issue would give the newcomer experience in: a. Reading and understanding existing code in a large open-source project; b. Writing test cases to verify bug fixes; c. Collaborating with the PyTorch community through the pull request process."
        ],
      },
      {
        number: '117351',
        link: 'https://github.com/pytorch/pytorch/issues/117351',
        title: 'Logging when executing fx.Interpreter',
        difficulty: 'Medium',
        description: ['Scientific computing package for deep learning'],
        reason: ['Suitable for Python developers interested in deep learning'],
        gain: ['PyTorch is a scientific computing package for deep learning.'],
      },
      
    ];
    messages.value.push({ text: 'Based on your history of activity on GitHub, the following issues in Pytorch are better suited for you:', 
                          sender: 'bot',
                          type: 'recommendation', 
                          data: recommendedIssues.value,
                          endText: 'You can also ask me to recommend more issues that would be suitable for you to contribute to, or to make more specific requests' });
    }, 500);
};

const getRecommendedIssues = () => {
  if (recommendedNumber.value === 2) {
    setTimeout(() => {
    recommendedIssues2.value = [
      {
        number: '131654',
        link: 'https://github.com/pytorch/pytorch/issues/131654',
        title: 'torch.export.save doesn\'t support torch.float8_e4m3fn dtype',
        difficulty: 'Medium',
        description: [
          "The following program shows that torch.export.save doesn't support torch.float8_e4m3fn type, though torch.save of model and model state_dict is supported -",
          "It fails with the following output -",
        ],
        reason: [
          "It deals with a specific data type (torch.float8_e4m3fn) and a particular functionality (torch.export.save), which provides a focused area for the newcomer to work on.",
          "The issue is well-documented with a clear example that reproduces the problem, making it easier for a newcomer to understand and approach.",
          "It involves working with PyTorch's export functionality, which is an important feature for model deployment and interoperability.",
          "The scope is relatively contained, making it a good entry point for someone new to contributing to PyTorch."
        ],
        gain: [
          "Resolving this issue would improve PyTorch's support for the float8_e4m3fn data type in the export functionality, which is crucial for users working with this specific dtype.",
          "Working on this issue provides opportunities to learn about:a. PyTorch's serialization and deserialization processes.b. Handling different data types in deep learning frameworks.c. The torch.export module and its importance in model deployment.",
          "The newcomer would gain experience in:a. Debugging and extending PyTorch's core functionalities.b. Writing and running test cases to verify fixes and prevent regressions.c. Understanding the intricacies of data type support in machine learning frameworks.",
          "Successfully addressing this issue would contribute to PyTorch's compatibility with various data types, potentially improving performance and efficiency for certain use cases.",
          "The newcomer would learn about the process of identifying and fixing compatibility issues in open-source projects, which is a valuable skill in software development."
        ],
      },
      {
        number: '131043',
        link: 'https://github.com/pytorch/pytorch/issues/131043',
        title: 'Using an empty tensor and torch.int64 or torch.bool for dtype of nanmean() works while a non-empty tensor doesn\'t work',
        difficulty: 'Medium',
        description: ['Scientific computing package for deep learning'],
        reason: ['Suitable for Python developers interested in deep learning'],
        gain: ['PyTorch is a scientific computing package for deep learning.'],
      },
      
    ];
    messages.value.push({ text: 'Based on your history of activity on GitHub, the following issues in Pytorch are better suited for you:', 
                          sender: 'bot',
                          type: 'recommendation', 
                          data: recommendedIssues2.value,
                          endText: 'You can also ask me to recommend more issues that would be suitable for you to contribute to, or to make more specific requests' });
    }, 500);
    recommendedNumber.value++;
  }
  else {
    setTimeout(() => {
    recommendedIssues3.value = [
      {
        number: '131654',
        link: 'https://github.com/pytorch/pytorch/issues/131654',
        title: 'torch.export.save doesn\'t support torch.float8_e4m3fn dtype',
        difficulty: 'Medium',
        description: [
          "The following program shows that torch.export.save doesn't support torch.float8_e4m3fn type, though torch.save of model and model state_dict is supported -",
          "It fails with the following output -",
        ],
        reason: [
          "It deals with a specific data type (torch.float8_e4m3fn) and a particular functionality (torch.export.save), which provides a focused area for the newcomer to work on.",
          "The issue is well-documented with a clear example that reproduces the problem, making it easier for a newcomer to understand and approach.",
          "It involves working with PyTorch's export functionality, which is an important feature for model deployment and interoperability.",
          "The scope is relatively contained, making it a good entry point for someone new to contributing to PyTorch."
        ],
        gain: [
          "Resolving this issue would improve PyTorch's support for the float8_e4m3fn data type in the export functionality, which is crucial for users working with this specific dtype.",
          "Working on this issue provides opportunities to learn about:a. PyTorch's serialization and deserialization processes.b. Handling different data types in deep learning frameworks.c. The torch.export module and its importance in model deployment.",
          "The newcomer would gain experience in:a. Debugging and extending PyTorch's core functionalities.b. Writing and running test cases to verify fixes and prevent regressions.c. Understanding the intricacies of data type support in machine learning frameworks.",
          "Successfully addressing this issue would contribute to PyTorch's compatibility with various data types, potentially improving performance and efficiency for certain use cases.",
          "The newcomer would learn about the process of identifying and fixing compatibility issues in open-source projects, which is a valuable skill in software development."
        ],
      },
      {
        number: '131043',
        link: 'https://github.com/pytorch/pytorch/issues/131043',
        title: 'Using an empty tensor and torch.int64 or torch.bool for dtype of nanmean() works while a non-empty tensor doesn\'t work',
        difficulty: 'Medium',
        description: ['Scientific computing package for deep learning'],
        reason: ['Suitable for Python developers interested in deep learning'],
        gain: ['PyTorch is a scientific computing package for deep learning.'],
      },
      
    ];
    messages.value.push({ text: 'Based on your history of activity on GitHub, the following issues in Pytorch are better suited for you:', 
                          sender: 'bot',
                          type: 'recommendation', 
                          data: recommendedIssues3.value,
                          endText: 'You can also ask me to recommend more issues that would be suitable for you to contribute to, or to make more specific requests' });
    }, 500);
  }
};

// 基于表单推荐项目
const getFormRecommendedIssues = () => {
  setTimeout(() => {
    formRecommendedIssues.value = [
    {
        number: '131654',
        link: 'https://github.com/pytorch/pytorch/issues/131654',
        title: 'torch.export.save doesn\'t support torch.float8_e4m3fn dtype',
        difficulty: 'Medium',
        description: [
          "The following program shows that torch.export.save doesn't support torch.float8_e4m3fn type, though torch.save of model and model state_dict is supported -",
          "It fails with the following output -",
        ],
        reason: [
          "It deals with a specific data type (torch.float8_e4m3fn) and a particular functionality (torch.export.save), which provides a focused area for the newcomer to work on.",
          "The issue is well-documented with a clear example that reproduces the problem, making it easier for a newcomer to understand and approach.",
          "It involves working with PyTorch's export functionality, which is an important feature for model deployment and interoperability.",
          "The scope is relatively contained, making it a good entry point for someone new to contributing to PyTorch."
        ],
        gain: [
          "Resolving this issue would improve PyTorch's support for the float8_e4m3fn data type in the export functionality, which is crucial for users working with this specific dtype.",
          "Working on this issue provides opportunities to learn about:a. PyTorch's serialization and deserialization processes.b. Handling different data types in deep learning frameworks.c. The torch.export module and its importance in model deployment.",
          "The newcomer would gain experience in:a. Debugging and extending PyTorch's core functionalities.b. Writing and running test cases to verify fixes and prevent regressions.c. Understanding the intricacies of data type support in machine learning frameworks.",
          "Successfully addressing this issue would contribute to PyTorch's compatibility with various data types, potentially improving performance and efficiency for certain use cases.",
          "The newcomer would learn about the process of identifying and fixing compatibility issues in open-source projects, which is a valuable skill in software development."
        ],
      },
      {
        number: '131043',
        link: 'https://github.com/pytorch/pytorch/issues/131043',
        title: 'Using an empty tensor and torch.int64 or torch.bool for dtype of nanmean() works while a non-empty tensor doesn\'t work',
        difficulty: 'Medium',
        description: ['Scientific computing package for deep learning'],
        reason: ['Suitable for Python developers interested in deep learning'],
        gain: ['PyTorch is a scientific computing package for deep learning.'],
      },
      
    ];
    messages.value.push({ text: 'Based on your submitted form, the following issues in Pytorch are better suited for you:', 
                          sender: 'bot',
                          type: 'recommendation', 
                          data: formRecommendedIssues.value,});
    }, 500);
};

// 分析issue
const analyzeIssue = (url) => {
  console.log(`Analyzing issue: ${url}`);
  setTimeout(() => {
    issueAnalysis.value = [
      "It's a bug fix in a core functionality (torch.fx.Tracer), which is a good entry point for understanding the internals of PyTorch.",
      "The issue is well-defined with a clear description of the problem and a potential solution, making it easier for a newcomer to approach.",
      "It involves working with Python and PyTorch, which are popular technologies in the machine learning community and is a perfect match for the needs you've expressed earlier.",
      "The scope seems manageable for a newcomer, as it focuses on a specific feature (record_stack_traces) rather than a large-scale change."
    ];
    messages.value.push({ text: 'This issue is perfect for you for the following reasons:',
                          type: 'issueAnalyze',  
                          data: issueAnalysis.value,
                          sender: 'bot' });
  }, 500);
};

// 跳转到Issue链接
const chooseIssue = (link) => { 
      props.onNextStep(); // 调用传入的函数
      window.open(link, '_blank');
};

// 初始化推荐项目
onMounted(() => {
  form.programmingLanguages = userHistory.programmingLanguages;
  form.difficultyLevel = userHistory.difficultyLevel;
  form.availableTime = userHistory.availableTime;
  form.motivation = userHistory.motivation;

  getFirstRecommendedIssues();
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
    getRecommendedIssues();
  } else if (input.toLowerCase().includes('specific need')) {
    messages.value.push({ text: 'Sure! Please fill out the request form below and I will recommend more issues for you with your specific needs in mind!',
                          sender: 'bot',
                          type: 'form' });
  } else if (input.toLowerCase().includes('suitable') && input.toLowerCase().includes('analyze')) {
    messages.value.push({ text: 'Sure! Please enter the url of the issue you are interested in',
                          sender: 'bot',
                          type: 'issue-input', });
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
                <el-collapse-item v-for="issue in message.data" :key="issue.number" :title="`${issue.number} - ${issue.title.slice(0, 20)}...`">
                  <div class="project-container">
                  <el-link :href="issue.link" type="primary" target="_blank" :gutter="10"> {{ issue.number }} </el-link>
                  <el-button type="primary" @click="chooseIssue(issue.link)">Choose This Issue!</el-button>
                  </div>
                  <p><strong>Title:</strong>{{ issue.title }}</p>
                  <p><strong>Difficulty Level:</strong><el-tag :type="issue.difficulty === 'Easy' ? 'success' : 'warning'">{{ issue.difficulty }}</el-tag></p>
                  <div>
                    <strong>Issue Description:</strong>
                    <p v-for="(descriptionPoint, index) in issue.description" :key="index" v-html="descriptionPoint"></p>
                  </div>
                  <div>
                    <strong>Recommendation Reason:</strong>
                    <ul>
                      <li v-for="(reasonPoint, index) in issue.reason" :key="index" v-html="reasonPoint"></li>
                    </ul>
                  </div>
                  <div>
                    <strong>What you can gain:</strong>
                    <ul>
                      <li v-for="(gainPoint, index) in issue.gain" :key="index" v-html="gainPoint"></li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <div>
              <el-button class="message-margin" @click="getRecommendedIssues">recommend more</el-button>
              </div>
            </div>
            <div v-if="message.type === 'form'" class="message-margin">
              <el-form :model="form" label-width="120px" class="recommendation-form">
                <el-form-item label="Programming Languages">
                  <el-select v-model="form.programmingLanguages" multiple placeholder="Select the programming language of the issue you want to contribute">
                    <el-option label="JavaScript" value="JavaScript" />
                    <el-option label="Python" value="Python" />
                    <el-option label="Java" value="Java" />
                    <el-option label="C" value="C" />
                    <el-option label="C++" value="C++" />
                    <el-option label="C#" value="C" />
                    <el-option label="Rust" value="Rust" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Difficulty Level">
                  <el-select v-model="form.difficultyLevel" placeholder="Select the difficulty level of the issue you want to contribute">
                    <el-option label="Easy" value="Easy" />
                    <el-option label="Medium" value="Medium" />
                    <el-option label="Difficult" value="Difficult" />
                    <el-option label="Whatever" value="Whatever" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Available hours">
                  <el-input v-model="form.availableTime" placeholder="Time you can spend contributing" />
                </el-form-item>
                <el-form-item label="Motivation to contribute">
                  <el-input v-model="form.motivation" type="textarea" :rows="2" placeholder="Describe your contribution motivation (e.g., study something)" />
                </el-form-item>
                <el-button type="primary" @click="getFormRecommendedIssues">Send</el-button>
              </el-form>
            </div>
            <div v-if="message.type === 'issue-input'" class="message-margin">
              <el-input v-model="issueUrl" placeholder="Please enter the url" @keyup.enter="analyzeIssue(issueUrl)" />
              <el-button type="primary" @click="analyzeIssue(issueUrl)">Send</el-button>
            </div>
            <div v-if="message.type === 'issueAnalyze'" class="message-margin">
              <ul>
                <li v-for="(reasonPoint, index) in message.data" :key="index">
                  {{ reasonPoint }}
                </li>
              </ul>
            </div>
            <div v-if="message.endText" class="message-margin">{{ message.endText }}</div>
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
  align-items: center; /* 垂直居中 */
  justify-content: space-between; /* 水平间距 */
}

.message-margin {
  margin: 10px 0; /* 上下间距为 10px，左右间距为 0 */
}

:deep(.code-style) {
  background-color: #bbb8b86d;
  color: #333;
  font-family: monospace;
}
</style>