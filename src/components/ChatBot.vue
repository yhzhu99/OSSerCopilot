<script setup>
import { ref } from 'vue';
import { ElCard, ElInput, ElButton, ElAvatar } from 'element-plus';
import 'element-plus/dist/index.css';

const messages = ref([]);
const userInput = ref('');

const sendMessage = () => {
  if (userInput.value.trim()) {
    messages.value.push({ text: userInput.value, sender: 'user' });
    // 模拟bot回复
    setTimeout(() => {
      messages.value.push({ text: '这是bot的回复', sender: 'bot', img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png' });
    }, 1000);
    userInput.value = '';
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
            <img v-if="message.img" :src="message.img" class="bot-image" />
            <div>{{ message.text }}</div>
          </el-card>
        </template>
      </div>
    </div>
    <div class="chat-inputs">
      <div class="input-row">
        <el-input v-model="userInput" placeholder="Type your message..." @keyup.enter="sendMessage" class="input-box" />
        <el-button class="send-button" @click="sendMessage">Send</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chatbot {
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  background-color: #fce4ec;
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