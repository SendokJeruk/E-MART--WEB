<template>
  <div class="relative w-full max-w-7xl mx-auto overflow-hidden rounded-xl shadow-lg bg-black">

    <!-- ================= SKELETON ================= -->
    <div v-if="isLoading" class="w-full h-[200px] sm:h-[300px]">
      <Skeleton width="100%" height="100%" />
    </div>

    <!-- ================= CAROUSEL ================= -->
    <div v-else>
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

      <!-- BUTTON -->
      <button
        @click="prevSlide"
        class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-3 py-2 rounded-full"
      >
        ‹
      </button>

      <button
        @click="nextSlide"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white px-3 py-2 rounded-full"
      >
        ›
      </button>

      <!-- DOT -->
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

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)
let interval = null

const isLoading = computed(() => props.images.length === 0)

const nextSlide = () => {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const prevSlide = () => {
  if (!props.images.length) return
  currentIndex.value =
    (currentIndex.value - 1 + props.images.length) % props.images.length
}

onMounted(() => {
  interval = setInterval(nextSlide, 3000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>