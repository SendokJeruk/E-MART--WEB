<template>
  <!-- Komponen Carousel: Digunakan untuk menampilkan slider gambar banner di halaman utama -->
  <div class="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg bg-black">

    <!-- ================= SKELETON ================= -->
    <!-- Menampilkan loading saat gambar belum siap -->
    <div v-if="isLoading" class="w-full h-[200px] sm:h-[300px]">
      <Skeleton width="100%" height="100%" />
    </div>

    <!-- ================= CAROUSEL ================= -->
    <div v-else>
      <!-- Wadah gambar yang bisa bergeser -->
      <div
        class="flex transition-transform duration-700 ease-in-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(image, index) in images"
          :key="index"
          class="w-full flex-shrink-0 flex justify-center items-center"
        >
          <img
            :src="image"
            class="w-full max-w-full h-auto max-h-[200px] sm:max-h-[300px] object-cover"
            @error="(e) => e.target.src = 'https://placehold.co/1200x400?text=Banner+Not+Found'"
          />
        </div>
      </div>

      <!-- Tombol Navigasi Kiri -->
      <button
        @click="prevSlide"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-3 py-2 rounded-full"
      >
        ‹
      </button>

      <!-- Tombol Navigasi Kanan -->
      <button
        @click="nextSlide"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-3 py-2 rounded-full"
      >
        ›
      </button>

      <!-- Indikator Titik (Dots) di bawah carousel -->
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        <span
          v-for="(image, index) in images"
          :key="index"
          class="h-2 w-2 rounded-full transition-all duration-300"
          :class="currentIndex === index ? 'bg-white scale-110' : 'bg-white/50'"
        ></span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Skeleton from '@/components/Skeleton.vue'

// Menerima daftar URL gambar dari luar (props)
const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

// Indeks gambar yang saat ini tampil
const currentIndex = ref(0)
let interval = null

// Mengecek apakah data gambar masih kosong
const isLoading = computed(() => props.images.length === 0)

// Fungsi untuk geser ke gambar berikutnya
const nextSlide = () => {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

// Fungsi untuk geser ke gambar sebelumnya
const prevSlide = () => {
  if (!props.images.length) return
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length
}

// Saat komponen dipasang, mulai jalankan slide otomatis setiap 3 detik
onMounted(() => {
  interval = setInterval(nextSlide, 3000)
})

// Bersihkan interval saat komponen dihancurkan (agar tidak membebani memori)
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>
