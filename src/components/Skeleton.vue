<template>
  <!-- Ini kotak skeleton buat efek loading, bentuknya bisa diatur lewat class ama style -->
  <div
    class="skeleton"
    :class="type"
    :style="style"
  ></div>
</template>

<script setup>

// Nerima kiriman data dari parent buat nentuin ukuran ama jenis skeletonnya
const props = defineProps({
  type: {
    type: String,
    default: "box"
  },
  width: String,
  height: String,
  size: String
})

// Gabungin lebar ama tinggi biar gampang dipake di template
const style = {
  width: props.size || props.width,
  height: props.size || props.height
}

</script>

<style>

/* Background-nya dibikin gradasi biar ada efek kilat-kilat pas animasi jalan */
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

/* Kalo milih box, pojokannya dibikin tumpul dikit */
.box{
  border-radius:8px;
}

/* Kalo milih circle, ya jadinya bulet sempurna */
.circle{
  border-radius:50%;
}

/* Ini animasi buat geser-geser cahaya gradasinya biar berasa lagi loading */
@keyframes loading{
  0%{background-position:200%}
  100%{background-position:-200%}
}

</style>