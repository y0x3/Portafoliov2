<!-- src/components/windows/MyCatsWindow.vue -->
<template>
  <div class="cat-screen-overlay">
    <!-- Botón de cerrar flotante -->
    <button class="close-button" @click="$emit('close')" title="Cerrar">
      ✕
    </button>

    <!-- Gatos caminando -->
    <div 
      v-for="cat in cats" 
      :key="cat.id"
      class="walking-cat"
      :style="getCatStyle(cat)"
    >
      <!-- GIF del gato -->
      <img 
        :src="getCurrentGif(cat)" 
        :alt="cat.profile.name"
        class="cat-sprite" 
        :class="{ 'flipped': cat.direction === 'left' }"
      />
      <!-- Nombre del gato con color personalizado -->
      <div class="cat-name" :style="{ color: cat.profile.color }">
        {{ cat.profile.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { catAnimationSystem } from '../../data/catAnimations';

defineProps({
  isActive: { type: Boolean, default: false }
});

defineEmits(['close']);

// 👇 Inicializar gatos con sus perfiles únicos
const cats = ref([
  { 
    id: 1, 
    profileId: 'Kuro',
    profile: catAnimationSystem.catProfiles.Kuro,
    x: 0,
    y: 200,
    direction: 'right',
    speed: catAnimationSystem.catProfiles.Kuro.speed,
    currentState: 'walking'
  },
  { 
    id: 2, 
    profileId: 'Karawita',
    profile: catAnimationSystem.catProfiles.Karawita,
    x: 300,
    y: 400,
    direction: 'right',
    speed: catAnimationSystem.catProfiles.Karawita.speed,
    currentState: 'sitting'
  },
  { 
    id: 3, 
    profileId: 'Mishita',
    profile: catAnimationSystem.catProfiles.Mishita,
    x: 500,
    y: 150,
    direction: 'left',
    speed: catAnimationSystem.catProfiles.Mishita.speed,
    currentState: 'standing'
  }
]);

let animationFrameId = null;

// 👇 Obtener el GIF actual según el perfil y estado del gato
const getCurrentGif = (cat) => {
  return cat.profile.gifs[cat.currentState];
};

// Obtener estilo dinámico para cada gato
const getCatStyle = (cat) => ({
  left: `${cat.x}px`,
  top: `${cat.y}px`
});

// Mover gatos
const moveCats = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const catWidth = 150;
  const catHeight = 150;

  cats.value.forEach(cat => {
    // Solo mover si está en estado 'walking'
    if (cat.currentState === 'walking') {
      // Mover horizontalmente
      if (cat.direction === 'right') {
        cat.x += cat.speed;
        
        // Si llega al borde derecho, cambiar dirección
        if (cat.x > screenWidth - catWidth) {
          cat.direction = 'left';
          cat.x = screenWidth - catWidth;
        }
      } else {
        cat.x -= cat.speed;
        
        // Si llega al borde izquierdo, cambiar dirección
        if (cat.x < 0) {
          cat.direction = 'right';
          cat.x = 0;
        }
      }
    }

    // Mantener dentro de límites verticales
    if (cat.y < 0) cat.y = 0;
    if (cat.y > screenHeight - catHeight) cat.y = screenHeight - catHeight;

    // Cambio aleatorio de estado (0.5% probabilidad por frame)
    if (Math.random() < 0.005) {
      const newState = catAnimationSystem.getNextState(cat.currentState);
      cat.currentState = newState;
      
      // Si deja de caminar, detener movimiento
      if (newState !== 'walking') {
        // Después de 2-4 segundos, vuelve a caminar
        const waitTime = Math.random() * 2000 + 2000; // 2-4 segundos
        setTimeout(() => {
          cat.currentState = 'walking';
        }, waitTime);
      }
    }
  });

  animationFrameId = requestAnimationFrame(moveCats);
};

onMounted(() => {
  moveCats();
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style scoped>
.cat-screen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  z-index: 9999;
  pointer-events: none;
}

.close-button {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: rgba(255, 0, 0, 0.8);
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  pointer-events: all;
  z-index: 10000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(255, 0, 0, 1);
  transform: scale(1.1);
}

.close-button:active {
  transform: scale(0.95);
}

.walking-cat {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition: left 0.05s linear, top 0.05s linear;
}

.cat-sprite {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
}

.cat-sprite.flipped {
  transform: scaleX(-1);
}

.cat-name {
  font-size: 16px;
  font-weight: bold;
  text-shadow: 
    -2px -2px 0 #000,  
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000,
    3px 3px 6px rgba(0, 0, 0, 0.9);
  margin-top: 8px;
  font-family: 'MS Sans Serif', sans-serif;
  pointer-events: none;
  letter-spacing: 1px;
}
</style>