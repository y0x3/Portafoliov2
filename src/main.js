// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // ← NUEVO
import './style.css';
import i18n from './i18n'

const app = createApp(App);

app.use(router,i18n);  // ← NUEVO

app.mount('#app');