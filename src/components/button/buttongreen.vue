<template>
    <!-- Tombol ijo buat navigasi, pas dihover bakal jadi transparan border ijo -->
    <a
      @click.prevent="navigate"
      href="#"
      class="inline-block rounded-sm border border-[#04AA6D] bg-[#04AA6D] px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-[#04AA6D] transition"
    >
      {{ label }}
    </a>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  
  // Perlu label (teks tombol) ama to (tujuan mau kemana)
  const props = defineProps({
    label: String,    
    to: String       
  })
  
  const router = useRouter()
  
  // Pas diklik, langsung cus ke halaman tujuan
  const navigate = () => {
    router.push(props.to)
  }
  </script>
  