<template>
  <div class="min-h-screen flex items-center justify-center bg-[#EEEEEE] inter-font">
    <div class="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden w-[95%] max-w-4xl">
      
      <!-- Carousel Image (desktop only) -->
      <div v-if="isDesktop" class="relative w-full md:w-1/2 bg-[#f5f5f5] flex justify-center items-center p-4">
        <div class="w-11/12">
          <img :src="images[currentImage]" class="w-full rounded-lg" alt="Carousel Image" />
        </div>
      </div>

      <!-- Login Form -->
      <div class="w-full md:w-1/2 bg-[#7D0A0A] text-white p-10 text-center">
        <h2 class="text-2xl navbar-font mb-6">Login</h2>
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
            class="w-full p-3 font-bold rounded border-2 border-[#BF3131] bg-white text-[#7D0A0A] hover:bg-[#BF3131] hover:text-white hover:border-[#7D0A0A] transition duration-300 oswald-font"
          >
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <router-link
            to="/register"
            class="block text-[#EAD196] underline mt-2 inter-font"
          >
            Don't Have an Account? Register
          </router-link>

          <p class="mt-4 inter-font">Or Login With</p>

          <button
            type="button"
            class="w-full p-3 mt-2 bg-white text-[#7D0A0A] rounded flex justify-center items-center gap-2 hover:bg-gray-100 transition oswald-font"
          >
            <i class="fab fa-google"></i> Google
          </button>
          <button
            type="button"
            class="w-full p-3 mt-2 bg-white text-[#7D0A0A] rounded flex justify-center items-center gap-2 hover:bg-gray-100 transition oswald-font"
          >
            <i class="fab fa-facebook-f"></i> Facebook
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/plugins/axios";
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = ref({ email: "", password: "" });
const images = ref([
  "https://placehold.co/400x500",
  "https://placehold.co/400x500/7D0A0A/FFF",
  "https://placehold.co/400x500/EAD196/000",
]);
const currentImage = ref(0);
const isDesktop = ref(window.innerWidth >= 768);
const loading = ref(false);
const errorMessage = ref("");
let interval = null;

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % images.value.length;
};

const checkScreen = () => {
  isDesktop.value = window.innerWidth >= 768;
};

const loginUser = async () => {
  loading.value = true;
  errorMessage.value = "";
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
    errorMessage.value = error.response?.data?.message || "Login gagal";
    alert(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  interval = setInterval(nextImage, 3000);
  window.addEventListener("resize", checkScreen);
});

onUnmounted(() => {
  clearInterval(interval);
  window.removeEventListener("resize", checkScreen);
});
</script>
