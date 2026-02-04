<!-- src/components/Taskbar.vue -->
<template>
  <div class="taskbar">
    <!-- Botón de inicio -->
    <div class="btnwindows" @click="$emit('start-click')">
      <img src="/ui/windows_taskbar/btn_inicio.png" />
    </div>
    
    <!-- Ventanas abiertas -->
    <div class="barradetareas">
      <div 
        v-for="window in windows"
        :key="window.id"
        class="taskbar-item"
        :class="{ active: window.id === activeWindowId }"
        @click="$emit('window-click', window.id)"
      >
        <img :src="window.icon" :alt="window.title" />
      </div>
    </div>
    
    <!-- Botón de volumen -->
    <div class="btnSonido" @click="toggleVolumePopup">
      <img src="/ui/windows_taskbar/btn_volumen.png" />
    </div>
    
    <!-- Reloj -->
    <div class="reloj">
      <Clock />
    </div>

    <!-- NUEVO: Popup de volumen -->
    <VolumeControl 
      :is-open="isVolumeOpen"
      @close="closeVolume"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Clock from './Clock.vue';
import VolumeControl from './VolumeControl.vue';  // ← NUEVO

defineProps({
  windows: {
    type: Array,
    default: () => []
  },
  activeWindowId: {
    type: Number,
    default: null
  }
});

defineEmits(['window-click', 'start-click']);

// ============================================
// ESTADO DEL VOLUMEN
// ============================================
const isVolumeOpen = ref(false);

const toggleVolumePopup = () => {
  isVolumeOpen.value = !isVolumeOpen.value;
};

const closeVolume = () => {
  isVolumeOpen.value = false;
};
</script>

<style scoped>
.taskbar {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: stretch;
  gap: 0;
  padding: 0;
  overflow: hidden;
  position: relative;  /* ← IMPORTANTE para el popup */
  z-index: 100000;
}

.btnwindows {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.1s;
}

.btnwindows:hover {
  filter: brightness(1.1);
}

.btnwindows:active {
  filter: brightness(0.9);
}

.btnSonido,
.reloj {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.btnSonido {
  cursor: pointer;
  transition: all 0.1s;
  width: 100%;  
  height: 100%; 
  padding: 0;  
}

.btnSonido:hover {
  background: rgba(255, 255, 255, 0.1);  /* ← NUEVO */
}

.btnwindows img,
.btnSonido img,
.reloj img {
  width: auto;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
  pointer-events: none;
  -webkit-user-drag: none;
}

.reloj {
  background: #1961c5;
  border-left: 1px solid #0d4a9f;
  min-width: clamp(60px, 8vw, 100px);
  padding: 0;
  position: relative;
}

.barradetareas {
  background: #0056ef;
  border-top: 8px solid #639bff;
  display: flex;
  overflow-x: auto;
  align-items: center;
  gap: 0.25rem;
}

.taskbar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  aspect-ratio: 1 / 1;
  height: 100%;
  color: white;
  font-size: 11px;
  user-select: none;
  padding: 0.5em;
  flex-shrink: 0;
}

.taskbar-item:hover {
  background: linear-gradient(180deg, #ececec7d 0%, #cccccc93 100%);
}

.taskbar-item.active {
  background: linear-gradient(180deg, #0f3a94 0%, #0d307a 100%);
  border: 1px inset #1941a5;
  box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.taskbar-item img {
  max-width: 80%;
  max-height: 80%;
  width: auto;
  height: auto;
  object-fit: contain;
  image-rendering: pixelated;
  flex-shrink: 0;
}
</style>