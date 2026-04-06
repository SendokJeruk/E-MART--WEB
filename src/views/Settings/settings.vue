<template>
  <Navbar />

  <!-- Halaman menu pengaturan, tempat milih-milih mau ngatur apa -->
  <main class="max-w-xl mx-auto mt-8 p-6 font-inter space-y-8 text-[#7D0A0A]">
    <section>
      <!-- Menu urusan data diri user -->
      <h2 class="text-xl bg-[#BF3131] text-white px-5 py-3 font-bold rounded-t-lg flex items-center space-x-2">
        <span>👤</span><span>Pengaturan Akun</span>
      </h2>
      <ul class="border rounded-b-lg overflow-hidden divide-y">
        <router-link to="/profile" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition">
                <span>Lihat Profil Saya</span>
                <span>&gt;</span>
            </li>
        </router-link>
        <router-link to="/alamat" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition">
                <span>Daftar Alamat Pengiriman</span>
                <span>&gt;</span>
            </li>
        </router-link>
      </ul>

      <!-- Menu urusan belanjaan ama riwayat pesanan -->
      <h2 class="text-xl bg-[#BF3131] text-white px-5 py-3 font-bold rounded-t-lg flex items-center space-x-2 mt-6">
        <span>📦</span><span>Urusan Belanja</span>
      </h2>
      <ul class="border rounded-b-lg overflow-hidden divide-y">
        <router-link to="/list-transaksi" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition">
                <span>Transaksi yang Belom Lunas</span>
                <span>&gt;</span>
            </li>
        </router-link>
        <router-link to="/history-transaksi" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition">
                <span>Riwayat Semua Transaksi</span>
                <span>&gt;</span>
            </li>
        </router-link>
      </ul>
    </section>
  </main>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue'
</script>

<style scoped>
</style>
