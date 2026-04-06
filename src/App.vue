<template>
  <!-- Ini tempat nampilin halaman yang ganti-ganti sesuai rute-nya -->
  <router-view :key="$route.fullPath" />
</template>


<script>
// Import dashboard, sapa tau nanti butuh dipake di sini
import dashboard from './views/dashboard.vue';
export default {
  // Daftarin komponen dashboard biar siap pake
  components: {
    dashboard
  }
};
</script>
