<!-- src/views/Home.vue -->
<template>
  <div class="windowsxp">
    <!-- Desktop con iconos -->
    <Desktop @open-app="handleOpenApp" />
    
    <!-- Ventanas abiertas -->
    <Window 
      v-for="window in visibleWindows"
      :key="window.id"
      :window="window"
      :is-active="isWindowActive(window.id)"
      @close="closeWindow(window.id)"
      @minimize="minimizeWindow(window.id)"
      @maximize="toggleMaximize(window.id)"
      @focus="focusWindow(window.id)"
      @open-image="handleOpenImage"
      @open-video="handleOpenVideo"
      @open-music="handleOpenMusic"
      @open-pdf="handleOpenPdf"
      @open-document="handleOpenDocument"
    />

    <!-- Menú de Inicio -->
    <StartMenu 
      :is-open="isStartMenuOpen"
      :user-name="'Diego Contreras Muñoz'"
      :user-avatar="'/ui/yo.png'"
      @close="closeStartMenu"
      @open-app="handleOpenApp"
    />
    
    <!-- Taskbar -->
    <Taskbar 
      :windows="windows"
      :active-window-id="activeWindowId"
      @window-click="handleTaskbarClick"
      @start-click="toggleStartMenu"
    />

    <!-- Mini Player -->
    <MiniPlayer 
      :is-spotify-open="isSpotifyOpen"
      @open-spotify="openSpotifyFromMiniPlayer"
    />
    <ClippyAssistant />
  </div>
</template>

<script setup>
import { ref, computed, provide } from 'vue';
import Desktop from '@/components/Desktop.vue';
import Taskbar from '@/components/Taskbar.vue';
import Window from '@/components/Window.vue';
import StartMenu from '@/components/StartMenu.vue';
import MiniPlayer from '@/components/MiniPlayer.vue'; 
import { useWindowManager } from '@/composables/useWindowManager';
import ClippyAssistant from '@/components/Clippy/ClippyAssistant.vue';
import { useGlobalAudio } from '@/composables/useGlobalAudio';

const windowManager = useWindowManager();

const {
  windows,
  activeWindowId,
  visibleWindows,
  openWindow,
  closeWindow,
  minimizeWindow,
  restoreWindow,
  toggleMaximize,
  focusWindow,
  isWindowActive
} = windowManager;

const { playSong } = useGlobalAudio();

provide('windowManager', windowManager);

const isStartMenuOpen = ref(false);

const isSpotifyOpen = computed(() => {
  return windows.value.some(w => w.appId === 'spotify' && !w.isMinimized);
});

// ✅ Función principal para abrir apps
const handleOpenApp = (appId) => {
  console.log('🏠 Home: Abriendo app:', appId);
  openWindow(appId);
  closeStartMenu();
};

// ✅ Handlers para archivos
const handleOpenImage = (imageData) => {
  console.log('📸 Home: Recibiendo datos de imagen:', imageData);
  
  // Pasar los datos correctamente anidados
  openWindow('imageviewer', {
    imageData: imageData  // ← Anidar dentro de un objeto
  });
};

const handleOpenVideo = (videoData) => {
  console.log('🎥 Abriendo video:', videoData);
  openWindow('videoplayer', videoData);
};

const handleOpenMusic = (musicData) => {
  console.log('🎵 Abriendo música:', musicData);
  
  // Buscar si Spotify ya está abierto
  const spotifyWindow = windows.value.find(w => w.appId === 'spotify');
  
  if (spotifyWindow) {
    // Si existe pero está minimizada, restaurarla
    if (spotifyWindow.isMinimized) {
      restoreWindow(spotifyWindow.id);
    }
    // Traerla al frente
    focusWindow(spotifyWindow.id);
  } else {
    // Si no existe, abrirla
    openWindow('spotify');
  }
  
  // Crear objeto de canción compatible con Spotify
  const song = {
    id: `file-${Date.now()}`,  // ID único
    title: musicData.name.replace(/\.(mp3|wav|flac|ogg|m4a|aac)$/i, ''),  // Quitar extensión
    artist: 'Unknown Artist',
    album: 'My Music',
    duration: 0,  // Se actualizará cuando se cargue
    cover: 'https://via.placeholder.com/200?text=Music',
    audioUrl: musicData.path
  };
  
  // Reproducir la canción
  playSong(song);
};

const handleOpenPdf = (pdfData) => {
  console.log('📄 Abriendo PDF:', pdfData);
  window.open(pdfData.path, '_blank');
};

const handleOpenDocument = (docData) => {
  console.log('📝 Abriendo documento:', docData);
  alert('Editor de documentos: ' + docData.name);
};

const handleTaskbarClick = (windowId) => {
  const window = windows.value.find(w => w.id === windowId);
  
  if (window.isMinimized) {
    restoreWindow(windowId);
  } else if (isWindowActive(windowId)) {
    minimizeWindow(windowId);
  } else {
    focusWindow(windowId);
  }
};

const toggleStartMenu = () => {
  isStartMenuOpen.value = !isStartMenuOpen.value;
};

const closeStartMenu = () => {
  isStartMenuOpen.value = false;
};

const openSpotifyFromMiniPlayer = () => {
  const spotifyWindow = windows.value.find(w => w.appId === 'spotify');
  
  if (spotifyWindow) {
    if (spotifyWindow.isMinimized) {
      restoreWindow(spotifyWindow.id);
    }
    focusWindow(spotifyWindow.id);
  } else {
    openWindow('spotify');
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
}

.windowsxp {
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 92vh 8vh;
  overflow: hidden;
  position: relative;
}
</style>