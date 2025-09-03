<template>
  <div v-if="loader.loading" class="loader-overlay">
    <div class="custom-loader"></div>
  </div>
</template>

<script setup>
import { useLoaderStore } from "@/stores/loader"
const loader = useLoaderStore()
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.custom-loader {
  width: 50px;
  height: 50px;
  display: grid;
  border:4px solid #0000;
  border-radius: 50%;
  border-color:#BF3131 #0000;
  animation: s6 1s infinite linear;
}
.custom-loader::before,
.custom-loader::after {    
  content:"";
  grid-area: 1/1;
  margin:2px;
  border:inherit;
  border-radius: 50%;
}
.custom-loader::before {
  border-color:#7D0A0A #0000;
  animation:inherit; 
  animation-duration: .5s;
  animation-direction: reverse;
}
.custom-loader::after {
  margin:8px;
}

@keyframes s6 { 
  100%{transform: rotate(1turn)}
} 
</style>
