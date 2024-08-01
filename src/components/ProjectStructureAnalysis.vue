<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar, ElCollapse, ElCollapseItem, ElTag, ElForm, ElFormItem, ElSelect, ElOption ,ElScrollbar, ElTree} from 'element-plus';
import 'element-plus/dist/index.css';
import { saveToLocalStorage, getFromLocalStorage } from '../utils/storage';

// 聊天消息列表
const messages = ref(getFromLocalStorage('projectStructureMessages') || []);
const userInput = ref('');
const structureData = ref(getFromLocalStorage('projectStructureData') || []);
const functionAnalysisData1 = ref(getFromLocalStorage('functionAnalysisData1') || []);
const functionAnalysisData2 = ref(getFromLocalStorage('functionAnalysisData2') || []);

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(messages, (newValue) => {
  saveToLocalStorage('projectStructureMessages', newValue);
}, { deep: true });

watch(structureData, (newValue) => {
  saveToLocalStorage('projectStructureData', newValue);
}, { deep: true });

watch(functionAnalysisData1, (newValue) => {
  saveToLocalStorage('functionAnalysisData1', newValue);
}, { deep: true });

watch(functionAnalysisData2, (newValue) => {
  saveToLocalStorage('functionAnalysisData2', newValue);
}, { deep: true });

// 获取贡献指南分析
const getFirstAnalysis = () => {
  setTimeout(() => {
    structureData.value = [
    {
    id: 1,
    label: "C10 - Core library files that work everywhere, both server and mobile. We are slowly moving pieces from ATen/core here. This library is intended only to contain essential functionality, and appropriate to use in settings where binary size matters. (But you'll have a lot of missing functionality if you try to use it directly.)",
    link: "https://github.com/pytorch/pytorch/tree/main/c10",
  },
  {
    id: 2,
    label: 'aten - C++ tensor library for PyTorch (no autograd support)',
    link:"https://github.com/pytorch/pytorch/tree/main/aten",
    children: [
      {
        id: 7,
        label: 'src - README',
        link: 'https://github.com/pytorch/pytorch/tree/main/aten/src',
      }
    ],
  },
  {
    id: 3,
    label: 'torch - The actual PyTorch library. Everything that is not in csrc is a Python module, following the PyTorch Python frontend module structure.',
    link: 'https://github.com/pytorch/pytorch/tree/main/torch',
    children: [
      {
        id: 8,
        label: 'csrc - C++ files composing the PyTorch library. Files in this directory tree are a mix of Python binding code, and C++ heavy lifting. Consult setup.py for the canonical list of Python binding files; conventionally, they are often prefixed with python_. README',
        link: 'https://github.com/pytorch/pytorch/tree/main/torch/csrc',
        children: [
          {
            id: 17,
            label: 'jit - Compiler and frontend for TorchScript JIT frontend. README',
            link: 'https://github.com/pytorch/pytorch/tree/main/torch/csrc/jit',
          },
          {
            id: 18,
            label: 'autograd - Implementation of reverse-mode automatic differentiation. README',
            link: 'https://github.com/pytorch/pytorch/tree/main/torch/csrc/autograd',
          },
          {
            id: 19,
            label: 'api - The PyTorch C++ frontend.',
            link: 'https://github.com/pytorch/pytorch/tree/main/torch/csrc/api',
          },
          {
            id: 20,
            label: 'distributed - Distributed training support for PyTorch.',
            link: 'https://github.com/pytorch/pytorch/tree/main/torch/csrc/distributed',
          },
          {
            id: 21,
            label: 'Exceptions.h - Moreover, when using the following macros, the generated warnings will be converted into python warnings that can be caught by the user.',
            link: 'https://github.com/pytorch/pytorch/blob/main/torch/csrc/Exceptions.h',
          }
        ],
      }
    ],
  },
  {
    id: 4,
    label: 'tools - Code generation scripts for the PyTorch library. See README of this directory for more details.',
    link: 'https://github.com/pytorch/pytorch/tree/main/tools',
  },
  {
    id: 5,
    label: 'test - Python unit tests for PyTorch Python frontend.',
    link: 'https://github.com/pytorch/pytorch/tree/main/test',
    children: [
      {
        id: 9,
        label: 'test_torch.py - Basic tests for PyTorch functionality.',
        link: 'https://github.com/pytorch/pytorch/blob/main/test/test_torch.py',
      },
      {
        id: 10,
        label: 'test_autograd.py - Tests for non-NN automatic differentiation support.',
        link: 'https://github.com/pytorch/pytorch/blob/main/test/test_autograd.py',
      },
      {
        id: 11,
        label: 'test_nn.py - Tests for NN operators and their automatic differentiation.',
        link: 'https://github.com/pytorch/pytorch/blob/main/test/test_nn.py'
      },
      {
        id: 12,
        label: 'test_jit.py - Tests for the JIT compiler and TorchScript.',
        link: 'https://github.com/pytorch/pytorch/blob/main/test/test_jit.py'
      },
      {
        id: 13,
        label: 'cpp - C++ unit tests for PyTorch C++ frontend.',
        link: 'https://github.com/pytorch/pytorch/tree/main/test/cpp',
      },
    ],
  },
  {
    id: 6,
    label: 'caffe2 - The Caffe2 library.',
    link: 'https://github.com/pytorch/pytorch/tree/main/caffe2',
    children: [
      {
        id: 14,
        label: 'core - Core files of Caffe2, e.g., tensor, workspace, blobs, etc.',
      },
      {
        id: 15,
        label: 'operators - Operators of Caffe2.',
      },
      {
        id: 16,
        label: 'python - Python bindings to Caffe2.',
      },
    ],
  },
    ];
    messages.value.push({
                        messageUnits:
                          [
                            { 
                            type: "structure" , 
                            data: structureData.value, 
                            text: 'Below is the directory structure of the Pytorch project. You can expand it level by level to see the functionality of each code file, and click the jump button after the directory to go straight to the corresponding code file on GitHub. You can also search by entering keywords in the input box below.', 
                            },
                            { 
                            text: 'Alternatively, you can just ask me what a particular directory/file or a specific piece of code does.', 
                            },
                          ],
                        sender: 'bot'
                      });
  }, 500);
};

const initialized = ref(getFromLocalStorage('projectStructureInitialized') === 'true');
// 初始化贡献指南分析
onMounted(() => {
  if (!initialized.value) {
    getFirstAnalysis();
    initialized.value = true;
    saveToLocalStorage('projectStructureInitialized', 'true');
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

const handleNodeClick = (node) => {
  // 假设你想根据节点的 label 或 id 来决定跳转的链接
  const link = node.link; // 这里替换成你的目标链接
  window.open(link, '_blank'); // 在新标签页中打开链接
};

const getFileAnalysis = () => {
  setTimeout(() => {
    messages.value.push({
                        messageUnits:
                          [{
                            text: '<p>Here\'s what the <a href="https://github.com/pytorch/pytorch/blob/main/torch/csrc/Exceptions.h" target="_blank">Exceptions.h</a> file does.</p><p>Frequently when working with the Python API, you may call a function which returns an error. In this case, we want to return directly to the Python interpreter, so that this exception can be propagated accordingly; however, because the Python API is C-based, what actually will happen is it will return control to whatever C++ code called it. Similarly, if we raise a C++ exception, prior to returning to the Python interpreter, we must set the Python error flags, so it turns into a C++ exception.</p><p>Moreover, when using the following macros, the generated warnings will be converted into python warnings that can be caught by the user.</p>', 
                          }],
                        sender: 'bot'
                        });
  }, 500);
};

const getFunctionAnalysis = () => {
  setTimeout(() => {
    functionAnalysisData1.value = [
      "Exception Catching: It catches multiple specific types of exceptions, including PyTorch-specific exceptions and some standard Python exceptions.",
      "Exception Handling: For each caught exception, it has a specific handling method.",
      "Flexibility: The macro accepts a retstmnt parameter, which allows the caller to specify what statement should be executed when an exception is caught (usually a return statement).",
      "Error Translation: In some cases, it translates caught C++ exceptions into corresponding Python exceptions."
    ];
    functionAnalysisData2.value = [
      "python_error and py::error_already_set: Likely pybind11-related exceptions.",
      "Standard Python exceptions: Such as IndexError, ValueError, TypeError, NotImplementedError.",
      "PyTorch-specific exceptions: Like LinAlgError (linear algebra error), OutOfMemoryError, etc.",
      "Distributed computing related exceptions: Such as DistBackendError, DistNetworkError, etc.",
      "Generic PyTorch exception: Catches torch::PyTorchError and converts it to Python's RuntimeError."
    ]
    messages.value.push({
                          messageUnits:
                          [{
                            type: 'functionAnalysis1',  
                            data: functionAnalysisData1.value, 
                            text: 'This code defines a macro named CATCH_CORE_ERRORS, which is designed to catch and handle various exceptions that may occur in PyTorch (a popular machine learning library). Here\'s an explanation of its main functions:', 
                          },
                          {
                            type: 'functionAnalysis2',  
                            data: functionAnalysisData2.value,
                            text: 'Specific exceptions caught include:', 
                          },
                          {
                            text: "The main purpose of this macro is to ensure that PyTorch's C++ code can gracefully handle various possible exceptions and pass them back to the Python environment in an appropriate manner, thereby improving the library's stability and user-friendliness."
                          }
                          ],
                          sender: 'bot'
                        });
  }, 500);
};

// 处理用户输入
const handleUserInput = (input) => {
  if (input.toLowerCase().includes('exceptions.h')) {
    getFileAnalysis();
  } else if (input.toLowerCase().includes('function')) {
    getFunctionAnalysis();
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
            <div v-if="messageUnit.type === 'structure'" class="message-margin">
              <el-scrollbar>
                <el-tree
                  :data="messageUnit.data"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                />
              </el-scrollbar>
            </div>
            <div v-if="messageUnit.type === 'functionAnalysis1'" class="message-margin">
                    <ol>
                      <li v-for="(step, index) in messageUnit.data" :key="index">
                        {{ step }}
                      </li>
                    </ol>
            </div>
            <div v-if="messageUnit.type === 'functionAnalysis2'" class="message-margin">
                    <ul>
                      <li v-for="(step, index) in messageUnit.data" :key="index">
                        {{ step }}
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