<!-- src/components/windows/MyComputerWindow.vue -->
<template>
  <WindowBase
    title="My Computer"
    icon="/vite.svg"
    :show-toolbar="true"
    :show-sidebar="true"
    address-bar-text="My Computer"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Sidebar personalizado -->
    <template #sidebar>
      <div class="sidebar-section">
        <div class="sidebar-title">Sobre Mi</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('skills')">
            <img src="/ui/iconos/skills.png" class="iconos"/>
            Skills
          </a>
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('experience')">
            <img src="/ui/iconos/experience.png" class="iconos" />
            Experiencia
          </a>
          <a href="#" class="sidebar-link" @click.prevent="scrollTo('education')">
            <img src="/ui/iconos/education_icon.png" class="iconos" />
            Educacion
          </a>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Contact</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link" @click.prevent="openOutlook">
            <img src="/ui/iconos/icono-gmail.png" />
            Email Me
          </a>
          <a href="#" class="sidebar-link" @click.prevent="openGitHub">
            <img src="/ui/iconos/github.png" />
            GitHub
          </a>
          <a href="#" class="sidebar-link" @click.prevent="openLinkedIn">
            <img src="/ui/iconos/linkedin_icon.png" />
            LinkedIn
          </a>
          <a href="#" class="sidebar-link" @click.prevent="openCV">
            <img src="/ui/iconos/CV.png" />
            CV
          </a>
        </div>
      </div>
    </template>

    <!-- Contenido principal -->
    <div class="about-me-content">
      <!-- ... resto de tu contenido sin cambios ... -->
      <!-- Sección de presentación -->
      <div class="profile-header">
        <img src="/ui/desktop/yo.jpg" class="profile-photo" />
        <div class="profile-info">
          <h1 class="profile-name">Diego Contreras Muñoz</h1>
          <p class="profile-title">Frontend Developer</p>
          <p class="profile-location">Mexico, Pacucha hidalgo</p>
        </div>
      </div>

      <!-- Sobre mí -->
      <section class="content-section">
        <div class="section-header">
          <img src="/ui/iconos/sobre-mi.png" class="section-icon" />
          <h2>Sobre Mi</h2>
        </div>
        <p class="section-text">
          Soy desarrollador web y me gusta mucho trabajar la lógica detrás de las aplicaciones y el desarrollo
          backend. Siempre estoy aprendiendo nuevas tecnologías para mejorar la funcionalidad, el rendimiento y
          las animaciones, y disfruto automatizar procesos para hacer todo más eficiente.
        </p>
      </section>

      <!-- Skills -->
      <section id="skills" class="content-section">
        <div class="section-header">
          <img src="/ui/iconos/skills.png" class="section-icon" />
          <h2>Skills</h2>
        </div>
        <div class="skills-grid">
          <div class="skill-item">
            <img src="/ui/iconos/code/vue_icon.png" />
            <span>Vue.js</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/react_icon.png" />
            <span>React</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/node_icon.png" />
            <span>Node.js</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/css3_icon.png" />
            <span>CSS3</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/js_icon.png" />
            <span>JavaScript</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/git_icon.png" />
            <span>Git</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/html5_icon.png" />
            <span>HTML</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/Python_icon.png" />
            <span>Python</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/c_icon.png" />
            <span>C++</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/c_sharp_icon.png" />
            <span>C#</span>
          </div>
          <div class="skill-item">
            <img src="/ui/iconos/code/astro_logo_icon.png" />
            <span>Astro</span>
          </div>
        </div>
      </section>

      <!-- Experience -->
      <section id="experience" class="content-section">
        <div class="section-header">
          <img src="/ui/iconos/experience.png" class="section-icon" />
          <h2>Experiencia</h2>
        </div>
        
        <div class="experience-item">
          <div class="experience-header">
            <h3>Desarrollo FrontEnd </h3>
            <span class="experience-date">enero 2024 -  mayo 2024</span>
          </div>
          <p class="experience-company">Gobierno estatal Pachuca (TI)</p>
          <ul class="experience-description">
            <li>Upgrade de lenguaje del programa SIFAP de visual Basic a c#/cs</li>
            <li>Lanzar a producción del sistema de este upgrade</li>
            <li>Principales tecnologías utilizadas: Visual Basic, C#</li>
          </ul>
        </div>

        <div class="experience-item">
          <div class="experience-header">
            <h3>Desarrollo FrontEnd</h3>
            <span class="experience-date">julio 2024 - diciembre 2024, remoto</span>
          </div>
          <p class="experience-company">OSC COMPLIANCE MEXICO AC</p>
          <ul class="experience-description">
            <li>creación de un sitio web de E-learning para donatarias paradiferentes asociaciones</li>
            <li>Principales tecnologías: Java script, HTML, JS, Vanilla, CSS, WordPress, elementor</li>
            <li>Realiza el testeo con Sonar y Creación de servidor personal: Linux Ubuntu Server</li>
          </ul>
        </div>

        <div class="experience-item">
          <div class="experience-header">
            <h3>Desarrollo FrontEnd</h3>
            <span class="experience-date">abril 2025 – abril 2025, remoto</span>
          </div>
          <p class="experience-company">Freelance</p>
          <ul class="experience-description">
            <li>Proyecto personal de creación de diferentes galerías para eventos sociales</li>
          </ul>
        </div>

        <div class="experience-item">
          <div class="experience-header">
            <h3>Data Entry</h3>
            <span class="experience-date">abril 2025 – junio 2025, remoto</span>
          </div>
          <p class="experience-company">Freelance</p>
          <ul class="experience-description">
            <li>Ingreso y actualización de información de productos (nombre, descripción, precio, etc.) en el sistema interno de la tienda.</li>
          </ul>
        </div>

        <div class="experience-item">
          <div class="experience-header">
            <h3>Data Entry/ Desarollador - Freelance</h3>
            <span class="experience-date">agosto 2025 – octubre 2025, remoto</span>
          </div>
          <p class="experience-company">Multiplica</p>
          <ul class="experience-description">
            <li>Migración de contenido web y desarrollo de páginas con Magnolia CMS, HTML e iFrames.</li>
            <li>Revisión UI, comunicación con el cliente y coordinación con el equipo de diseño para resolver issues y garantizar la calidad visual.</li>
          </ul>
        </div>
      </section>

      <!-- Education -->
      <section id="education" class="content-section">
        <div class="section-header">
          <img src="/ui/iconos/education_icon.png" class="section-icon" />
          <h2>Educacio</h2>
        </div>
        
        <div class="education-item">
          <h3>Ingenieria en software </h3>
          <p class="education-school">Universidad Politecnica de Pachuca</p>
          <p class="education-date">2020 - 2024</p>
        </div>
      </section>
    </div>
  </WindowBase>
</template>

<script setup>
import WindowBase from '../WindowBase.vue';
import { inject } from 'vue';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// Inyectar el windowManager
const windowManager = inject('windowManager');

const scrollTo = (sectionId) => {
  const element = document.getElementById(sectionId);
  element?.scrollIntoView({ behavior: 'smooth' });
};

const openOutlook = () => {
  console.log('Abriendo Outlook...', windowManager);
  if (windowManager) {
    windowManager.openWindow('outlook');
  } else {
    console.error('windowManager no está disponible');
  }
};

const openGitHub = () => {
  console.log('Abriendo GitHub...', windowManager);
  if (windowManager) {
    windowManager.openWindow('github');
  } else {
    console.error('windowManager no está disponible');
  }
};

const openLinkedIn = () => {
  console.log('Abriendo LinkedIn…');
  window.open(
    'https://www.linkedin.com/in/diegocontrerasmunoz/',
    '_blank',
    'noopener,noreferrer'
  );
};

function openCV(url, fileName = "CvDiegoContrerasMuñoz.pdf") {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al descargar el PDF");
      }
      return response.blob();
    })
    .then(blob => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    })
    .catch(error => {
      console.error("openCV error:", error);
    });
}


</script>


<style scoped>

/* Perfil Header */
.profile-header {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(180deg, #f0f8ff 0%, #e6f2ff 100%);
  border: 1px solid #c0d8f0;
  border-radius: 3px;
  margin-bottom: 20px;
}

.profile-photo {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #0054e3;
  object-fit: contain;
  padding: 10px;
  background: white;
}

.profile-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.profile-name {
  font-size: 24px;
  color: #003c9d;
  margin: 0 0 5px 0;
}

.profile-title {
  font-size: 16px;
  color: #0054e3;
  margin: 0 0 10px 0;
}

.profile-location {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* Secciones de contenido */
.content-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
}
.content-section img{
  image-rendering: pixelated;
}
.content-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.section-icon {
  width: 24px;
  height: 24px;
}

.section-header h2 {
  font-size: 16px;
  color: #003c9d;
  margin: 0;
}

.section-text {
  font-size: 12px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

/* Skills Grid */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 3px;
  transition: all 0.2s;
}

.skill-item:hover {
  background: #e6f2ff;
  border-color: #0054e3;
  transform: translateY(-2px);
}

.skill-item img {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.skill-item span {
  font-size: 11px;
  color: #333;
  text-align: center;
}

/* Experience */
.experience-item {
  margin-bottom: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-left: 3px solid #0054e3;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.experience-header h3 {
  font-size: 14px;
  color: #003c9d;
  margin: 0;
}

.experience-date {
  font-size: 11px;
  color: #666;
}

.experience-company {
  font-size: 12px;
  color: #0054e3;
  margin: 0 0 10px 0;
}

.experience-description {
  margin: 0;
  padding-left: 20px;
  font-size: 11px;
  line-height: 1.6;
  color: #333;
}

.experience-description li {
  margin-bottom: 5px;
}

/* Education */
.education-item {
  padding: 15px;
  background: #f9f9f9;
  border-left: 3px solid #0054e3;
}

.education-item h3 {
  font-size: 14px;
  color: #003c9d;
  margin: 0 0 5px 0;
}

.education-school {
  font-size: 12px;
  color: #0054e3;
  margin: 0 0 5px 0;
}

.education-date {
  font-size: 11px;
  color: #666;
  margin: 0;
}

/* 👇 AGREGAR/MODIFICAR ESTE CSS */
.sidebar-link {
  display: flex; /* Cambia de block a flex */
  align-items: center;
  gap: 8px; /* Espacio entre icono y texto */
  padding: 6px 12px;
  color: #0054e3;
  text-decoration: none;
  font-size: 12px;
  transition: background 0.2s;
  border-radius: 2px;
}

.sidebar-link:hover {
  background: #e6f2ff;
}

.sidebar-link img {
  width: 16px;
  height: 16px;
  flex-shrink: 0; /* Evita que el icono se comprima */
}

.iconos img{
  image-rendering: pixelated;
  height: 100%;
}
</style>