<template>
  <!-- Komponen Skeleton Loading: Digunakan untuk menampilkan efek bayangan saat data sedang dimuat -->
  <div
    class="skeleton"
    :class="type"
    :style="style"
  ></div>
</template>

<script setup>
/**
 * Properti yang bisa diatur saat menggunakan komponen ini:
 * - type: Bentuk skeleton ('box' atau 'circle')
 * - width: Lebar kotak
 * - height: Tinggi kotak
 * - size: Ukuran (jika ingin lebar dan tinggi sama)
 */
const props = defineProps({
  type: {
    type: String,
    default: "box"
  },
  width: String,
  height: String,
  size: String
})

// Menentukan gaya tampilan (lebar dan tinggi) berdasarkan properti yang dikirim
const style = {
  width: props.size || props.width,
  height: props.size || props.height
}

</script>

<style>
/* Animasi loading yang bergerak dari kiri ke kanan */
.skeleton{
  background: linear-gradient(
    90deg,
    #e5e5e5 25%,
    #f5f5f5 50%,
    #e5e5e5 75%
  );
  background-size:200% 100%;
  animation:loading 1.2s infinite;
}

/* Bentuk kotak dengan sudut melengkung */
.box{
  border-radius:8px;
}

/* Bentuk lingkaran sempurna */
.circle{
  border-radius:50%;
}

/* Definisi gerakan animasi */
@keyframes loading{
  0%{background-position:200%}
  100%{background-position:-200%}
}

</style>
