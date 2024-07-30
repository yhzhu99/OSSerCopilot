<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption, ElScrollbar } from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// 聊天消息列表
const messages = ref(getFromLocalStorage('issueAnalysisMessages') || []);
const userInput = ref('');
const catalog = ref(getFromLocalStorage('issueAnalysisCatalog') || []);
const issueReappearVersion = ref(getFromLocalStorage('issueReappearVersion') || []);
const issueReappearCode = ref(getFromLocalStorage('issueReappearCode') || '');
const relatedIssuRecommendationCode = ref(getFromLocalStorage('relatedIssuRecommendationCode') || '');
const solutionSteps = ref(getFromLocalStorage('solutionSteps') || []);

watch(messages, (newValue) => {
  saveToLocalStorage('issueAnalysisMessages', newValue);
}, { deep: true });

watch(catalog, (newValue) => {
  saveToLocalStorage('issueAnalysisCatalog', newValue);
}, { deep: true });

watch(issueReappearVersion, (newValue) => {
  saveToLocalStorage('issueReappearVersion', newValue);
}, { deep: true });

watch(issueReappearCode, (newValue) => {
  saveToLocalStorage('issueReappearCode', newValue);
});

watch(relatedIssuRecommendationCode, (newValue) => {
  saveToLocalStorage('relatedIssuRecommendationCode', newValue);
});

watch(solutionSteps, (newValue) => {
  saveToLocalStorage('solutionSteps', newValue);
}, { deep: true });

// 获取issue分析
const getFirstAnalysis = () => {
  setTimeout(() => {
    catalog.value = [
      "Issue Reappear (for bug fix)",
      "Base/Similar Function Analysis (for new feature)",
      "Related Issue Recommendation",
      "Solution Steps Analysis",
    ];
    messages.value.push({
                        messageUnits:
                          [
                            { 
                              type: 'catalog', 
                              data: catalog.value, 
                              text: 'I see that you have selected a GOOD FIRST ISSUE <a href="https://github.com/pytorch/pytorch/issues/130861" target="_blank">#130861</a> in Pytorch, and in this step I can perform a comprehensive issue analysis for you, including the following:', 
                            },
                            {
                              text : 'You can select one of the following items to get more detailed analysis.'
                            }
                          ],
                        sender: 'bot'
                      });
  }, 500);
};


// 初始化issue分析
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

const getIssueReappear = () => {
  setTimeout(() => {
    issueReappearVersion.value = [
      "PyTorch version: 2.4.0+cu121",
      "CUDA used to build PyTorch: 12.1",
      "OS: Ubuntu 22.04.3 LTS (x86_64)",
      "GCC version: (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0",
      "CMake version: version 3.29.2",
      "Libc version: glibc-2.35",
    ];
    issueReappearCode.value = "import torch.fx\nclass M1(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.linear = torch.nn.Linear(1, 1)\n    def forward(self, x):\n        return x + self.linear(x)\nclass M2(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.m1 = M1()\n    def forward(self, x):\n        return x + self.m1(x)\nm = M2()\ntracer = torch.fx.Tracer()\ntracer.record_stack_traces=True\ngraph = tracer.trace(m)\nsym=torch.fx.GraphModule(m,graph)\nprint(sym.print_readable())\nassert 'code: return x + self.linear(x)' in sym.print_readable()\nassert 'code: return x + self.m1(x)' in sym.print_readable()";
    messages.value.push({
                        messageUnits:
                          [
                            {
                              text: 'Okay, let\'s reproduce the bug.',
                            },
                            { 
                              type: 'issueReappearVersion', 
                              data: issueReappearVersion.value, 
                              text: 'In order to reproduce the bug, we first had to set our environment to the version mentioned in the issue report:', 
                            },
                            { 
                              type: 'showcode', 
                              data: issueReappearCode.value, 
                              text: 'Next, as we can see from the code below, torch.fx.Tracer has a record_stack_traces member. It does not give the correct stack trace, starting with torch 2.4 RC. torch.export.unflatten looses stack trace for collapsed modules.', 
                            }
                          ],
                        sender: 'bot'
                        });
  }, 500);
};

const getRelatedIssueRecommendation = () => {
  setTimeout(() => {
    relatedIssuRecommendationCode.value = "time_start = time.time()\nfor i in range(1000):\n    self.check_graph(MyModule(), inputs)\nwarnings.warn(f\"time_taken: {time.time() - time_start}\")";
    messages.value.push({
                        messageUnits:
                          [
                            {
                              text: 'After my analysis of the code base and past issues, this issue seems to be related to PR <a href="https://github.com/pytorch/pytorch/issues/130861" target="_blank">#121449</a>, where pytorch stopped using the find_user_frame (or an equivalent function) to filter non user stack traces.',
                            },
                            { 
                              type: 'showcode', 
                              data: relatedIssuRecommendationCode.value, 
                              text: 'This PR replace traceback.extract_stack with CapturedTraceback.extract using below code:', 
                            },
                            { 
                              text: 'and forcing FakeTensorConfig.debug to True, record_stack_traces to True, logging level to debug, it shows that the the changed code is consistently ard 20 secs faster (~90s vs originally ~110s). But it also result in issue #130861. Looking through this PR will help to resolve the issue!', 
                            }
                          ],
                        sender: 'bot'
                        });
  }, 500);
};

const getSolutionStepsAnalysis = () => {
  setTimeout(() => {
    solutionSteps.value = [
      {
        pstep: "Identify the Problem. - The issue is that the record_stack_traces functionality in torch.fx.Tracer is not providing the correct stack trace in PyTorch 2.4.0 RC. This was working correctly in PyTorch 2.3.",
        childrenContent:[]
      },
      {
        pstep: "Locate the Source of the Problem. - The problem was introduced in PR #121449, where the find_user_frame function (or an equivalent) was removed, which was previously used to filter out non-user stack traces.",
        childrenContent:[]
      },
      {
        pstep: "Implement the Fix - We'll need to modify the create_proxy method in the Tracer class and add a new helper function to filter the stack trace.Let's break down the changes:",
        childrenContent:[
          "We create a new Tracer class that inherits from torch.fx.Tracer.",
          "We override the create_proxy method. This method is responsible for creating proxy objects during the tracing process.",
          "In the create_proxy method, we first call the parent class's create_proxy method using super().",
          "We then check if record_stack_traces is True and if the proxy's node doesn't already have a stack trace.",
          "If both conditions are met, we set the stack_trace of the proxy's node using our new _find_user_frame2_4 method.",
          "The _find_user_frame2_4 method is a helper function that filters the stack trace to remove internal PyTorch frames and keep only user-relevant frames.",
          "In _find_user_frame2_4, we split the stack trace into lines, remove the last frame if it's from torch/fx/proxy.py, and then remove any remaining frames that contain /fx/ until we reach user code."
        ]
      },
      {
        pstep: "Test the Fix. - Run the test code provided in the issue description to ensure that the assertions pass and the correct stack traces are captured.",
        childrenContent:[]
      },
      {
        pstep: "Submit a Pull Request. - Once you've verified that the fix works, you can submit a pull request to the PyTorch repository with these changes.",
        childrenContent:[]
      },
    ];
    messages.value.push({
                          messageUnits:
                          [
                            {  
                              type: 'solutionSteps', 
                              data: solutionSteps.value, 
                              text: 'I think you can try to resolve the issue by following these steps:', 
                            },
                            {
                              text: "This solution should restore the functionality of record_stack_traces in PyTorch 2.4.0 and later versions. It filters out internal PyTorch frames from the stack trace, providing only the user-relevant information."
                            }
                          ],
                          sender: 'bot'
                        });
  }, 500);
};

// 处理用户输入
const handleUserInput = (input) => {
  if (input.toLowerCase().includes('reappear') || input.toLowerCase().includes('1')) {
    getIssueReappear();
  } else if (input.toLowerCase().includes('similar') || input.toLowerCase().includes('2')) {
    setTimeout(() => {
      messages.value.push({
                          messageUnits:
                          [{ 
                            text: 'Sure! Let me analyze base/similar function of this issue in Pytorch', 
                          }],
                          sender: 'bot'
                        });
    }, 500);
  } else if (input.toLowerCase().includes('related') || input.toLowerCase().includes('3')) {
    getRelatedIssueRecommendation();
  } else if (input.toLowerCase().includes('steps') || input.toLowerCase().includes('4')) {
    getSolutionStepsAnalysis();
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
            <div v-if="messageUnit.text" v-html="messageUnit.text" class="message-margin"></div>
            <div v-if="messageUnit.type === 'catalog'" class="message-margin">
              <ol>
                <li v-for="(step, index) in messageUnit.data" :key="index">
                  {{ step }}
                </li>
              </ol>
            </div>
            <div v-if="messageUnit.type === 'issueReappearVersion'" class="message-margin">
              <ul>
                <li v-for="(step, index) in messageUnit.data" :key="index">
                  {{ step }}
                </li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'showcode'" class="message-margin">
                <el-card><el-scrollbar><pre v-html="messageUnit.data"></pre></el-scrollbar></el-card>
            </div>
            <div v-if="messageUnit.type === 'solutionSteps'" class="message-margin">
                <ol>
                  
                  <li v-for="(step, index) in messageUnit.data" :key="index">
                    <el-scrollbar>
                    <div>{{ step.pstep }}</div>
                    <ol>
                      <li v-for="(content, index) in step.childrenContent" :key="index">
                        {{ content }}
                      </li>
                    </ol>
                    </el-scrollbar>
                  </li>
                </ol>
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

.message-margin {
  margin: 10px 0; /* 上下间距为 10px，左右间距为 0 */
}
</style>