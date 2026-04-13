<template>
  <!-- Komponen utama yang akan menampilkan halaman berdasarkan rute/URL yang aktif -->
  <router-view :key="$route.fullPath" />
</template>


<script>
/**
 * Komponen Utama Aplikasi (Root Component).
 * File ini adalah gerbang masuk utama untuk seluruh tampilan web E-Mart.
 */
import dashboard from './views/dashboard.vue';
export default {
  components: {
    dashboard
  }
};
</script>
