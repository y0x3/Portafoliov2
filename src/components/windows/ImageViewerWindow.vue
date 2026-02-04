<!-- src/components/windows/ImageViewerWindow.vue -->
<template>
  <WindowBase
    :title="imageData.name || 'Visor de Imágenes'"
    icon="/ui/iconos/image-icon.png"
    :show-toolbar="false"
    :show-sidebar="false"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <div class="image-viewer">
      <div class="image-container">
        <img 
          :src="imageData.path" 
          :alt="imageData.name"
          class="displayed-image"
        />
      </div>
      
      <div class="image-info">
        <span class="image-name">{{ imageData.name }}</span>
        <span class="image-size" v-if="imageData.size">{{ formatFileSize(imageData.size) }}</span>
      </div>
      
      <div class="image-controls">
        <button class="control-btn" @click="zoomOut" title="Zoom Out">
          🔍-
        </button>
        <button class="control-btn" @click="zoomIn" title="Zoom In">
          🔍+
        </button>
        <button class="control-btn" @click="resetZoom" title="Reset Zoom">
          ↺
        </button>
        <button class="control-btn" @click="openInNewTab" title="Abrir en nueva pestaña">
          🔗
        </button>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref } from 'vue';
import WindowBase from '../WindowBase.vue';

const props = defineProps({
  imageData: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Imagen',
      path: '',
      size: 0
    })
  }
});

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// ============================================
// ESTADO REACTIVO
// ============================================
const zoomLevel = ref(100);

// ============================================
// FUNCIONES
// ============================================
const zoomIn = () => {
  if (zoomLevel.value < 300) {
    zoomLevel.value += 10;
    updateZoom();
  }
};

const zoomOut = () => {
  if (zoomLevel.value > 10) {
    zoomLevel.value -= 10;
    updateZoom();
  }
};

const resetZoom = () => {
  zoomLevel.value = 100;
  updateZoom();
};

const updateZoom = () => {
  const img = document.querySelector('.displayed-image');
  if (img) {
    img.style.transform = `scale(${zoomLevel.value / 100})`;
  }
};

const openInNewTab = () => {
  window.open(props.imageData.path, '_blank');
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
</script>

<style scoped>
.image-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #2b2b2b;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  padding: 20px;
}

.displayed-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s;
  image-rendering: auto;
}

.image-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #1a1a1a;
  color: #fff;
  border-top: 1px solid #444;
}

.image-name {
  font-size: 12px;
  font-weight: bold;
}

.image-size {
  font-size: 11px;
  color: #aaa;
}

.image-controls {
  display: flex;
  gap: 5px;
  padding: 10px;
  background: #1a1a1a;
  justify-content: center;
  border-top: 1px solid #444;
}

.control-btn {
  padding: 8px 15px;
  background: #3a3a3a;
  border: 1px solid #555;
  color: #fff;
  cursor: pointer;
  border-radius: 3px;
  font-size: 14px;
  transition: background 0.2s;
}

.control-btn:hover {
  background: #4a4a4a;
}

.control-btn:active {
  background: #2a2a2a;
}
</style>