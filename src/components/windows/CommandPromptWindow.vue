<!-- src/components/windows/CommandPromptWindow.vue -->
<template>
  <WindowBase
    title="Command Prompt"
    icon="/ui/iconos/cmd.png"
    :show-toolbar="false"
    :show-sidebar="false"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="handleFocus"
  >
    <div class="cmd-window" @click="focusInput">
      <div class="cmd-output" ref="outputContainer">
        <!-- Mensaje de inicio -->
        <div v-if="history.length === 0" class="startup-message">
          <p>Microsoft Windows XP [Version 5.1.2600]</p>
          <p>(C) Copyright 1985-2001 Microsoft Corp.</p>
          <p></p>
          <p>Escribe HELP para ver la lista de comandos disponibles.</p>
          <p></p>
        </div>

        <!-- Historial de comandos -->
        <div v-for="(entry, index) in history" :key="index" class="history-entry">
          <!-- Comando ejecutado -->
          <div class="command-line">
            <span class="prompt">{{ entry.path }}></span>
            <span class="command-text">{{ entry.command }}</span>
          </div>
          
          <!-- Salida del comando -->
          <div v-if="entry.output" class="command-output" v-html="entry.output"></div>
        </div>

        <!-- Línea de comando actual -->
        <div class="command-line current">
          <span class="prompt">{{ currentPath }}></span>
          <span class="input-container">
            <span class="text-before-cursor">{{ textBeforeCursor }}</span>
            <span class="cursor">_</span>
            <span class="text-after-cursor">{{ textAfterCursor }}</span>
            <span class="autocomplete-hint" v-if="autocompleteSuggestion">{{ autocompleteSuggestion }}</span>
            <input
              ref="commandInput"
              v-model="currentCommand"
              @input="handleInput"
              @keydown="handleKeyDown"
              @keydown.enter.prevent="executeCommand"
              @keydown.up.prevent="navigateHistory('up')"
              @keydown.down.prevent="navigateHistory('down')"
              @keydown.tab.prevent="autoComplete"
              @keydown.left="handleArrowKeys"
              @keydown.right="handleArrowKeys"
              @keydown.home="handleArrowKeys"
              @keydown.end="handleArrowKeys"
              @click="updateCursorFromClick"
              class="hidden-input"
              spellcheck="false"
              autocomplete="off"
            />
          </span>
        </div>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import WindowBase from '../WindowBase.vue';

defineEmits(['close', 'minimize', 'maximize', 'focus']);

// ============================================
// ESTADO REACTIVO
// ============================================
const currentCommand = ref('');
const history = ref([]);
const commandHistory = ref([]);
const historyIndex = ref(-1);
const currentPath = ref('C:\\Users\\Guest');
const commandInput = ref(null);
const outputContainer = ref(null);
const autocompleteSuggestion = ref('');
const cursorPosition = ref(0);

// Computed para texto antes y después del cursor
const textBeforeCursor = computed(() => {
  return currentCommand.value.substring(0, cursorPosition.value);
});

const textAfterCursor = computed(() => {
  return currentCommand.value.substring(cursorPosition.value);
});

// Sistema de archivos virtual
const fileSystem = ref({
  'C:': {
    type: 'dir',
    children: {
      'Users': {
        type: 'dir',
        children: {
          'Guest': {
            type: 'dir',
            children: {
              'Desktop': { type: 'dir', children: {} },
              'Documents': {
                type: 'dir',
                children: {
                  'readme.txt': { type: 'file', content: 'Este es un archivo de prueba.' },
                  'portfolio.txt': { type: 'file', content: 'Mi portafolio web interactivo.' }
                }
              },
              'Downloads': { type: 'dir', children: {} },
              'Music': { type: 'dir', children: {} },
              'Pictures': { type: 'dir', children: {} }
            }
          }
        }
      },
      'Windows': { type: 'dir', children: {} },
      'Program Files': { type: 'dir', children: {} }
    }
  }
});

// ============================================
// UTILIDADES
// ============================================
const getCurrentDirectory = () => {
  const pathParts = currentPath.value.split('\\').filter(p => p);
  let current = fileSystem.value;
  
  for (const part of pathParts) {
    if (current[part] && current[part].children) {
      current = current[part].children;
    }
  }
  
  return current;
};

const focusInput = () => {
  commandInput.value?.focus();
};

const handleFocus = () => {
  nextTick(() => {
    focusInput();
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (outputContainer.value) {
      outputContainer.value.scrollTop = outputContainer.value.scrollHeight;
    }
  });
};

const updateCursorPosition = () => {
  nextTick(() => {
    if (commandInput.value) {
      cursorPosition.value = commandInput.value.selectionStart || 0;
    }
  });
};

const updateCursorFromClick = () => {
  updateCursorPosition();
};

const handleArrowKeys = () => {
  updateCursorPosition();
};

const handleKeyDown = (event) => {
  // Actualizar posición del cursor después de cualquier tecla
  nextTick(() => {
    updateCursorPosition();
  });
};

// ============================================
// COMANDOS DISPONIBLES
// ============================================
const commands = {
  help: () => {
    return `
Comandos disponibles:
  HELP        - Muestra esta ayuda
  DIR         - Lista archivos y directorios
  CD          - Cambia el directorio actual
  CLS         - Limpia la pantalla
  ECHO        - Muestra un mensaje
  DATE        - Muestra la fecha actual
  TIME        - Muestra la hora actual
  VER         - Muestra la versión del sistema
  TITLE       - Cambia el título de la ventana
  COLOR       - Cambia los colores de la consola
  TREE        - Muestra estructura de directorios
  TYPE        - Muestra contenido de archivo
  MKDIR (MD)  - Crea un directorio
  EXIT        - Cierra la ventana
  CALC        - Calcula expresiones matemáticas
  WHOAMI      - Muestra el usuario actual
  IPCONFIG    - Muestra configuración de red
  PING        - Simula ping a un host
  
Usa TAB para autocompletar.
    `.trim();
  },

  dir: () => {
    const current = getCurrentDirectory();
    let output = `<div class="dir-output">`;
    output += `Directory of ${currentPath.value}<br><br>`;
    
    const entries = Object.entries(current);
    
    if (entries.length === 0) {
      return 'El directorio está vacío.';
    }
    
    entries.forEach(([name, item]) => {
      const date = new Date().toLocaleDateString();
      const time = new Date().toLocaleTimeString();
      
      if (item.type === 'dir') {
        output += `${date}  ${time}    &lt;DIR&gt;          ${name}<br>`;
      } else {
        output += `${date}  ${time}                  ${name}<br>`;
      }
    });
    
    output += `<br>               ${entries.length} File(s)<br>`;
    output += `</div>`;
    return output;
  },

  cd: (args) => {
    if (!args || args === '') {
      return currentPath.value;
    }
    
    if (args === '..') {
      const parts = currentPath.value.split('\\');
      if (parts.length > 1) {
        parts.pop();
        currentPath.value = parts.join('\\') || 'C:';
      }
      return '';
    }
    
    if (args === '\\' || args === '/') {
      currentPath.value = 'C:';
      return '';
    }
    
    const current = getCurrentDirectory();
    if (current[args] && current[args].type === 'dir') {
      currentPath.value += '\\' + args;
      return '';
    }
    
    return `El sistema no puede encontrar la ruta especificada.`;
  },

  cls: () => {
    history.value = [];
    return null;
  },

  echo: (args) => {
    if (!args || args === '') {
      return 'ECHO está activado.';
    }
    return args;
  },

  date: () => {
    return `La fecha actual es: ${new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`;
  },

  time: () => {
    return `La hora actual es: ${new Date().toLocaleTimeString('es-ES')}`;
  },

  ver: () => {
    return 'Microsoft Windows XP [Version 5.1.2600]';
  },

  tree: () => {
    const buildTree = (obj, prefix = '', isLast = true) => {
      let result = '';
      const entries = Object.entries(obj);
      
      entries.forEach(([name, item], index) => {
        const isLastItem = index === entries.length - 1;
        const connector = isLastItem ? '└── ' : '├── ';
        const extension = isLastItem ? '    ' : '│   ';
        
        result += prefix + connector + name;
        if (item.type === 'dir') result += '\\';
        result += '<br>';
        
        if (item.type === 'dir' && item.children) {
          result += buildTree(item.children, prefix + extension, isLastItem);
        }
      });
      
      return result;
    };
    
    return `${currentPath.value}<br>` + buildTree(getCurrentDirectory());
  },

  type: (args) => {
    if (!args) {
      return 'La sintaxis del comando no es correcta.<br>Uso: TYPE [archivo]<br>Ejemplo: TYPE readme.txt';
    }
    
    const current = getCurrentDirectory();
    if (current[args] && current[args].type === 'file') {
      return current[args].content || 'Archivo vacío.';
    }
    
    return `El sistema no puede encontrar el archivo especificado.`;
  },

  mkdir: (args) => {
    if (!args) {
      return 'La sintaxis del comando no es correcta.<br>Uso: MKDIR [nombre]<br>Ejemplo: MKDIR nueva_carpeta';
    }
    
    const current = getCurrentDirectory();
    if (current[args]) {
      return `Ya existe un subdirectorio o archivo con ese nombre.`;
    }
    
    current[args] = { type: 'dir', children: {} };
    return '';
  },

  md: (args) => commands.mkdir(args),

  calc: (args) => {
    if (!args) {
      return 'Uso: CALC [expresión matemática]<br>Ejemplos:<br>  CALC 2+2<br>  CALC (5*3)+10<br>  CALC 100/4';
    }
    
    try {
      // Sanitizar la expresión
      const sanitized = args.replace(/[^0-9+\-*/(). ]/g, '');
      const result = eval(sanitized);
      return `Resultado: ${result}`;
    } catch (error) {
      return 'Error en la expresión matemática.<br>Uso: CALC [expresión]<br>Ejemplo: CALC 2+2';
    }
  },

  whoami: () => {
    return 'DESKTOP-XP\\Guest';
  },

  ipconfig: () => {
    return `
Configuración IP de Windows

Adaptador de Ethernet:

   Sufijo DNS específico para la conexión: local
   Dirección IPv4. . . . . . . . . . . . : 192.168.1.100
   Máscara de subred . . . . . . . . . . : 255.255.255.0
   Puerta de enlace predeterminada . . . : 192.168.1.1
    `.trim();
  },

  ping: (args) => {
    if (!args) {
      return 'Uso: PING [host]<br>Ejemplos:<br>  PING localhost<br>  PING google.com<br>  PING 192.168.1.1';
    }
    const host = args;
    return `
Haciendo ping a ${host} [127.0.0.1] con 32 bytes de datos:
Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128
Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128
Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128
Respuesta desde 127.0.0.1: bytes=32 tiempo<1m TTL=128

Estadísticas de ping para 127.0.0.1:
    Paquetes: enviados = 4, recibidos = 4, perdidos = 0
    (0% perdidos),
    `.trim();
  },

  title: (args) => {
    if (!args) {
      return 'Uso: TITLE [texto]<br>Ejemplo: TITLE Mi Consola';
    }
    return `Título cambiado a: ${args}`;
  },

  color: (args) => {
    if (!args) {
      return `El comando COLOR cambia los colores de la consola.
      
Uso: COLOR [fondo][texto]

Códigos de color disponibles:
  0 = Negro       8 = Gris
  1 = Azul        9 = Azul claro
  2 = Verde       A = Verde claro
  3 = Aguamarina  B = Aguamarina claro
  4 = Rojo        C = Rojo claro
  5 = Púrpura     D = Púrpura claro
  6 = Amarillo    E = Amarillo claro
  7 = Blanco      F = Blanco brillante

Ejemplos:
  COLOR 0A    (Fondo negro, texto verde claro)
  COLOR 1F    (Fondo azul, texto blanco brillante)
  COLOR 4E    (Fondo rojo, texto amarillo claro)
  COLOR 07    (Restaurar colores predeterminados)

Nota: Esta funcionalidad está limitada en la versión web.`;
    }
    
    return `COLOR ${args} - Los colores se aplicarían si estuviera implementado completamente.<br>Usa COLOR sin parámetros para ver la ayuda.`;
  },

  exit: () => {
    return 'EXIT';
  }
};

// ============================================
// EJECUCIÓN DE COMANDOS
// ============================================
const executeCommand = () => {
  const cmd = currentCommand.value.trim();
  
  if (!cmd) return;
  
  // Agregar al historial de comandos
  commandHistory.value.push(cmd);
  historyIndex.value = commandHistory.value.length;
  
  // Parsear comando y argumentos
  const parts = cmd.split(' ');
  const command = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');
  
  let output = '';
  
  // Ejecutar comando
  if (command === 'exit') {
    // Emitir evento de cierre
    return;
  } else if (commands[command]) {
    const result = commands[command](args);
    if (result !== null) {
      output = result;
    }
  } else {
    output = `'${cmd}' no se reconoce como un comando interno o externo,<br>programa o archivo por lotes ejecutable.<br><br>Escribe HELP para ver los comandos disponibles.`;
  }
  
  // Agregar al historial con el path actual
  history.value.push({
    command: cmd,
    output: output,
    path: currentPath.value
  });
  
  // Limpiar input y sugerencia
  currentCommand.value = '';
  autocompleteSuggestion.value = '';
  cursorPosition.value = 0;
  
  // Scroll al final
  scrollToBottom();
};

// ============================================
// NAVEGACIÓN EN HISTORIAL
// ============================================
const navigateHistory = (direction) => {
  if (commandHistory.value.length === 0) return;
  
  if (direction === 'up') {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      currentCommand.value = commandHistory.value[historyIndex.value];
    }
  } else if (direction === 'down') {
    if (historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++;
      currentCommand.value = commandHistory.value[historyIndex.value];
    } else {
      historyIndex.value = commandHistory.value.length;
      currentCommand.value = '';
    }
  }
  
  // Limpiar sugerencia de autocompletado
  autocompleteSuggestion.value = '';
  
  // Forzar el cursor al final del input
  nextTick(() => {
    if (commandInput.value) {
      const length = currentCommand.value.length;
      commandInput.value.setSelectionRange(length, length);
      cursorPosition.value = length;
      commandInput.value.focus();
    }
  });
};

// ============================================
// AUTOCOMPLETADO
// ============================================
const updateAutocompleteSuggestion = () => {
  const cmd = currentCommand.value.toLowerCase();
  
  if (!cmd) {
    autocompleteSuggestion.value = '';
    return;
  }
  
  // Buscar comandos que coincidan
  const commandNames = Object.keys(commands);
  const matches = commandNames.filter(c => c.startsWith(cmd));
  
  if (matches.length === 1 && matches[0] !== cmd) {
    // Mostrar la sugerencia (solo la parte que falta)
    autocompleteSuggestion.value = matches[0].substring(cmd.length);
  } else {
    autocompleteSuggestion.value = '';
  }
};

const autoComplete = () => {
  const cmd = currentCommand.value.toLowerCase();
  if (!cmd) return;
  
  // Autocompletar comandos
  const commandNames = Object.keys(commands);
  const matches = commandNames.filter(c => c.startsWith(cmd));
  
  if (matches.length === 1) {
    currentCommand.value = matches[0].toUpperCase();
    autocompleteSuggestion.value = '';
    
    // Posicionar cursor al final
    nextTick(() => {
      if (commandInput.value) {
        const length = currentCommand.value.length;
        commandInput.value.setSelectionRange(length, length);
        cursorPosition.value = length;
        commandInput.value.focus();
      }
    });
  } else if (matches.length > 1) {
    // Mostrar opciones
    const output = '<span style="color: #00ff00;">Comandos disponibles:</span><br>' + 
                   matches.map(m => m.toUpperCase()).join('  ');
    history.value.push({
      command: currentCommand.value,
      output: output,
      path: currentPath.value
    });
    autocompleteSuggestion.value = '';
    scrollToBottom();
  }
};

// Observar cambios en currentCommand para actualizar sugerencias
const handleInput = () => {
  updateCursorPosition();
  updateAutocompleteSuggestion();
};

// ============================================
// LIFECYCLE
// ============================================
onMounted(() => {
  focusInput();
  cursorPosition.value = 0;
});
</script>

<style scoped>
.cmd-window {
  width: 100%;
  height: 100%;
  background: #000000;
  color: #c0c0c0;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  padding: 10px;
  overflow: hidden;
  cursor: text;
}

.cmd-output {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.startup-message p {
  margin: 0;
  line-height: 1.4;
}

.history-entry {
  margin-bottom: 4px;
}

.command-line {
  display: flex;
  align-items: center;
  line-height: 1.4;
}

.command-line.current {
  position: relative;
}

.prompt {
  color: #c0c0c0;
  margin-right: 4px;
  flex-shrink: 0;
}

.command-text {
  color: #ffffff;
}

.input-wrapper {
  position: relative;
  flex: 1;
  display: inline-block;
}

.input-container {
  position: relative;
  flex: 1;
  display: inline-flex;
  align-items: center;
}

.text-before-cursor,
.text-after-cursor {
  color: #ffffff;
  white-space: pre;
}

.autocomplete-hint {
  color: #666666;
  white-space: pre;
  margin-left: 0;
}

.hidden-input {
  position: absolute;
  left: -9999px;
  opacity: 0;
  width: 1px;
  height: 1px;
}

.input-mirror {
  visibility: hidden;
  white-space: pre;
}

.autocomplete-suggestion {
  position: absolute;
  left: 0;
  top: 0;
  color: #666666;
  white-space: pre;
  pointer-events: none;
  user-select: none;
}

.command-input {
  position: absolute;
  left: 0;
  top: 0;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-family: inherit;
  font-size: inherit;
  width: 100%;
  padding: 0;
  margin: 0;
  caret-color: transparent;
}

.cursor {
  display: inline-block;
  background: #c0c0c0;
  width: 8px;
  height: 16px;
  animation: blink 1s infinite;
  pointer-events: none;
  flex-shrink: 0;
}

.cursor.typing {
  left: auto;
}

@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

.command-output {
  color: #c0c0c0;
  margin: 4px 0 8px 0;
  line-height: 1.4;
}

.dir-output {
  font-family: 'Consolas', 'Courier New', monospace;
}

/* Scrollbar personalizado */
.cmd-output::-webkit-scrollbar {
  width: 12px;
}

.cmd-output::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.cmd-output::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 6px;
}

.cmd-output::-webkit-scrollbar-thumb:hover {
  background: #606060;
}
</style>