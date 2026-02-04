<!-- src/components/BrowserWindow.vue -->
<template>
  <WindowBase
    :title="pageTitle"
    icon="/ui/iconos/navegador.png"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :is-maximized="isMaximized"
    :is-active="isActive"
    :is-minimized="isMinimized"
    :z-index="zIndex"
    :show-toolbar="false"
    :show-sidebar="false"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <div class="browser-container">
      <!-- Barra de navegación -->
      <div class="browser-navbar">
        <div class="nav-controls">
          <button @click="goBack" :disabled="!canGoBack" class="nav-btn" title="Back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1L1 8l7 7V9.5C15 9.5 15 15 15 15c0-7-7-7-7-7V1z"/>
            </svg>
          </button>
          <button @click="goForward" :disabled="!canGoForward" class="nav-btn" title="Forward">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1l7 7-7 7V9.5C1 9.5 1 15 1 15c0-7 7-7 7-7V1z"/>
            </svg>
          </button>
          <button @click="refresh" class="nav-btn" title="Refresh">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M13.451 5.609l-.579-.939-1.068.812-.076.094c-.335.415-.927 1.341-1.124 2.876l-.021.165.033.163.071.345c0 .193-.032.377-.096.55l-.008.025-.005.024a.993.993 0 01-.168.298l-.021.028-.028.021a1 1 0 01-.565.267l-.024.004-.024-.001a1.02 1.02 0 01-.639-.218l-.02-.022-.015-.024a.993.993 0 01-.171-.296l-.005-.024-.008-.025a2.003 2.003 0 01-.096-.55l.033-.163-.02-.165c-.197-1.535-.789-2.461-1.124-2.876l-.076-.094-1.068-.812-.579.939c.26.157.547.38.801.64l.015.018.01.01c.133.14.293.338.401.65l.01.032c.002.006.003.012.005.018a.748.748 0 01.047.274l-.001.014v.008l-.001.019v.007l.001.007v.009l.001.016a.73.73 0 01-.047.283c-.002.007-.003.013-.005.019l-.01.032c-.108.312-.268.51-.401.65l-.01.01-.015.018c-.254.26-.541.483-.801.64l.579.939 1.068-.812.076-.094c.335-.415.927-1.341 1.124-2.876l.021-.165-.033-.163-.071-.345a2 2 0 01.096-.55l.008-.025.005-.024a.993.993 0 01.168-.298l.021-.028.028-.021a1 1 0 01.565-.267l.024-.004.024.001a1.02 1.02 0 01.639.218l.02.022.015.024c.112.176.164.305.171.296l.005.024.008.025c.064.173.096.357.096.55l-.033.163.02.165c.197 1.535.789 2.461 1.124 2.876l.076.094 1.068.812.579-.939c-.26-.157-.547-.38-.801-.64l-.015-.018-.01-.01a2.06 2.06 0 01-.401-.65l-.01-.032a.739.739 0 01-.047-.283l.001-.016v-.007-.009l.001-.007v-.019l.001-.008a.748.748 0 01.047-.274c.002-.006.003-.012.005-.018l.01-.032c.108-.312.268-.51.401-.65l.01-.01.015-.018c.254-.26.541-.483.801-.64z"/>
            </svg>
          </button>
        </div>
        
        <div class="address-bar">
          <span class="protocol">🔒</span>
          <input 
            v-model="currentUrl" 
            type="text" 
            class="url-input"
            @keyup.enter="navigateTo(currentUrl)"
            placeholder="Enter URL or search..."
          />
        </div>
        
        <div class="nav-actions">
          <button @click="openDevTools" class="nav-btn" title="Developer Tools">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M9.5 1.1l3.4 3.5.1.4v9l-.5.5h-11l-.5-.5v-12l.5-.5h7.7l.3.1zM9 2v3h3l-3-3zM3 13h10V6H8.5L8 5.5V2H3v11z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="browser-content">
        <!-- Loading spinner -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner"></div>
          <span>Loading...</span>
        </div>

        <!-- Iframe para mostrar contenido -->
        <iframe
          v-show="!isLoading"
          ref="contentIframe"
          class="content-frame"
          sandbox="allow-scripts allow-same-origin"
          @load="handleIframeLoad"
        ></iframe>
      </div>

      <!-- Developer Tools Panel (Console) -->
      <div v-if="showDevTools" class="devtools-panel">
        <div class="devtools-header">
          <div class="devtools-tabs">
            <button class="devtools-tab active">Console</button>
            <button class="devtools-tab">Elements</button>
            <button class="devtools-tab">Network</button>
          </div>
          <button @click="closeDevTools" class="devtools-close">×</button>
        </div>
        
        <div class="devtools-content">
          <div class="console-log">
            <div v-for="(log, index) in consoleLogs" :key="index" class="console-entry" :class="log.type">
              <span class="console-icon">{{ getConsoleIcon(log.type) }}</span>
              <span class="console-message">{{ log.message }}</span>
              <span class="console-source">{{ log.source }}</span>
            </div>
            <div v-if="consoleLogs.length === 0" class="console-empty">
              Console is empty
            </div>
          </div>
        </div>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import WindowBase from '../components/WindowBase.vue';

// Props
const props = defineProps({
  x: { type: Number, default: 200 },
  y: { type: Number, default: 120 },
  width: { type: Number, default: 900 },
  height: { type: Number, default: 650 },
  isMaximized: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  isMinimized: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1 },
  initialContent: { type: String, default: '' },
  initialUrl: { type: String, default: 'about:blank' }
});

// Emits
const emit = defineEmits(['close', 'minimize', 'maximize', 'focus']);

// Estado
const currentUrl = ref(props.initialUrl);
const isLoading = ref(false);
const showDevTools = ref(false);
const consoleLogs = ref([]);
const contentIframe = ref(null);
const pageTitle = ref('Browser');
const canGoBack = ref(false);
const canGoForward = ref(false);

// History
const history = ref([props.initialUrl]);
const historyIndex = ref(0);

// Computed
const currentPage = computed(() => {
  return history.value[historyIndex.value] || 'about:blank';
});

// Funciones de navegación
function goBack() {
  if (canGoBack.value) {
    historyIndex.value--;
    currentUrl.value = history.value[historyIndex.value];
    loadContent(currentUrl.value);
    updateNavigationState();
  }
}

function goForward() {
  if (canGoForward.value) {
    historyIndex.value++;
    currentUrl.value = history.value[historyIndex.value];
    loadContent(currentUrl.value);
    updateNavigationState();
  }
}

function refresh() {
  loadContent(currentUrl.value);
}

function navigateTo(url) {
  if (!url) return;
  
  // Eliminar historial hacia adelante si navegamos desde el medio
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1);
  }
  
  history.value.push(url);
  historyIndex.value = history.value.length - 1;
  currentUrl.value = url;
  
  loadContent(url);
  updateNavigationState();
}

function updateNavigationState() {
  canGoBack.value = historyIndex.value > 0;
  canGoForward.value = historyIndex.value < history.value.length - 1;
}

function loadContent(content) {
  if (!contentIframe.value) return;
  
  isLoading.value = true;
  consoleLogs.value = [];
  
  // Si el contenido es HTML, cargarlo directamente
  if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
    contentIframe.value.srcdoc = content;
  } else if (content === 'about:blank') {
    contentIframe.value.srcdoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 40px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              background: #f5f5f5;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .welcome {
              text-align: center;
              color: #666;
            }
            h1 {
              font-size: 48px;
              color: #333;
              margin-bottom: 16px;
            }
            p {
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="welcome">
            <h1>Welcome</h1>
            <p>This browser is ready to display your code</p>
          </div>
        </body>
      </html>
    `;
  } else {
    // Contenido HTML plano
    contentIframe.value.srcdoc = content;
  }
}

function handleIframeLoad() {
  isLoading.value = false;
  
  // Intentar obtener el título de la página
  try {
    const iframeDoc = contentIframe.value.contentDocument;
    if (iframeDoc && iframeDoc.title) {
      pageTitle.value = iframeDoc.title || 'Browser';
    }
  } catch (e) {
    // Ignorar errores de acceso cross-origin
  }
}

function openDevTools() {
  showDevTools.value = !showDevTools.value;
}

function closeDevTools() {
  showDevTools.value = false;
}

function getConsoleIcon(type) {
  const icons = {
    log: '›',
    error: '✕',
    warn: '⚠',
    info: 'ℹ'
  };
  return icons[type] || '›';
}

// Escuchar mensajes del iframe para console logs
function handleIframeMessage(event) {
  if (event.data && event.data.type) {
    const logEntry = {
      type: event.data.type,
      message: event.data.message,
      source: 'console',
      timestamp: new Date().toLocaleTimeString()
    };
    consoleLogs.value.push(logEntry);
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('message', handleIframeMessage);
  
  // Cargar contenido inicial si existe
  if (props.initialContent) {
    loadContent(props.initialContent);
  } else {
    loadContent('about:blank');
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handleIframeMessage);
});

// Watch para contenido inicial
watch(() => props.initialContent, (newContent) => {
  if (newContent) {
    loadContent(newContent);
  }
});

// Exponer método para cargar contenido desde fuera
defineExpose({
  loadContent,
  setUrl: (url) => {
    currentUrl.value = url;
  }
});
</script>

<style scoped>
.browser-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

/* Barra de navegación */
.browser-navbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.nav-controls {
  display: flex;
  gap: 4px;
}

.nav-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #5f6368;
  transition: background 0.2s;
}

.nav-btn:hover:not(:disabled) {
  background: #e8eaed;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.address-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0 12px;
  height: 36px;
}

.protocol {
  font-size: 14px;
}

.url-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  color: #333;
}

.nav-actions {
  display: flex;
  gap: 4px;
}

/* Contenido */
.browser-content {
  flex: 1;
  position: relative;
  background: white;
  overflow: hidden;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: white;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f0f0f0;
  border-top-color: #1a73e8;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.content-frame {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

/* Developer Tools */
.devtools-panel {
  height: 250px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.devtools-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #e8eaed;
  border-bottom: 1px solid #ddd;
}

.devtools-tabs {
  display: flex;
  gap: 4px;
}

.devtools-tab {
  padding: 6px 16px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #5f6368;
  transition: background 0.2s;
}

.devtools-tab:hover {
  background: #dadce0;
}

.devtools-tab.active {
  background: white;
  color: #1a73e8;
  font-weight: 500;
}

.devtools-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 20px;
  color: #5f6368;
}

.devtools-close:hover {
  background: #dadce0;
}

.devtools-content {
  flex: 1;
  overflow-y: auto;
  background: white;
}

.console-log {
  padding: 8px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
}

.console-entry {
  display: flex;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid #f0f0f0;
  align-items: flex-start;
}

.console-entry.log {
  color: #333;
}

.console-entry.error {
  color: #d93025;
  background: #fce8e6;
}

.console-entry.warn {
  color: #f29900;
  background: #fef7e0;
}

.console-entry.info {
  color: #1967d2;
  background: #e8f0fe;
}

.console-icon {
  font-weight: bold;
  min-width: 16px;
}

.console-message {
  flex: 1;
  word-break: break-word;
}

.console-source {
  font-size: 11px;
  color: #999;
  min-width: 80px;
  text-align: right;
}

.console-empty {
  padding: 20px;
  text-align: center;
  color: #999;
  font-style: italic;
}

/* Scrollbar personalizado */
.devtools-content::-webkit-scrollbar {
  width: 10px;
}

.devtools-content::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.devtools-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 5px;
}

.devtools-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>