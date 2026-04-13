<template>
    <!-- Tombol navigasi berwarna hijau -->
    <a
      @click.prevent="navigate"
      href="#"
      class="inline-block rounded-sm border border-[#04AA6D] bg-[#04AA6D] px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-[#04AA6D] transition"
    >
      {{ label }}
    </a>
  </template>
  
  <script setup>
  /**
   * Komponen Tombol Hijau.
   * Digunakan untuk aksi yang mengarahkan user ke halaman lain.
   */
  import { useRouter } from 'vue-router'
  
  // Properti: label (teks tombol), to (alamat tujuan)
  const props = defineProps({
    label: String,    
    to: String       
  })
  
  const router = useRouter()
  
  // Fungsi untuk pindah halaman saat tombol diklik
  const navigate = () => {
    router.push(props.to)
  }
  </script>
