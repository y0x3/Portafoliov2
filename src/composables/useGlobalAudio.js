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
const previousVolume = ref(70); // Guardar volumen anterior para unmute
const playlist = ref([]);
const isShuffleMode = ref(false); // Para recordar si estamos en modo aleatorio

// ============================================
// FUNCIONES DE REPRODUCCIÓN (fuera del composable)
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
  // Si no hay canción, reproducir la primera de la playlist
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
  // Si no hay playlist, no hacer nada
  if (!playlist.value.length) return;
  
  // Si no hay canción actual, reproducir la primera
  if (!currentSong.value) {
    playSong(playlist.value[0]);
    return;
  }
  
  const currentIndex = playlist.value.findIndex(s => s.id === currentSong.value.id);
  const nextIndex = (currentIndex + 1) % playlist.value.length;
  playSong(playlist.value[nextIndex]);
};

const previousSong = () => {
  // Si no hay playlist, no hacer nada
  if (!playlist.value.length) return;
  
  // Si no hay canción actual, reproducir la última de la playlist
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
};

const toggleMute = () => {
  if (volume.value > 0) {
    // Guardar volumen actual antes de mutear
    previousVolume.value = volume.value;
    volume.value = 0;
    audioElement.volume = 0;
  } else {
    // Restaurar volumen anterior
    volume.value = previousVolume.value || 70;
    audioElement.volume = volume.value / 100;
  }
};

const stopPlayback = () => {
  audioElement.pause();
  audioElement.currentTime = 0;
  isPlaying.value = false;
  currentSong.value = null;
};

const shufflePlay = () => {
  // Si no hay playlist, no hacer nada
  if (!playlist.value.length) return;
  
  // Activar modo shuffle
  isShuffleMode.value = true;
  
  // Generar índice aleatorio
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

// ============================================
// EVENT LISTENERS
// ============================================
audioElement.addEventListener('timeupdate', () => {
  currentTime.value = audioElement.currentTime;
});

audioElement.addEventListener('ended', () => {
  // Auto-play siguiente canción (aleatoria si está en shuffle mode)
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
  // Verificar si la canción ya está en la playlist
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
    addSongToPlaylist 
  };
}