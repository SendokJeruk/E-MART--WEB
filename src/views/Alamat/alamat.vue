<template>
  <Navbar />
  
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
</script>