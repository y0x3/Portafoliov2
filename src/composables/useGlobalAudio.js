// src/composables/useGlobalAudio.js
import { ref, watch } from 'vue';

// ============================================
// AUDIO GLOBAL (se crea UNA SOLA VEZ)
// ============================================
const audioElement = new Audio();
const isPlaying = ref(false);
const currentSong = ref(null);
const currentTime = ref(0);
const volume = ref(70);
const previousVolume = ref(70);
const playlist = ref([]);
const isShuffleMode = ref(false);

// 🔥 NUEVO: Pool de audio elements para efectos de sonido
const soundEffectsPool = [];
const MAX_SOUND_EFFECTS = 5;

// ============================================
// FUNCIONES DE REPRODUCCIÓN
// ============================================

const setPlaylist = (newPlaylist) => {
  playlist.value = newPlaylist;
};

const playSong = (song) => {
  currentSong.value = song;
  audioElement.src = song.audioUrl;
  audioElement.volume = volume.value / 100;
  audioElement.play();
  isPlaying.value = true;
};

const togglePlay = () => {
  if (!currentSong.value) {
    if (playlist.value.length > 0) {
      playSong(playlist.value[0]);
    }
    return;
  }
  
  if (isPlaying.value) {
    audioElement.pause();
    isPlaying.value = false;
  } else {
    audioElement.play();
    isPlaying.value = true;
  }
};

const nextSong = () => {
  if (!playlist.value.length) return;
  
  if (!currentSong.value) {
    playSong(playlist.value[0]);
    return;
  }
  
  const currentIndex = playlist.value.findIndex(s => s.id === currentSong.value.id);
  const nextIndex = (currentIndex + 1) % playlist.value.length;
  playSong(playlist.value[nextIndex]);
};

const previousSong = () => {
  if (!playlist.value.length) return;
  
  if (!currentSong.value) {
    playSong(playlist.value[playlist.value.length - 1]);
    return;
  }
  
  const currentIndex = playlist.value.findIndex(s => s.id === currentSong.value.id);
  const prevIndex = currentIndex === 0 ? playlist.value.length - 1 : currentIndex - 1;
  playSong(playlist.value[prevIndex]);
};

const seekTo = (seconds) => {
  if (!currentSong.value) return;
  audioElement.currentTime = seconds;
};

const setVolume = (newVolume) => {
  volume.value = newVolume;
  audioElement.volume = newVolume / 100;
  
  // 🔥 CRÍTICO: Actualizar volumen de TODOS los efectos (incluso los que están sonando)
  soundEffectsPool.forEach(audio => {
    audio.volume = newVolume / 100;
  });
};

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value;
    setVolume(0); // 🔥 Usar setVolume para que actualice todo
  } else {
    setVolume(previousVolume.value || 70); // 🔥 Usar setVolume
  }
};

const stopPlayback = () => {
  audioElement.pause();
  audioElement.currentTime = 0;
  isPlaying.value = false;
  currentSong.value = null;
};

const shufflePlay = () => {
  if (!playlist.value.length) return;
  isShuffleMode.value = true;
  const randomIndex = Math.floor(Math.random() * playlist.value.length);
  playSong(playlist.value[randomIndex]);
};

const toggleShuffle = () => {
  isShuffleMode.value = !isShuffleMode.value;
  return isShuffleMode.value;
};

const disableShuffle = () => {
  isShuffleMode.value = false;
};

// 🔥 Reproducir efecto de sonido respetando volumen global
const playSoundEffect = (soundPath) => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.5; // Ajusta el volumen (0.0 a 1.0)
    audio.play().catch(err => {
      console.warn('⚠️ No se pudo reproducir el sonido:', err);
    });
  } catch (error) {
    console.error('❌ Error al reproducir sonido:', error);
  }
};

// 🔥 Detener todos los efectos de sonido
const stopAllSoundEffects = () => {
  soundEffectsPool.forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
};

// ============================================
// EVENT LISTENERS
// ============================================
audioElement.addEventListener('timeupdate', () => {
  currentTime.value = audioElement.currentTime;
});

audioElement.addEventListener('ended', () => {
  if (isShuffleMode.value) {
    shufflePlay();
  } else {
    nextSong();
  }
});

audioElement.addEventListener('loadedmetadata', () => {
  audioElement.volume = volume.value / 100;
});

const addSongToPlaylist = (song) => {
  const exists = playlist.value.some(s => s.audioUrl === song.audioUrl);
  
  if (!exists) {
    playlist.value.push(song);
    console.log('🎵 Canción agregada a la playlist:', song.title);
  }
};

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

export function useGlobalAudio() {
  return {
    // Estado
    isPlaying,
    currentSong,
    currentTime,
    volume,
    playlist,
    isShuffleMode,
    
    // Funciones
    setPlaylist,
    playSong,
    togglePlay,
    nextSong,
    previousSong,
    seekTo,
    setVolume,
    toggleMute,
    stopPlayback,
    shufflePlay,
    toggleShuffle,
    disableShuffle,
    addSongToPlaylist,
    playSoundEffect,
    stopAllSoundEffects
  };
}