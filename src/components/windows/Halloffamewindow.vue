<!-- src/components/windows/HallOfFameWindow.vue - CON MAPA REAL DE LEAFLET -->
<template>
  <WindowBase
    title="Salón de la Fama"
    icon="/vue.svg"
    :show-toolbar="false"
    :show-sidebar="true"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Sidebar con filtros -->
    <template #sidebar>
      <div class="sidebar-section">
        <div class="sidebar-title">Categorías</div>
        <div class="sidebar-content">
          <a 
            href="#" 
            v-for="cat in categories" 
            :key="cat"
            class="sidebar-link"
            :class="{ active: selectedCategory === cat }"
            @click.prevent="selectedCategory = cat"
          >
            {{ cat }}
          </a>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Información</div>
        <div class="sidebar-content">
          <p class="sidebar-text">
            {{ filteredPersons.length }} {{ filteredPersons.length === 1 ? 'personaje' : 'personajes' }}
          </p>
          <p class="sidebar-text" v-if="loading">
            🗺️ Cargando coordenadas...
          </p>
        </div>
      </div>

      <div v-if="selectedPerson" class="sidebar-section">
        <button class="close-detail-btn" @click="closePersonDetail">
          ← Cerrar detalle
        </button>
      </div>
    </template>

    <!-- Contenido principal -->
    <div class="hall-content">
      <!-- Vista Principal: Mapa + Timeline -->
      <div v-if="!selectedPerson" class="main-view">
        <!-- Sección del Mapa Mundial - AHORA CON LEAFLET REAL -->
        <div class="world-map-section">
          <div id="leaflet-map" class="leaflet-map-container"></div>
          
          <!-- Overlay con información del personaje -->
          <div v-if="hoveredPerson" class="map-overlay">
            <!-- Caso: Múltiples personas en la misma ubicación -->
            <div v-if="hoveredPerson.multiple" class="overlay-content-multiple">
              <div class="overlay-header">
                <p class="location-text">📍 {{ hoveredPerson.birthplace }}</p>
                <span class="person-count">{{ hoveredPerson.persons.length }} personajes</span>
              </div>
              <div class="persons-list">
                <div 
                  v-for="p in hoveredPerson.persons" 
                  :key="p.id"
                  class="person-item"
                  @click="selectPerson(p)"
                >
                  <img 
                    :src="p.image" 
                    :alt="p.name"
                    class="person-item-image"
                  />
                  <div class="person-item-info">
                    <h4>{{ p.name }}</h4>
                    <p class="year-text">{{ p.year }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Caso: Una sola persona -->
            <div v-else class="overlay-content">
              <img 
                :src="hoveredPerson.image" 
                :alt="hoveredPerson.name"
                class="overlay-image"
              />
              <div class="overlay-info">
                <h3>{{ hoveredPerson.name }}</h3>
                <p class="location-text">📍 {{ hoveredPerson.birthplace }}</p>
                <p class="year-text">{{ hoveredPerson.year }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de la Línea de Tiempo -->
        <div class="timeline-section">
          <div class="timeline-header">
            <h2>🏆 Salón de la Fama</h2>
            <p>Personas que admiro mucho y lamentablemente nunca tendré el placer de conocer</p>
          </div>

          <div 
            ref="timelineContainer"
            class="timeline-horizontal-container"
            @mousedown="startDrag"
            @wheel="handleWheel"
          >
            <div class="timeline-horizontal">
              <div 
                v-for="person in filteredPersons" 
                :key="person.id"
                class="timeline-person"
                @mouseenter="handlePersonHover(person)"
                @mouseleave="hoveredPerson = null"
                @click="selectPerson(person)"
              >
                <div class="person-circle">
                  <img 
                    :src="person.image" 
                    :alt="person.name" 
                    draggable="false"
                  />
                </div>

                <div class="person-year-badge">
                  {{ getYearFromRange(person.year) }}
                </div>
                
                <div class="person-name">{{ person.name }}</div>
                
                <div class="person-artistic-name" v-if="person.artisticName && person.artisticName !== person.name">
                  "{{ person.artisticName }}"
                </div>

                <div class="timeline-line"></div>
              </div>
            </div>
          </div>

          <div v-if="filteredPersons.length === 0" class="no-results">
            <p>😔 No hay personajes en esta categoría</p>
          </div>
        </div>
      </div>

      <!-- Vista de Detalle del Personaje -->
      <div v-else class="person-detail-view">
        <div class="representative-image-container" @click="toggleImage">
          <img 
            :src="currentImage"
            :alt="`${selectedPerson.name} representación`"
            :class="showingRepresentative ? 'representative-gif' : 'representative-image-static'"
            draggable="false"
          />
        </div>

        <div class="person-info-overlay">
          <div class="info-section quote-section">
            <blockquote class="famous-quote">
              "{{ selectedPerson.quote }}"
            </blockquote>
          </div>

          <div class="info-section main-info-section">
            <div class="person-image">
              <img 
                :src="selectedPerson.image" 
                :alt="selectedPerson.name"
                draggable="false"
              />
            </div>
            <div class="person-main-data">
              <h2 class="person-name">{{ selectedPerson.name }}</h2>
              <p class="person-artistic-name" v-if="selectedPerson.artisticName">
                "{{ selectedPerson.artisticName }}"
              </p>
              <p class="person-years">{{ selectedPerson.year }}</p>
            </div>
          </div>

          <div class="info-section description-section">
            <p class="short-description">{{ selectedPerson.shortDescription }}</p>
          </div>
        </div>

        <button class="back-to-timeline-btn" @click="closePersonDetail">
          ← Volver a la línea de tiempo
        </button>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WindowBase from '../WindowBase.vue';
import { hallOfFamePersons, categories } from '@/composables/data/Halloffamedata';
import { useGeocoding } from '@/composables/useGeocoding';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// ============================================
// GEOCODING COMPOSABLE
// ============================================
const { 
  coordinatesCache, 
  loading, 
  preloadCities
} = useGeocoding();

// ============================================
// ESTADO REACTIVO
// ============================================
const selectedCategory = ref('Todos');
const selectedPerson = ref(null);
const hoveredPerson = ref(null);
const timelineContainer = ref(null);
const showingRepresentative = ref(true); // true = representativeImage, false = image
const savedScrollPosition = ref(0);

// Estado del mapa Leaflet
let map = null;
const markers = ref({});
const currentMarker = ref(null);

// Estado para el drag
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// ============================================
// COMPUTED
// ============================================
const filteredPersons = computed(() => {
  if (selectedCategory.value === 'Todos') {
    return hallOfFamePersons;
  }
  return hallOfFamePersons.filter(person => person.category === selectedCategory.value);
});

const personsWithCoordinates = computed(() => {
  return filteredPersons.value.filter(person => {
    return person.birthplace && coordinatesCache.value[person.birthplace];
  });
});

// Agrupar personajes por ubicación
const personsByLocation = computed(() => {
  const grouped = {};
  
  personsWithCoordinates.value.forEach(person => {
    const location = person.birthplace;
    if (!grouped[location]) {
      grouped[location] = [];
    }
    grouped[location].push(person);
  });
  
  return grouped;
});

// Computed para la imagen actual a mostrar
const currentImage = computed(() => {
  if (!selectedPerson.value) return '';
  return showingRepresentative.value 
    ? selectedPerson.value.representativeImage 
    : selectedPerson.value.secondaryImage;
});

// ============================================
// FUNCIONES DEL MAPA LEAFLET
// ============================================
const initMap = () => {
  map = L.map('leaflet-map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 10,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  console.log('🗺️ Mapa Leaflet inicializado');
  
  setTimeout(() => {
    if (map) {
      map.invalidateSize();
      console.log('🔄 Tamaño del mapa recalculado');
    }
  }, 200);
};

const addMarkersToMap = () => {
  if (!map) return;

  // Limpiar marcadores anteriores
  Object.values(markers.value).forEach(marker => {
    map.removeLayer(marker);
  });
  markers.value = {};

  // Agregar marcadores para cada persona con coordenadas
  personsWithCoordinates.value.forEach(person => {
    const coords = coordinatesCache.value[person.birthplace];
    if (!coords) return;

    // Crear icono personalizado dorado
    const goldIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-wrapper">
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Crear marcador
    const marker = L.marker([coords.lat, coords.lng], {
      icon: goldIcon,
      personData: person
    });

    // Eventos del marcador
    marker.on('mouseover', () => {
      hoveredPerson.value = person;
      marker.getElement().classList.add('active');
    });

    marker.on('mouseout', () => {
      if (hoveredPerson.value?.id === person.id) {
        hoveredPerson.value = null;
      }
      marker.getElement().classList.remove('active');
    });

    marker.on('click', () => {
      selectPerson(person);
    });

    marker.addTo(map);
    markers.value[person.id] = marker;
  });

  console.log(`📍 ${Object.keys(markers.value).length} marcadores agregados al mapa`);
};

const handlePersonHover = (person) => {
  // Si hay múltiples personas en esta ubicación, mostrar todas
  const location = person.birthplace;
  const personsAtLocation = personsByLocation.value[location] || [person];
  
  // Guardar todos los personajes de esta ubicación para el overlay
  hoveredPerson.value = personsAtLocation.length > 1 
    ? { multiple: true, persons: personsAtLocation, birthplace: location }
    : person;

  // Animar el marcador correspondiente en el mapa
  if (markers.value[person.id]) {
    const markerElement = markers.value[person.id].getElement();
    if (markerElement) {
      markerElement.classList.add('active');
    }

    // Hacer zoom suave al marcador
    const coords = coordinatesCache.value[person.birthplace];
    if (coords && map) {
      map.flyTo([coords.lat, coords.lng], 5, {
        duration: 0.8
      });
    }
  }

  // Limpiar estado anterior
  Object.values(markers.value).forEach(marker => {
    if (marker.options.personData?.id !== person.id) {
      const el = marker.getElement();
      if (el) el.classList.remove('active');
    }
  });
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================
const getYearFromRange = (yearRange) => {
  if (!yearRange) return '';
  return yearRange.split(' - ')[0] || yearRange.split('-')[0] || yearRange;
};

// ============================================
// NUEVA FUNCIÓN: Toggle entre imágenes
// ============================================
const toggleImage = () => {
  showingRepresentative.value = !showingRepresentative.value;
};

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================
const selectPerson = (person) => {
  if (timelineContainer.value) {
    savedScrollPosition.value = timelineContainer.value.scrollLeft;
  }
  
  selectedPerson.value = person;
  showingRepresentative.value = true; // Siempre empezar mostrando la representativeImage
};

const closePersonDetail = () => {
  selectedPerson.value = null;
  showingRepresentative.value = true;
  
  nextTick(() => {
    if (timelineContainer.value && savedScrollPosition.value !== null) {
      timelineContainer.value.scrollLeft = savedScrollPosition.value;
    }
    
    setTimeout(() => {
      if (map) {
        map.remove();
        map = null;
      }
      initMap();
      addMarkersToMap();
      console.log('🔄 Mapa recreado al volver');
    }, 100);
  });
};

// ============================================
// SCROLL HORIZONTAL CON RUEDA DEL MOUSE
// ============================================
const handleWheel = (event) => {
  if (!timelineContainer.value) return;
  event.preventDefault();
  timelineContainer.value.scrollLeft += event.deltaY;
};

// ============================================
// DRAG TO SCROLL
// ============================================
const startDrag = (event) => {
  if (!timelineContainer.value) return;
  if (event.target.tagName === 'IMG') return;
  
  isDragging = true;
  timelineContainer.value.style.cursor = 'grabbing';
  timelineContainer.value.style.userSelect = 'none';
  
  startX = event.pageX - timelineContainer.value.offsetLeft;
  scrollLeft = timelineContainer.value.scrollLeft;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (event) => {
  if (!isDragging || !timelineContainer.value) return;
  event.preventDefault();
  
  const x = event.pageX - timelineContainer.value.offsetLeft;
  const walk = (x - startX) * 2;
  timelineContainer.value.scrollLeft = scrollLeft - walk;
};

const stopDrag = () => {
  isDragging = false;
  
  if (timelineContainer.value) {
    timelineContainer.value.style.cursor = 'grab';
    timelineContainer.value.style.userSelect = 'auto';
  }
  
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

// ============================================
// WATCHERS
// ============================================
watch(personsWithCoordinates, () => {
  if (map) {
    addMarkersToMap();
  }
}, { deep: true });

watch(hoveredPerson, (newPerson, oldPerson) => {
  // Limpiar hover anterior
  if (oldPerson && markers.value[oldPerson.id]) {
    const el = markers.value[oldPerson.id].getElement();
    if (el) el.classList.remove('active');
  }
});

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  if (timelineContainer.value) {
    timelineContainer.value.addEventListener('wheel', handleWheel, { passive: false });
  }

  // Inicializar mapa Leaflet
  await nextTick();
  initMap();

  // Pre-cargar coordenadas de todas las ciudades
  const uniqueCities = [...new Set(
    hallOfFamePersons
      .map(p => p.birthplace)
      .filter(Boolean)
  )];
  
  console.log('🌍 Iniciando geocoding para ciudades:', uniqueCities);
  await preloadCities(uniqueCities);
  
  // Agregar marcadores después de cargar coordenadas
  await nextTick();
  addMarkersToMap();
});

onUnmounted(() => {
  if (timelineContainer.value) {
    timelineContainer.value.removeEventListener('wheel', handleWheel);
  }
  
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);

  // Destruir mapa Leaflet
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>

@import 'leaflet/dist/leaflet.css';
/* ============================================
   LAYOUT PRINCIPAL
   ============================================ */

   *,
*::before,
*::after {
  box-sizing: border-box;
}

.hall-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #1a1a1a;
}

/* ============================================
   VISTA PRINCIPAL: MAPA + TIMELINE
   ============================================ */
.main-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

/* Sección del Mapa Mundial */
.world-map-section {
  flex: 1; 
  min-height: 0; 
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.map-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Marcadores en el mapa */
.map-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background: #ffd700;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.map-marker:hover .marker-dot,
.map-marker.active .marker-dot {
  width: 16px;
  height: 16px;
  background: #ff6b6b;
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.5);
}

.map-marker.pulsing .marker-dot {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.7;
  }
}

.marker-label {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: #ffd700;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.marker-label::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(0, 0, 0, 0.9);
}

.world-map {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
  user-select: none;
  -webkit-user-drag: none;
}


.location-text {
  color: #ffd700;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  text-align: center;
}

/* Sección de la Línea de Tiempo */
.timeline-section {
  flex: 1; 
  min-height: 0; 
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  border-top: 2px solid #333;
  box-sizing: border-box;
  overflow: hidden; 
  box-sizing: border-box;
}

.timeline-header {
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.timeline-header h2 {
  color: #ffd700;
  font-size: 28px;
  margin: 0 0 10px 0;
}

.timeline-header p {
  color: #999;
  font-size: 14px;
  margin: 0;
}


/* ========================================
   NOMBRES - MEJORADO PARA RESPONSIVIDAD
   ======================================== */
.person-name {
  color: #fff;
  font-size: clamp(11px, 1.1vw, 14px);
  font-weight: 600;
  text-align: center;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  line-height: 1.3;
  grid-row: 3;
  padding: 0 4px;
  box-sizing: border-box;
  user-select: none;
}

.person-artistic-name {
  color: #ffd700;
  font-size: clamp(10px, 0.9vw, 13px);
  font-style: italic;
  text-align: center;
  width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  line-height: 1.2;
  grid-row: 4;
  padding: 0 4px;
  box-sizing: border-box;
  user-select: none;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background: linear-gradient(to right, #ffd700, transparent);
  z-index: -1;
}

.no-results {
  text-align: center;
  padding: clamp(20px, 4vh, 40px);
  color: #999;
  font-size: clamp(14px, 1.5vw, 18px);
}

/* ============================================
   VISTA DE DETALLE DEL PERSONAJE
   ============================================ */
.person-detail-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #000;
}

.representative-image-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  cursor: pointer;
  image-rendering: pixelated
}

.representative-gif,
.representative-image-static {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-drag: none;
}

.person-info-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20px;
  padding: 30px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.332), transparent);
  backdrop-filter: blur(5px);
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Parte 1: Frase Célebre */
.quote-section {
  align-items: flex-start;
}

.famous-quote {
  color: #000000;
  font-size: 18px;
  font-style: italic;
  line-height: 1.6;
  margin: 0;
  padding: 0 20px;
  border-left: 4px solid #0d1e7e;
}

/* Parte 2: Imagen + Datos Principales */
.main-info-section {
  flex-direction: row;
  gap: 20px;
  align-items: center;
}

.person-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #ffd700;
  flex-shrink: 0;
}

.person-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
}

.person-main-data {
  flex: 1;
}

.person-main-data .person-name {
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.person-main-data .person-artistic-name {
  color: #000000;
  font-size: 18px;
  font-style: italic;
  margin: 0 0 5px 0;
}

.person-location {
  color: #999;
  font-size: 14px;
  margin: 5px 0;
}

/* Parte 3: Descripción Corta */
.description-section {
  align-items: flex-end;
}

.short-description {
  color: #000000;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  text-align: right;
  max-width: 400px;
}

/* Botón de volver */
.back-to-timeline-btn {
  position: absolute;
  bottom: 30px;
  left: 30px;
  background: rgba(255, 215, 0, 0.9);
  color: #000;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.back-to-timeline-btn:hover {
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

/* ============================================
   SIDEBAR
   ============================================ */
.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #000000;
}

.sidebar-link {
  display: block;
  padding: 8px 12px;
  margin-bottom: 5px;
  color: #ccc;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.sidebar-link:hover {
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
}

.sidebar-link.active {
  background: #ffd700;
  color: #000;
  font-weight: bold;
}

.sidebar-text {
  color: #999;
  font-size: 14px;
}

.close-detail-btn {
  width: 100%;
  padding: 10px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.close-detail-btn:hover {
  background: #444;
}
</style>

<style scoped>
.hall-content {
  height: 100%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

/* ============================================
   HEADER
   ============================================ */
.hall-header {
  padding: 30px 20px;
  text-align: center;
  color: white;
}

.hall-header h1 {
  font-size: 32px;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hall-header p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

/* ============================================
   TIMELINE HORIZONTAL
   ============================================ */
.timeline-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.timeline-horizontal-container {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  cursor: grab;
  padding: 2vh 0;
  box-sizing: border-box;
}

.timeline-horizontal-container:active {
  cursor: grabbing;
}

.timeline-horizontal-container::-webkit-scrollbar {
  height: 8px;
}

.timeline-horizontal {
  display: flex;
  align-items: flex-start;
  height: 100%;
  gap: clamp(20px, 3vw, 40px);
  padding: 0 clamp(10px, 2vw, 20px);
  box-sizing: border-box;
}



.timeline-person {
  display: grid;
  grid-template-rows: auto auto auto auto; /* círculo, badge, nombre, nombre artístico */
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: start;
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
  
  /* CRÍTICO: Ajustarse a la altura disponible */
  height: 100%;
  max-height: 100%;
  
  /* Ancho controlado */
  width: clamp(80px, 10vw, 140px);
  min-width: clamp(80px, 10vw, 140px);
  max-width: clamp(80px, 10vw, 140px);
  
  flex-shrink: 0;
  gap: 0.3vh;
  box-sizing: border-box;
  padding: 0.5vh 0;
}



.timeline-person:hover {
  transform: translateY(-8px);
}

.person-circle {
  /* El círculo ahora es proporcional al ancho del timeline-person */
  width: 100%;
  max-width: clamp(60px, 8vw, 100px);
  aspect-ratio: 1 / 1; /* Mantiene proporción circular */
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #ffd700;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 3px 12px rgba(255, 215, 0, 0.3);
  flex-shrink: 0;
  grid-row: 1;
  box-sizing: border-box;
}

.timeline-person:hover .person-circle {
  border-color: #fff;
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.5);
}

.person-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.person-year-badge {
  background: #ffd700;
  color: #000;
  padding: 3px 7px;
  border-radius: 10px;
  font-size: clamp(9px, 0.9vw, 12px);
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  grid-row: 2;
  margin-top: -8px; /* Superpone ligeramente sobre el círculo */
  z-index: 5;
  box-sizing: border-box;
  user-select: none;
}

.person-tag {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 12px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.timeline-line {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
  z-index: 2;
}

/* ============================================
   VISTA DETALLE
   ============================================ */
.person-detail-view {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.back-btn {
  padding: 10px 20px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 2px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  border-radius: 3px;
}

.back-btn:hover {
  background: linear-gradient(180deg, #f0ede0 0%, #e0d8c0 100%);
}

.detail-header h2 {
  flex: 1;
  font-size: 28px;
  color: #333;
  margin: 0;
}

.detail-category {
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

/* ============================================
   CARRUSEL
   ============================================ */
.carousel-section {
  margin-bottom: 30px;
}

.carousel-container {
  position: relative;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel-main {
  position: relative;
  width: 100%;
  height: 400px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  font-size: 12px;
  text-align: center;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 30px;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-btn.prev {
  left: 10px;
}

.carousel-btn.next {
  right: 10px;
}

.carousel-thumbnails {
  display: flex;
  gap: 10px;
  padding: 15px;
  background: #f0f0f0;
  overflow-x: auto;
}

.thumbnail {
  width: 80px;
  height: 60px;
  flex-shrink: 0;
  cursor: pointer;
  border: 3px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s;
}

.thumbnail:hover {
  border-color: #667eea;
}

.thumbnail.active {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.3);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ============================================
   INFO GRID
   ============================================ */
.person-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  font-size: 16px;
  color: #667eea;
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item strong {
  color: #666;
  font-size: 12px;
}

.info-item span {
  color: #333;
  font-size: 12px;
}

.biography {
  grid-column: span 2;
}

.biography p {
  font-size: 13px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 10px;
}

.achievements-list {
  margin: 0;
  padding-left: 20px;
}

.achievements-list li {
  font-size: 12px;
  color: #555;
  margin-bottom: 8px;
  line-height: 1.5;
}

.quote-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.quote-card h3 {
  color: white;
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.famous-quote {
  font-size: 16px;
  font-style: italic;
  line-height: 1.6;
  margin: 0;
  padding-left: 20px;
  border-left: 4px solid rgba(255, 255, 255, 0.5);
}

/* ============================================
   NO RESULTS
   ============================================ */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: white;
  font-size: 18px;
}

/* ============================================
   MEDIA QUERIES POR ALTURA - PARA MONITORES PEQUEÑOS
   ============================================ */

/* Altura menor a 800px */
@media (max-height: 800px) {
  .timeline-section {
    padding: 1vh 1.5vw;
  }
  
  .timeline-header h2 {
    font-size: clamp(16px, 2vw, 22px);
    margin: 0 0 0.5vh 0;
  }
  
  .timeline-header p {
    font-size: clamp(10px, 1vw, 12px);
  }
  
  .timeline-horizontal-container {
    padding: 1vh 0;
  }
  
  .timeline-person {
    width: clamp(70px, 9vw, 120px);
    min-width: clamp(70px, 9vw, 120px);
    max-width: clamp(70px, 9vw, 120px);
    gap: 0.2vh;
    padding: 0.3vh 0;
  }
  
  .person-circle {
    max-width: clamp(55px, 7vw, 85px);
    border: 2px solid #ffd700;
  }
  
  .person-year-badge {
    padding: 2px 5px;
    font-size: clamp(8px, 0.75vw, 10px);
    margin-top: -5px;
  }
  
  .person-name {
    font-size: clamp(9px, 0.95vw, 12px);
    line-height: 1.15;
  }
  
  .person-artistic-name {
    font-size: clamp(8px, 0.8vw, 11px);
    line-height: 1.1;
  }
}

/* Altura menor a 700px */
@media (max-height: 700px) {
  .timeline-section {
    padding: 0.8vh 1.5vw;
  }
  
  .timeline-header {
    margin-bottom: 1vh;
  }
  
  .timeline-header h2 {
    font-size: clamp(14px, 1.8vw, 20px);
    margin: 0 0 0.4vh 0;
  }
  
  .timeline-header p {
    font-size: clamp(9px, 0.9vw, 11px);
  }
  
  .timeline-horizontal-container {
    padding: 0.8vh 0;
  }
  
  .timeline-person {
    width: clamp(65px, 8vw, 110px);
    min-width: clamp(65px, 8vw, 110px);
    max-width: clamp(65px, 8vw, 110px);
    gap: 0.15vh;
    padding: 0.2vh 0;
  }
  
  .person-circle {
    max-width: clamp(50px, 6.5vw, 80px);
    border: 2px solid #ffd700;
  }
  
  .person-year-badge {
    padding: 1px 4px;
    font-size: clamp(7px, 0.7vw, 9px);
    margin-top: -4px;
    border-radius: 6px;
  }
  
  .person-name {
    font-size: clamp(8px, 0.9vw, 11px);
    line-height: 1.1;
  }
  
  .person-artistic-name {
    font-size: clamp(7px, 0.75vw, 10px);
    line-height: 1.05;
  }
}

/* Altura menor a 600px - MUY PEQUEÑO */
@media (max-height: 600px) {
  .timeline-section {
    padding: 0.5vh 1vw;
  }
  
  .timeline-header {
    margin-bottom: 0.8vh;
  }
  
  .timeline-header h2 {
    font-size: clamp(12px, 1.6vw, 18px);
    margin: 0 0 0.3vh 0;
  }
  
  .timeline-header p {
    font-size: clamp(8px, 0.85vw, 10px);
  }
  
  .timeline-horizontal-container {
    padding: 0.6vh 0;
  }
  
  .timeline-horizontal {
    gap: clamp(12px, 1.5vw, 20px);
  }
  
  .timeline-person {
    width: clamp(60px, 7vw, 100px);
    min-width: clamp(60px, 7vw, 100px);
    max-width: clamp(60px, 7vw, 100px);
    gap: 0.1vh;
    padding: 0.15vh 0;
  }
  
  .person-circle {
    max-width: clamp(45px, 6vw, 75px);
    border: 1.5px solid #ffd700;
  }
  
  .person-year-badge {
    padding: 1px 3px;
    font-size: 7px;
    margin-top: -3px;
    border-radius: 5px;
  }
  
  .person-name {
    font-size: clamp(7px, 0.85vw, 10px);
    line-height: 1.05;
  }
  
  .person-artistic-name {
    font-size: clamp(6px, 0.7vw, 9px);
    line-height: 1;
  }
  
  .no-results {
    padding: 2vh;
    font-size: clamp(12px, 1.3vw, 16px);
  }
}

/* Altura menor a 500px - CRÍTICO */
@media (max-height: 500px) {
  .timeline-section {
    padding: 0.4vh 1vw;
  }
  
  .timeline-header {
    margin-bottom: 0.5vh;
  }
  
  .timeline-header h2 {
    font-size: 14px;
    margin: 0;
  }
  
  .timeline-header p {
    font-size: 8px;
  }
  
  .timeline-horizontal-container {
    padding: 0.4vh 0;
  }
  
  .timeline-horizontal {
    gap: 10px;
  }
  
  .timeline-person {
    width: 55px;
    min-width: 55px;
    max-width: 55px;
    gap: 1px;
    padding: 0;
  }
  
  .person-circle {
    max-width: 40px;
    border: 1px solid #ffd700;
  }
  
  .person-year-badge {
    padding: 0px 2px;
    font-size: 6px;
    margin-top: -2px;
  }
  
  .person-name {
    font-size: 7px;
    line-height: 1;
  }
  
  .person-artistic-name {
    font-size: 6px;
    line-height: 1;
  }
}

/* ============================================
   COMBINACIÓN: Altura + Ancho pequeños
   ============================================ */

/* Pantallas pequeñas en ambas dimensiones */
@media (max-height: 700px) and (max-width: 768px) {
  .timeline-person {
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }
  
  .person-circle {
    max-width: 48px;
  }
  
  .timeline-horizontal {
    gap: 15px;
  }
}

/* Móviles en landscape */
@media (max-height: 500px) and (max-width: 900px) {
  .world-map-section {
    height: 30%;
    min-height: 120px;
  }
  
  .timeline-section {
    height: 70%;
    padding: 0.3vh 1vw;
  }
  
  .timeline-header h2 {
    font-size: 12px;
  }
  
  .timeline-header p {
    display: none; /* Ocultar descripción para ahorrar espacio */
  }
  
  .timeline-person {
    width: 50px;
    min-width: 50px;
    max-width: 50px;
  }
  
  .person-circle {
    max-width: 38px;
  }
}

/* ============================================
   SIDEBAR ADDITIONS
   ============================================ */
.close-detail-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(180deg, #ece9d8 0%, #d8d0b8 100%);
  border: 2px solid;
  border-top-color: #ffffff;
  border-left-color: #ffffff;
  border-right-color: #808080;
  border-bottom-color: #808080;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
}

.close-detail-btn:hover {
  background: linear-gradient(180deg, #f0ede0 0%, #e0d8c0 100%);
}

/* ============================================
   SCROLLBAR
   ============================================ */
.timeline-horizontal-container::-webkit-scrollbar,
.person-detail-view::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.timeline-horizontal-container::-webkit-scrollbar-track {
  background: #2a2a2a;
  border-radius: 4px;
}

.timeline-horizontal-container::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}

.timeline-horizontal-container::-webkit-scrollbar-thumb:hover {
  background: #777;
}
</style>

<style scoped>
.hall-content {
  background: linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%);
  min-height: 100%;
}

.hall-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hall-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #0054e3;
}

.hall-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* Línea de tiempo */
.timeline-container {
  position: relative;
  padding-left: 40px;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #0054e3 0%, #00c6ff 100%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
}

.timeline-dot {
  position: absolute;
  left: -33px;
  top: 20px;
  width: 20px;
  height: 20px;
  background: white;
  border: 4px solid #0054e3;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 84, 227, 0.3);
  z-index: 1;
  transition: all 0.3s;
}

.timeline-item.expanded .timeline-dot {
  background: #0054e3;
  transform: scale(1.3);
}

/* Tarjeta del personaje */
.person-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.person-card:hover {
  border-color: #0054e3;
  box-shadow: 0 4px 12px rgba(0, 84, 227, 0.2);
  transform: translateX(5px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.person-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0054e3;
  flex-shrink: 0;
}

.person-info {
  flex: 1;
}

.person-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  color: #333;
}

.person-year {
  margin: 0 0 5px 0;
  font-size: 13px;
  color: #666;
}

.person-category {
  display: inline-block;
  padding: 4px 12px;
  background: #0054e3;
  color: white;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
}

.expand-btn {
  width: 32px;
  height: 32px;
  background: #f0f0f0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
  flex-shrink: 0;
}

.expand-btn.rotated {
  transform: rotate(180deg);
  background: #0054e3;
  color: white;
}

.expand-btn:hover {
  background: #0054e3;
  color: white;
}


/* Contenido expandible */
.expanded-content {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
}

.full-description,
.achievements,
.quote {
  margin-bottom: 20px;
}

.full-description h4,
.achievements h4,
.quote h4 {
  margin: 0 0 10px 0;
  font-size: 15px;
  color: #0054e3;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.full-description p {
  margin: 0 0 10px 0;
  color: #444;
  font-size: 13px;
  line-height: 1.6;
}

.achievements ul {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.achievements li {
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
  color: #444;
  font-size: 13px;
}

.achievements li::before {
  content: '🏆';
  position: absolute;
  left: 0;
}

.quote blockquote {
  margin: 0;
  padding: 15px 20px;
  background: #fffacd;
  border-left: 4px solid #ffd700;
  border-radius: 4px;
  font-style: italic;
  color: #555;
  font-size: 14px;
  line-height: 1.6;
}

/* Transición de expansión */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Sin resultados */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.no-results p {
  font-size: 16px;
}

/* Sidebar */
.sidebar-link {
  display: block;
  padding: 8px 12px;
  color: #0054e3;
  text-decoration: none;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background 0.2s;
  font-size: 12px;
}

.sidebar-link:hover {
  background: rgba(0, 84, 227, 0.1);
}

.sidebar-link.active {
  background: #0054e3;
  color: white;
  font-weight: bold;
}

.sidebar-text {
  font-size: 11px;
  color: #666;
  margin: 0;
  padding: 8px 12px;
}

/* ============================================
   MAPA LEAFLET - ESTILOS CRÍTICOS
   ============================================ */
.world-map-section {
  position: relative;
  width: 100%;
  height: 400px; /* 👈 ALTURA FIJA NECESARIA */
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.leaflet-map-container {
  width: 100%;
  height: 100%; /* 👈 TOMA EL 100% DEL PADRE */
  z-index: 1;
}

/* Estilos para los marcadores personalizados */
:deep(.custom-marker) {
  background: transparent;
  border: none;
}

:deep(.marker-wrapper) {
  position: relative;
  width: 20px;
  height: 20px;
}

:deep(.marker-dot) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #ffd700;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 2;
  transition: all 0.3s ease;
}

:deep(.marker-pulse) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: rgba(255, 215, 0, 0.4);
  border-radius: 50%;
  animation: pulse 2s infinite;
  z-index: 1;
}

:deep(.custom-marker.active .marker-dot) {
  width: 16px;
  height: 16px;
  background: #ff6b35;
  box-shadow: 0 0 20px rgba(255, 107, 53, 0.8);
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

.overlay-content {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.overlay-image {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffd700;
}

.overlay-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.location-text,
.year-text {
  margin: 0.25rem 0 0;
  font-size: 0.85rem;
  color: #666;
}

/* Overlay de información del personaje */
.map-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-width: 320px;
  max-height: 400px;
  overflow-y: auto;
  pointer-events: auto; /* 👈 Cambiado para permitir clicks */
}

/* Overlay múltiple */
.overlay-content-multiple {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ffd700;
}

.person-count {
  background: #ffd700;
  color: #000;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.persons-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.person-item {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.person-item:hover {
  background: rgba(255, 215, 0, 0.3);
  transform: translateX(5px);
}

.person-item-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffd700;
  flex-shrink: 0;
}

.person-item-info {
  flex: 1;
}

.person-item-info h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.person-item-info .year-text {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #666;
}

/* Scrollbar para overlay múltiple */
.map-overlay::-webkit-scrollbar {
  width: 6px;
}

.map-overlay::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.map-overlay::-webkit-scrollbar-thumb {
  background: #ffd700;
  border-radius: 3px;
}
</style>