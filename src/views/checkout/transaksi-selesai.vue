<template>
  <Navbar />
  <!-- Halaman Sukses: Tampilan penutup setelah user berhasil menyelesaikan pembayaran via Midtrans -->
  <div class="flex items-center justify-center min-h-screen bg-[#FFF5F5] p-6">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 text-center">
      
      <!-- Icon Centang Hijau -->
      <div class="flex justify-center mb-6">
        <div class="bg-green-100 p-5 rounded-full">
          <div class="bg-green-500 rounded-full p-4 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-800 navbar-font">Pembayaran Berhasil!</h1>
      <p class="text-gray-500 text-sm mt-2 inter-font">Terima kasih atas pesananmu. Penjual akan segera memproses barang Anda.</p>

      <!-- Tombol Kembali ke Beranda -->
      <button @click="router.push('/dashboard')" class="mt-8 w-full py-3 bg-[#7D0A0A] text-white rounded-xl font-semibold shadow-md">
        Kembali Belanja
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import Navbar from "@/components/navbar/navbar.vue";
const router = useRouter();
</script>
