<!-- src/components/Desktop.vue -->
<template>
  <div class="desktop" ref="desktopRef">
    <img src="/ui/desktop/homexp.png" class="desktop-bg" />
    
    <div 
      v-for="icon in icons" 
      :key="icon.id"
      class="desktop-icon"
      :style="getIconStyle(icon)"
      @mousedown="startDrag($event, icon)"
    >
      <img :src="icon.image" :alt="icon.name" draggable="false" />
      <span class="icon-label">{{ icon.name }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['open-app']);

const GRID_SIZE = 80;
const DRAG_THRESHOLD = 5;

const icons = ref([
  { id: 1, name: 'Sobre mí', image: '/ui/iconos/icono_mipc_notexto.png', appId: 'mycomputer', x: 0, y: 0 },
  { id: 2, name: 'Mis Documentos', image: '/ui/iconos/folder.png', appId: 'documents', x: 0, y: 5 },
  { id: 3, name: 'Papelera', image: '/ui/iconos/papelera.png', appId: 'recyclebin', x: 0, y: 6 },
  { id: 4, name: 'Mis Proyectos', image: '/ui/iconos/icono-internetE.png', appId: 'internetexplorer', x: 0, y: 1 },
  { id: 5, name: 'Contactos', image: '/ui/iconos/icono-gmail.png', appId: 'outlook', x: 0, y: 2 },
  { id: 6, name: 'Spotify', image: '/ui/iconos/spotify.png', appId: 'spotify', x: 0, y: 3 },
  { id: 7, name: 'Github', image: '/ui/iconos/github.png', appId: 'github', x: 0, y: 4 },
  { id: 8, name: 'Minesweeper', image: '/ui/iconos/Minesweeper.png', appId: 'minesweeper', x: 1, y: 0 },
  { id: 9, name: 'CMD', image: '/ui/iconos/cmd.png', appId: 'cmd', x: 2, y: 0 },
  { id: 10, name: 'visualCode', image: '/ui/iconos/visualcodeicono.png', appId: 'visualCode', x: 3, y: 0 }
]);

const desktopRef = ref(null);
let draggedIcon = null;
let offsetX = 0;
let offsetY = 0;
const tempPosition = ref({ x: 0, y: 0 });
const isDragging = ref(false);

let startX = 0;
let startY = 0;
let hasMoved = false;

const isCellOccupied = (gridX, gridY, excludeIconId) => {
  return icons.value.some(icon => {
    if (icon.id === excludeIconId) return false;
    return icon.x === gridX && icon.y === gridY;
  });
};

const findNearestFreeCell = (targetX, targetY, excludeIconId) => {
  if (!isCellOccupied(targetX, targetY, excludeIconId)) {
    return { x: targetX, y: targetY };
  }
  
  const maxDistance = 10;
  
  for (let distance = 1; distance <= maxDistance; distance++) {
    const candidates = [
      { x: targetX, y: targetY - distance },
      { x: targetX, y: targetY + distance },
      { x: targetX - distance, y: targetY },
      { x: targetX + distance, y: targetY },
      { x: targetX - distance, y: targetY - distance },
      { x: targetX + distance, y: targetY - distance },
      { x: targetX - distance, y: targetY + distance },
      { x: targetX + distance, y: targetY + distance }
    ];
    
    for (const candidate of candidates) {
      if (candidate.x >= 0 && candidate.y >= 0) {
        const desktopRect = desktopRef.value?.getBoundingClientRect();
        if (desktopRect) {
          const maxX = Math.floor(desktopRect.width / GRID_SIZE) - 1;
          const maxY = Math.floor(desktopRect.height / GRID_SIZE) - 1;
          
          if (candidate.x <= maxX && candidate.y <= maxY) {
            if (!isCellOccupied(candidate.x, candidate.y, excludeIconId)) {
              return candidate;
            }
          }
        }
      }
    }
  }
  
  const originalIcon = icons.value.find(icon => icon.id === excludeIconId);
  return { x: originalIcon.x, y: originalIcon.y };
};

const getIconStyle = (icon) => {
  if (isDragging.value && draggedIcon && draggedIcon.id === icon.id) {
    return {
      left: tempPosition.value.x + 'px',
      top: tempPosition.value.y + 'px',
      zIndex: 1000
    };
  }
  
  return {
    left: (icon.x * GRID_SIZE) + 'px',
    top: (icon.y * GRID_SIZE) + 'px'
  };
};

const snapToGrid = (pixelValue) => {
  return Math.round(pixelValue / GRID_SIZE);
};

const startDrag = (event, icon) => {
  event.preventDefault();
  
  draggedIcon = icon;
  const iconPixelX = icon.x * GRID_SIZE;
  const iconPixelY = icon.y * GRID_SIZE;
  
  offsetX = event.clientX - iconPixelX;
  offsetY = event.clientY - iconPixelY;
  
  startX = event.clientX;
  startY = event.clientY;
  hasMoved = false;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (event) => {
  if (!draggedIcon) return;
  
  const deltaX = Math.abs(event.clientX - startX);
  const deltaY = Math.abs(event.clientY - startY);
  
  if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
    hasMoved = true;
    isDragging.value = true;
  }
  
  if (!hasMoved) return;
  
  let newX = event.clientX - offsetX;
  let newY = event.clientY - offsetY;
  
  const desktopRect = desktopRef.value.getBoundingClientRect();
  newX = Math.max(0, Math.min(newX, desktopRect.width - GRID_SIZE));
  newY = Math.max(0, Math.min(newY, desktopRect.height - GRID_SIZE));
  
  tempPosition.value = { x: newX, y: newY };
};

const stopDrag = () => {
  if (!draggedIcon) return;
  
  if (!hasMoved) {
    console.log('🖱️ Desktop: Click en icono:', draggedIcon.appId);
    emit('open-app', draggedIcon.appId);
  } else {
    const targetGridX = snapToGrid(tempPosition.value.x);
    const targetGridY = snapToGrid(tempPosition.value.y);
    
    const freeCell = findNearestFreeCell(targetGridX, targetGridY, draggedIcon.id);
    
    draggedIcon.x = freeCell.x;
    draggedIcon.y = freeCell.y;
  }
  
  draggedIcon = null;
  isDragging.value = false;
  hasMoved = false;
  
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};
</script>

<style scoped>
.desktop {
  position: relative;
  overflow: hidden;
  background-color: rgb(0, 136, 255);
  width: 100%;
  height: 100%;
}

.desktop-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
  pointer-events: none;
  -webkit-user-drag: none;
}

.desktop-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  width: 70px;
  transition: background-color 0.1s;
  image-rendering: pixelated;
  z-index: 1;
}

.desktop-icon:hover {
  background-color: rgba(51, 153, 255, 0.4);
  border: 1px dotted rgba(255, 255, 255, 0.9);
}

.desktop-icon img {
  width: 48px;
  height: 48px;
  image-rendering: pixelated;
  pointer-events: none;
  -webkit-user-drag: none;
}

.icon-label {
  color: white;
  font-size: 11px;
  text-align: center;
  margin-top: 5px;
  text-shadow: 1px 1px 2px black;
  word-wrap: break-word;
  max-width: 70px;
}
</style>