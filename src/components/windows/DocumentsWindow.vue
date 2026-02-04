<!-- src/components/windows/DocumentsWindow.vue -->
<template>
  <WindowBase
    title="Mis Documentos"
    icon="/ui/iconos/folder.png"
    :show-toolbar="true"
    :show-sidebar="true"
    address-bar-text="Mis Documentos"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Sidebar personalizado -->
    <template #sidebar>
      <!-- Apartado 1: System Tasks -->
      <div class="sidebar-section">
        <div class="sidebar-title">System Tasks</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/views.png" />
            Hide the contents of this drive
          </a>
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            Add or remove programs
          </a>
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/icono-serch.png" />
            Search for files or folders
          </a>
        </div>
      </div>

      <!-- Apartado 2: Other Places -->
      <div class="sidebar-section">
        <div class="sidebar-title">Other Places</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/icono_mipc_notexto.png" />
            My Computer
          </a>
          <a href="#" class="sidebar-link" @click.prevent="openFolder('My Pictures')">
            <img src="/ui/iconos/folder.png" />
            My Pictures
          </a>
          <a href="#" class="sidebar-link" @click.prevent="openFolder('My Music')">
            <img src="/ui/iconos/folder.png" />
            My Music
          </a>
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            My Network Places
          </a>
        </div>
      </div>

      <!-- Apartado 3: File and Folder Tasks -->
      <div class="sidebar-section">
        <div class="sidebar-title">File and Folder Tasks</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            Make a new folder
          </a>
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            Publish this folder to the web
          </a>
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            Share this folder
          </a>
        </div>
      </div>
    </template>

    <!-- Contenido principal -->
    <div class="documents-content">
      <div class="documents-header">
        <img src="/ui/iconos/folder.png" class="folder-icon-large" />
        <div class="folder-info">
          <h2>{{ currentPath }}</h2>
          <p>{{ folderDescription }}</p>
        </div>
      </div>

      <div v-if="loading" class="loading">
        Cargando archivos...
      </div>

      <div v-else class="documents-grid">
        <!-- Botón para volver atrás -->
        <div v-if="pathHistory.length > 0" class="folder-item" @click="goBack">
          <img src="/ui/iconos/folder.png" alt="Back" />
          <span>.. (Atrás)</span>
        </div>

        <!-- Carpetas predefinidas (solo en raíz) -->
        <div 
          v-if="currentPath === 'Mis Documentos'"
          v-for="folder in mainFolders" 
          :key="folder.name"
          class="folder-item"
          @click="openFolder(folder.name)"
        >
          <img src="/ui/iconos/folder.png" :alt="folder.name" />
          <span>{{ folder.name }}</span>
        </div>

        <!-- Subcarpetas del índice -->
        <div 
          v-for="folder in currentFolders" 
          :key="folder.name"
          class="folder-item"
          @click="navigateToSubfolder(folder)"
        >
          <img src="/ui/iconos/folder.png" :alt="folder.name" />
          <span>{{ folder.name }}</span>
        </div>

        <!-- Archivos -->
        <div 
          v-for="file in currentFiles" 
          :key="file.name"
          class="file-item"
          @click="openFile(file)"
        >
          <img :src="getFileIcon(file.name)" :alt="file.name" />
          <span>{{ file.name }}</span>
        </div>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import WindowBase from '../WindowBase.vue';

// Emits: agregamos eventos para abrir diferentes tipos de archivos
const emit = defineEmits([
  'close', 
  'minimize', 
  'maximize', 
  'focus',
  'open-image',      // Para abrir visor de imágenes
  'open-music',      // Para abrir reproductor de música
  'open-video',      // Para abrir reproductor de video
  'open-pdf',        // Para abrir visor de PDF
  'open-document'    // Para abrir editor de documentos
]);

// ============================================
// ESTADO REACTIVO
// ============================================
const currentPath = ref('Mis Documentos');
const currentFolders = ref([]);
const currentFiles = ref([]);
const pathHistory = ref([]);
const fileIndex = ref({});
const loading = ref(true);

// Carpetas principales que aparecen en "Mis Documentos"
const mainFolders = [
  { name: 'My Pictures' },
  { name: 'My Music' },
  { name: 'My Videos' }
];

// Mapeo de carpetas principales a las del índice
const folderMapping = {
  'My Music': 'demo',
  'My Pictures': 'My Pictures',
  'My Videos': 'My Videos'
};

// ============================================
// COMPUTED
// ============================================
const folderDescription = computed(() => {
  if (currentPath.value === 'Mis Documentos') {
    return 'Esta carpeta está configurada para tus archivos personales.';
  } else if (currentPath.value === 'My Music') {
    return 'Almacena tus archivos de música aquí.';
  } else if (currentPath.value === 'My Pictures') {
    return 'Almacena tus imágenes aquí.';
  } else if (currentPath.value === 'My Videos') {
    return 'Almacena tus videos aquí.';
  }
  return `Carpeta: ${currentPath.value}`;
});

// ============================================
// FUNCIONES
// ============================================
const loadFileIndex = async () => {
  try {
    loading.value = true;
    const response = await fetch('/fileIndex.json');
    
    if (!response.ok) {
      console.warn('⚠️ No se pudo cargar fileIndex.json');
      fileIndex.value = {};
      return;
    }
    
    fileIndex.value = await response.json();
    console.log('✅ Índice de archivos cargado:', fileIndex.value);
  } catch (error) {
    console.error('❌ Error cargando índice de archivos:', error);
    fileIndex.value = {};
  } finally {
    loading.value = false;
  }
};

const loadCurrentFolder = (items = null) => {
  if (currentPath.value === 'Mis Documentos') {
    currentFolders.value = [];
    currentFiles.value = [];
    return;
  }
  
  if (items !== null) {
    currentFolders.value = items.filter(item => item.type === 'folder');
    currentFiles.value = items.filter(item => item.type === 'file');
    return;
  }
  
  const indexKey = folderMapping[currentPath.value] || currentPath.value;
  const indexItems = fileIndex.value[indexKey] || [];
  
  currentFolders.value = indexItems.filter(item => item.type === 'folder');
  currentFiles.value = indexItems.filter(item => item.type === 'file');
};

const openFolder = (folderName) => {
  pathHistory.value.push({
    path: currentPath.value,
    items: null
  });
  
  currentPath.value = folderName;
  loadCurrentFolder();
};

const navigateToSubfolder = (folder) => {
  pathHistory.value.push({
    path: currentPath.value,
    items: [...currentFolders.value, ...currentFiles.value]
  });
  
  currentPath.value = folder.name;
  loadCurrentFolder(folder.children || []);
};

const goBack = () => {
  if (pathHistory.value.length > 0) {
    const previous = pathHistory.value.pop();
    currentPath.value = previous.path;
    loadCurrentFolder(previous.items);
  }
};

const openFile = (file) => {
  console.log('Abriendo archivo:', file);
  
  // Música - Emitir evento para abrir en Spotify o reproductor
  if (file.name.match(/\.(mp3|wav|flac|ogg|m4a|aac)$/i)) {
    emit('open-music', {
      name: file.name,
      path: file.path,
      type: 'audio'
    });
  } 
  // Videos - Emitir evento para abrir reproductor de video
  else if (file.name.match(/\.(mp4|avi|mkv|mov|wmv|flv|webm)$/i)) {
    emit('open-video', {
      name: file.name,
      path: file.path,
      type: 'video'
    });
  } 
  // Imágenes - Emitir evento para abrir visor de imágenes
  else if (file.name.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
    emit('open-image', {
      name: file.name,
      path: file.path,
      type: 'image'
    });
  } 
  // PDFs - Emitir evento para abrir visor de PDF
  else if (file.name.endsWith('.pdf')) {
    emit('open-pdf', {
      name: file.name,
      path: file.path,
      type: 'pdf'
    });
  } 
  // Documentos - Emitir evento para abrir editor
  else if (file.name.match(/\.(docx?|txt|rtf|odt)$/i)) {
    emit('open-document', {
      name: file.name,
      path: file.path,
      type: 'document'
    });
  }
  // Archivo desconocido
  else {
    alert(`No hay un programa asociado para abrir archivos de tipo: ${file.extension || 'desconocido'}`);
  }
};

const getFileIcon = (fileName) => {
  // Música (MP3, WAV, FLAC, etc.)
  if (fileName.match(/\.(mp3|wav|flac|ogg|m4a|aac)$/i)) {
    return '/ui/iconos/music-icon.png';
  } 
  // Videos (MP4, AVI, MKV, etc.)
  else if (fileName.match(/\.(mp4|avi|mkv|mov|wmv|flv|webm)$/i)) {
    return '/ui/iconos/video-icon.png';
  } 
  // Imágenes (JPG, PNG, GIF, etc.)
  else if (fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
    return '/ui/iconos/image-icon.png';
  } 
  // PDFs
  else if (fileName.endsWith('.pdf')) {
    return '/ui/iconos/pdf-icon.png';
  } 
  // Documentos de texto (Word, TXT, etc.)
  else if (fileName.match(/\.(docx?|txt|rtf|odt)$/i)) {
    return '/ui/iconos/document-icon.png';
  }
  // Archivo genérico
  return '/ui/iconos/file-icon.png';
};

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  await loadFileIndex();
  loadCurrentFolder();
});
</script>

<style scoped>
.sidebar-section {
  font-size: 10px;
}

.documents-content {
  padding: 15px;
}

/* Header con icono grande */
.documents-header {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px;
  background: linear-gradient(180deg, #f0f8ff 0%, #e6f2ff 100%);
  border: 1px solid #c0d8f0;
  border-radius: 3px;
  margin-bottom: 20px;
}

.folder-icon-large {
  width: 64px;
  height: 64px;
}

.folder-info h2 {
  font-size: 16px;
  color: #003c9d;
  margin: 0 0 5px 0;
}

.folder-info p {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 14px;
}

/* Grid de carpetas y archivos */
.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
  padding: 10px;
}

.folder-item,
.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 3px;
  transition: all 0.2s;
}

.folder-item:hover,
.file-item:hover {
  background: rgba(0, 120, 215, 0.1);
  border: 1px dotted #0078d7;
}

.folder-item img,
.file-item img {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
}

.folder-item span,
.file-item span {
  font-size: 11px;
  text-align: center;
  word-wrap: break-word;
  max-width: 90px;
}

/* Estilos para el sidebar */
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  cursor: pointer;
}

.sidebar-link img {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  image-rendering: pixelated;
}

.sidebar-text {
  font-size: 5px;
  color: #003c9d;
  margin: 0 0 3px 0;
}

.sidebar-text-small {
  font-size: 5px;
  color: #666;
  margin: 0;
}

.documents-grid img,
.documents-content img {
  image-rendering: pixelated;
}
</style>