<template>
  <div class="flex justify-center items-center min-h-screen bg-[#eeeeee]">
    <div
      class="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl"
    >
      <!-- Carousel Section -->
      <div
        v-if="isDesktop"
        class="relative w-full md:w-1/2 bg-[#f5f5f5] flex justify-center items-center p-4"
      >
        <div class="w-11/12 h-[500px] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
          <img
            v-if="images.length"
            :src="images[currentImage]"
            class="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>  
      </div>

      <!-- Form Section -->
      <div
        class="w-full md:w-1/2 bg-[#7d0a0a] p-10 text-white text-center flex flex-col justify-center"
      >
        <h2 class="navbar-font text-2xl mb-6">Register</h2>

        <form @submit.prevent="registerUser" class="space-y-4 inter-font">
          <!-- Input Name -->
          <input
            v-model="form.name"
            type="text"
            placeholder="Full Name"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />

          <!-- Input Email -->
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />

          <!-- Input Phone -->
          <input
            v-model="form.no_telp"
            type="tel"
            placeholder="Phone Number"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />

          <!-- Input Password -->
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />

          <!-- Password Checklist -->
          <div v-if="unmetRequirements.length" class="text-xs text-left mt-2 space-y-1">
            <p v-for="(req, i) in unmetRequirements" :key="i" class="text-white">
              • {{ req }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full p-3 bg-white text-[#7d0a0a] border-2 border-[#bf3131] rounded font-bold hover:bg-[#bf3131] hover:text-white hover:border-[#7d0a0a] transition oswald-font"
          >
            Register
          </button>

          <!-- Link to Login -->
          <router-link
            to="/login"
            class="block mt-4 text-sm text-[#ead196] hover:underline"
          >
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

/* ================= STATE ================= */
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
  { label: "Simbol (@, #, $, dll)", test: (pw) => /[!@#$%^&*(),.?\":{}|<>]/.test(pw) },
]

/* ================= COMPUTED ================= */
const unmetRequirements = computed(() => {
  return requirements
    .filter(rule => !rule.test(form.value.password))
    .map(rule => rule.label)
})

/* ================= METHODS ================= */
const registerUser = async () => {
  try {
    await api.post("/auth/register", form.value)
    showSuccess("Registrasi Berhasil! Silakan Login.")
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
  }
}

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % images.value.length
}

const checkScreen = () => {
  isDesktop.value = window.innerWidth >= 768
}

const getBannerLogin = async () => {
  try {
    const response = await api.get("/content?section=login")
    const data = response.data.data || []
    images.value = data.map(item => item.image)

    console.log("Images:", images.value)
  } catch (error) {
    console.error("Error fetching login banners:", error)
  }
}

/* ================= LIFECYCLE ================= */
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
