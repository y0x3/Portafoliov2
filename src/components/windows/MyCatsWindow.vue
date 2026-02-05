<!-- src/components/windows/MyCatsWindow.vue -->
<template>
  <div class="cat-screen-overlay" @mousemove="handleMouseMove">
    <!-- Botón de cerrar flotante -->
    <button class="close-button" @click="$emit('close')" title="Cerrar">
      ✕
    </button>

    <!-- Gatos caminando -->
    <div 
      v-for="cat in cats" 
      :key="cat.id"
      class="walking-cat"
      :class="{ 
        'cat-running': cat.isRunning,
        'cat-angry': cat.isAngry,
        'cat-leaving': cat.isLeaving,
        'cat-returning': cat.isReturning,
        'cat-sleeping': cat.isSleeping,
        'cat-loving': cat.isLoving
      }"
      :style="getCatStyle(cat)"
      @click="handleCatClick(cat)"
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

      <!-- 🔥 Emoji de enojo (Kuro) -->
      <div v-if="cat.isAngry" class="angry-emoji">😾💢</div>

      <!-- 🔥 ZZZ de sueño (Karawita) -->
      <div v-if="cat.isSleeping" class="sleep-zzz">
        <span class="zzz zzz1">Z</span>
        <span class="zzz zzz2">Z</span>
        <span class="zzz zzz3">Z</span>
      </div>

      <!-- 🔥 Corazones (Mishita) -->
      <div v-if="cat.isLoving" class="love-hearts">
        <span class="heart heart1">💗</span>
        <span class="heart heart2">💕</span>
        <span class="heart heart3">💖</span>
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

// 🔥 Posición del mouse
const mousePosition = ref({ x: 0, y: 0 });

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
    currentState: 'walking',
    isRunning: false,
    isAngry: false,
    isLeaving: false,
    isReturning: false,
    isSleeping: false,
    isLoving: false,
    exitPosition: null
  },
  { 
    id: 2, 
    profileId: 'Karawita',
    profile: catAnimationSystem.catProfiles.Karawita,
    x: 300,
    y: 400,
    direction: 'right',
    speed: catAnimationSystem.catProfiles.Karawita.speed,
    currentState: 'sitting',
    isRunning: false,
    isAngry: false,
    isLeaving: false,
    isReturning: false,
    isSleeping: false,
    isLoving: false,
    exitPosition: null
  },
  { 
    id: 3, 
    profileId: 'Mishita',
    profile: catAnimationSystem.catProfiles.Mishita,
    x: 500,
    y: 150,
    direction: 'left',
    speed: catAnimationSystem.catProfiles.Mishita.speed,
    currentState: 'standing',
    isRunning: false,
    isAngry: false,
    isLeaving: false,
    isReturning: false,
    isSleeping: false,
    isLoving: false,
    exitPosition: null
  }
]);

let animationFrameId = null;

// 👇 Obtener el GIF actual según el perfil y estado del gato
const getCurrentGif = (cat) => {
  if (cat.isLeaving || cat.isReturning) return cat.profile.gifs.walking;
  if (cat.isAngry) return cat.profile.gifs.angry;
  if (cat.isRunning) return cat.profile.gifs.running;
  if (cat.isSleeping) return cat.profile.gifs.sleeping;
  if (cat.isLoving) return cat.profile.gifs.loving;
  return cat.profile.gifs[cat.currentState];
};

// Obtener estilo dinámico para cada gato
const getCatStyle = (cat) => ({
  left: `${cat.x}px`,
  top: `${cat.y}px`
});

// 🔥 MEJORADO: Capturar posición del mouse a nivel de documento
const handleMouseMove = (event) => {
  mousePosition.value = {
    x: event.clientX,
    y: event.clientY
  };
};

// 🔊 Función para reproducir sonidos
const playSoundEffect = (soundPath) => {
  try {
    const audio = new Audio(soundPath);
    audio.volume = 0.1;
    audio.play().catch(err => {
      console.warn('⚠️ No se pudo reproducir el sonido:', err);
    });
  } catch (error) {
    console.error('❌ Error al reproducir sonido:', error);
  }
};

const handleCatClick = (cat) => {
  // No hacer nada si ya está en algún estado especial
  if (cat.isLeaving || cat.isReturning) return;

  const result = catAnimationSystem.handleCatClick(cat.profileId);
  
  if (!result) return;

  // KURO - Comportamiento de enojo
  if (result.action === 'run') {
    cat.isRunning = true;
    cat.currentState = 'running';
    cat.speed = cat.profile.runSpeed;

    setTimeout(() => {
      cat.isRunning = false;
      cat.currentState = 'walking';
      cat.speed = cat.profile.speed;
    }, result.duration);

  } else if (result.action === 'leave') {
    cat.isAngry = true;
    cat.currentState = 'angry';
    
    cat.exitPosition = {
      x: cat.x,
      y: cat.y,
      direction: cat.direction
    };
    
    setTimeout(() => {
      cat.isAngry = false;
      cat.isLeaving = true;
      cat.currentState = 'leaving';
      cat.speed = cat.profile.runSpeed * 1.5;

      // 🔥 Reproducir sonido al salir
      if (result.sound) {
        catAnimationSystem.playSound(result.sound);
      }

      const screenWidth = window.innerWidth;
      if (cat.x < screenWidth / 2) {
        cat.direction = 'left';
      } else {
        cat.direction = 'right';
      }

      setTimeout(() => {
        startCatReturn(cat);
      }, result.duration);
    }, 2000);
  }
  
  // 🔥 KARAWITA - Comportamiento de dormir
  else if (result.action === 'sleep') {
    cat.isSleeping = true;
    cat.currentState = 'sleeping';
    
    setTimeout(() => {
      cat.isSleeping = false;
      cat.currentState = 'walking';
    }, result.duration);
  }
  
  // 🔥 MISHITA - Comportamiento amoroso (seguir mouse)
  else if (result.action === 'love') {
    cat.isLoving = true;
    cat.currentState = 'loving';
    cat.speed = cat.profile.speed * (result.speedMultiplier || 4);
    
    setTimeout(() => {
      cat.isLoving = false;
      cat.currentState = 'walking';
      cat.speed = cat.profile.speed;
    }, result.duration);
  }
};

// 🔥 Hacer que el gato regrese caminando
const startCatReturn = (cat) => {
  cat.isLeaving = false;
  cat.isReturning = true;
  cat.currentState = 'walking';
  cat.speed = cat.profile.speed;

  const screenWidth = window.innerWidth;
  const catWidth = 150;

  if (cat.exitPosition.direction === 'left' || cat.direction === 'left') {
    cat.x = -catWidth;
    cat.direction = 'right';
  } else {
    cat.x = screenWidth + catWidth;
    cat.direction = 'left';
  }

  cat.y = cat.exitPosition.y;
};

// 🔥 MEJORADO: Mover gatos con lógica especial para cada uno
const moveCats = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const catWidth = 150;
  const catHeight = 150;

  cats.value.forEach(cat => {
    // 🔥 MISHITA - Seguir el mouse cuando está en modo amoroso
    if (cat.isLoving && cat.profileId === 'Mishita') {
      const targetX = mousePosition.value.x - catWidth / 2;
      const targetY = mousePosition.value.y - catHeight / 2;
      
      const deltaX = targetX - cat.x;
      const deltaY = targetY - cat.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // 🔥 Siempre moverse hacia el mouse
      if (distance > 5) {
        const moveX = (deltaX / distance) * cat.speed;
        const moveY = (deltaY / distance) * cat.speed;
        
        cat.x += moveX;
        cat.y += moveY;
        
        // Cambiar dirección según hacia donde va
        cat.direction = deltaX > 0 ? 'right' : 'left';
      }
    }
    // 🔥 KARAWITA - No moverse mientras duerme
    else if (cat.isSleeping) {
      // No hacer nada, está durmiendo
    }
    // Movimiento normal
    else if (cat.currentState === 'walking' || cat.isRunning || cat.isLeaving || cat.isReturning) {
      
      if (cat.direction === 'right') {
        cat.x += cat.speed;
        
        if (cat.isLeaving) {
          // Saliendo...
        } 
        else if (cat.isReturning) {
          if (cat.x >= cat.exitPosition.x) {
            cat.x = cat.exitPosition.x;
            cat.direction = cat.exitPosition.direction;
            cat.isReturning = false;
            cat.currentState = 'walking';
            cat.exitPosition = null;
            catAnimationSystem.resetClickCount(cat.profileId);
          }
        } 
        else {
          if (cat.x > screenWidth - catWidth) {
            cat.direction = 'left';
            cat.x = screenWidth - catWidth;
          }
        }
      } else {
        cat.x -= cat.speed;
        
        if (cat.isLeaving) {
          // Saliendo...
        } 
        else if (cat.isReturning) {
          if (cat.x <= cat.exitPosition.x) {
            cat.x = cat.exitPosition.x;
            cat.direction = cat.exitPosition.direction;
            cat.isReturning = false;
            cat.currentState = 'walking';
            cat.exitPosition = null;
            catAnimationSystem.resetClickCount(cat.profileId);
          }
        } 
        else {
          if (cat.x < 0) {
            cat.direction = 'right';
            cat.x = 0;
          }
        }
      }
    }

    // 🔥 MISHITA: Mantener dentro de límites de pantalla
    if (cat.isLoving && cat.profileId === 'Mishita') {
      if (cat.x < 0) cat.x = 0;
      if (cat.x > screenWidth - catWidth) cat.x = screenWidth - catWidth;
      if (cat.y < 0) cat.y = 0;
      if (cat.y > screenHeight - catHeight) cat.y = screenHeight - catHeight;
    }
    // Mantener dentro de límites verticales (otros gatos)
    else if (!cat.isLeaving && !cat.isReturning) {
      if (cat.y < 0) cat.y = 0;
      if (cat.y > screenHeight - catHeight) cat.y = screenHeight - catHeight;
    }

    // Cambio aleatorio de estado (solo si no está en estados especiales)
    if (!cat.isRunning && !cat.isAngry && !cat.isLeaving && !cat.isReturning && !cat.isSleeping && !cat.isLoving && Math.random() < 0.005) {
      const newState = catAnimationSystem.getNextState(cat.currentState);
      cat.currentState = newState;
      
      if (newState !== 'walking') {
        const waitTime = Math.random() * 2000 + 2000;
        setTimeout(() => {
          if (!cat.isRunning && !cat.isAngry && !cat.isLeaving && !cat.isReturning && !cat.isSleeping && !cat.isLoving) {
            cat.currentState = 'walking';
          }
        }, waitTime);
      }
    }
  });

  animationFrameId = requestAnimationFrame(moveCats);
};

onMounted(() => {
  catAnimationSystem.setSoundEffectFunction(playSoundEffect);
  console.log('🐱 MyCatsWindow montado, función de sonido registrada');
  
  // 🔥 NUEVO: Escuchar mousemove a nivel de documento (no del overlay)
  document.addEventListener('mousemove', handleMouseMove);
  
  moveCats();
});

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  
  // 🔥 NUEVO: Limpiar listener de mousemove
  document.removeEventListener('mousemove', handleMouseMove);
  
  cats.value.forEach(cat => {
    catAnimationSystem.resetClickCount(cat.profileId);
  });
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
  pointer-events: all;
  cursor: pointer;
  transition: left 0.05s linear, top 0.05s linear;
}

/* Estados especiales */
.cat-running .cat-sprite {
  animation: shake 0.1s infinite;
}

.cat-angry {
  animation: shake 0.2s infinite;
}

.cat-loving .cat-sprite {
  animation: wiggle 0.3s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0) translateY(0); }
  25% { transform: translateX(-2px) translateY(-2px); }
  75% { transform: translateX(2px) translateY(2px); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
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

/* 🔥 Emoji de enojo */
.angry-emoji {
  position: absolute;
  top: -30px;
  right: -10px;
  font-size: 24px;
  animation: bounce 0.5s infinite;
  pointer-events: none;
}

/* 🔥 ZZZ de sueño */
.sleep-zzz {
  position: absolute;
  top: -40px;
  right: 10px;
  pointer-events: none;
}

.zzz {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: #4a90e2;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: float-zzz 2s infinite;
}

.zzz1 {
  left: 0;
  animation-delay: 0s;
}

.zzz2 {
  left: 15px;
  top: -10px;
  animation-delay: 0.3s;
}

.zzz3 {
  left: 30px;
  top: -20px;
  animation-delay: 0.6s;
}

@keyframes float-zzz {
  0%, 100% { 
    opacity: 0;
    transform: translateY(0);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* 🔥 Corazones */
.love-hearts {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.heart {
  position: absolute;
  font-size: 24px;
  animation: float-heart 2s infinite;
}

.heart1 {
  left: -20px;
  animation-delay: 0s;
}

.heart2 {
  left: 0;
  animation-delay: 0.3s;
}

.heart3 {
  left: 20px;
  animation-delay: 0.6s;
}

@keyframes float-heart {
  0%, 100% { 
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateY(-30px) scale(1);
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0.5);
  }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
</style>