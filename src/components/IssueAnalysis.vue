<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption, ElScrollbar } from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// Chat message list
const messages = ref(getFromLocalStorage('issueAnalysisMessages') || []);
const userInput = ref('');
const catalog = ref(getFromLocalStorage('issueAnalysisCatalog') || []);
const issueReappearVersion = ref(getFromLocalStorage('issueReappearVersion') || []);
const issueReappearCode = ref(getFromLocalStorage('issueReappearCode') || '');
const relatedIssuRecommendationCode = ref(getFromLocalStorage('relatedIssuRecommendationCode') || '');
const solutionSteps = ref(getFromLocalStorage('solutionSteps') || []);

// Watch for changes and save to local storage
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

// Get initial issue analysis
const getFirstAnalysis = () => {
  setTimeout(() => {
    catalog.value = [
      "Issue Reappear (for bug fix)",
      "Base/Similar Function Analysis (for new feature)",
      "Related Issue Recommendation",
      "Solution Steps Analysis",
    ];
    messages.value.push({
      messageUnits: [
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

const initialized = ref(getFromLocalStorage('issueAnalysisInitialized') === 'true');

// Initialize issue analysis
onMounted(() => {
  if (!initialized.value) {
    getFirstAnalysis();
    initialized.value = true;
    saveToLocalStorage('issueAnalysisInitialized', 'true');
  }
});

// Send message
const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.push({ text: userInput.value, sender: 'user' });
    handleUserInput(userInput.value);
    userInput.value = '';
  }
};

// Get issue reappear information
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
    issueReappearCode.value = `import torch.fx
class M1(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.linear = torch.nn.Linear(1, 1)
    def forward(self, x):
        return x + self.linear(x)
class M2(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.m1 = M1()
    def forward(self, x):
        return x + self.m1(x)
m = M2()
tracer = torch.fx.Tracer()
tracer.record_stack_traces=True
graph = tracer.trace(m)
sym=torch.fx.GraphModule(m,graph)
print(sym.print_readable())
assert 'code: return x + self.linear(x)' in sym.print_readable()
assert 'code: return x + self.m1(x)' in sym.print_readable()`;
    messages.value.push({
      messageUnits: [
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
          text: "Next, as we can see from the code below, <span class='code-style'>torch.fx.Tracer</span> has a <span class='code-style'>record_stack_traces</span> member. It does not give the correct stack trace, starting with torch 2.4 RC. <span class='code-style'>torch.export.unflatten</span> looses stack trace for collapsed modules.", 
        }
      ],
      sender: 'bot'
    });
  }, 500);
};

// Get related issue recommendation
const getRelatedIssueRecommendation = () => {
  setTimeout(() => {
    relatedIssuRecommendationCode.value = `time_start = time.time()
for i in range(1000):
    self.check_graph(MyModule(), inputs)
warnings.warn(f"time_taken: {time.time() - time_start}")`;
    messages.value.push({
      messageUnits: [
        {
          text: 'After my analysis of the code base and past issues, this issue seems to be related to PR <a href="https://github.com/pytorch/pytorch/issues/130861" target="_blank">#121449</a>, where pytorch stopped using the <span class=\'code-style\'>find_user_frame</span> (or an equivalent function) to filter non user stack traces.',
        },
        { 
          type: 'showcode', 
          data: relatedIssuRecommendationCode.value, 
          text: 'This PR replace <span class=\'code-style\'>traceback.extract_stack</span> with <span class=\'code-style\'>CapturedTraceback.extract</span> using below code:', 
        },
        { 
          text: 'and forcing <span class=\'code-style\'>FakeTensorConfig.debug</span> to True, <span class=\'code-style\'>record_stack_traces</span> to True, logging level to debug, it shows that the the changed code is consistently ard 20 secs faster (~90s vs originally ~110s). But it also result in issue #130861. Looking through this PR will help to resolve the issue!', 
        }
      ],
      sender: 'bot'
    });
  }, 500);
};

// Get solution steps analysis
const getSolutionStepsAnalysis = () => {
  setTimeout(() => {
    solutionSteps.value = [
      {
        pstep: "<strong>Identify the Problem.</strong> - The issue is that the <span class='code-style'>record_stack_traces</span> functionality in <span class='code-style'>torch.fx.Tracer</span> is not providing the correct stack trace in PyTorch 2.4.0 RC. This was working correctly in PyTorch 2.3.",
        childrenContent:[]
      },
      {
        pstep: "<strong>Locate the Source of the Problem.</strong> - The problem was introduced in PR #121449, where the <span class='code-style'>find_user_frame</span> function (or an equivalent) was removed, which was previously used to filter out non-user stack traces.",
        childrenContent:[]
      },
      {
        pstep: "<strong>Implement the Fix</strong> - We'll need to modify the <span class='code-style'>create_proxy</span> method in the <span class='code-style'>Tracer</span> class and add a new helper function to filter the stack trace.Let's break down the changes:",
        childrenContent:[
          "We create a new <span class='code-style'>Tracer</span> class that inherits from <span class='code-style'>torch.fx.Tracer.</span>",
          "We override the <span class='code-style'>create_proxy</span> method. This method is responsible for creating proxy objects during the tracing process.",
          "In the <span class='code-style'>create_proxy</span> method, we first call the parent class's <span class='code-style'>create_proxy</span> method using <span class='code-style'>super()</span>.",
          "We then check if <span class='code-style'>record_stack_traces</span> is True and if the proxy's node doesn't already have a stack trace.",
          "If both conditions are met, we set the <span class='code-style'>stack_trace</span> of the proxy's node using our new <span class='code-style'>_find_user_frame2_4</span> method.",
          "The <span class='code-style'>_find_user_frame2_4</span> method is a helper function that filters the stack trace to remove internal PyTorch frames and keep only user-relevant frames.",
          "In <span class='code-style'>_find_user_frame2_4</span>, we split the stack trace into lines, remove the last frame if it's from torch/fx/proxy.py, and then remove any remaining frames that contain /fx/ until we reach user code."
        ]
      },
      {
        pstep: "<strong>Test the Fix.</strong> - Run the test code provided in the issue description to ensure that the assertions pass and the correct stack traces are captured.",
        childrenContent:[]
      },
      {
        pstep: "<strong>Submit a Pull Request.</strong> - Once you've verified that the fix works, you can submit a pull request to the PyTorch repository with these changes.",
        childrenContent:[]
      },
    ];
    messages.value.push({
      messageUnits: [
        {  
          type: 'solutionSteps', 
          data: solutionSteps.value, 
          text: 'I think you can try to resolve the issue by following these steps:', 
        },
        {
          text: "This solution should restore the functionality of <span class='code-style'>record_stack_traces</span> in PyTorch 2.4.0 and later versions. It filters out internal PyTorch frames from the stack trace, providing only the user-relevant information."
        }
      ],
      sender: 'bot'
    });
  }, 500);
};

// Handle user input
const handleUserInput = (input) => {
  if (input.toLowerCase().includes('reappear') || input.toLowerCase().includes('1')) {
    getIssueReappear();
  } else if (input.toLowerCase().includes('similar') || input.toLowerCase().includes('2')) {
    setTimeout(() => {
      messages.value.push({
        messageUnits: [{ 
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
        messageUnits: [{ 
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
                <li v-for="(step, index) in messageUnit.data" :key="index" v-html="step"></li>
              </ol>
            </div>
            <div v-if="messageUnit.type === 'issueReappearVersion'" class="message-margin">
              <ul>
                <li v-for="(step, index) in messageUnit.data" :key="index" v-html="step"></li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'showcode'" class="message-margin">
                <el-card><el-scrollbar><pre v-html="messageUnit.data"></pre></el-scrollbar></el-card>
            </div>
            <div v-if="messageUnit.type === 'solutionSteps'" class="message-margin">
                <ol>
                  
                  <li v-for="(step, index) in messageUnit.data" :key="index">
                    <el-scrollbar>
                    <div v-html="step.pstep"></div>
                    <ol>
                      <li v-for="(content, index) in step.childrenContent" :key="index" v-html="content"></li>
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

.message-margin {
  margin: 10px 0;
}

:deep(.code-style) {
  background-color: #bbb8b86d;
  color: #333;
  font-family: monospace;
}
</style>