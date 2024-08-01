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

// Get the first code snippet
const getFirstCode = () => {
  setTimeout(() => {
    firstExampleCode.value = "import torch.fx\nfrom torch.fx.proxy import CapturedTraceback\n\nclass Tracer(torch.fx.Tracer):\n    def create_proxy(self, kind, target, args, kwargs, name, type_expr=None, proxy_factory_fn=None):\n        proxy = super().create_proxy(kind, target, args, kwargs, name, type_expr, proxy_factory_fn)\n        if self.record_stack_traces and not proxy.node.stack_trace:\n            proxy.node.stack_trace = self._find_user_frame2_4(''.join(CapturedTraceback.extract().format()))\n        return proxy\n\n    def _find_user_frame2_4(self, stack_trace):\n        stack_trace = stack_trace.split('\n')\n        if 'torch/fx/proxy.py' in stack_trace[-3]:\n            stack_trace = stack_trace[:-1]\n            while len(stack_trace) > 2 and '/fx/' in stack_trace[-2]:\n                stack_trace = stack_trace[:-2]\n        return '\\n'.join(stack_trace)";
    catalog.value = [
      "Code Comprehension",
      "Code Translation",
      "Natural Language to Code",
      "Test Case Generation",
    ];
    messages.value.push({
      messageUnits: [
        { 
          type: 'showcode', 
          data: firstExampleCode.value, 
          text: 'According to the analysis we have done before, the following code may help you to solve this issue, you can refer to it and make any modification, note that it may not be necessarily correct', 
        },
        { 
          type: 'catalog', 
          data: catalog.value, 
          text: 'You can always ask me for help during code writing and test writing, for example:', 
        },
        {
          text : 'But when it comes to problems, it\'s better for you to prioritise independent thinking.'
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
    getFirstCode();
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
      "Import necessary modules - torch.fx and a custom Tracer class.",
      "Define two PyTorch modules: M1 is a simple module with a linear layer plus input. M2 contains an instance of M1 and adds its output to the input.",
      "Create a model instance.",
      "Use the custom Tracer class for tracing: This uses the custom Tracer class to trace the model's computation graph and enables stack trace recording.",
      "Create a symbolic graph module: This converts the traced graph into a GraphModule.",
      "Print and assert: This prints a readable representation of the symbolic graph and asserts that specific code snippets are present in the output."
    ];
    NL2Code.value = `import torch.fx
from your_module import Tracer  # Import the new Tracer class

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
          text: 'In this code, we replace the original torch.fx.Tracer() with an instance of this new Tracer class:', 
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
      "test_create_proxy: This test verifies that the create_proxy method correctly creates a Proxy object with a Node that has a stack_trace attribute when record_stack_traces is enabled.",
      "test_find_user_frame2_4: This test checks the _find_user_frame2_4 method to ensure it correctly filters out PyTorch internal frames and preserves user frames.",
      "test_record_stack_traces_disabled: This test ensures that when record_stack_traces is set to False, the create_proxy method doesn't add a stack_trace attribute to the node.",
    ];
    testCode.value = `import unittest
import torch
import torch.fx
from torch.fx.proxy import Proxy, Node
from your_module import Tracer  # Assuming the Tracer class is in a file named 'your_module.py'

class TestCustomTracer(unittest.TestCase):
    def setUp(self):
        self.tracer = Tracer()
        self.tracer.record_stack_traces = True

    def test_create_proxy(self):
        # Create a dummy module for testing
        class DummyModule(torch.nn.Module):
            def forward(self, x):
                return x + 1

        m = DummyModule()

        # Test create_proxy method
        proxy = self.tracer.create_proxy('call_function', torch.add, (torch.tensor([1.0]), torch.tensor([2.0])), {}, 'add')
        
        self.assertIsInstance(proxy, Proxy)
        self.assertIsInstance(proxy.node, Node)
        self.assertTrue(hasattr(proxy.node, 'stack_trace'))
        self.assertIsNotNone(proxy.node.stack_trace)

    def test_find_user_frame2_4(self):
        # Create a mock stack trace
        mock_stack_trace = '''
File "test_file.py", line 10, in test_function
    result = some_operation()
File "/path/to/torch/fx/proxy.py", line 100, in proxy_function
    return proxy_operation()
File "/path/to/torch/fx/other_file.py", line 50, in other_function
    return final_operation()
'''
        result = self.tracer._find_user_frame2_4(mock_stack_trace)
        
        # Check if torch/fx/proxy.py frame is removed
        self.assertNotIn('torch/fx/proxy.py', result)
        
        # Check if other torch/fx frames are removed
        self.assertNotIn('torch/fx/other_file.py', result)
        
        # Check if user frame is preserved
        self.assertIn('test_file.py', result)

    def test_record_stack_traces_disabled(self):
        self.tracer.record_stack_traces = False
        
        proxy = self.tracer.create_proxy('call_function', torch.add, (torch.tensor([1.0]), torch.tensor([2.0])), {}, 'add')
        
        self.assertFalse(hasattr(proxy.node, 'stack_trace'))

if __name__ == '__main__':
    unittest.main()`;
    messages.value.push({
      messageUnits: [
        { 
          type: 'showcode', 
          data: testCode.value, 
          text: 'Certainly! Here\'s a unit test case for the custom Tracer class you\'ve provided. This test case will verify the functionality of the create_proxy method and the _find_user_frame2_4 method.', 
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
              <span>OSSNewcomerCopilot</span>
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
                <li v-for="(step, index) in messageUnit.data" :key="index">
                  {{ step }}
                </li>
              </ul>
            </div>
            <div v-if="messageUnit.type === 'testCodeExplanation'" class="message-margin">
              <ul>
                <li v-for="(step, index) in messageUnit.data" :key="index">
                  {{ step }}
                </li>
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
  margin: 10px 0;
}
</style>