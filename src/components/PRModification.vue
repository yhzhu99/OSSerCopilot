<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption, ElScrollbar, ElIcon } from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// 聊天消息列表
const messages = ref(getFromLocalStorage('prModificationMessages') || []);
const userInput = ref('');
const catalog = ref(getFromLocalStorage('prModificationCatalog') || []);
const commitMessageAdvice = ref(getFromLocalStorage('prModificationCommitMessageAdvice') || '');
const PRCodeModificationAdvice = ref(getFromLocalStorage('PRCodeModificationAdvice') || []);
const PRReferCode = ref(getFromLocalStorage('PRReferCode') || '');

watch(messages, (newValue) => {
  saveToLocalStorage('prModificationMessages', newValue);
}, { deep: true });

watch(catalog, (newValue) => {
  saveToLocalStorage('prModificationCatalog', newValue);
}, { deep: true });

watch(commitMessageAdvice, (newValue) => {
  saveToLocalStorage('prModificationCommitMessageAdvice', newValue);
});

watch(PRCodeModificationAdvice, (newValue) => {
  saveToLocalStorage('PRCodeModificationAdvice', newValue);
}, { deep: true });

watch(PRReferCode, (newValue) => {
  saveToLocalStorage('PRReferCode', newValue);
});

// 引入SVG图标
import { SuccessFilled, WarningFilled, CircleCloseFilled } from '@element-plus/icons-vue'

// 模拟用户历史数据
const userHistory = reactive({
  PRURL: 'https://github.com/pytorch/pytorch/pull/131741',
});

// 表单数据
const form = reactive({
  PRURL: '',
});

//初始化
const getModificationAdviceTips = () => {
  setTimeout(() => {
    catalog.value = [
      "Check the current PR status",
      "If the PR is in an abnormal workflow, analyse the reason for the abnormality.",
      "Give you code modification suggestions based on the code reviewer's recommendations.",
    ];
    messages.value.push({
                        messageUnits:
                          [
                            { 
                              type: 'PR-input', 
                              text: 'In this step, you can provide me with the URL of your PR submission to the community.', 
                            },
                            { 
                              type: 'catalog', 
                              data: catalog.value, 
                              text: 'After analysing the PR content within the URL, I can:', 
                            },
                          ],
                        sender: 'bot'
                      });
  }, 500);
};


const initialized = ref(getFromLocalStorage('prModificationInitialized') === 'true');
// 初始化
onMounted(() => {
  if (!initialized.value) {
    form.PRURL = userHistory.PRURL;
    getModificationAdviceTips();
    initialized.value = true;
    saveToLocalStorage('prModificationInitialized', 'true');
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

const getModificationAdvice = () => {
  setTimeout(() => {
    PRCodeModificationAdvice.value = [
      "Remove the <span class=\'code-style\'>_find_user_frame2_4</span> function definition.",
      "Directly call the <span class=\'code-style\'>find_user_frame</span> function."
    ];
    PRReferCode.value =  `# Remove the _find_user_frame2_4 function definition

if self.record_stack_traces and not proxy.node.stack_trace:
    proxy.node.stack_trace = find_user_frame("".join(CapturedTraceback.extract().format()))
return proxy`;
    messages.value.push({
                        messageUnits:
                          [ 
                            { 
                              text: 'Based on your submitted PR URL, here is some information on the current state of your PR and some suggestions for change:',
                            },
                            { 
                              text: '1. <strong>Merging is blocked</strong>: The base branch restricts merging to authorized users. <a href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" target="_blank">You can learn more about protected branches.</a>', 
                              pass: 'False'
                            },
                            { 
                              text: '2. <strong>4 workflows awaiting approval</strong>: This workflow requires approval from a maintainer. <a href="https://docs.github.com/en/actions/managing-workflow-runs/approving-workflow-runs-from-public-forks" target="_blank">You can learn more about approving workflows.</a>', 
                              pass: 'Warning'
                            },
                            { 
                              text: '3. <strong>From the reviewer\'s comment\'s</strong>, they suggest that you should call the original <span class=\'code-style\'>find_user_frame</span> function in your new code instead of introducing a simplified version named <span class=\'code-style\'>_find_user_frame2_4</span>. This approach avoids code duplication and leverages the existing, tested functionality.', 
                              pass: 'Warning'
                            },
                            { 
                              text: 'Here\'s how you can modify your code:', 
                              data: PRCodeModificationAdvice.value,
                              type: 'codeadvice',
                            },
                            { 
                              text: 'You can refer to the following code modification:', 
                              type: 'advice',
                              data: PRReferCode.value,
                            },
                            { 
                              text: 'By doing this, you simplify your code and use the existing functionality to handle stack traces. Ensure that the <span class=\'code-style\'>find_user_frame</span> function is defined and that it meets your requirements before making this change.', 
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
              <span>OSSerCopilot</span>
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
                <li v-for="(step, index) in messageUnit.data" :key="index" v-html="step">
                </li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'codeadvice'" class="message-margin">
              <ol>
                <li v-for="(step, index) in messageUnit.data" :key="index" v-html="step">
                </li>
              </ol>
            </div>
            <div v-if="messageUnit.type === 'PR-input'" class="message-margin">
              <el-form :model="form" label-width="120px" class="recommendation-form">
                <el-form-item label="PR URL">
                  <el-input v-model="form.PRURL" placeholder="Your PR URL" />
                </el-form-item>
                <div class="button-container">
                  <el-button type="primary" @click="getModificationAdvice">Send</el-button>
                </div>
              </el-form>
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
  border: 1px solid #b3e5fc;
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

:deep(.code-style) {
  background-color: #bbb8b86d;
  color: #333;
  font-family: monospace;
}
</style>