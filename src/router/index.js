import { createRouter, createWebHistory } from 'vue-router'
import XPLogin from '@/components/XPLogin.vue'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'  // ← Redirige automáticamente a /home
  },
  {
    path: '/login',
    name: 'Login',
    component: XPLogin
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
