<!-- src/components/FileTreeItem.vue -->
<template>
  <div class="tree-item">
    <div 
      class="tree-item-content"
      :style="{ paddingLeft: (level * 16 + 8) + 'px' }"
      @click="handleClick"
      @contextmenu.prevent="showContextMenu"
      :class="{ selected: isSelected }"
    >
      <!-- Icono de carpeta expandible -->
      <span 
        v-if="item.type === 'folder'" 
        class="expand-icon"
        @click.stop="toggleExpand"
      >
        {{ item.expanded ? '▼' : '▶' }}
      </span>
      <span v-else class="expand-icon placeholder"></span>
      
      <!-- Icono de archivo/carpeta -->
      <span class="item-icon">
        {{ getIcon() }}
      </span>
      
      <!-- Nombre del item o input para renombrar -->
      <input
        v-if="item.isEditing"
        v-model="editingName"
        @blur="confirmEdit"
        @keyup.enter="confirmEdit"
        @keyup.esc="cancelEdit"
        class="item-name-input"
        ref="editInput"
        @click.stop
      />
      <span v-else class="item-name">{{ item.name }}</span>
    </div>

    <!-- Menú contextual -->
    <div 
      v-if="contextMenuVisible" 
      class="context-menu"
      :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }"
    >
      <div class="context-menu-item" @click="handleRename">
        <span class="menu-icon">✏️</span>
        Rename
      </div>
      <div class="context-menu-item" @click="handleDelete">
        <span class="menu-icon">🗑️</span>
        Delete
      </div>
      <div v-if="item.type === 'folder'" class="context-menu-divider"></div>
      <div v-if="item.type === 'folder'" class="context-menu-item" @click="handleNewFile">
        <span class="menu-icon">📄</span>
        New File
      </div>
      <div v-if="item.type === 'folder'" class="context-menu-item" @click="handleNewFolder">
        <span class="menu-icon">📁</span>
        New Folder
      </div>
    </div>

    <!-- Hijos (si es carpeta y está expandida) -->
    <div v-if="item.type === 'folder' && item.expanded && item.children">
      <FileTreeItem
        v-for="child in item.children"
        :key="child.id"
        :item="child"
        :level="level + 1"
        @select="$emit('select', $event)"
        @rename="$emit('rename', $event)"
        @delete="$emit('delete', $event)"
        @confirm-rename="(id, name) => $emit('confirm-rename', id, name)"
        @cancel-rename="$emit('cancel-rename', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['select', 'rename', 'delete', 'confirm-rename', 'cancel-rename']);

const isSelected = ref(false);
const contextMenuVisible = ref(false);
const contextMenuX = ref(0);
const contextMenuY = ref(0);
const editingName = ref('');
const editInput = ref(null);

// Watch para cuando item.isEditing cambia
watch(() => props.item.isEditing, (newVal) => {
  if (newVal) {
    editingName.value = props.item.name;
    nextTick(() => {
      if (editInput.value) {
        editInput.value.focus();
        editInput.value.select();
      }
    });
  }
});

function getIcon() {
  if (props.item.type === 'folder') {
    return props.item.expanded ? '📂' : '📁';
  }
  
  const ext = props.item.name.split('.').pop();
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
    'ts': '💠',
    'tsx': '⚛️',
    'png': '🖼️',
    'jpg': '🖼️',
    'svg': '🎨',
    'git': '🔀'
  };
  
  return icons[ext] || '📄';
}

function handleClick() {
  if (props.item.isEditing) return;
  
  if (props.item.type === 'file') {
    isSelected.value = true;
    emit('select', props.item.id);
  } else {
    toggleExpand();
  }
}

function toggleExpand() {
  if (props.item.type === 'folder') {
    props.item.expanded = !props.item.expanded;
  }
}

function showContextMenu(event) {
  contextMenuVisible.value = true;
  contextMenuX.value = event.clientX;
  contextMenuY.value = event.clientY;
  
  // Cerrar el menú al hacer click fuera
  setTimeout(() => {
    document.addEventListener('click', closeContextMenu);
  }, 0);
}

function closeContextMenu() {
  contextMenuVisible.value = false;
  document.removeEventListener('click', closeContextMenu);
}

function handleRename() {
  emit('rename', props.item.id);
  closeContextMenu();
}

function handleDelete() {
  emit('delete', props.item.id);
  closeContextMenu();
}

function confirmEdit() {
  if (editingName.value && editingName.value.trim()) {
    emit('confirm-rename', props.item.id, editingName.value.trim());
  } else {
    cancelEdit();
  }
}

function cancelEdit() {
  emit('cancel-rename', props.item.id);
  editingName.value = props.item.name;
}

function handleNewFile() {
  // Esta funcionalidad debería manejarse en el componente padre
  console.log('New file in folder:', props.item.id);
  closeContextMenu();
}

function handleNewFolder() {
  // Esta funcionalidad debería manejarse en el componente padre
  console.log('New folder in folder:', props.item.id);
  closeContextMenu();
}

onBeforeUnmount(() => {
  document.removeEventListener('click', closeContextMenu);
});
</script>

<style scoped>
.tree-item {
  user-select: none;
}

.tree-item-content {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  cursor: pointer;
  color: #cccccc;
  font-size: 13px;
  transition: background 0.1s;
}

.tree-item-content:hover {
  background: #2a2d2e;
}

.tree-item-content.selected {
  background: #37373d;
}

.expand-icon {
  width: 16px;
  font-size: 10px;
  color: #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.expand-icon.placeholder {
  visibility: hidden;
}

.item-icon {
  font-size: 14px;
  width: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-name-input {
  flex: 1;
  background: #3c3c3c;
  border: 1px solid #007acc;
  color: #cccccc;
  padding: 2px 4px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  border-radius: 2px;
}

.item-name-input:focus {
  background: #2d2d2d;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: #3c3c3c;
  border: 1px solid #454545;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  min-width: 180px;
  z-index: 10000;
  padding: 4px 0;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  color: #cccccc;
  cursor: pointer;
  font-size: 12px;
}

.context-menu-item:hover {
  background: #094771;
}

.menu-icon {
  width: 16px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.context-menu-divider {
  height: 1px;
  background: #454545;
  margin: 4px 0;
}
</style>