<!-- src/components/VSCodeWindow.vue -->
<template>
  <WindowBase
    :title="'Visual Studio Code - ' + currentFile"
    icon="/ui/iconos/visualcodeicono.png"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :is-maximized="isMaximized"
    :is-active="isActive"
    :is-minimized="isMinimized"
    :z-index="zIndex"
    :show-toolbar="false"
    :show-sidebar="false"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <div class="vscode-container">
        <!-- SIDEBAR: Explorador de archivos -->
        <div class="vscode-sidebar">
          <div class="sidebar-header">
            <span>EXPLORER</span>
          </div>
          
          <div class="file-tree">
            <div class="tree-header">
              <span class="folder-name">WORKSPACE</span>
              <div class="tree-actions">
                <button @click="createNewFile" title="New File" class="tree-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M9.5 1.1l3.4 3.5.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7l.3.1zM9 2v3h2.9L9 2zm4 14h-1v-3H9v-1h3V9h1v3h3v1h-3v3z"/>
                  </svg>
                </button>
                <button @click="createNewFolder" title="New Folder" class="tree-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5h13l.5-.5v-10L14.5 2zm-.51 8.49V13h-12V7h4.49l.35-.35.86-.86H14v4.7z"/>
                    <path fill="currentColor" d="M11.5 10v-1.5H10V8h1.5V6.5H12V8h1.5v.5H12V10h-.5z"/>
                  </svg>
                </button>
                <button @click="refreshFileTree" title="Refresh" class="tree-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M13.451 5.609l-.579-.939-1.068.812-.076.094c-.335.415-.927 1.341-1.124 2.876l-.021.165.033.163.071.345c0 .193-.032.377-.096.55l-.008.025-.005.024a.993.993 0 01-.168.298l-.021.028-.028.021a1 1 0 01-.565.267l-.024.004-.024-.001a1.02 1.02 0 01-.639-.218l-.02-.022-.015-.024a.993.993 0 01-.171-.296l-.005-.024-.008-.025a2.003 2.003 0 01-.096-.55l.033-.163-.02-.165c-.197-1.535-.789-2.461-1.124-2.876l-.076-.094-1.068-.812-.579.939c.26.157.547.38.801.64l.015.018.01.01c.133.14.293.338.401.65l.01.032c.002.006.003.012.005.018a.748.748 0 01.047.274l-.001.014v.008l-.001.019v.007l.001.007v.009l.001.016a.73.73 0 01-.047.283c-.002.007-.003.013-.005.019l-.01.032c-.108.312-.268.51-.401.65l-.01.01-.015.018c-.254.26-.541.483-.801.64l.579.939 1.068-.812.076-.094c.335-.415.927-1.341 1.124-2.876l.021-.165-.033-.163-.071-.345a2 2 0 01.096-.55l.008-.025.005-.024a.993.993 0 01.168-.298l.021-.028.028-.021a1 1 0 01.565-.267l.024-.004.024.001a1.02 1.02 0 01.639.218l.02.022.015.024c.112.176.164.305.171.296l.005.024.008.025c.064.173.096.357.096.55l-.033.163.02.165c.197 1.535.789 2.461 1.124 2.876l.076.094 1.068.812.579-.939c-.26-.157-.547-.38-.801-.64l-.015-.018-.01-.01a2.06 2.06 0 01-.401-.65l-.01-.032a.739.739 0 01-.047-.283l.001-.016v-.007-.009l.001-.007v-.019l.001-.008a.748.748 0 01.047-.274c.002-.006.003-.012.005-.018l.01-.032c.108-.312.268-.51.401-.65l.01-.01.015-.018c.254-.26.541-.483.801-.64z"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <!-- Árbol de archivos recursivo -->
            <div class="tree-items">
              <FileTreeItem
                v-for="item in fileSystem"
                :key="item.id"
                :item="item"
                :level="0"
                @select="selectFile"
                @rename="renameItem"
                @delete="deleteItem"
                @confirm-rename="confirmRename"
                @cancel-rename="cancelRename"
              />
            </div>
          </div>
        </div>

        <!-- MODAL CREAR ARCHIVO/CARPETA -->
        <div v-if="showCreateModal" class="modal-overlay" @click="cancelCreate">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>{{ createModalType === 'file' ? 'New File' : 'New Folder' }}</h3>
            </div>
            <div class="modal-body">
              <label>Name:</label>
              <input 
                v-model="newItemName" 
                type="text" 
                class="modal-input"
                @keyup.enter="confirmCreate"
                @keyup.esc="cancelCreate"
                ref="modalInput"
              />
            </div>
            <div class="modal-footer">
              <button @click="cancelCreate" class="modal-btn cancel">Cancel</button>
              <button @click="confirmCreate" class="modal-btn confirm">Create</button>
            </div>
          </div>
        </div>

        <!-- MAIN AREA: Editor + Output -->
        <div class="vscode-main">
          <!-- Tab Bar -->
          <div class="tab-bar">
            <div class="tab-list">
              <div 
                v-for="tab in openTabs" 
                :key="tab.id"
                class="tab"
                :class="{ active: tab.id === activeTabId }"
                @click="switchTab(tab.id)"
              >
                <span class="tab-icon">{{ getFileIcon(tab.name) }}</span>
                <span class="tab-name">{{ tab.name }}</span>
                <button class="tab-close" @click.stop="closeTab(tab.id)">×</button>
              </div>
            </div>
            
            <div class="tab-actions">
              <button @click="runCode" class="run-btn" title="Run Code (Ctrl+Enter)">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.5 3l8 5-8 5V3z"/>
                </svg>
                Run
              </button>
            </div>
          </div>

          <!-- Editor Area -->
          <div class="editor-area" style="flex: 1;">
            <div v-if="activeTab" class="editor-container">
              <div class="editor-header">
                <span class="file-path">{{ getFilePath(activeTab.id) }}</span>
              </div>
              
              <div class="code-editor">
                <div class="line-numbers">
                  <div 
                    v-for="n in lineCount" 
                    :key="n" 
                    class="line-number"
                  >
                    {{ n }}
                  </div>
                </div>
                <textarea
                  v-model="activeTab.content"
                  class="code-textarea"
                  spellcheck="false"
                  @input="updateLineCount"
                  @keydown.tab.prevent="handleTab"
                ></textarea>
              </div>
            </div>
            
            <div v-else class="empty-editor">
              <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M9.5 1.1l3.4 3.5.1.4v9l-.5.5h-11l-.5-.5v-12l.5-.5h7.7l.3.1zM9 2v3h3l-3-3zM3 13h10V6H8.5L8 5.5V2H3v11z"/>
                </svg>
                <p>No file selected</p>
                <p class="hint">Select a file from the explorer or create a new one</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  </WindowBase>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import WindowBase from '../WindowBase.vue';
import FileTreeItem from './FileTreeItem.vue';

// Props
const props = defineProps({
  x: { type: Number, default: 150 },
  y: { type: Number, default: 80 },
  width: { type: Number, default: 1000 },
  height: { type: Number, default: 700 },
  isMaximized: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  isMinimized: { type: Boolean, default: false },
  zIndex: { type: Number, default: 1 }
});

// Emits
const emit = defineEmits(['close', 'minimize', 'maximize', 'focus', 'run-code']);

// Estado del sistema de archivos
const fileSystem = ref([
  {
    id: 1,
    name: 'src',
    type: 'folder',
    expanded: true,
    isEditing: false,
    children: [
      {
        id: 2,
        name: 'index.html',
        type: 'file',
        isEditing: false,
        content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>My App</title>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div class="container">\n    <h1>Hello World!</h1>\n    <p>Welcome to my app!</p>\n  </div>\n  <script src="app.js"><\/script>\n</body>\n</html>'
      },
      {
        id: 3,
        name: 'app.js',
        type: 'file',
        isEditing: false,
        content: 'console.log("Hello from app.js!");\n\n// Tu código aquí\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n\n// Crear elementos dinámicos\nconst container = document.querySelector(\'.container\');\nif (container) {\n  const newP = document.createElement(\'p\');\n  newP.textContent = \'This was added by JavaScript!\';\n  newP.style.color = \'blue\';\n  container.appendChild(newP);\n}'
      },
      {
        id: 4,
        name: 'styles.css',
        type: 'file',
        isEditing: false,
        content: 'body {\n  margin: 0;\n  padding: 20px;\n  font-family: Arial, sans-serif;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  background: white;\n  padding: 40px;\n  border-radius: 10px;\n  box-shadow: 0 10px 40px rgba(0,0,0,0.2);\n}\n\nh1 {\n  color: #333;\n  margin-bottom: 20px;\n}\n\np {\n  color: #666;\n  line-height: 1.6;\n}'
      }
    ]
  }
]);

// Contador de IDs
let nextId = 5;

// Tabs abiertas
const openTabs = ref([]);
const activeTabId = ref(null);

// Estado de ejecución
const isRunning = ref(false);

// Computed
const activeTab = computed(() => {
  return openTabs.value.find(tab => tab.id === activeTabId.value);
});

const currentFile = computed(() => {
  return activeTab.value ? activeTab.value.name : 'No file open';
});

const lineCount = ref(20);

// Funciones del sistema de archivos
// Modal para crear archivos/carpetas
const showCreateModal = ref(false);
const createModalType = ref('file'); // 'file' o 'folder'
const newItemName = ref('');
const modalInput = ref(null);

// Watch para enfocar el input cuando se abre el modal
watch(showCreateModal, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (modalInput.value) {
        modalInput.value.focus();
        modalInput.value.select();
      }
    });
  }
});

function createNewFile() {
  createModalType.value = 'file';
  newItemName.value = 'newfile.js';
  showCreateModal.value = true;
}

function createNewFolder() {
  createModalType.value = 'folder';
  newItemName.value = 'new-folder';
  showCreateModal.value = true;
}

function confirmCreate() {
  if (!newItemName.value) return;
  
  if (createModalType.value === 'file') {
    const newFile = {
      id: nextId++,
      name: newItemName.value,
      type: 'file',
      content: '',
      isEditing: false
    };
    fileSystem.value.push(newFile);
  } else {
    const newFolder = {
      id: nextId++,
      name: newItemName.value,
      type: 'folder',
      expanded: false,
      children: [],
      isEditing: false
    };
    fileSystem.value.push(newFolder);
  }
  
  showCreateModal.value = false;
  newItemName.value = '';
}

function cancelCreate() {
  showCreateModal.value = false;
  newItemName.value = '';
}

function refreshFileTree() {
  // Aquí podrías implementar lógica de refresh si fuera necesario
  console.log('Refreshing file tree...');
}

function findItemById(items, id) {
  for (let item of items) {
    if (item.id === id) return item;
    if (item.type === 'folder' && item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getAllFiles(items) {
  let files = {};
  for (let item of items) {
    if (item.type === 'file') {
      files[item.name] = item.content;
    }
    if (item.type === 'folder' && item.children) {
      Object.assign(files, getAllFiles(item.children));
    }
  }
  return files;
}

function selectFile(fileId) {
  const file = findItemById(fileSystem.value, fileId);
  if (!file || file.type !== 'file') return;
  
  // Verificar si ya está abierta
  const existingTab = openTabs.value.find(tab => tab.id === fileId);
  if (existingTab) {
    activeTabId.value = fileId;
    return;
  }
  
  // Abrir nueva tab
  openTabs.value.push({
    id: file.id,
    name: file.name,
    content: file.content || ''
  });
  
  activeTabId.value = file.id;
  updateLineCount();
}

function renameItem(itemId) {
  const item = findItemById(fileSystem.value, itemId);
  if (!item) return;
  
  // Marcar el item como "en edición"
  item.isEditing = true;
}

function confirmRename(itemId, newName) {
  const item = findItemById(fileSystem.value, itemId);
  if (!item) return;
  
  if (newName && newName !== item.name) {
    item.name = newName;
    
    // Actualizar tab si está abierta
    const tab = openTabs.value.find(t => t.id === itemId);
    if (tab) {
      tab.name = newName;
    }
  }
  
  item.isEditing = false;
}

function cancelRename(itemId) {
  const item = findItemById(fileSystem.value, itemId);
  if (item) {
    item.isEditing = false;
  }
}

function deleteItem(itemId) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  
  function removeFromArray(items, id) {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      return true;
    }
    
    for (let item of items) {
      if (item.type === 'folder' && item.children) {
        if (removeFromArray(item.children, id)) return true;
      }
    }
    return false;
  }
  
  removeFromArray(fileSystem.value, itemId);
  
  // Cerrar tab si está abierta
  closeTab(itemId);
}

function switchTab(tabId) {
  activeTabId.value = tabId;
  updateLineCount();
}

function closeTab(tabId) {
  const index = openTabs.value.findIndex(tab => tab.id === tabId);
  if (index === -1) return;
  
  // Guardar contenido antes de cerrar
  const tab = openTabs.value[index];
  const file = findItemById(fileSystem.value, tabId);
  if (file) {
    file.content = tab.content;
  }
  
  openTabs.value.splice(index, 1);
  
  // Si era la tab activa, activar otra
  if (activeTabId.value === tabId) {
    activeTabId.value = openTabs.value.length > 0 
      ? openTabs.value[openTabs.value.length - 1].id 
      : null;
  }
}

function getFileIcon(fileName) {
  const ext = fileName.split('.').pop();
  const icons = {
    'html': '🌐',
    'css': '🎨',
    'js': '📜',
    'json': '📋',
    'md': '📝',
    'txt': '📄',
    'vue': '💚',
    'py': '🐍',
    'jsx': '⚛️',
    'ts': '💠'
  };
  return icons[ext] || '📄';
}

function getFilePath(fileId) {
  // Simplificado - podrías implementar path completo
  const file = findItemById(fileSystem.value, fileId);
  return file ? `/${file.name}` : '';
}

function updateLineCount() {
  if (activeTab.value) {
    const lines = activeTab.value.content.split('\n').length;
    lineCount.value = Math.max(lines, 20);
  }
}

function handleTab(e) {
  const textarea = e.target;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  
  // Insertar tab (2 espacios)
  activeTab.value.content = 
    activeTab.value.content.substring(0, start) +
    '  ' +
    activeTab.value.content.substring(end);
  
  // Mover cursor
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2;
  }, 0);
}

async function runCode() {
  if (!activeTab.value) {
    alert('No file selected');
    return;
  }
  
  isRunning.value = true;
  
  // Simular delay de compilación
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const fileName = activeTab.value.name;
    const code = activeTab.value.content;
    const allFiles = getAllFiles(fileSystem.value);
    
    let htmlContent = '';
    
    if (fileName.endsWith('.js')) {
      // Ejecutar JavaScript en el iframe con HTML wrapper
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>JavaScript Output</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background: #f5f5f5;
    }
    #output {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: 'Consolas', 'Courier New', monospace;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div id="output"></div>
  <script>
    (function() {
      const outputDiv = document.getElementById('output');
      
      // Interceptar console.log
      const originalLog = console.log;
      console.log = function(...args) {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        outputDiv.innerHTML += message + '\\n';
        window.parent.postMessage({ 
          type: 'log', 
          message: message 
        }, '*');
        originalLog.apply(console, args);
      };
      
      // Interceptar console.error
      const originalError = console.error;
      console.error = function(...args) {
        const message = args.join(' ');
        outputDiv.innerHTML += '<span style="color: #d93025;">ERROR: ' + message + '</span>\\n';
        window.parent.postMessage({ 
          type: 'error', 
          message: message 
        }, '*');
        originalError.apply(console, args);
      };
      
      // Interceptar console.warn
      const originalWarn = console.warn;
      console.warn = function(...args) {
        const message = args.join(' ');
        outputDiv.innerHTML += '<span style="color: #f29900;">WARN: ' + message + '</span>\\n';
        window.parent.postMessage({ 
          type: 'warn', 
          message: message 
        }, '*');
        originalWarn.apply(console, args);
      };
      
      // Capturar errores runtime
      window.onerror = function(msg, url, line, col, error) {
        const errorMsg = msg + (line ? ' (line ' + line + ')' : '');
        outputDiv.innerHTML += '<span style="color: #d93025;">ERROR: ' + errorMsg + '</span>\\n';
        window.parent.postMessage({ 
          type: 'error', 
          message: errorMsg 
        }, '*');
        return true;
      };
      
      // Ejecutar el código del usuario
      try {
        ${code}
      } catch (error) {
        console.error(error.message);
      }
    })();
  <\/script>
</body>
</html>`;
      
    } else if (fileName.endsWith('.html')) {
      // Para HTML, buscar referencias a CSS y JS e inyectarlos
      htmlContent = code;
      
      // Buscar e inyectar CSS
      if (allFiles['styles.css']) {
        const cssContent = allFiles['styles.css'];
        const linkRegex = new RegExp('<link[^>]+href=["' + "'" + ']styles\\.css["' + "'" + '][^>]*>', 'gi');
        htmlContent = htmlContent.replace(
          linkRegex,
          `<style>${cssContent}</style>`
        );
      }
      
      // Buscar e inyectar JS
      if (allFiles['app.js']) {
        const jsContent = allFiles['app.js'];
        
        // Envolver el JS con interceptores de console
        const wrappedJS = `
          (function() {
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            
            console.log = function(...args) {
              const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ');
              window.parent.postMessage({ type: 'log', message: message }, '*');
              originalLog.apply(console, args);
            };
            
            console.error = function(...args) {
              const message = args.join(' ');
              window.parent.postMessage({ type: 'error', message: message }, '*');
              originalError.apply(console, args);
            };
            
            console.warn = function(...args) {
              const message = args.join(' ');
              window.parent.postMessage({ type: 'warn', message: message }, '*');
              originalWarn.apply(console, args);
            };
            
            window.onerror = function(msg, url, line) {
              const errorMsg = msg + (line ? ' (line ' + line + ')' : '');
              window.parent.postMessage({ type: 'error', message: errorMsg }, '*');
              return true;
            };
            
            try {
              ${jsContent}
            } catch(e) {
              console.error(e.message);
            }
          })();
        `;
        
        const scriptRegex = new RegExp('<script[^>]+src=["' + "'" + ']app\\.js["' + "'" + '][^>]*><\/script>', 'gi');
        htmlContent = htmlContent.replace(
          scriptRegex,
          `<script>${wrappedJS}<\/script>`
        );
      }
      
    } else if (fileName.endsWith('.css')) {
      // Mostrar CSS con ejemplo de aplicación
      htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CSS Preview</title>
  <style>
    ${code}
  </style>
</head>
<body>
  <div style="padding: 20px;">
    <h1>CSS Preview</h1>
    <p>Your styles are applied to this page.</p>
    <button>Button</button>
    <div class="container">
      <div class="box">Box 1</div>
      <div class="box">Box 2</div>
    </div>
  </div>
</body>
</html>`;
      
    } else {
      alert(`File type .${fileName.split('.').pop()} is not executable`);
      isRunning.value = false;
      return;
    }
    
    // Emitir evento para abrir nueva ventana de navegador con el contenido
    emit('run-code', {
      content: htmlContent,
      fileName: fileName,
      fileType: fileName.split('.').pop()
    });
    
  } catch (error) {
    alert(`Execution error: ${error.message}`);
  } finally {
    isRunning.value = false;
  }
}

// Watch para sincronizar cambios en tabs con el file system
watch(() => activeTab.value?.content, () => {
  if (activeTab.value) {
    const file = findItemById(fileSystem.value, activeTab.value.id);
    if (file) {
      file.content = activeTab.value.content;
    }
  }
});
</script>

<style scoped>
.vscode-container {
  display: flex;
  height: 100%;
  background: #1e1e1e;
  color: #cccccc;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 13px;
}

/* ===== SIDEBAR ===== */
.vscode-sidebar {
  width: 250px;
  background: #252526;
  border-right: 1px solid #3e3e42;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 8px 12px;
  background: #252526;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #cccccc;
  text-transform: uppercase;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  background: #37373d;
  font-size: 11px;
  font-weight: 600;
}

.folder-name {
  color: #cccccc;
}

.tree-actions {
  display: flex;
  gap: 4px;
}

.tree-btn {
  background: transparent;
  border: none;
  color: #cccccc;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

.tree-btn:hover {
  background: #2a2d2e;
}

.tree-items {
  padding: 4px 0;
}

/* ===== MAIN AREA ===== */
.vscode-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2d2d2d;
  border-bottom: 1px solid #3e3e42;
  overflow-x: auto;
}

.tab-list {
  display: flex;
  flex: 1;
  overflow-x: auto;
}

.tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #2d2d2d;
  border-right: 1px solid #3e3e42;
  cursor: pointer;
  min-width: 120px;
  max-width: 200px;
}

.tab:hover {
  background: #323233;
}

.tab.active {
  background: #1e1e1e;
}

.tab-icon {
  font-size: 14px;
}

.tab-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}

.tab-close {
  background: transparent;
  border: none;
  color: #858585;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0 4px;
  border-radius: 3px;
}

.tab-close:hover {
  background: #5a5a5a;
  color: #ffffff;
}

.tab-actions {
  display: flex;
  padding: 0 8px;
  border-left: 1px solid #3e3e42;
}

.run-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: #0e639c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background 0.2s;
}

.run-btn:hover {
  background: #1177bb;
}

.run-btn svg {
  width: 14px;
  height: 14px;
}

/* ===== EDITOR ===== */
.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  padding: 8px 12px;
  background: #1e1e1e;
  border-bottom: 1px solid #3e3e42;
  font-size: 11px;
  color: #858585;
}

.code-editor {
  flex: 1;
  display: flex;
  overflow: auto;
  background: #1e1e1e;
}

.line-numbers {
  background: #1e1e1e;
  color: #858585;
  padding: 12px 8px;
  text-align: right;
  user-select: none;
  min-width: 50px;
  border-right: 1px solid #3e3e42;
}

.line-number {
  line-height: 1.6;
  font-size: 12px;
}

.code-textarea {
  flex: 1;
  background: #1e1e1e;
  color: #d4d4d4;
  border: none;
  outline: none;
  padding: 12px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: none;
  tab-size: 2;
}

.empty-editor {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1e1e1e;
}

.empty-state {
  text-align: center;
  color: #858585;
}

.empty-state svg {
  opacity: 0.3;
  margin-bottom: 16px;
}

.empty-state p {
  margin: 8px 0;
}

.empty-state .hint {
  font-size: 11px;
  color: #6e6e6e;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
}

.modal-content {
  background: #252526;
  border: 1px solid #454545;
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  width: 400px;
  max-width: 90%;
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid #3e3e42;
}

.modal-header h3 {
  margin: 0;
  color: #cccccc;
  font-size: 14px;
  font-weight: 600;
}

.modal-body {
  padding: 20px;
}

.modal-body label {
  display: block;
  color: #cccccc;
  font-size: 12px;
  margin-bottom: 8px;
}

.modal-input {
  width: 100%;
  background: #3c3c3c;
  border: 1px solid #454545;
  color: #cccccc;
  padding: 8px 12px;
  font-size: 13px;
  font-family: 'Consolas', monospace;
  border-radius: 3px;
  outline: none;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: #007acc;
  background: #1e1e1e;
}

.modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #3e3e42;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.modal-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
  font-family: inherit;
}

.modal-btn.cancel {
  background: #3c3c3c;
  color: #cccccc;
}

.modal-btn.cancel:hover {
  background: #4e4e4e;
}

.modal-btn.confirm {
  background: #0e639c;
  color: white;
}

.modal-btn.confirm:hover {
  background: #1177bb;
}

/* ===== PREVIEW IFRAME ===== */
.preview-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.preview-iframe {
  flex: 1;
  width: 100%;
  border: none;
  background: white;
}

/* Scrollbar personalizado */
.vscode-sidebar::-webkit-scrollbar,
.file-tree::-webkit-scrollbar,
.code-editor::-webkit-scrollbar,
.panel-content::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.vscode-sidebar::-webkit-scrollbar-track,
.file-tree::-webkit-scrollbar-track,
.code-editor::-webkit-scrollbar-track,
.panel-content::-webkit-scrollbar-track {
  background: #1e1e1e;
}

.vscode-sidebar::-webkit-scrollbar-thumb,
.file-tree::-webkit-scrollbar-thumb,
.code-editor::-webkit-scrollbar-thumb,
.panel-content::-webkit-scrollbar-thumb {
  background: #424242;
  border-radius: 5px;
}

.vscode-sidebar::-webkit-scrollbar-thumb:hover,
.file-tree::-webkit-scrollbar-thumb:hover,
.code-editor::-webkit-scrollbar-thumb:hover,
.panel-content::-webkit-scrollbar-thumb:hover {
  background: #4e4e4e;
}
</style>