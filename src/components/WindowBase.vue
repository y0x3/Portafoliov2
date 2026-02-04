<!-- src/components/WindowBase.vue -->
<template>
  <div 
    class="window-container"
    :class="{ 
      maximized: isMaximized, 
      active: isActive,
      minimized: isMinimized  
    }"
    :style="windowStyle"
    @mousedown="$emit('focus')"
  >
        <!-- BARRA SUPERIOR (Title Bar) -->
        <div class="title-bar" @mousedown="startDrag">
        <div class="title-bar-left">
            <img :src="icon" class="window-icon" />
            <span class="window-title">{{ title }}</span>
        </div>
        <div class="title-bar-controls">
            <!-- Botón Minimizar -->
            <button 
            class="btn-control btn-minimize" 
            @click.stop="$emit('minimize')" 
            title="Minimizar"
            >
            <img src="/ui/window/btn-minimize.png" alt="Minimizar" />
            </button>
            
            <!-- Botón Maximizar/Restaurar - CAMBIA SEGÚN ESTADO -->
            <button 
            class="btn-control btn-maximize" 
            @click.stop="$emit('maximize')" 
            :title="isMaximized ? 'Restaurar' : 'Maximizar'"
            >
            <img 
                :src="isMaximized ? '/ui/window/btn-maximize2.png' : '/ui/window/btn-maximize.png'" 
                :alt="isMaximized ? 'Restaurar' : 'Maximizar'" 
            />
            </button>
            
            <!-- Botón Cerrar -->
            <button 
            class="btn-control btn-close" 
            @click.stop="$emit('close')" 
            title="Cerrar"
            >
            <img src="/ui/window/btn-close.png" alt="Cerrar" />
            </button>
        </div>
        </div>

    <!-- BARRA INTERMEDIA (Toolbar) - Solo si showToolbar es true -->
    <div v-if="showToolbar" class="toolbar-container">
      <!-- Fila 1: Menú -->
      <div class="menu-bar">
        <div class="menu-items">
          <button class="menu-item">File</button>
          <button class="menu-item">Edit</button>
          <button class="menu-item">View</button>
          <button class="menu-item">Favorites</button>
          <button class="menu-item">Tools</button>
          <button class="menu-item">Help</button>
        </div>
        <img src="/ui/iconos/windows.png" class="windows-logo" />
      </div>

      <!-- Fila 2: Barra de navegación -->
      <div class="navigation-bar">
        <div class="nav-buttons">
          <button class="nav-btn" title="Atrás">
            <span>←</span>
          </button>
          <button class="nav-btn" title="Adelante">
            <span>→</span>
          </button>
        </div>
        
        <div class="toolbar-buttons">
          <button class="toolbar-btn">
            <img src="/ui/iconos/icono-serch.png" />
            <span>Search</span>
          </button>
          <button class="toolbar-btn">
            <img src="/ui/iconos/folder.png" />
            <span>Folders</span>
          </button>
          <button class="toolbar-btn">
            <img src="/ui/iconos/views.png" />
            <span>Views</span>
          </button>
        </div>
      </div>

      <!-- Fila 3: Barra de dirección -->
      <div class="address-bar">
        <span class="address-label">Address</span>
        <div class="address-input-container">
          <img src="/ui/iconos/icono_mipc_notexto.png" class="address-icon" />
          <input 
            type="text" 
            :value="addressBarText" 
            class="address-input"
            readonly
          />
          <button class="address-dropdown">▼</button>
        </div>
        <button class="go-button">Go</button>
      </div>
    </div>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="window-content">
      <!-- Columna izquierda (Sidebar) - Solo si showSidebar es true -->
      <div v-if="showSidebar" class="sidebar">
        <slot name="sidebar">
          <!-- Contenido por defecto del sidebar -->
          <div class="sidebar-section">
            <div class="sidebar-title">System Tasks</div>
            <div class="sidebar-content">
              <a href="#" class="sidebar-link">View system information</a>
              <a href="#" class="sidebar-link">Add or remove programs</a>
              <a href="#" class="sidebar-link">Change a setting</a>
            </div>
          </div>

          <div class="sidebar-section">
            <div class="sidebar-title">Other Places</div>
            <div class="sidebar-content">
              <a href="#" class="sidebar-link">
                <img src="/vite.svg" />
                My Network Places
              </a>
              <a href="#" class="sidebar-link">
                <img src="/vite.svg" />
                My Documents
              </a>
            </div>
          </div>
        </slot>
      </div>

      <!-- Columna derecha (Contenido principal) -->
      <div class="main-content">
        <slot>
          <!-- Aquí va el contenido específico de cada ventana -->
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// ============================================
// PROPS
// ============================================
const props = defineProps({
  title: { type: String, default: 'Window' },
  icon: { type: String, default: '/vite.svg' },
  x: { type: Number, default: 100 },
  y: { type: Number, default: 100 },
  width: { type: Number, default: 800 },
  height: { type: Number, default: 600 },
  maxWidth: { type: String, default: '90vw' },
  maxHeight: { type: String, default: '80vh' },
  isMaximized: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  isMinimized: { type: Boolean, default: false }, 
  zIndex: { type: Number, default: 1 },
  showToolbar: { type: Boolean, default: false },
  showSidebar: { type: Boolean, default: false },
  addressBarText: { type: String, default: 'My Computer' }
});

// ============================================
// EMITS
// ============================================
const emit = defineEmits(['close', 'minimize', 'maximize', 'focus', 'update:x', 'update:y']);

// ============================================
// ESTADO REACTIVO
// ============================================
const windowX = ref(props.x);
const windowY = ref(props.y);
const hoveredBtn = ref(null);

// ============================================
// COMPUTED: Z-Index dinámico con prioridad correcta
// ============================================
const computedZIndex = computed(() => {
  // PRIORIDAD 1: Ventana activa SIEMPRE encima (sin importar si está maximizada)
  // Usa un rango muy alto (10000+) para asegurar que esté sobre todo
  if (props.isActive) {
    return 10000 + props.zIndex;
  }
  
  // PRIORIDAD 2: Ventanas maximizadas (pero no activas)
  // Usa un rango medio (5000+) para estar sobre ventanas normales
  if (props.isMaximized) {
    return 5000 + props.zIndex;
  }
  
  // PRIORIDAD 3: Ventanas normales no activas
  // Usa el z-index base (1-999 típicamente)
  return props.zIndex;
});

// ============================================
// COMPUTED: Estilos de la ventana
// ============================================
const windowStyle = computed(() => {
  if (props.isMaximized) {
    return {
      left: '0',
      top: '0',
      width: '100vw',
      height: '92vh',
      maxWidth: 'none',
      maxHeight: 'none',
      zIndex: computedZIndex.value
    };
  }
  
  return {
    left: windowX.value + 'px',
    top: windowY.value + 'px',
    width: props.width + 'px',
    height: props.height + 'px',
    maxWidth: props.maxWidth,
    maxHeight: props.maxHeight,
    zIndex: computedZIndex.value
  };
});

// ============================================
// FUNCIÓN: Obtener icono de maximizar correcto
// ============================================
const getMaximizeIcon = () => {
  const isHovered = hoveredBtn.value === 'maximize';
  
  if (props.isMaximized) {
    // Ventana maximizada - mostrar icono de "restaurar"
    return isHovered 
      ? '/ui/window/btn-maximize2-hover.png'
      : '/ui/window/btn-maximize2.png';
  } else {
    // Ventana normal - mostrar icono de "maximizar"
    return isHovered 
      ? '/ui/window/btn-maximize-hover.png'
      : '/ui/window/btn-maximize.png';
  }
};

// ============================================
// DRAG FUNCTIONALITY
// ============================================
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

const startDrag = (event) => {
  // No permitir arrastrar si está maximizada
  if (props.isMaximized) return;
  
  isDragging = true;
  dragOffsetX = event.clientX - windowX.value;
  dragOffsetY = event.clientY - windowY.value;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  
  emit('focus');
};

const onDrag = (event) => {
  if (!isDragging) return;
  
  windowX.value = event.clientX - dragOffsetX;
  windowY.value = event.clientY - dragOffsetY;
};

const stopDrag = () => {
  isDragging = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};
</script>

<style scoped>
/* ============================================
   CONTENEDOR PRINCIPAL
   ============================================ */
.window-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #ece9d8;
  border: 0.4vh solid;
  border-top-color: #0054e3;
  border-left-color: #0054e3;
  border-right-color: #003c9d;
  border-bottom-color: #003c9d;
  box-shadow: 0.3vw 0.3vw 1vw rgba(0, 0, 0, 0.3);
  
  box-sizing: border-box;
  min-width: 300px;
  min-height: 200px;
}


.window-container.active {
  border-top-color: #0997ff;
  border-left-color: #0997ff;
}

/* ============================================
   BARRA SUPERIOR (Title Bar)
   ============================================ */
.title-bar {
  background: linear-gradient(180deg, #0997ff 0%, #0053ee 100%);
  padding: 3px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
  min-height: 28px;
}

.window-container:not(.active) .title-bar {
  background: linear-gradient(180deg, #7e92c4 0%, #4e6da2 100%);
}

.window-container.minimized {
  display: none !important;
}

.title-bar-left {
  display: flex;
  align-items: center;
  gap: 5px;
}

.window-icon {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
}

.window-title {
  color: white;
  font-size: 11px;
  font-weight: bold;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
}

.title-bar-controls {
  display: flex;
  gap: 2px;
}

.title-bar-controls button {
  width: 21px;
  height: 21px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-weight: bold;
}

.title-bar-controls button:hover {
  background: linear-gradient(180deg, #f0ede0 0%, #e0d8c0 100%);
}

.title-bar-controls button:active {
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  background: linear-gradient(180deg, #d0c8b0 0%, #e0d8c0 100%);
}

.minimize-icon {
  font-size: 16px;
  line-height: 10px;
  margin-top: 8px;
}

.maximize-icon {
  font-size: 14px;
  line-height: 1;
}

.close-icon {
  font-size: 18px;
  line-height: 1;
}

.btn-close:hover {
  background: linear-gradient(180deg, #e04040 0%, #c03030 100%);
  color: white;
}

/* ============================================
   BARRA INTERMEDIA (Toolbar)
   ============================================ */
.toolbar-container {
  background: #ece9d8;
  border-bottom: 1px solid #919b9c;
}

/* Fila 1: Menú */
.menu-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 5px;
  background: linear-gradient(180deg, #f1ede7 0%, #ebe7df 100%);
  border-bottom: 1px solid #d4d0c8;
}

.menu-items {
  display: flex;
  gap: 2px;
}

.menu-item {
  padding: 3px 8px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 11px;
  color: #000;
}

.menu-item:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ece9d8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
}

.windows-logo {
  width: 20px;
  height: 20px;
  image-rendering: pixelated;
}

/* Fila 2: Navegación */
.navigation-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  background: #ece9d8;
}

.nav-buttons {
  display: flex;
  gap: 2px;
}

.nav-btn {
  width: 32px;
  height: 28px;
  background: linear-gradient(180deg, #ffffff 0%, #ece9d8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%);
}

.nav-btn:active {
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
}

.toolbar-buttons {
  display: flex;
  gap: 5px;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 11px;
}

.toolbar-btn:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ece9d8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
}

.toolbar-btn img {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
}

/* Fila 3: Barra de dirección */
.address-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  background: #ece9d8;
}

.address-label {
  font-size: 11px;
  color: #000;
}

.address-input-container {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid;
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  padding: 2px;
}

.address-icon {
  width: 16px;
  height: 16px;
  margin: 0 3px;
  image-rendering: pixelated;
}

.address-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 11px;
  background: transparent;
}

.address-dropdown {
  width: 20px;
  height: 20px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 10px;
}

.go-button {
  padding: 2px 15px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 11px;
}

.go-button:hover {
  background: linear-gradient(180deg, #f0ede0 0%, #e0d8c0 100%);
}

/* ============================================
   CONTENIDO PRINCIPAL
   ============================================ */
.window-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* Columna izquierda (Sidebar) */
.sidebar {
  width: 200px;
  background: linear-gradient(180deg, #d6dff7 0%, #a6caf0 100%);
  border-right: 1px solid #808080;
  padding: 10px;
  overflow-y: auto;
}

.sidebar-section {
  margin-bottom: 15px;
}

.sidebar-title {
  font-size: 12px;
  font-weight: bold;
  color: #003c9d;
  margin-bottom: 8px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  font-size: 11px;
  color: #003c9d;
  text-decoration: none;
  border-radius: 2px;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.5);
  text-decoration: underline;
}

.sidebar-link img {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
}

/* Columna derecha (Main Content) */
.main-content {
  flex: 1;
  background: white;
  padding: 15px;
  overflow-y: auto;
}

.btn-control {
  width: 21px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
}

.btn-control img {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  -ms-interpolation-mode: nearest-neighbor;
  display: block;
}
</style>