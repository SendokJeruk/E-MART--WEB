<template>
  <Navbar />
  <!-- Halaman buat ngerayain kalo pembayarannya udah beres ama sukses -->
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FFF5F5] to-[#ffeaea] p-6">
    
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 text-center">

      <!-- Ikon centang ijo, tanda kalo duitnya udah aman masuk sistem -->
      <div class="flex justify-center">
        <div class="bg-green-100 p-5 rounded-full">
          <div class="bg-green-500 rounded-full p-4">
            <svg xmlns="http://www.w3.org/2000/svg" 
                 class="h-10 w-10 text-white" 
                 viewBox="0 0 20 20" 
                 fill="currentColor">
              <path fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5 11.586a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" 
                    clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Pesan selamat buat user -->
      <h1 class="text-2xl font-bold text-gray-800 mt-6">
        Pembayaran Berhasil!
      </h1>

      <p class="text-gray-500 text-sm mt-2">
        Asik, transaksi kamu udah beres diproses. Tungguin aja ya paketnya dateng.
      </p>

      <!-- Tombol buat balik ke halaman depan biar bisa belanja lagi -->
      <button 
        @click="router.push('/dashboard')" 
        class="mt-8 w-full py-3 bg-[#7D0A0A] text-white rounded-xl font-semibold 
               hover:bg-[#a32727] transition duration-300 shadow-md">
        Kembali ke Beranda
      </button>

    </div>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Navbar from "@/components/navbar/navbar.vue";

const router = useRouter();
</script>