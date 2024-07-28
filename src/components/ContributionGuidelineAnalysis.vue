<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption } from 'element-plus';
import 'element-plus/dist/index.css';

// 聊天消息列表
const messages = ref([]);
const userInput = ref('');
const catalog = ref([])
const summaryStep = ref([])
const prerequisites = ref([])

// 获取贡献指南分析
const getFirstAnalysis = () => {
  setTimeout(() => {
    summaryStep.value = [
      "Find or report a new issue to work on. If your change is minor (like fixing a typo) feel free to skip this step.",
      "Create a new branch with 'git fetch && git checkout -b <my-branch-name>' to start working on your change.",
      "Make changes locally to the code. Whether you're working on a new feature or a bug fix, always consider adding tests for your changes (using the 'unittest' framework).",
      "Test your changes locally with 'python ./test/test_torch.py'.",
      "Review other pre-commit checks.",
      "Push changes to your fork 'git push'.",
      "Create a new Github PR to propose changes from your fork into the official PyTorch repo.",
      "Review, address comments on your PR, and initiate merge along the pull request workflow.",
      "Celebrate your contributions and welcome to the PyTorch Developer community :)!"
    ];
    catalog.value = ["Setup the developer environment","pull request workflow","Writing documentation","C++ development tips","CUDA development tips","community communicating tips"];
    messages.value.push({
                        messageUnits:
                          [{ 
                            text: "You want to contribute to Pytorch? That's great! Below I will provide you with a contribution guide based on the project's 'CONTRIBUTING.md' file:"
                            },
                            { 
                            type: "summary" , 
                            data: summaryStep.value, 
                            text: 'This is the Contributing Guide for the project newcomers <a href="https://github.com/pytorch/pytorch/wiki/The-Ultimate-Guide-to-PyTorch-Contributions" target="_blank">Contributing Guide</a>. Like many open source projects, PyTorch uses a workflow based on pull requests. You will create a copy of the repository in your Git branch, make your changes and test it, push those changes to your fork (origin), and create a pull request (PR) against the official repo (upstream). Below are the exact steps to follow:', 
                            },
                            { 
                            type: 'catalog', 
                            data: catalog.value, 
                            text: 'You can keep asking me more detailed questions about contributing documentation, for example:', 
                            },
                          ],
                        sender: 'bot'
                      });
  }, 500);
};


// 初始化贡献指南分析
onMounted(() => {
  getFirstAnalysis();
});

// 发送消息
const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.push({ text: userInput.value, sender: 'user' });
    handleUserInput(userInput.value);
    userInput.value = '';
  }
};

const getEnvironmentSetup = () => {
  setTimeout(() => {
    prerequisites.value = [
      "Install Prerequisites",
      "Fork, clone, and checkout the PyTorch source",
      "Install Dependencies",
      "Build PyTorch from source",
      "Tips for developing PyTorch",
      "PyTorch Workflow Git cheatsheet"
    ];
    messages.value.push({
                        messageUnits:
                          [{ 
                            type: 'environment', 
                            data: prerequisites.value, 
                            text: 'You can keep asking me more detailed questions about setup the developer environment, for example:', 
                          }],
                        sender: 'bot'
                        });
  }, 500);
};

const getPrerequisites = () => {
  setTimeout(() => {
    prerequisites.value = [
      {
        pstep: "To develop PyTorch you will need:",
        childrenContent:[
          "Python 3.8 or later (for Linux, Python 3.8.1+ is needed)",
          "A C++17 compatible compiler, such as clang",
        ]
      },
      {
        pstep: "If you want to compile with CUDA support, install the following (note that CUDA is not supported on macOS)",
        childrenContent:[
          "NVIDIA CUDA 11.0 or above",
          "NVIDIA cuDNN v8 or above",
          "Compiler compatible with CUDA"
        ]
      },
      {
        pstep: "If you want to compile with ROCm support, install",
        childrenContent:[
          "AMD ROCm 4.0 and above installation",
          "ROCm is currently supported only for Linux systems.",
        ]
      },
    ];
    messages.value.push({
                          messageUnits:
                          [{  
                            type: 'prerequisites', 
                            data: prerequisites.value, 
                            text: 'Prerequisites are below', 
                          }],
                          sender: 'bot'
                        });
  }, 500);
};

// 处理用户输入
const handleUserInput = (input) => {
  if (input.toLowerCase().includes('environment') || input.toLowerCase().includes('setup') || input.toLowerCase().includes('1')) {
    getEnvironmentSetup();
  } else if (input.toLowerCase().includes('workflow') || input.toLowerCase().includes('2')) {
    setTimeout(() => {
      messages.value.push({
                          messageUnits:
                          [{ 
                            text: 'Sure! Let me introduce you to the general workflow of contributing to Pytorch', 
                          }],
                          sender: 'bot'
                        });
    }, 500);
  } else if (input.toLowerCase().includes('documentation') || input.toLowerCase().includes('3')) {
    setTimeout(() => {
      messages.value.push({
                          messageUnits:
                          [{ 
                            text: 'Sure! Let me introduce you to how to writing documentation for Pytorch', 
                          }],
                          sender: 'bot'
                        });
    }, 500);
  } else if (input.toLowerCase().includes('c++') || input.toLowerCase().includes('4')) {
    setTimeout(() => {
      messages.value.push({
                          messageUnits:
                          [{ 
                            text: 'Sure! I will give you some tips for developing in C++.', 
                          }],
                          sender: 'bot'
                        });
    }, 500);
  } else if (input.toLowerCase().includes('cuda') || input.toLowerCase().includes('5')) {
    setTimeout(() => {
      messages.value.push({
                          messageUnits:
                          [{ 
                            text: 'Sure! I will give you some tips for developing in CUDA.', 
                          }],
                          sender: 'bot'
                        });
    }, 500);
  } else if (input.toLowerCase().includes('install prerequisites')) {
    getPrerequisites();
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
              <span>Bot</span>
            </div>
          <div v-for="(messageUnit, index) in message.messageUnits" :key="index">
            <img v-if="messageUnit.img" :src="messageUnit.img" class="bot-image" />
            <div v-if="messageUnit.text" v-html="messageUnit.text"></div>
            <div v-if="messageUnit.type === 'summary'">
                    <ol>
                      <li v-for="(step, index) in messageUnit.data" :key="index">
                        {{ step }}
                      </li>
                    </ol>
            </div>
            <div v-if="messageUnit.type === 'catalog'">
                    <ol>
                      <li v-for="(step, index) in messageUnit.data" :key="index">
                        {{ step }}
                      </li>
                    </ol>
            </div>
            <div v-if="messageUnit.type === 'environment'">
                    <ol>
                      <li v-for="(step, index) in messageUnit.data" :key="index">
                        {{ step }}
                      </li>
                    </ol>
            </div>
            <div v-if="messageUnit.type === 'prerequisites'">
                    <ul>
                      <li v-for="(step, index) in messageUnit.data" :key="index">
                        <div>{{ step.pstep }}:</div>
                        <ol>
                          <li v-for="(content, index) in step.childrenContent" :key="index">
                            {{ content }}
                          </li>
                        </ol>
                      </li>
                    </ul>
            </div>
          </div>
          </el-card>
        </template>
      </div>
    </div>
    <div class="chat-inputs">
      <div class="input-row">
        <el-input v-model="userInput" placeholder="tell me something so that I can recommend a project for you" @keyup.enter="sendMessage" class="input-box" />
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