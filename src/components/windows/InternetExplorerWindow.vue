<!-- src/components/windows/InternetExplorerWindow.vue -->
<template>
  <WindowBase
    :title="currentTitle"
    icon="/ui/iconos/proyectos.png"
    :show-toolbar="true"
    :show-sidebar="false"
    :address-bar-text="currentUrl"
    :initial-width="1100"
    :initial-height="750"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <div class="ie-content">
      <!-- Vista Principal: Lista de Proyectos -->
      <div v-if="!selectedProject" class="projects-home">
        <div class="browser-header">
          <img src="/ui/iconos/proyectos.png" class="browser-logo" />
          <div class="browser-info">
            <h1>Mis Proyectos</h1>
            <p>Click en tiempo real para ver el proyecto en vivo</p>
          </div>
        </div>

        <div class="projects-grid">
          <div 
            v-for="project in projects" 
            :key="project.id"
            class="project-card"
            @click="openProject(project)"
          >
            <!-- 🔥 CARRUSEL DE IMÁGENES -->
            <div class="project-carousel">
              <button 
                class="carousel-btn prev-btn" 
                @click.stop="prevImage(project)"
                v-if="project.images.length > 1"
              >
                ‹
              </button>
              
              <div class="carousel-images">
                <img 
                  :src="project.images[project.currentImageIndex || 0]" 
                  :alt="project.name" 
                />
              </div>
              
              <button 
                class="carousel-btn next-btn" 
                @click.stop="nextImage(project)"
                v-if="project.images.length > 1"
              >
                ›
              </button>

              <!-- Indicadores -->
              <div class="carousel-indicators" v-if="project.images.length > 1">
                <span 
                  v-for="(img, index) in project.images" 
                  :key="index"
                  class="indicator"
                  :class="{ active: index === (project.currentImageIndex || 0) }"
                  @click.stop="setImage(project, index)"
                ></span>
              </div>
            </div>

            <div class="project-info">
              <h3>{{ project.name }}</h3>
              <p class="project-description">{{ project.description }}</p>
              <div class="project-tags">
                <span 
                  v-for="tag in project.tags" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔥 VISTA IFRAME: Proyecto funcionando -->
      <div v-else class="project-iframe-view">
        <!-- LAYOUT: Sidebar izquierda + Iframe -->
        <div class="iframe-layout">
          <!-- SIDEBAR DE CONTROLES (IZQUIERDA) -->
          <div class="iframe-controls">
            <button class="back-button" @click="goBack">
              ← Volver
            </button>
            
            <div class="iframe-info">
              <h2>{{ selectedProject.name }}</h2>
              <span class="iframe-url">{{ selectedProject.liveUrl }}</span>
            </div>

            <div class="iframe-actions">
              <a 
                v-if="selectedProject.githubUrl" 
                :href="selectedProject.githubUrl" 
                target="_blank"
                class="icon-button"
                title="Ver en GitHub"
              >
                <img src="/ui/iconos/github.png" class="iconos"/>
                <span>GitHub</span>
              </a>
              <a 
                v-if="selectedProject.liveUrl" 
                :href="selectedProject.liveUrl" 
                target="_blank"
                class="icon-button"
                title="Abrir en nueva pestaña"
              >
                <img src="/ui/iconos/enlaces.png" class="iconos"/>
                <span>Abrir</span>
              </a>
            </div>
          </div>

          <!-- IFRAME DEL PROYECTO -->
          <!-- Si es Galería Compartida, mostrar vista móvil doble -->
          <div v-if="selectedProject.id === 1" class="mobile-preview-container">
            <div class="phones-wrapper">
              <!-- iPhone 14 Pro -->
              <div class="phone-mockup iphone">
                <div class="phone-notch"></div>
                <div class="phone-screen">
                  <iframe 
                    :src="selectedProject.liveUrl" 
                    :title="selectedProject.name + ' - iPhone'"
                    class="phone-iframe"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
                <div class="phone-label">iPhone 14 Pro</div>
              </div>

              <!-- Samsung Galaxy S23 -->
              <div class="phone-mockup android">
                <div class="phone-camera"></div>
                <div class="phone-screen">
                  <iframe 
                    :src="selectedProject.liveUrl" 
                    :title="selectedProject.name + ' - Android'"
                    class="phone-iframe"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
                <div class="phone-label">Galaxy S23</div>
              </div>
            </div>
          </div>

          <!-- Vista normal para otros proyectos -->
          <div v-else class="iframe-container">
            <iframe 
              :src="selectedProject.liveUrl" 
              :title="selectedProject.name"
              class="project-iframe"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed } from 'vue';
import WindowBase from '../WindowBase.vue';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

const selectedProject = ref(null);

// Lista de proyectos con carrusel de imágenes
const projects = ref([
  {
    id: 1,
    name: 'Galería compartida',
    description: 'Galeria de fotos publica para eventos',
    images: [
      '/ui/imgProyectos/pag-eve-v2-img1.png',
      '/ui/imgProyectos/pag-eve-v2-img2.png',
      '/ui/imgProyectos/pag-eve-v2-img3.png'
    ],
    currentImageIndex: 0,
    tags: ['Astro', 'CSS', 'JS','Cloudinary'],
    liveUrl: 'https://bodaevemario.vercel.app/', 
    githubUrl: 'https://github.com/y0x3/PagEveV2'
  },
  {
    id: 2,
    name: 'ExpressLabs',
    description: 'Proyecto para crear páginas web para donatarias (ONGs)',
    images: [
      'https://picsum.photos/400/250?random=4',
      'https://picsum.photos/400/250?random=5',
      'https://picsum.photos/400/250?random=6',
      'https://picsum.photos/400/250?random=7'
    ],
    currentImageIndex: 0,
    tags: ['React', 'HTML', 'JS','TailwinCss'],
    liveUrl: 'https://express-labs.vercel.app/',
    githubUrl: 'https://github.com/y0x3/ExpressLabs'
  },
  {
    id: 3,
    name: 'Revisión de responsividad',
    description: 'Revisa tu pagina web en diferentes dispositivos',
    images: [
      '/ui/imgProyectos/Respinsivaspag1.png',
      '/ui/imgProyectos/Respinsivaspag2.png'
    ],
    currentImageIndex: 0,
    tags: ['Vue', 'React', 'HTML', 'CSS', 'JS'],
    liveUrl: 'https://paginas-responsivas-revision.vercel.app/',
    githubUrl: 'https://github.com/y0x3/paginas-responsivas-revisi-n-'
  }
]);

// Título dinámico de la ventana
const currentTitle = computed(() => {
  if (selectedProject.value) {
    return `Internet Explorer - ${selectedProject.value.name}`;
  }
  return 'Internet Explorer - Mis Proyectos';
});

// URL dinámica en la barra de direcciones
const currentUrl = computed(() => {
  if (selectedProject.value) {
    return selectedProject.value.liveUrl;
  }
  return 'http://localhost/projects';
});

// 🔥 Funciones del carrusel
const nextImage = (project) => {
  if (!project.currentImageIndex) project.currentImageIndex = 0;
  project.currentImageIndex = (project.currentImageIndex + 1) % project.images.length;
};

const prevImage = (project) => {
  if (!project.currentImageIndex) project.currentImageIndex = 0;
  project.currentImageIndex = 
    project.currentImageIndex === 0 
      ? project.images.length - 1 
      : project.currentImageIndex - 1;
};

const setImage = (project, index) => {
  project.currentImageIndex = index;
};

// Funciones
const openProject = (project) => {
  selectedProject.value = project;
};

const goBack = () => {
  selectedProject.value = null;
};
</script>

<style scoped>
.ie-content {
  height: 100%;
  overflow-y: auto;
  background: #f5f5f5;
}

/* ============================================
   VISTA PRINCIPAL: LISTA DE PROYECTOS
   ============================================ */
.projects-home {
  padding: 20px;
}

.browser-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #000000 ;
  border-radius: 8px;
  margin-bottom: 30px;
  color: white;
}

.browser-logo {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
}

.browser-info h1 {
  font-size: 24px;
  margin: 0 0 5px 0;
}

.browser-info p {
  font-size: 12px;
  margin: 0;
  opacity: 0.9;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.project-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* ============================================
   CARRUSEL DE IMÁGENES
   ============================================ */
.project-carousel {
  position: relative;
  width: 100%;
  height: 200px;
  background: #000;
  overflow: hidden;
}

.carousel-images {
  width: 100%;
  height: 100%;
}

.carousel-images img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
}

.indicator.active {
  background: white;
  width: 24px;
  border-radius: 4px;
}

/* ============================================
   INFO DEL PROYECTO
   ============================================ */
.project-info {
  padding: 15px;
}

.project-info h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px 0;
}

.project-description {
  font-size: 11px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: inline-block;
  padding: 3px 8px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 9px;
  color: #555;
}

/* ============================================
   VISTA IFRAME - NUEVO LAYOUT
   ============================================ */
.project-iframe-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
}

.iframe-layout {
  display: flex;
  height: 100%;
  overflow: hidden;
}

/* ============================================
   SIDEBAR DE CONTROLES (IZQUIERDA)
   ============================================ */
.iframe-controls {
  width: 200px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%);
  border-right: 1px solid #ccc;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

.back-button {
  padding: 8px 12px;
  background: linear-gradient(180deg, #ffffff 0%, #e0e0e0 100%);
  border: 1px solid #999;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
  font-family: 'CoralPixels', sans-serif;
  text-align: center;
}

.back-button:hover {
  background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
}

.back-button:active {
  background: linear-gradient(180deg, #d0d0d0 0%, #e0e0e0 100%);
}

.iframe-info {
  border-bottom: 1px solid #d0d0d0;
  padding-bottom: 12px;
}

.iframe-info h2 {
  font-size: 13px;
  color: #333;
  margin: 0 0 6px 0;
  word-wrap: break-word;
  line-height: 1.3;
}

.iframe-url {
  font-size: 9px;
  color: #666;
  word-break: break-all;
  line-height: 1.3;
  display: block;
}

.iframe-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.iframe-actions img {
  width: 20px;
  height: 20px;
}

.icon-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(180deg, #ffffff 0%, #e8e8e8 100%);
  border: 1px solid #aaa;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'CoralPixels', sans-serif;
}

.icon-button:hover {
  background: linear-gradient(180deg, #ffffff 0%, #f0f0f0 100%);
  transform: translateX(2px);
}

.icon-button span {
  flex: 1;
}

/* ============================================
   CONTENEDOR DEL IFRAME NORMAL
   ============================================ */
.iframe-container {
  flex: 1;
  position: relative;
  background: white;
  overflow: hidden;
}

.project-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

/* ============================================
   VISTA MÓVIL - NUEVO 📱📱
   ============================================ */
.mobile-preview-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  overflow: auto;
  height: 100%;
  box-sizing: border-box;
}


.phones-wrapper {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
}

/* ============================================
   MOCKUP DE TELÉFONOS
   ============================================ */
.phone-mockup {
  position: relative;
  background: #1a1a1a;
  border-radius: 32px;
  padding: 12px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 2px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.phone-mockup:hover {
  transform: translateY(-5px);
}

/* iPhone 14 Pro (más estrecho) */
.phone-mockup.iphone {
  width: 280px;
  height: 580px;
}

/* Samsung Galaxy S23 (un poco más ancho) */
.phone-mockup.android {
  width: 300px;
  height: 600px;
}

/* Notch del iPhone */
.phone-notch {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 28px;
  background: #1a1a1a;
  border-radius: 0 0 20px 20px;
  z-index: 10;
  box-shadow: inset 0 -2px 5px rgba(0, 0, 0, 0.5);
}

/* Cámara del Android */
.phone-camera {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: #0a0a0a;
  border-radius: 50%;
  z-index: 10;
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.1),
    inset 0 2px 4px rgba(0, 0, 0, 0.8);
}

/* Pantalla del teléfono */
.phone-screen {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
}

/* Ocultar scrollbar expandiendo el iframe */
.phone-iframe {
  width: calc(100%);
  height: calc(100%);
  border: none;
  display: block;
  margin-right: -17px;
  margin-bottom: -17px;
}

/* Etiqueta del modelo */
.phone-label {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* ============================================
   🔥 MEDIA QUERIES - CONTROL DE TELÉFONOS
   ============================================ */

/* 🔥 VENTANA PEQUEÑA/NO MAXIMIZADA: Solo mostrar iPhone */
@media (max-width: 1000px) {
  .phone-mockup.android {
    display: none !important; /* Ocultar Android en ventanas pequeñas */
  }

  .phone-mockup.iphone {
    width: 280px;
    height: 580px;
  }

  .phones-wrapper {
    gap: 0;
  }

  .mobile-preview-container {
    padding: 15px;
  }
}

/* 🔥 VENTANA GRANDE/MAXIMIZADA: Mostrar ambos teléfonos */
@media (min-width: 1001px) {
  .phones-wrapper {
    gap: 40px;
  }

  .phone-mockup.iphone {
    width: 280px;
    height: 580px;
    display: block;
  }

  .phone-mockup.android {
    width: 300px;
    height: 600px;
    display: block; /* Mostrar Android en ventanas grandes */
  }
}

/* ============================================
   RESPONSIVE GENERAL
   ============================================ */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .iframe-layout {
    flex-direction: column;
  }

  .iframe-controls {
    width: 100%;
    min-width: unset;
    flex-direction: row;
    flex-wrap: wrap;
    border-right: none;
    border-bottom: 1px solid #ccc;
  }

  .iframe-info {
    flex: 1;
    border-bottom: none;
    padding-bottom: 0;
  }

  .iframe-actions {
    flex-direction: row;
  }

  .phone-mockup.iphone {
    width: 260px;
    height: 540px;
  }
}

/* Para pantallas MUY pequeñas */
@media (max-width: 480px) {
  .phone-mockup.iphone {
    width: 240px;
    height: 500px;
  }

  .mobile-preview-container {
    padding: 10px;
  }
}

.carousel-images img {
  width: 100%;
  height: 100%;
  object-fit: fill; /* Estira la imagen */
  transition: opacity 0.3s;
}
</style>