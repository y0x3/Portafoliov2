<!-- src/components/Clock.vue -->
<template>
  <div class="clock-container">
    <div class="clock-time">{{ currentTime }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentTime = ref('');

let intervalId = null;

const updateClock = () => {
  const now = new Date();
  
  let hours = now.getHours();
  const minutes = now.getMinutes();
  let period = '';
  
  // Formato 12 horas (AM/PM)
  period = hours >= 12 ? ' PM' : ' AM';
  hours = hours % 12 || 12;
  
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  currentTime.value = `${formattedHours}:${formattedMinutes}${period}`;
};

onMounted(() => {
  updateClock();
  // Actualizar cada segundo
  intervalId = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped>
.clock-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  pointer-events: none;
  z-index: 2;
  border-top: 8px solid #639bff;
  background-color: #5fcde4;
  min-width: 0; /* Permite que se encoja si es necesario */
}

.clock-time {
   font-size: clamp(0.875rem, 2vw, 1.875rem); /* Responsive: 14px a 30px */
  font-weight: bold;
  color: rgb(0, 0, 0);
  white-space: nowrap;
  line-height: 1;
}
</style>