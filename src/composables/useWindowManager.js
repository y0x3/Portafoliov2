import { ref, computed } from 'vue';
import MyCatsWindow from '../components/windows/MyCatsWindow.vue';

export function useWindowManager() {
  // =============================
  // Estado
  // =============================
  const windows = ref([]);
  const activeWindowId = ref(null);

  let windowIdCounter = 0;
  let topZIndex = 100; // 

  // =============================
  // Configuración de apps
  // =============================
  const appConfigs = {
    mycomputer: {
      title: 'Mi PC',
      icon: '/ui/iconos/icono_mipc_notexto.png',
      component: 'MyComputerWindow',
      width: 700,
      height: 500
    },
    documents: {
      title: 'Mis Documentos',
      icon: '/ui/iconos/folder.png',
      component: 'DocumentsWindow',
      width: 600,
      height: 450
    },
    recyclebin: {
      title: 'Papelera de reciclaje',
      icon: '/ui/iconos/papelera.png',
      component: 'RecycleBinWindow',
      width: 550,
      height: 400
    },
    internetexplorer: {
      title: 'Internet Explorer',
      icon: '/ui/iconos/icono-internetE.png',
      component: 'InternetExplorerWindow',
      width: 900,
      height: 600
    },
    outlook: {
      title: 'Outlook Express',
      icon: '/ui/iconos/icono-gmail.png',
      component: 'OutlookWindow',
      width: 700,
      height: 500
    },
    spotify: {
      title: 'Spotify',
      icon: '/ui/iconos/spotify.png',
      component: 'SpotifyWindow',
      width: 900,
      height: 600
    },
    github: {
      title: 'GitHub Projects',
      icon: '/ui/iconos/github.png',
      component: 'GitHubWindow',
      width: 900,
      height: 650
    },
      minesweeper: {
      title: 'Minesweeper',
      icon: '/ui/iconos/Minesweeper.png',  // Cambia cuando tengas el icono
      component: 'MinesweeperWindow',
      width: 600,
      height: 700
    },
    imageviewer: {
      title: 'Visor de Imágenes',
      icon: '/ui/iconos/image-icon.png',
      component: 'ImageViewerWindow',
      width: 800,
      height: 600
    },
    videoplayer: {
      title: 'Reproductor de Video',
      icon: '/ui/iconos/video-icon.png',
      component: 'VideoPlayerWindow',
      width: 900,
      height: 650
    },
    halloffame: {
      title: 'Salón de la Fama',
      icon: '/ui/iconos/trofeo.png',  // Cambia al icono correcto
      component: 'HallOfFameWindow',  // ← NOMBRE DEL ARCHIVO
      width: 900,
      height: 650
    },
    funfact: {
      title: '¿Sabías que...?',
      icon: '/ui/iconos/dado.png',  // 👈 Cambia a un icono de bombilla/idea
      component: 'FunFactWindow',  // 👈 Nombre correcto del componente
      width: 500,
      height: 400
    },
    cmd: {
      title: 'Command Prompt',
      icon: '/ui/iconos/cmd.png',
      component: 'CommandPromptWindow',
      width: 700,
      height: 500
    },
    visualCode: {
      title: 'Command Prompt',
      icon: '/ui/iconos/visualcodeicono.png',
      component: 'visualCodeWindow',
      width: 700,
      height: 500
    },
    mycats: {
      title: 'Mis gatos',
      icon: '/ui/iconos/gatoicono.png',
      component: 'MyCatsWindow',
      width: 700,
      height: 500
    }
  };

  // =============================
  // Abrir ventana
  // =============================
  // src/composables/useWindowManager.js

const openWindow = (appId, data = null) => {
  console.log('🔧 WindowManager: Abriendo ventana:', appId, data);
  
  const config = appConfigs[appId];
  if (!config) {
    console.error(`Aplicación ${appId} no encontrada`);
    return;
  }

  const existingWindow = windows.value.find(w => w.appId === appId);
  if (existingWindow && !data) {  // ← Solo reusar si no hay datos específicos
    if (existingWindow.isMinimized) {
      restoreWindow(existingWindow.id);
    }
    focusWindow(existingWindow.id);
    return;
  }

  topZIndex++;

  const newWindow = {
    id: ++windowIdCounter,
    appId,
    title: config.title,
    icon: config.icon,
    component: config.component,
    x: 100 + windows.value.length * 30,
    y: 50 + windows.value.length * 30,
    width: config.width,
    height: config.height,
    isMinimized: false,
    isMaximized: false,
    zIndex: topZIndex,
    data: data  // ← Agregar datos adicionales
  };

  windows.value.push(newWindow);
  activeWindowId.value = newWindow.id;
};

  // =============================
  // Cerrar ventana
  // =============================
  const closeWindow = (windowId) => {
    const index = windows.value.findIndex(w => w.id === windowId);
    if (index === -1) return;

    windows.value.splice(index, 1);

    if (activeWindowId.value === windowId) {
      const lastWindow = windows.value[windows.value.length - 1];
      activeWindowId.value = lastWindow?.id || null;
    }
  };

  // =============================
  // Minimizar
  // =============================
  const minimizeWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return;

    window.isMinimized = true;

    const nextWindow = [...windows.value]
      .reverse()
      .find(w => !w.isMinimized && w.id !== windowId);

    activeWindowId.value = nextWindow?.id || null;
  };

  // =============================
  // Restaurar
  // =============================
  const restoreWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return;

    window.isMinimized = false;
    focusWindow(windowId);
  };

  // =============================
  // Maximizar / Restaurar
  // =============================
  const toggleMaximize = (windowId) => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window) return;

    window.isMaximized = !window.isMaximized;
    focusWindow(windowId);
  };

  // =============================
  // Foco (z-index REAL)
  // =============================
  const focusWindow = (windowId) => {
    const window = windows.value.find(w => w.id === windowId);
    if (!window || window.isMinimized) return;

    topZIndex++;
    window.zIndex = topZIndex;
    activeWindowId.value = windowId;
  };

  // =============================
  // Computeds
  // =============================
  const visibleWindows = computed(() =>
    windows.value.filter(w => !w.isMinimized)
  );

  const isWindowActive = (windowId) =>
    activeWindowId.value === windowId;

  // =============================
  // API pública
  // =============================
  return {
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
  };
}
