<!-- src/components/windows/VideoPlayerWindow.vue -->
<template>
  <WindowBase
    :title="videoData.name || 'Reproductor de Video'"
    icon="/ui/iconos/video-icon.png"
    :show-toolbar="false"
    :show-sidebar="false"
    v-bind="$attrs"
    @close="handleClose"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <div class="video-player">
      <div class="video-container">
        <video 
          ref="videoElement"
          :src="videoData.path"
          controls
          class="video-element"
          @loadedmetadata="onVideoLoaded"
        >
          Tu navegador no soporta el elemento de video.
        </video>
      </div>
      
      <div class="video-info">
        <span class="video-name">{{ videoData.name }}</span>
        <span class="video-duration" v-if="duration">{{ formatDuration(duration) }}</span>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import WindowBase from '../WindowBase.vue';

const props = defineProps({
  videoData: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Video',
      path: ''
    })
  }
});

const emit = defineEmits(['close', 'minimize', 'maximize', 'focus']);

// ============================================
// ESTADO REACTIVO
// ============================================
const videoElement = ref(null);
const duration = ref(0);

// ============================================
// FUNCIONES
// ============================================
const onVideoLoaded = () => {
  if (videoElement.value) {
    duration.value = videoElement.value.duration;
  }
};

const handleClose = () => {
  // Pausar el video antes de cerrar
  if (videoElement.value) {
    videoElement.value.pause();
  }
  emit('close');
};

const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// ============================================
// LIFECYCLE
// ============================================
onBeforeUnmount(() => {
  if (videoElement.value) {
    videoElement.value.pause();
  }
});
</script>

<style scoped>
.video-player {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #000;
}

.video-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.video-element {
  width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
}

.video-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #1a1a1a;
  color: #fff;
  border-top: 1px solid #444;
}

.video-name {
  font-size: 12px;
  font-weight: bold;
}

.video-duration {
  font-size: 11px;
  color: #aaa;
}
</style>