<!-- src/components/windows/RecycleBinWindow.vue -->
<template>
  <WindowBase
    title="Papelera de reciclaje"
    icon="/vite.svg"
    :show-toolbar="true"
    :show-sidebar="true"
    address-bar-text="Papelera de reciclaje"
    v-bind="$attrs"
    @close="$emit('close')"
    @minimize="$emit('minimize')"
    @maximize="$emit('maximize')"
    @focus="$emit('focus')"
  >
    <!-- Sidebar personalizado -->
    <template #sidebar>
      <div class="sidebar-section">
        <div class="sidebar-title">Recycle Bin Tasks</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            <span>Empty the Recycle Bin</span>
          </a>
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            <span>Restore all items</span>
          </a>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">Other Places</div>
        <div class="sidebar-content">
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            <span>My Computer</span>
          </a>
          <a href="#" class="sidebar-link">
            <img src="/ui/iconos/folder.png" />
            <span>My Documents</span>
          </a>
        </div>
      </div>
    </template>

    <!-- Contenido principal -->
    <div class="recycle-bin-content">
      <div class="recycle-bin-header">
        <img src="/ui/iconos/folder.png" class="recycle-icon-large" />
        <div class="recycle-info">
          <h2>Papelera de reciclaje</h2>
          <p>Contiene archivos y carpetas que has eliminado.</p>
        </div>
      </div>

      <div class="empty-state">
        <img src="/ui/iconos/folder.png" class="empty-icon" />
        <p>La papelera de reciclaje está vacía.</p>
      </div>
    </div>
  </WindowBase>
</template>

<script setup>
import WindowBase from '../WindowBase.vue';

defineEmits(['close', 'minimize', 'maximize', 'focus']);
</script>

<style scoped>

*img {
  image-rendering: pixelated;

}
.recycle-bin-content {
  padding: 15px;
}

.recycle-bin-header {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px;
  background: linear-gradient(180deg, #f0f8ff 0%, #e6f2ff 100%);
  border: 1px solid #c0d8f0;
  border-radius: 3px;
  margin-bottom: 20px;
}

.recycle-icon-large {
  width: 64px;
  height: 64px;
}

.recycle-info h2 {
  font-size: 16px;
  color: #003c9d;
  margin: 0 0 5px 0;
}

.recycle-info p {
  font-size: 11px;
  color: #666;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  width: 96px;
  height: 96px;
  opacity: 0.3;
  margin-bottom: 20px;
}

.empty-state p {
  font-size: 12px;
  color: #999;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  text-decoration: none;
  color: #0066cc;
  border-radius: 3px;
}

.sidebar-link img {
  width: 16px;
  height: 16px;
}
</style>