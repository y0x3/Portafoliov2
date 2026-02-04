<template>
  <div id="app">
    <div class="login-container">
      <!-- Título -->
      <h1 class="title">Unlock Computer</h1>

      <!-- Logo -->
      <img src="/ui/iconos/windowslogo.png" alt="Inicio" />

      <!-- Contenido principal -->
      <div class="content">
        <!-- Columna izquierda -->
        <div class="left">
          <img
            class="icon"
            src="/ui/iconos/icono_mipc_notexto.png"
            alt="Icono"
          />
        </div>

        <!-- Columna derecha -->
        <div class="right">
          <!-- Fila 1 -->
          <p class="text-small">
            this computer is un use has been locked.
          </p>

          <!-- Fila 2 -->
          <p class="text-big">
            Only EXPERIEN-340EC\Administrator or an Administrator can unlock this computer.
          </p>

          <!-- Fila 3 (formulario) -->
          <div class="form-grid">
            <!-- Username -->
            <label for="user">User name:</label>
            <input
            id="user"
            type="text"
            v-model="username"
            readonly
            />

            <!-- Password -->
            <label for="pass">Password:</label>
            <input
            id="pass"
            type="password"
            v-model="password"
            />

            <!-- Botones -->
            <button class="ok" @click="handleOk">OK</button>
            <button class="cancel" @click="handleCancel">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* ===== CONTENEDOR PRINCIPAL ===== */
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: black;
}

/* ===== LOGIN ===== */
.login-container {
  width: 600px;
  padding: 16px;
  background-color: #0101c8;
  border: 2px solid #c0c0c0;
  box-shadow:
    inset 1px 1px 0 #ffffff,
    inset -1px -1px 0 #808080;
  display: flex;
  flex-direction: column;
  gap: 14px;
  font-family: 'CoralPixels', sans-serif;
}

/* ===== TÍTULO ===== */
.title {
  margin: 0;
  padding: 6px 10px;
  font-size: 18px;
  color: white;
  background-color: #0101c8;
  border: 1px solid #c3c3c3;
  font-family: simplepixel;
}

/* ===== CONTENIDO ===== */
.content {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 14px;
  background: #ece9d8;
  padding: 14px;
  border: 1px solid #808080;
  box-shadow:
    inset 1px 1px 0 #ffffff,
    inset -1px -1px 0 #a0a0a0;
}

/* ===== COLUMNA IZQUIERDA ===== */
.left {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.icon {
  width: 64px;
}

/* ===== COLUMNA DERECHA ===== */
.right {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: 10px;
}

/* ===== TEXTOS ===== */
.text-small {
  font-size: 13px;
  color: #000;
}

.text-big {
  font-size: 13px;
  color: #000;
}

/* ===== FORMULARIO ===== */
.form-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: repeat(3, auto);
  gap: 8px 10px;
  margin-top: 6px;
}

.form-grid label {
  font-size: 13px;
  color: #000;
}

.form-grid input {
  padding: 4px;
  font-size: 13px;
  background: #ffffff;
  border: 1px solid #7f9db9;
  box-shadow:
    inset 1px 1px 0 #c0c0c0,
    inset -1px -1px 0 #ffffff;
  font-family: 'CoralPixels', sans-serif;
}

/* ===== BOTONES ===== */
.ok,
.cancel {
  padding: 4px 16px;
  font-size: 13px;
  background: #ece9d8;
  border: 1px solid #808080;
  box-shadow:
    inset 1px 1px 0 #ffffff,
    inset -1px -1px 0 #a0a0a0;
  cursor: pointer;
  font-family: 'CoralPixels', sans-serif;
}

.ok:active,
.cancel:active {
  box-shadow:
    inset -1px -1px 0 #ffffff,
    inset 1px 1px 0 #808080;
}

/* ===== APP CENTRADO ===== */
#app {
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('Administrator')
const password = ref('')

/* ❌ CANCELAR */
function handleCancel() {
  password.value = ''
  username.value = 'Administrator'
}

/* ✅ OK */
async function handleOk() {
  
  router.push('/home')
}



</script>
