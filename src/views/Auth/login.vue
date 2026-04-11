<template>
  <div class="min-h-screen flex items-center justify-center bg-[#EEEEEE] inter-font">
    <div class="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden w-[95%] max-w-4xl">
      
      <!-- Carousel Image (desktop only) -->
      <div v-if="isDesktop" class="relative w-full md:w-1/2 bg-[#f5f5f5] flex justify-center items-center p-4">
        <div class="w-11/12 h-[500px] bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
          <img
            v-if="images.length"
            :src="images[currentImage]"
            class="max-w-full max-h-full object-contain rounded-lg"
            @error="(e) => e.target.src = 'https://placehold.co/800x800/7D0A0A/FFF?text=Space Available'"
          />
        </div>  
      </div>

      <!-- Login Form -->
      <div class="w-full md:w-1/2 bg-[#7D0A0A] text-white p-10 text-center">
        <h2 class="text-2xl navbar-font mb-6">Login ke eleven market</h2>
        <form @submit.prevent="loginUser" class="space-y-4">
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            class="w-full p-3 bg-white rounded border-2 border-[#BF3131] text-black placeholder-gray-500 focus:outline-none focus:border-[#EAD196] inter-font"
            required
          />
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="w-full p-3 rounded bg-white border-2 border-[#BF3131] text-black placeholder-gray-500 focus:outline-none focus:border-[#EAD196] inter-font"
            required
          />
          <button
            type="submit"
            :disabled="loading"
            class="w-full p-3 font-bold rounded-lg
                  bg-white text-[#BF3131] border-2 border-[#BF3131]
                  hover:bg-[#BF3131] hover:text-white
                  shadow-md hover:shadow-lg
                  active:scale-95 transition duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  oswald-font"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <router-link
            to="/register"
            class="block text-[#EAD196] underline mt-2 inter-font"
          >
            Don't Have an Account? Register
          </router-link>
          <router-link
            to="/forget-password"
            class="block text-[#EAD196] underline mt-2 inter-font"
          >
            Forgot Password 
          </router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/plugins/axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { showError } from "@/utils/alert"; 

const router = useRouter();
const form = ref({ email: "", password: "" });
const images = ref([])
const currentImage = ref(0);
const isDesktop = ref(window.innerWidth >= 768);
const loading = ref(false);
let interval = null;

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % images.value.length;
};

const checkScreen = () => {
  isDesktop.value = window.innerWidth >= 768;
};

const loginUser = async () => {
  loading.value = true;
  try {
    const response = await api.post("/auth/login", form.value);
    if (response.data?.data?.access_token) {
      const token = response.data.data.access_token;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } else {
      throw new Error("Token tidak ditemukan");
    }
  } catch (error) {
    const message = "Login gagal / Email atau Password salah";
    showError(message); 
  } finally {
    loading.value = false;
  }
};

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

    console.log("Images:", images.value)
  } catch (error) {
    console.error("Error fetching login banners:", error)
    images.value = ['https://placehold.co/800x800/7D0A0A/FFF?text=Space Available']
  }
}

onMounted(() => {
  interval = setInterval(nextImage, 3000)
  window.addEventListener("resize", checkScreen)
  getBannerLogin()
})

onUnmounted(() => {
  clearInterval(interval);
  window.removeEventListener("resize", checkScreen);
});
</script>
