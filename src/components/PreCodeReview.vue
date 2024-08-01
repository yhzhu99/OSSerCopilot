<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption, ElScrollbar, ElIcon } from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// 聊天消息列表
const messages = ref(getFromLocalStorage('preCodeReviewMessages') || []);
const userInput = ref('');
const catalog = ref(getFromLocalStorage('preCodeReviewCatalog') || []);
const PRDescriptionAdvice = ref(getFromLocalStorage('PRDescriptionAdvice') || '');
const commitMessageAdvice = ref(getFromLocalStorage('commitMessageAdvice') || '');

watch(messages, (newValue) => {
  saveToLocalStorage('preCodeReviewMessages', newValue);
}, { deep: true });

watch(catalog, (newValue) => {
  saveToLocalStorage('preCodeReviewCatalog', newValue);
}, { deep: true });

watch(PRDescriptionAdvice, (newValue) => {
  saveToLocalStorage('PRDescriptionAdvice', newValue);
});

watch(commitMessageAdvice, (newValue) => {
  saveToLocalStorage('commitMessageAdvice', newValue);
});

// 模拟用户历史数据
const userHistory = reactive({
  PRDescription: 'torch.fx.Tracer.record_stack_traces fix',
  codeFileList: [],
});

// 表单数据
const form = reactive({
  PRDescription: '',
  codeFileList: [],
});

//初始化
const getReviewTips = () => {
  setTimeout(() => {
    catalog.value = [
      "Check if your code complies with the pytorch project coding standards",
      "Check if your code style matches the project code.",
      "Point out errors in the code or areas where improvements can be made.",
      "Give suggestions for changes to the PR description to bring the PR in line with the community norms.",
    ];
    messages.value.push({
                        messageUnits:
                          [
                            { 
                              type: 'PR-input', 
                              text: 'In this step, if you have finished writing and testing the issue code, you can submit the relevant code files and your PR description to me, and I can review your code and give some PR modifications before you formally submit your PR to the community to increase the probability of your PR being merged.', 
                            },
                            { 
                              type: 'catalog', 
                              data: catalog.value, 
                              text: 'For example, I can:', 
                            },
                          ],
                        sender: 'bot'
                      });
  }, 500);
};

const initialized = ref(getFromLocalStorage('preCodeReviewInitialized') === 'true');
// 初始化
onMounted(() => {
  if (!initialized.value) {
    form.PRDescription = userHistory.PRDescription;
    form.codeFileList = userHistory.codeFileList;
    getReviewTips();
    initialized.value = true;
    saveToLocalStorage('preCodeReviewInitialized', 'true');
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

const getPreReview = () => {
  setTimeout(() => {
    PRDescriptionAdvice.value =  `This PR addresses the issue described in #130861 by fixing the stack trace recording in 'torch.fx.Tracer'.

**Changes Made:**
- Fixed the stack trace recording logic.
- Added unit tests to cover this scenario.

**Testing:**
- All existing tests pass.
- New tests have been added and pass successfully.

Please review and let me know if any additional changes are needed.`;
    messages.value.push({
                        messageUnits:
                          [ 
                            { 
                              text: 'Based on your submitted code and PR information, here are some of my suggestions:',
                            },
                            { 
                              text: '1.Code Standards: Your code conforms to the standards of Pytorch.', 
                              pass: 'True'
                            },
                            { 
                              text: '2.Code Style: Your code style matches the project code.', 
                              pass: 'True'
                            },
                            { 
                              text: '3.Code Modification Advice: This is a very simplified function. It is a patch one contributor did in his tracer that inherits form torch.fx tracer, and makes it work in both 2.3 and 2.4 that is the 2_4. you should probably call the original find_user_frame in the new code.', 
                              pass: 'False'
                            },
                            { 
                              text: '4.PR Title Modification Advice: The current title torch.fx.Tracer.record_stack_traces fix #131741 can be made more descriptive. For example: Fix stack trace recording issue in torch.fx.Tracer (#131741).', 
                              pass: 'Warning'
                            },
                            { 
                              text: '5.PR Desciption Modification Advice: The current description \'Please let me know what changes would be needed, it\'s a start.\' can be more detailed. For example:', 
                              data: PRDescriptionAdvice.value,
                              type: 'advice',
                              pass: 'Warning'
                            },
                            { 
                              text: '6.Commit Desciption Modification Advice: The current commit message Fixes the tracer issue is too brief. It can be more descriptive.', 
                              pass: 'Warning'
                            },
                            { 
                              text: '7.Documentation: Update any relevant documentation if your changes affect the project\'s documentation.', 
                              pass: 'Warning'
                            },
                          ],
                        sender: 'bot'
                        });
  }, 500);
};

const getCommitAdvice = () => {
  setTimeout(() => {
    commitMessageAdvice.value = `Fix stack trace recording issue in torch.fx.Tracer

- Resolved the logic error in 'record_stack_traces'.
- Added corresponding unit tests to ensure correctness.

This should close #130861.`;
    messages.value.push({
                        messageUnits:
                          [
                            { 
                              text: 'Certainly! It can be more descriptive like:', 
                              data: commitMessageAdvice.value,
                              type: 'advice',
                            },
                          ],
                        sender: 'bot'
                        });
  }, 500);
};


// 处理用户输入
const handleUserInput = (input) => {
  if (input.toLowerCase().includes('commit')) {
    getCommitAdvice();
  } else {
    setTimeout(() => {
      messages.value.push({
                          messageUnits:
                          [{ 
                            text: 'System error: please try again later.', 
                          }],
                          sender: 'bot'
                        });
    }, 500);
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
          <div v-for="(messageUnit, index) in message.messageUnits" :key="index">
            <img v-if="messageUnit.img" :src="messageUnit.img" class="bot-image" />
            <div v-if="messageUnit.text" class="icon-text-container">
              <div v-html="messageUnit.text"></div>
              <el-icon v-if="messageUnit.pass === 'True'" color="#95d475"><SuccessFilled /></el-icon>
              <el-icon v-if="messageUnit.pass === 'Warning'" color="#eebe77"><WarningFilled /></el-icon>
              <el-icon v-if="messageUnit.pass === 'False'" color="#f89898"><CircleCloseFilled /></el-icon>
            </div>
            <div v-if="messageUnit.type === 'catalog'" class="message-margin">
              <ul>
                <li v-for="(step, index) in messageUnit.data" :key="index">
                  {{ step }}
                </li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'PR-input'" class="message-margin">
            <el-card>
              <el-form :model="form" label-width="120px" class="recommendation-form">
                <el-form-item label="PR Description">
                  <el-input v-model="form.PRDescription" placeholder="Your commits and PR Description" />
                </el-form-item>
                <el-form-item label="Relevant File">
                  <el-upload
                    v-model:file-list="form.codeFileList"
                    class="upload-demo"
                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                    multiple
                    :limit="10"
                    :auto-upload="false"
                  >
                    <el-button type="primary">upload code file</el-button>
                    <template #tip>
                      <div class="el-upload__tip">
                        Please upload your relevant code file
                      </div>
                    </template>
                  </el-upload>
                </el-form-item>
                <div class="button-container">
                  <el-button type="primary" @click="getPreReview">Send</el-button>
                </div>
              </el-form>
            </el-card>
            </div>
            <div v-if="messageUnit.type === 'advice'" class="message-margin">
                <el-card><el-scrollbar><pre v-html="messageUnit.data"></pre></el-scrollbar></el-card>
            </div>
          </div>
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
.button-container {
  display: flex;
  justify-content: flex-end;
}
.icon-text-container {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.message-margin {
  margin: 10px 0;
}
</style>