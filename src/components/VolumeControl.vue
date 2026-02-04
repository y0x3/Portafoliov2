<!-- src/components/VolumeControl.vue -->
<template>
  <Transition name="slide-up">
    <div v-if="isOpen" class="volume-popup">
      <!-- Header -->
      <div class="volume-header">
        <span>Volume</span>
        <button class="close-btn" @click="$emit('close')"> <img src="/ui/window/btn-close.png"/></button>
      </div>

      <!-- Control de volumen vertical -->
      <div class="volume-body">
        <div class="volume-slider-container">
          <!-- Número de volumen -->
          <div class="volume-display">{{ volume }}%</div>

          <!-- Slider vertical -->
          <div class="volume-slider-vertical" @click="handleSliderClick">
            <div class="volume-track">
              <div 
                class="volume-fill" 
                :style="{ height: volume + '%' }"
              ></div>
              <div 
                class="volume-thumb" 
                :style="{ bottom: volume + '%' }"
                @mousedown="startDrag"
              ></div>
            </div>
          </div>

          <!-- Icono de volumen -->
          <div class="volume-icon">
            <span v-if="volume === 0">🔇</span>
            <span v-else-if="volume < 33">🔈</span>
            <span v-else-if="volume < 66">🔉</span>
            <span v-else>🔊</span>
          </div>
        </div>

      </div>
    </div>
  </Transition>

  <!-- Overlay para cerrar al hacer click fuera -->
  <div 
    v-if="isOpen" 
    class="volume-overlay"
    @click="$emit('close')"
  ></div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useGlobalAudio } from '@/composables/useGlobalAudio';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

// ============================================
// AUDIO GLOBAL
// ============================================
const { volume, setVolume, toggleMute } = useGlobalAudio();

// ============================================
// DRAG STATE
// ============================================
let isDragging = false;

// ============================================
// FUNCIONES
// ============================================
const handleSliderClick = (event) => {
  const slider = event.currentTarget;
  const rect = slider.getBoundingClientRect();
  const clickY = event.clientY - rect.top;
  const sliderHeight = rect.height;
  
  // Invertir porque el slider es vertical (0 abajo, 100 arriba)
  const newVolume = Math.round((1 - (clickY / sliderHeight)) * 100);
  const clampedVolume = Math.max(0, Math.min(100, newVolume));
  
  setVolume(clampedVolume);
};

const startDrag = (event) => {
  isDragging = true;
  event.preventDefault();
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (event) => {
  if (!isDragging) return;
  
  const slider = document.querySelector('.volume-slider-vertical');
  if (!slider) return;
  
  const rect = slider.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  const sliderHeight = rect.height;
  
  // Invertir porque el slider es vertical
  const newVolume = Math.round((1 - (mouseY / sliderHeight)) * 100);
  const clampedVolume = Math.max(0, Math.min(100, newVolume));
  
  setVolume(clampedVolume);
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// ============================================
// LIFECYCLE
// ============================================
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});
</script>

<style scoped>
/* ============================================
   OVERLAY
   ============================================ */
.volume-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

/* ============================================
   POPUP PRINCIPAL
   ============================================ */
.volume-popup {
  position: fixed;
  bottom: 8vh; 
  right: calc(clamp(80px, 10vw, 120px) + 1rem); 
  width: clamp(12rem, 15vw, 15rem);
  background: linear-gradient(180deg, #ffffff 0%, #ece9d8 100%);
  border: 3px solid;
  border-top-color: #5487de;
  border-left-color: #0054e3;
  border-right-color: #003c9d;
  border-bottom-color: #003c9d;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  border-radius: 8px 8px 0 0;
  z-index: 1000;
  user-select: none;
}

/* ============================================
   HEADER
   ============================================ */
.volume-header {
  background: linear-gradient(180deg, #0997ff 0%, #0053ee 100%);
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px 5px 0 0;
  color: white;
  font-size: 11px;
  font-weight: bold;
}

.close-btn {
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  color: #000;
  padding: 0;
}

.close-btn:hover {
  background: linear-gradient(180deg, #f0ede0 0%, #e0d8c0 100%);
}

.close-btn:active {
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}

/* ============================================
   BODY
   ============================================ */
.volume-body {
  padding: 20px;
}

.volume-slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

/* Display de volumen */
.volume-display {
  font-size: 24px;
  font-weight: bold;
  color: #0054e3;
  min-width: 70px;
  text-align: center;
}

/* Slider vertical */
.volume-slider-vertical {
  width: 40px;
  height: 150px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  position: relative;
}

.volume-track {
  width: 8px;
  height: 100%;
  background: #d4d0c8;
  border: 2px inset #808080;
  position: relative;
  border-radius: 4px;
}

.volume-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, #0997ff 0%, #0053ee 100%);
  border-radius: 2px;
  transition: height 0.1s ease;
}

.volume-thumb {
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  width: 20px;
  height: 20px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 2px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  border-radius: 50%;
  cursor: grab;
  transition: bottom 0.1s ease;
}

.volume-thumb:active {
  cursor: grabbing;
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}

/* Icono de volumen */
.volume-icon {
  font-size: 32px;
  text-align: center;
}

/* ============================================
   CONTROLES
   ============================================ */
.volume-controls {
  display: flex;
  justify-content: center;
}

.mute-btn {
  padding: 8px 20px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 2px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  border-radius: 3px;
  transition: all 0.1s;
}

.mute-btn:hover {
  background: linear-gradient(180deg, #f0ede0 0%, #e0d8c0 100%);
}

.mute-btn:active {
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  background: linear-gradient(180deg, #d0c8b0 0%, #e0d8c0 100%);
}

/* ============================================
   TRANSICIÓN
   ============================================ */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>