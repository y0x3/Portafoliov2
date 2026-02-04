<!-- src/components/Clippy/ClippyAssistant.vue -->
<template>
  <div class="clippy-wrapper">
    <!-- Avatar de Clippy (siempre visible) -->
    <ClippyAvatar 
      :animation="currentAnimation"
      :is-chat-open="isChatOpen"
      @click="toggleChat"
    />
    
    <!-- Bocadillo de diálogo -->
    <Transition name="bubble-pop">
      <div v-if="isChatOpen" class="clippy-bubble-container">
        <ClippyBubble
          :current-message="currentMessage"
          :conversation-history="conversationHistory"
          :current-buttons="currentButtons"
          :allow-text-input="allowTextInput"
          @button-click="handleButtonClick"
          @send-message="sendMessage"
          @close="closeChat"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import ClippyAvatar from './ClippyAvatar.vue';
import ClippyBubble from './ClippyBubble.vue';
import { useClippy } from '@/composables/useClippy';

const {
  isChatOpen,
  currentMessage,
  currentAnimation,
  currentButtons,
  conversationHistory,
  allowTextInput,
  toggleChat,
  closeChat,
  handleButtonClick,
  sendMessage,
  showGreeting
} = useClippy();

// Mostrar saludo inicial después de 2 segundos
onMounted(() => {
  setTimeout(() => {
    showGreeting();
  }, 2000);
});
</script>

<style scoped>
.clippy-wrapper {
  position: fixed;
  bottom: 10vh;
  
  right: 30px;
  z-index: 10000;
  pointer-events: none;
}

.clippy-wrapper > * {
  pointer-events: all;
}

.clippy-bubble-container {
  position: absolute;
  bottom: 120px;
  right: 0;
}

/* Transiciones */
.bubble-pop-enter-active,
.bubble-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bubble-pop-enter-from {
  transform: scale(0) translateY(20px);
  opacity: 0;
}

.bubble-pop-leave-to {
  transform: scale(0.8) translateY(10px);
  opacity: 0;
}
</style>