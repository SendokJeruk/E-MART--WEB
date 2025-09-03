import { defineStore } from "pinia"
import { ref, computed } from "vue"   

export const useLoaderStore = defineStore("loader", () => {
  const requestCount = ref(0)

  function showLoader() {
    requestCount.value++
  }

  function hideLoader() {
    if (requestCount.value > 0) {
      requestCount.value--
    }
  }

  const loading = computed(() => requestCount.value > 0)

  return { loading, showLoader, hideLoader }
})
