<template>
  <div class="flex justify-center items-center min-h-screen bg-[#eeeeee]">
    <div class="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl">
      <div v-if="isDesktop" class="relative w-full md:w-1/2 bg-[#f5f5f5] flex justify-center items-center p-4">
        <div class="w-11/12">
          <img :src="images[currentImage]" class="w-full rounded-lg" alt="Carousel Image" />
        </div>
      </div>


      <div class="w-full md:w-1/2 bg-[#7d0a0a] p-10 text-white text-center">
        <h2 class="font-[Righteous] text-2xl mb-6">Register</h2>
        <form @submit.prevent="registerUser" class="space-y-4">
          <input
            v-model="form.name"
            type="text"
            placeholder="Full Name"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />
          <input
            v-model="form.email"
            type="email"
            placeholder="Email"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />
          <input
            v-model="form.no_telp"
            type="tel"
            placeholder="Phone Number"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            required
            class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black"
          />

          <button
            type="submit"
            class="w-full p-3 bg-white text-[#7d0a0a] border-2 border-[#bf3131] rounded font-bold hover:bg-[#bf3131] hover:text-white hover:border-[#7d0a0a] transition"
          >
            Register
          </button>
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

<script>
import api from "@/plugins/axios";

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        no_telp: "",
        password: "",
        role_id: 3,
      },
      images: [
        "https://placehold.co/400x500",
        "https://placehold.co/400x500/7D0A0A/FFF",
        "https://placehold.co/400x500/EAD196/000",
      ],
      currentImage: 0,
      isDesktop: window.innerWidth >= 768,
    };
  },
  mounted() {
    setInterval(this.nextImage, 3000);
    window.addEventListener("resize", this.checkScreen);
  },
  methods: {
    async registerUser() {
      try {
        const response = await api.post("/auth/register", this.form);
        alert("Registrasi Berhasil! Silakan Login.");
        this.$router.push("/login");
      } catch (error) {
        console.error(error);
        alert(error.response?.data?.message || "Registrasi Gagal!");
      }
    },
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.images.length;
    },
    changeImage(index) {
      this.currentImage = index;
    },
    checkScreen() {
      this.isDesktop = window.innerWidth >= 768;
    },
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.checkScreen);
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Righteous&display=swap");
</style>
