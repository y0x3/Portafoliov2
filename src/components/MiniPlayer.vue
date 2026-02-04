<!-- src/components/MiniPlayer.vue -->
<template>
  <Transition name="slide-up">
      <div 
      v-if="showPlayer" 
      class="mini-player"
      :class="{ 'mini-player-hover': isHovered }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <!-- Album Cover -->
      <img 
        :src="currentSong?.cover || 'https://via.placeholder.com/60'" 
        alt="Album cover" 
        class="mini-player-cover"
        @click="openSpotify"
      />
      
      <!-- Song Info -->
      <div class="mini-player-info" @click="openSpotify">
        <div class="mini-player-title">{{ currentSong?.title || 'No song' }}</div>
        <div class="mini-player-artist">{{ currentSong?.artist || '' }}</div>
      </div>
      
      <!-- Controls -->
      <div class="mini-player-controls">
        <button class="mini-control-btn" @click="previousSong" title="Previous">
          <img src="/ui/iconos/icono-next.png">
        </button>
        <button class="mini-control-btn mini-control-main" @click="togglePlay" title="Play/Pause">
          <span v-if="!isPlaying"><img src="/ui/iconos/icono-play.png"></span>
          <span v-else><img src="/ui/iconos/icono-pause.png"></span>
        </button>
        <button class="mini-control-btn" @click="nextSong" title="Next">
          <img src="/ui/iconos/icono-previous.png">
        </button>
        <button class="mini-control-btn mini-control-close" @click="stopAndClose" title="Close">
          ✕
        </button>
      </div>
      
      <!-- Progress Bar -->
      <div class="mini-progress-bar">
        <div 
          class="mini-progress-fill" 
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useGlobalAudio } from '@/composables/useGlobalAudio';

const props = defineProps({
  isSpotifyOpen: {
    type: Boolean,
    default: false
  }
});

const isHovered = ref(false);

const emit = defineEmits(['open-spotify']);

// ============================================
// AUDIO GLOBAL
// ============================================
const {
  isPlaying,
  currentSong,
  currentTime,
  togglePlay,
  nextSong,
  previousSong,
  stopPlayback
} = useGlobalAudio();

// ============================================
// COMPUTED
// ============================================
const showPlayer = computed(() => {
  // Mostrar mini player si hay música Y Spotify está cerrado
  return currentSong.value !== null && !props.isSpotifyOpen;
});

const progressPercentage = computed(() => {
  if (!currentSong.value) return 0;
  return (currentTime.value / currentSong.value.duration) * 100;
});

// ============================================
// FUNCIONES
// ============================================
const openSpotify = () => {
  emit('open-spotify');
};

const stopAndClose = () => {
  stopPlayback();
};
</script>

<style scoped>
/* ============================================
   MINI PLAYER
   ============================================ */
.mini-player {
  position: fixed;
  top: 5vh; /* Justo encima de la taskbar */
  right: 10px;
  width: 300px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 2px solid #3a3a3a;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 10002;
  display: flex;
  flex-direction: column;
}

/* Cover */
.mini-player-cover {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.mini-player-cover:hover {
  opacity: 0.8;
}

/* Info */
.mini-player-info {
  flex: 1;
  padding: 8px 12px;
  cursor: pointer;
  overflow: hidden;
}

.mini-player-info:hover .mini-player-title {
  color: #1db954;
}

.mini-player-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  transition: color 0.2s;
}

.mini-player-artist {
  font-size: 11px;
  color: #b3b3b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Container superior: cover + info + controls */
.mini-player {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  grid-template-rows: 60px auto;
  grid-template-areas: 
    "cover info controls"
    "progress progress progress";
}

.mini-player-cover {
  grid-area: cover;
}

.mini-player-info {
  grid-area: info;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.mini-player-controls {
  grid-area: controls;
  display: flex;
  gap: 4px;
  padding: 8px;
  align-items: center;
}

.mini-progress-bar {
  grid-area: progress;
}

/* Controls */
.mini-control-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.mini-control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.mini-control-main {
  background: #1db954;
  width: 36px;
  height: 36px;
}

.mini-control-main:hover {
  background: #1ed760;
}

.mini-control-close {
  background: rgba(255, 0, 0, 0.2);
  font-size: 14px;
  font-weight: bold;
}

.mini-control-close:hover {
  background: rgba(255, 0, 0, 0.4);
}

/* Progress Bar */
.mini-progress-bar {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
}

.mini-progress-fill {
  height: 100%;
  background: #1db954;
  transition: width 0.1s linear;
}

/* ============================================
   TRANSITIONS
   ============================================ */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}

.mini-player-hover {
  z-index: 10001 !important;
}

/* ============================================
   RESPONSIVE (si la taskbar es alta)
   ============================================ */
@media (max-height: 600px) {
  .mini-player {
    bottom: 50px;
  }
}
</style>