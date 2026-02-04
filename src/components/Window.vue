<!-- src/components/Window.vue -->
<template>
  <component 
    :is="windowComponent"
    v-bind="windowProps"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
    @open-image="$emit('open-image', $event)"
    @open-video="$emit('open-video', $event)"
    @open-music="$emit('open-music', $event)"
    @open-pdf="$emit('open-pdf', $event)"
    @open-document="$emit('open-document', $event)"
  />
</template>

<script setup>
import { computed } from 'vue';

// ============================================
// IMPORTS ESTÁTICOS
// ============================================
import MyComputerWindow from './windows/MyComputerWindow.vue';
import DocumentsWindow from './windows/DocumentsWindow.vue';
import RecycleBinWindow from './windows/RecycleBinWindow.vue';
import InternetExplorerWindow from './windows/InternetExplorerWindow.vue';
import OutlookWindow from './windows/OutlookWindow.vue';
import SpotifyWindow from './windows/SpotifyWindow.vue';
import GitHubWindow from './windows/GitHubWindow.vue';
import MinesweeperWindow from './windows/MinesweeperWindow.vue';
import ImageViewerWindow from './windows/ImageViewerWindow.vue'; 
import VideoPlayerWindow from './windows/VideoPlayerWindow.vue';
import HallOfFameWindow from './windows/HallOfFameWindow.vue';
import FunFactWindow from './windows/FunFactWindow.vue';
import CommandPromptWindow from './windows/CommandPromptWindow.vue';
import visualCodeWindow from './windows/VSCodeWindow.vue';
import MyCatsWindow from './windows/MyCatsWindow.vue';


// ============================================
// PROPS & EMITS
// ============================================
const props = defineProps({
  window: { type: Object, required: true },
  isActive: { type: Boolean, default: false }
});

const emit = defineEmits([
  'close', 
  'minimize', 
  'maximize', 
  'focus',
  'open-image',
  'open-video',
  'open-music',
  'open-pdf',
  'open-document'
]);

// ============================================
// MAPA DE COMPONENTES
// ============================================
const componentMap = {
  MyComputerWindow,
  DocumentsWindow,
  RecycleBinWindow,
  InternetExplorerWindow,
  OutlookWindow,
  SpotifyWindow,
  GitHubWindow,
  MinesweeperWindow,
  ImageViewerWindow, 
  VideoPlayerWindow,
  HallOfFameWindow,
  FunFactWindow,
  CommandPromptWindow,
  visualCodeWindow,
  MyCatsWindow
};

// ============================================
// COMPUTED
// ============================================
const windowComponent = computed(() => {
  const component = componentMap[props.window.component];
  
  if (!component) {
    console.error(`Component not found: ${props.window.component}`);
  }
  
  return component;
});

const windowProps = computed(() => {
  const baseProps = {
    ...props.window,
    isActive: props.isActive
  };
  
  // ✅ DEBUG: Ver qué datos hay
  console.log('🪟 Window props.window:', props.window);
  console.log('🪟 Window props.window.data:', props.window.data);
  
  // Si hay datos adicionales, pasarlos
  if (props.window.data) {
    Object.assign(baseProps, props.window.data);
    console.log('🪟 Window baseProps después de assign:', baseProps);
  }
  
  return baseProps;
});
</script>