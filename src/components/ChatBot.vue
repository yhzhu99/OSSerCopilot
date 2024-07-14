<template>
  <div class="chatbot">
    <div class="chat-messages">
      <div v-for="(message, index) in messages" :key="index" class="message">
        {{ message.text }}
      </div>
    </div>
    <div class="chat-inputs">
      <div class="input-row">
        <el-input v-model="userInput" placeholder="Type your message..." @keyup.enter="sendMessage" class="input-box" />
        <el-button class="send-button" @click="sendMessage">Send</el-button>
      </div>
      <div class="next-row">
        <el-button class="next-button" @click="nextStep">Next</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  emits: ['update-progress'],
  setup(props, { emit }) {
    const messages = ref([]);
    const userInput = ref('');
    const currentStep = ref(0);

    const sendMessage = () => {
      if (userInput.value.trim()) {
        messages.value.push({ text: userInput.value, sender: 'user' });
        // Add bot response logic here
        userInput.value = '';
      }
    };

    const nextStep = () => {
      currentStep.value++;
      emit('update-progress', (currentStep.value / 10) * 100);
    };

    return {
      messages,
      userInput,
      sendMessage,
      nextStep,
    };
  },
};
</script>

<style scoped>
.chatbot {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  background-color: #e8e8e8;
}

.chat-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 2px;
}

.input-row {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.next-row {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-box {
  flex-grow: 1;
  border-radius: 5px;
}

.send-button, .next-button {
  background-color: #0366d6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.send-button:hover, .next-button:hover {
  background-color: #025bb5;
}
</style>