<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()



</script>

<template>
  <router-view />
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}

</style>