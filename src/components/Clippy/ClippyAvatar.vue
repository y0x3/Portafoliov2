<!-- src/components/Clippy/ClippyAvatar.vue -->
<template>
  <div 
    class="clippy-avatar"
    :class="{ 'chat-open': isChatOpen, 'bouncing': shouldBounce }"
    @click="$emit('click')"
    @mouseenter="onHover"
    @mouseleave="onLeave"
  >
    <img 
      :src="currentAnimationSrc" 
      alt="Clippy"
      class="clippy-image"
    />
    
    <!-- Indicador de que hay chat abierto -->
    <div v-if="isChatOpen" class="chat-indicator"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { clippyAnimations } from '@/composables/useClippyAnimations';

const props = defineProps({
  animation: {
    type: String,
    default: 'idle'
  },
  isChatOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const isHovered = ref(false);
const shouldBounce = ref(true);

const currentAnimationSrc = computed(() => {
  // Si está en hover, mostrar animación de saludo
  if (isHovered.value && !props.isChatOpen) {
    return clippyAnimations.waving;
  }
  
  // Mostrar la animación activa
  return clippyAnimations[props.animation] || clippyAnimations.idle;
});

const onHover = () => {
  isHovered.value = true;
  shouldBounce.value = false;
};

const onLeave = () => {
  isHovered.value = false;
  shouldBounce.value = true;
};
</script>

<style scoped>
.clippy-avatar {
  width: 100px;
  height: 100px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
  animation: float 3s ease-in-out infinite;
}

.clippy-avatar:hover {
  transform: scale(1.1);
}

.clippy-avatar.bouncing {
  animation: float 3s ease-in-out infinite, bounce 2s ease-in-out infinite;
}

.clippy-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.chat-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
  background: #1db954;
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 2s ease-in-out infinite;
}

/* Animaciones */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-7px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
}
</style>