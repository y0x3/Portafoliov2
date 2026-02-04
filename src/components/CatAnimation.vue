<!-- src/components/CatAnimation.vue -->
<template>
  <div class="cat-container">
    <div class="cat-sprite">
      {{ currentFrame }}
    </div>
    <div class="cat-info">
      <p class="cat-name">{{ catName }}</p>
      <p class="cat-state">{{ currentState }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { catAnimationSystem } from '../data/catAnimations';

const props = defineProps({
  catName: {
    type: String,
    default: 'Michi'
  }
});

const currentState = ref('sitting');
const frameIndex = ref(0);

let frameInterval = null;
let stateInterval = null;

// Frame actual de la animación
const currentFrame = computed(() => {
  const animation = catAnimationSystem.animations[currentState.value];
  return animation.frames[frameIndex.value];
});

// Ciclo de frames
const startFrameAnimation = () => {
  if (frameInterval) clearInterval(frameInterval);
  
  const animation = catAnimationSystem.animations[currentState.value];
  
  frameInterval = setInterval(() => {
    frameIndex.value = (frameIndex.value + 1) % animation.frames.length;
  }, animation.duration);
};

// Cambio automático de estado
const startStateTransition = () => {
  if (stateInterval) clearInterval(stateInterval);
  
  stateInterval = setInterval(() => {
    const nextState = catAnimationSystem.getNextState(currentState.value);
    currentState.value = nextState;
    frameIndex.value = 0;
    startFrameAnimation();
  }, 5000);
};

onMounted(() => {
  startFrameAnimation();
  startStateTransition();
});

onUnmounted(() => {
  if (frameInterval) clearInterval(frameInterval);
  if (stateInterval) clearInterval(stateInterval);
});
</script>

<style scoped>
.cat-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  margin: 10px;
  min-width: 120px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.cat-sprite {
  font-size: 48px;
  margin-bottom: 10px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.cat-info {
  color: white;
  text-align: center;
  font-family: 'MS Sans Serif', sans-serif;
}

.cat-name {
  font-size: 14px;
  font-weight: bold;
  margin: 0 0 5px 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.cat-state {
  font-size: 10px;
  opacity: 0.7;
  text-transform: capitalize;
  margin: 0;
}
</style>