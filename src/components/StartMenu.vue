<template>
  <!-- Overlay oscuro de fondo (opcional) -->
  <div 
    v-if="isOpen" 
    class="start-menu-overlay"
    @click="$emit('close')"
  ></div>

  <!-- Menú de Inicio -->
  <transition name="slide-up">
    <div v-if="isOpen" class="start-menu">
      <!-- FILA 1: Header con usuario -->
      <div class="start-menu-header">
        <img :src="userAvatar" class="user-avatar" alt="User Avatar" />
        <span class="user-name">{{ userName }}</span>
      </div>

      <!-- FILA 2: Grid de aplicaciones (2 columnas) -->
      <div class="start-menu-body">
        <!-- Columna Izquierda: Aplicaciones frecuentes -->
        <div class="menu-column left-column">
          <div class="column-header">Pinned Items</div>
          
          <div 
            v-for="app in pinnedApps"
            :key="app.id"
            class="menu-item"
            @click="openApp(app)"
          >
            <img :src="app.icon" :alt="app.name" class="menu-icon" />
            <span class="menu-text">{{ app.name }}</span>
          </div>

          <!-- Separador -->
          <div class="menu-separator"></div>

          <div class="menu-item">
            <img src="/ui/iconos/allprograms.png" class="menu-icon" />
            <span class="menu-text">All Programs</span>
            <span class="menu-arrow">►</span>
          </div>
        </div>

        <!-- Columna Derecha: Sistema y configuración -->
        <div class="menu-column right-column">
          <div 
            v-for="item in systemItems"
            :key="item.id"
            class="menu-item system-item"
            @click="openSystemItem(item)"
          >
            <img :src="item.icon" :alt="item.name" class="menu-icon" />
            <span class="menu-text">{{ item.name }}</span>
          </div>
        </div>
      </div>

      <!-- FILA 3: Footer con botones de apagado -->
      <div class="start-menu-footer">
        <button class="footer-button" @click="logOff">
          <img src="/ui/iconos/log_off.png" class="footer-icon" />
          <span>Log Off</span>
        </button>

        <button class="footer-button" @click="turnOff">
          <img src="/ui/iconos/turn_off.png" class="footer-icon" />
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; 

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  userName: {
    type: String,
    default: 'Usuario'
  },
  userAvatar: {
    type: String,
    default: '/ui/yo.png'
  }
});

const emit = defineEmits(['close', 'open-app']);

const router = useRouter();
// Aplicaciones ancladas (columna izquierda)
const pinnedApps = ref([
  { 
    id: 1, 
    name: 'Internet Explorer', 
    icon: '/ui/iconos/icono-internetE.png',
    appId: 'internetexplorer'
  },
  { 
    id: 2, 
    name: 'Outlook Express', 
    icon: '/ui/iconos/icono-gmail.png',
    appId: 'outlook'
  },
  { 
    id: 3, 
    name: 'Mi PC', 
    icon: '/ui/iconos/icono_mipc_notexto.png',
    appId: 'mycomputer'
  },
  { 
    id: 4, 
    name: 'Minesweeper', 
    icon: '/ui/iconos/Minesweeper.png',
    appId: 'minesweeper'
  },
  { 
    id: 5, 
    name: 'Spotify', 
    icon: '/ui/iconos/spotify.png',
    appId: 'spotify'
  },
  { 
    id: 6, 
    name: 'GitHub', 
    icon: '/ui/iconos/github.png',
    appId: 'github'
  }
  // Espacio para más aplicaciones (puedes agregar hasta 10)
]);

// Items del sistema (columna derecha)
const systemItems = ref([
  { id: 1, name: 'Mi PC', icon: '/ui/iconos/icono_mipc_notexto.png', appId: 'mycomputer' },
  { id: 2, name: 'Mis Documentos', icon: '/ui/iconos/icono-mis-documentos.png', appId: 'documents' }
  // Espacio para más items
]);

// Funciones
const openApp = (app) => {
  if (app.appId) {
    emit('open-app', app.appId);
    emit('close');
  } else {
    console.log('Abriendo:', app.name);
  }
};

const openSystemItem = (item) => {
  if (item.appId) {
    emit('open-app', item.appId);
    emit('close');
  } else {
    console.log('Abriendo item del sistema:', item.name);
  }
};

const logOff = () => {

    emit('close');
    router.push('/');  // ← Redirige al login

};

const turnOff = () => {
  if (confirm('¿Deseas apagar el sistema?')) {
    emit('close');
    // Opcional: Mostrar pantalla de apagado antes de ir al login
    setTimeout(() => {
      router.push('/');
    }, 500);
  }
};
</script>
<style scoped>
/* ============================================
   OVERLAY DE FONDO
   ============================================ */
.start-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 999;
}

/* ============================================
   CONTENEDOR DEL MENÚ (RESPONSIVO)
   ============================================ */
.start-menu {
  position: fixed;
  bottom: 8vh;
  left: 0;
  width: 25vw;
  max-height: 70vh;                
  background: linear-gradient(to right, #245edb 0px, #3866cb 50px, #ffffff 50px);
  border: 3px solid;
  border-top-color: #679efc;
  border-left-color: #1060e9;
  border-right-color: #1060e9;
  border-bottom-color: #1060e9;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
}
/* ============================================
   FILA 1: HEADER CON USUARIO
   ============================================ */
.start-menu-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  background: linear-gradient(to bottom, #245edb 0%, #5a9dff 100%);
  border-bottom: 2px solid #003c9d;
  border-radius: 5px 5px 0 0;
  min-height: 80px;
}

.user-avatar {
  width: clamp(32px, 10vw, 48px);   /* ← Se adapta entre 32px y 48px */
  height: clamp(32px, 10vw, 48px);  /* ← Se adapta entre 32px y 48px */
  aspect-ratio: 1 / 1;              /* ← Siempre cuadrado */
  border-radius: 4px;
  border: 2px solid white;
  background: white;
  padding: 4px;
  object-fit: cover;
  image-rendering: pixelated;
  flex-shrink: 0;
}

.user-name {
  color: white;
  font-size: clamp(14px, 2vw, 16px);  /* ← Texto también responsivo */
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ============================================
   FILA 2: CUERPO (ACTUALIZADO)
   ============================================ */
.start-menu-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex: 1;                  /* ← Ocupa espacio disponible */
  min-height: 300px;        /* ← Mínimo más pequeño */
  max-height: 60vh;         /* ← Máximo relativo al viewport */
  overflow: hidden;
}

.menu-column {
  padding: 10px;
  overflow-y: auto;
}

.left-column {
  background: white;
  border-right: 1px solid #d4d0c8;
}

.right-column {
  background: #d4e7ff;
}

.column-header {
  font-size: 10px;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 8px;
  padding: 5px 8px;
  font-weight: bold;
}

/* Items del menú */
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.1s;
  position: relative;
}

.menu-item:hover {
  background: linear-gradient(to right, #3d95ff 0%, #1f6fd7 100%);
  color: white;
}

.menu-item:hover .menu-arrow {
  color: white;
}

.menu-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
  font-size: 11px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-arrow {
  font-size: 10px;
  color: #666;
  margin-left: auto;
}

.menu-separator {
  height: 1px;
  background: #d4d0c8;
  margin: 8px 0;
}

.system-item {
  font-size: 11px;
}

/* ============================================
   FILA 3: FOOTER CON BOTONES
   ============================================ */
.start-menu-footer {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: linear-gradient(to bottom, #0078d4 0%, #0054a3 100%);
  border-top: 2px solid #003c9d;
  gap: 8px;
}

.footer-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 15px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 1px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 10px;
  color: #000;
  border-radius: 3px;
  transition: all 0.1s;
}

.footer-button:hover {
  background: linear-gradient(180deg, #f0ede0 0%, #e0d8c0 100%);
}

.footer-button:active {
  border-top-color: #808080;
  border-left-color: #808080;
  border-right-color: #ffffff;
  border-bottom-color: #ffffff;
  background: linear-gradient(180deg, #d0c8b0 0%, #e0d8c0 100%);
}

.footer-icon {
  width: 20px;
  height: 20px;
}

/* ============================================
   ANIMACIÓN DE ENTRADA
   ============================================ */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.2s ease;
}

.slide-up-enter-from {
  transform: translateY(20px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* ============================================
   SCROLLBAR PERSONALIZADO
   ============================================ */
.menu-column::-webkit-scrollbar {
  width: 16px;
}

.menu-column::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.menu-column::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border: 2px solid #f1f1f1;
}

.menu-column::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>