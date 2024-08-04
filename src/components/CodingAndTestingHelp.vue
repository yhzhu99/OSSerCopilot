<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption, ElScrollbar } from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// Chat message list
const messages = ref(getFromLocalStorage('codingTestingMessages') || []);
const userInput = ref('');
const catalog = ref(getFromLocalStorage('codingTestingCatalog') || []);
const firstExampleCode = ref(getFromLocalStorage('firstExampleCode') || '');
const NL2Code = ref(getFromLocalStorage('NL2Code') || '');
const NL2CodeExplanation = ref(getFromLocalStorage('NL2CodeExplanation') || []);
const testCode = ref(getFromLocalStorage('testCode') || '');
const testCodeExplanation = ref(getFromLocalStorage('testCodeExplanation') || []);

// Watch for changes and save to local storage
watch(messages, (newValue) => {
  saveToLocalStorage('codingTestingMessages', newValue);
}, { deep: true });

watch(catalog, (newValue) => {
  saveToLocalStorage('codingTestingCatalog', newValue);
}, { deep: true });

watch(firstExampleCode, (newValue) => {
  saveToLocalStorage('firstExampleCode', newValue);
});

watch(NL2Code, (newValue) => {
  saveToLocalStorage('NL2Code', newValue);
});

watch(NL2CodeExplanation, (newValue) => {
  saveToLocalStorage('NL2CodeExplanation', newValue);
}, { deep: true });

watch(testCode, (newValue) => {
  saveToLocalStorage('testCode', newValue);
});

watch(testCodeExplanation, (newValue) => {
  saveToLocalStorage('testCodeExplanation', newValue);
}, { deep: true });

const getFirstTips = () => {
  setTimeout(() => {
    catalog.value = [
      "Code Comprehension",
      "Code Translation",
      "Natural Language to Code",
      "Test Case Generation",
    ];
    messages.value.push({
      messageUnits: [
        { 
          text: 'After our analysis in the previous step, you can now start writing code and testing it.', 
        },
        { 
          type: 'catalog', 
          data: catalog.value, 
          text: 'In this step, you can always ask me for help during code writing and test writing, for example:', 
        },
        {
          text : 'However, when it comes to problems, it\'s better for you to prioritise independent thinking.'
        }
      ],
      sender: 'bot'
    });
  }, 500);
};


// Get the first code snippet
const getFirstCode = () => {
  setTimeout(() => {
    firstExampleCode.value = "import torch.fx\nfrom torch.fx.proxy import CapturedTraceback\n\nclass Tracer(torch.fx.Tracer):\n    def create_proxy(self, kind, target, args, kwargs, name, type_expr=None, proxy_factory_fn=None):\n        \"\"\"\n        try to complete the code yourself\n        \"\"\"\n        return proxy\n\n    def _find_user_frame2_4(self, stack_trace):\n        \"\"\"\n        try to complete the code yourself\n        \"\"\"\n        return '\\n'.join(stack_trace)";
    messages.value.push({
      messageUnits: [
        { 
          type: 'showcode', 
          data: firstExampleCode.value, 
          text: 'According to the analysis we have done before, the following code framework may help you to solve this issue, you can refer to it and make any modification, note that it may not be necessarily correct', 
        }
      ],
      sender: 'bot'
    });
  }, 500);
};

const initialized = ref(getFromLocalStorage('codingTestingInitialized') === 'true');
// Initialize
onMounted(() => {
  if (!initialized.value) {
    getFirstTips();
    initialized.value = true;
    saveToLocalStorage('codingTestingInitialized', 'true');
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

// Get Natural Language to Code example
const getNL2Code = () => {
  setTimeout(() => {
    NL2CodeExplanation.value = [
      "Import necessary modules - <span class=\'code-style\'>torch.fx</span> and a custom <span class=\'code-style\'>Tracer</span> class.",
      "Define two PyTorch modules: <span class=\'code-style\'>M1</span> is a simple module with a linear layer plus input. <span class=\'code-style\'>M2</span> contains an instance of <span class=\'code-style\'>M1</span> and adds its output to the input.",
      "Create a model instance.",
      "Use the custom Tracer class for tracing: This uses the custom Tracer class to trace the model's computation graph and enables stack trace recording.",
      "Create a symbolic graph module: This converts the traced graph into a <span class=\'code-style\'>GraphModule</span>.",
      "Print and assert: This prints a readable representation of the symbolic graph and asserts that specific code snippets are present in the output."
    ];
    NL2Code.value = `import torch.fx
from your_module import Tracer  # Import the new Tracer class

class M1(torch.nn.Module):
    def __init__(self):
        """
        try to complete the code yourself
        """
    def forward(self, x):
        """
        try to complete the code yourself
        """

class M2(torch.nn.Module):
    def __init__(self):
        """
        try to complete the code yourself
        """
    def forward(self, x):
        """
        try to complete the code yourself
        """

m = M2()
tracer = Tracer()  # Use the new Tracer class
tracer.record_stack_traces = True
graph = tracer.trace(m)
sym = torch.fx.GraphModule(m, graph)
print(sym.print_readable())
assert 'code: return x + self.linear(x)' in sym.print_readable()
assert 'code: return x + self.m1(x)' in sym.print_readable()
`;
    messages.value.push({
      messageUnits: [
        { 
          type: 'showcode', 
          data: NL2Code.value, 
          text: 'Sure! Here\'s the code for how to use this fixed version of the Tracer.', 
        },
        { 
          type: 'NL2CodeExplanation', 
          data: NL2CodeExplanation.value, 
          text: 'In this code, we replace the original <span class=\'code-style\'>torch.fx.Tracer()</span> with an instance of this new <span class=\'code-style\'>Tracer</span> class:', 
        },
      ],
      sender: 'bot'
    });
  }, 500);
};

// Get test code
const getTestCode = () => {
  setTimeout(() => {
    testCodeExplanation.value = [
      "<span class=\'code-style\'>test_create_proxy</span>: This test verifies that the <span class=\'code-style\'>create_proxy</span> method correctly creates a Proxy object with a Node that has a <span class=\'code-style\'>stack_trace</span> attribute when <span class=\'code-style\'>record_stack_traces<span> is enabled.",
      "<span class=\'code-style\'>test_find_user_frame2_4</span>: This test checks the <span class=\'code-style\'>_find_user_frame2_4</span> method to ensure it correctly filters out PyTorch internal frames and preserves user frames.",
      "<span class=\'code-style\'>test_record_stack_traces_disabled</span>: This test ensures that when <span class=\'code-style\'>record_stack_traces</span> is set to False, the <span class=\'code-style\'>create_proxy</span> method doesn't add a <span class=\'code-style\'>stack_trace</span> attribute to the node.",
    ];
    testCode.value = `import unittest
import torch
import torch.fx
from torch.fx.proxy import Proxy, Node
from your_module import Tracer  # Assuming the Tracer class is in a file named 'your_module.py'

class TestCustomTracer(unittest.TestCase):
    def setUp(self):
        """
        try to complete the code yourself
        """

    def test_create_proxy(self):
        # Create a dummy module for testing
        class DummyModule(torch.nn.Module):
            def forward(self, x):
            """
            try to complete the code yourself
            """

        """
        try to complete the code yourself
        """

    def test_find_user_frame2_4(self):
        """
        try to complete the code yourself
        """

    def test_record_stack_traces_disabled(self):
        """
        try to complete the code yourself
        """

if __name__ == '__main__':
    unittest.main()`;
    messages.value.push({
      messageUnits: [
        { 
          type: 'showcode', 
          data: testCode.value, 
          text: 'Certainly! Here\'s a unit test case for the custom <span class=\'code-style\'>Tracer</span> class you\'ve provided. This test case will verify the functionality of the <span class=\'code-style\'>create_proxy</span> method and the <span class=\'code-style\'>_find_user_frame2_4</span> method.', 
        },
        { 
          type: 'testCodeExplanation', 
          data: testCodeExplanation.value, 
          text: 'This test case includes three tests:', 
        },
      ],
      sender: 'bot'
    });
  }, 500);
};

// Handle user input
const handleUserInput = (input) => {
  if (input.toLowerCase().includes('use this')) {
    getNL2Code();
  } else if (input.toLowerCase().includes('test case')) {
    getTestCode();
  } else if (input.toLowerCase().includes('translation') || input.toLowerCase().includes('comprehension')) {
    setTimeout(() => {
      messages.value.push({
        messageUnits: [
          { 
            text: 'Sure! Please provide your code', 
          },
        ],
        sender: 'bot'
      });
    }, 500);
  }else if (input.toLowerCase().includes('tips')) {
    getFirstCode();
  } else {
    setTimeout(() => {
      messages.value.push({
        messageUnits: [
          { 
            text: 'System error: please try again later.', 
          }
        ],
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
            <div v-if="messageUnit.text" v-html="messageUnit.text" class="message-margin"></div>
            <div v-if="messageUnit.type === 'catalog'" class="message-margin">
              <ul>
                <li v-for="(step, index) in messageUnit.data" :key="index">
                  {{ step }}
                </li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'NL2CodeExplanation'" class="message-margin">
              <ul>
                <li v-for="(step, index) in messageUnit.data" :key="index" v-html="step"></li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'testCodeExplanation'" class="message-margin">
              <ul>
                <li v-for="(step, index) in messageUnit.data" :key="index" v-html="step"></li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'showcode'" class="message-margin">
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

.message-margin {
  margin: 10px 0;
}

:deep(.code-style) {
  background-color: #bbb8b86d;
  color: #333;
  font-family: monospace;
}
</style>