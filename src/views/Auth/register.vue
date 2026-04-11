<template>
  <div class="flex justify-center items-center min-h-screen bg-[#eeeeee]">
    <div class="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
      <div v-if="isDesktop" class="relative w-full md:w-1/2 bg-[#f5f5f5] flex justify-center items-center p-4">
        <div class="w-11/12 h-[500px] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
          <img v-if="images.length" :src="images[currentImage]"
            class="max-w-full max-h-full object-contain rounded-lg"
            @error="(e) => e.target.src = 'https://placehold.co/800x800/7D0A0A/FFF?text=Space Available'" />
        </div>
      </div>

      <div class="w-full md:w-1/2 bg-[#7d0a0a] p-10 text-white text-center flex flex-col justify-center">
        <h2 class="navbar-font text-2xl mb-6">Register ke eleven market</h2>

        <form @submit.prevent="registerUser" class="space-y-4 inter-font">
          <input v-model="form.name" type="text" placeholder="Full Name" required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black" />

          <input v-model="form.email" type="email" placeholder="Email" required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black" />

          <input v-model="form.no_telp" type="tel" placeholder="Phone Number" required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black" />

          <input v-model="form.password" type="password" placeholder="Password" required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black" />

          <div v-if="unmetRequirements.length" class="text-xs text-left mt-2 space-y-1">
            <p v-for="(req, i) in unmetRequirements" :key="i" class="text-white">
              • {{ req }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isLoading || unmetRequirements.length > 0"
            :class="[
              'w-full p-3 border-2 rounded-lg font-bold transition-all duration-200 oswald-font flex justify-center items-center shadow-md',
              (isLoading || unmetRequirements.length > 0)
                ? 'bg-gray-400 border-gray-400 text-gray-200 cursor-not-allowed shadow-none'
                : 'bg-white text-[#7d0a0a] border-[#bf3131] hover:bg-[#bf3131] hover:text-white hover:border-[#7d0a0a] hover:shadow-lg active:scale-95'
            ]"
          >
            <span v-if="isLoading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Memproses...
            </span>
            <span v-else>Register</span>
          </button>

          <router-link to="/login" class="block mt-4 text-sm text-[#ead196] hover:underline">
            Have an account? Login
          </router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import { showSuccess, showError } from '@/utils/alert'

const router = useRouter()

const isLoading = ref(false)

const form = ref({
  name: "",
  email: "",
  no_telp: "",
  password: "",
  role_id: 3,
})

const images = ref([])
const currentImage = ref(0)
const isDesktop = ref(window.innerWidth >= 768)
const intervalId = ref(null)

const requirements = [
  { label: "Minimal 8 karakter", test: (pw) => pw.length >= 8 },
  { label: "Huruf besar", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Huruf kecil", test: (pw) => /[a-z]/.test(pw) },
  { label: "Angka", test: (pw) => /\d/.test(pw) },
  { label: "Simbol (@, #, $, dll)", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
]

const unmetRequirements = computed(() => {
  return requirements
    .filter(rule => !rule.test(form.value.password))
    .map(rule => rule.label)
})

const registerUser = async () => {
  if (isLoading.value || unmetRequirements.value.length > 0) return

  isLoading.value = true

  try {
    await api.post("/auth/register", form.value)
    showSuccess("Registrasi Berhasil! Silakan Cek Email Anda Untuk Verifikasi.")
    router.push("/login")
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const errors = error.response.data.errors
      let messages = ""
      for (const key in errors) {
        messages += errors[key].join("\n") + "\n"
      }
      showError(messages)
    } else {
      showError("Registrasi Gagal!")
    }
  } finally {
    isLoading.value = false
  }
}

const nextImage = () => {
  if (images.value.length > 0) {
    currentImage.value = (currentImage.value + 1) % images.value.length
  }
}

const checkScreen = () => {
  isDesktop.value = window.innerWidth >= 768
}

const getBannerLogin = async () => {
  try {
    const response = await api.get("/content?section=login")
    const data = response.data?.data || []
    const fetchedImages = data.map(item => item.image)
    
    if (fetchedImages.length > 0) {
      images.value = fetchedImages
    } else {
      images.value = ['https://placehold.co/800x800/7D0A0A/FFF?text=Space Available']
    }
  } catch (error) {
    console.error(error)
    images.value = ['https://placehold.co/800x800/7D0A0A/FFF?text=Space Available']
  }
}

onMounted(() => {
  intervalId.value = setInterval(nextImage, 3000)
  window.addEventListener("resize", checkScreen)
  getBannerLogin()
})

onUnmounted(() => {
  clearInterval(intervalId.value)
  window.removeEventListener("resize", checkScreen)
})
</script>