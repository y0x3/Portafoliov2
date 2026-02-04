<!-- src/components/Clippy/ClippyBubble.vue -->
<template>
  <div class="clippy-bubble">
    <!-- Header -->
    <div class="bubble-header">
      <div class="header-left">
        <span class="header-icon">💬</span>
        <span class="header-title">Clippy Assistant</span>
      </div>
      <button class="close-btn" @click="$emit('close')" title="Cerrar">
        <img src="/ui/window/btn-close.png" class="iconos"/>
      </button>
    </div>

    <!-- Contenido del chat con scroll -->
    <div class="bubble-content" ref="contentRef">
      <!-- Historial de conversación -->
      <div class="conversation-history" ref="historyRef" v-if="conversationHistory.length > 0">
        <div 
          v-for="(msg, index) in conversationHistory" 
          :key="index"
          class="message"
          :class="msg.type"
        >
          <div class="message-bubble">
            {{ msg.message }}
          </div>
          <div class="message-time">
            {{ formatTime(msg.timestamp) }}
          </div>
        </div>
      </div>

      <!-- Botones de acción con scroll -->
      <div class="action-buttons-wrapper" v-if="currentButtons.length">
        <div class="action-buttons">
          <button 
            v-for="button in currentButtons" 
            :key="button.id"
            class="action-btn"
            @click="handleButtonClick(button)"
          >
            {{ button.label }}
          </button>
        </div>
      </div>

      <!-- Input de texto (opcional) -->
      <div class="text-input-container" v-if="allowTextInput">
        <input 
          v-model="userInput"
          type="text"
          class="text-input"
          placeholder="Escribe aquí o usa los botones..."
          @keyup.enter="handleSendMessage"
        />
        <button 
          class="send-btn"
          @click="handleSendMessage"
          :disabled="!userInput.trim()"
        >
          📤
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
  currentMessage: {
    type: String,
    default: ''
  },
  conversationHistory: {
    type: Array,
    default: () => []
  },
  currentButtons: {
    type: Array,
    default: () => []
  },
  allowTextInput: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['button-click', 'send-message', 'close']);

const userInput = ref('');
const isTyping = ref(false);
const historyRef = ref(null);
const contentRef = ref(null);

const handleButtonClick = (button) => {
  emit('button-click', button);
};

const handleSendMessage = () => {
  if (!userInput.value.trim()) return;
  
  emit('send-message', userInput.value);
  userInput.value = '';
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatMessage = (message) => {
  // Convertir saltos de línea a <br>
  return message.replace(/\n/g, '<br>');
};

// Auto-scroll al final del historial
watch(() => props.conversationHistory.length, () => {
  nextTick(() => {
    if (historyRef.value) {
      historyRef.value.scrollTop = historyRef.value.scrollHeight;
    }
  });
});

// Auto-scroll al final del contenido cuando cambian los botones
watch(() => props.currentButtons.length, () => {
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.scrollTop = contentRef.value.scrollHeight;
    }
  });
});

// Simular efecto de escritura
watch(() => props.currentMessage, () => {
  isTyping.value = true;
  setTimeout(() => {
    isTyping.value = false;
  }, 500);
});
</script>

<style scoped>
.clippy-bubble {
  width: min(380px, 40vw); 
  height: min(600px, 60vh); /* 👈 Altura fija */
  background: white;
  border: 3px solid #0054e3;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ==================== HEADER ==================== */
.bubble-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: linear-gradient(180deg, #0997ff 0%, #0053ee 100%);
  color: white;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 16px;
}

.header-title {
  font-size: 13px;
  font-weight: bold;
}

.close-btn {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* ==================== CONTENIDO PRINCIPAL ==================== */
.bubble-content {
  padding: 12px;
  overflow: hidden; /* 👈 Sin scroll en el contenedor padre */
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1; /* 👈 Toma todo el espacio disponible */
  min-height: 0;
}

/* ==================== CHAT - 60% ==================== */
.conversation-history {
  flex: 6; /* 👈 60% del espacio */
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
  background: #fafafa;
  border-radius: 8px;
  padding: 8px;
}

.conversation-history::-webkit-scrollbar {
  width: 6px;
}

.conversation-history::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.conversation-history::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.conversation-history::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message.user .message-bubble {
  background: #0054e3;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant .message-bubble {
  background: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 10px;
  color: #999;
  padding: 0 8px;
}

/* Mensaje actual destacado */
.current-message {
  background: #fffacd;
  border: 2px solid #ffd700;
  border-radius: 8px;
  padding: 12px;
  margin-top: auto;
}

.current-message p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  word-wrap: break-word;
}

/* Indicador de escritura */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* ==================== BOTONES - 40% ==================== */
.action-buttons-wrapper {
  flex: 4; /* 👈 40% del espacio */
  overflow: hidden; /* 👈 SIN scroll */
  padding: 8px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 👈 SIEMPRE 2 columnas */
  grid-auto-rows: 1fr; /* 👈 Todas las filas tienen el mismo tamaño */
  gap: 0.5vh;
  height: 100%; /* 👈 Ocupa todo el alto disponible */
  overflow: hidden;
}

/* Scrollbar MUY delgada y sutil */
.action-buttons::-webkit-scrollbar {
  width: 4px;
}

.action-buttons::-webkit-scrollbar-track {
  background: transparent;
}

.action-buttons::-webkit-scrollbar-thumb {
  background: rgba(0, 84, 227, 0.3);
  border-radius: 2px;
}

.action-buttons::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 84, 227, 0.5);
}

.action-btn {
  padding: 0.5vh 0.5vw;
  background: white;
  border: 2px solid #0054e3;
  border-radius: 6px;
  color: #0054e3;
  font-size: clamp(10px, 1.2vh, 12px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  white-space: normal;
  word-wrap: break-word;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.2;
  height: 100%; /* 👈 Ocupa todo el alto de su celda en el grid */
  min-height: 0;
  overflow: hidden;
}

.action-btn:hover {
  background: #0054e3;
  color: white;
  transform: scale(1.03);
}

.action-btn:active {
  transform: scale(0.98);
}

/* ==================== RESPONSIVE ==================== */
@media (max-width: 480px) {
  .action-buttons {
    grid-template-columns: 1fr;
  }
}

/* Para contenedores pequeños */
@media (max-height: 500px) {
  .action-btn {
    font-size: clamp(9px, 1vh, 11px);
    padding: 0.3vh 0.3vw;
  }
  
  .action-buttons {
    gap: 0.3vh;
  }
}

/* ==================== INPUT ==================== */
.text-input-container {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
  background: white;
}

.text-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.text-input:focus {
  border-color: #0054e3;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #0054e3;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background: #0066ff;
  transform: scale(1.1);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ==================== RESPONSIVE ==================== */
@media (max-height: 600px) {
  .clippy-bubble {
    height: 95vh;
  }
  
  .bubble-header {
    padding: 8px 10px;
  }
  
  .action-btn {
    font-size: 11px;
    padding: 8px 10px;
  }
}

@media (max-width: 480px) {
  .clippy-bubble {
    width: 95vw;
  }
  
  .message-bubble {
    font-size: 13px;
  }
}
</style>