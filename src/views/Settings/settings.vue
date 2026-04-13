<template>
  <Navbar />
  <!-- Halaman Menu Pengaturan: Pintu masuk untuk mengelola Akun, Alamat, dan melihat riwayat Transaksi -->
  <main class="max-w-xl mx-auto mt-8 p-6 font-inter space-y-8 text-[#7D0A0A]">
    <section>
      <!-- BAGIAN 1: PENGATURAN DATA DIRI -->
      <h2 class="navbar-font bg-[#BF3131] text-white px-5 py-3 font-bold rounded-t-lg flex items-center space-x-2">
       <span>Akun Saya</span>
      </h2>
      <ul class="border rounded-b-lg overflow-hidden divide-y">
        <router-link to="/profile" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition inter-font">
                <span>Profil Pengguna</span>
                <span>&gt;</span>
            </li>
        </router-link>
        <router-link to="/alamat" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition inter-font">
                <span>Alamat Pengiriman</span>
                <span>&gt;</span>
            </li>
        </router-link>
      </ul>

      <!-- BAGIAN 2: PENGATURAN TRANSAKSI -->
      <h2 class="navbar-font bg-[#BF3131] text-white px-5 py-3 font-bold rounded-t-lg flex items-center space-x-2 mt-6">
        <span>Transaksi Saya</span>
      </h2>
      <ul class="border rounded-b-lg overflow-hidden divide-y">
        <router-link to="/list-transaksi" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition inter-font">
                <span>Daftar Transaksi Menunggu</span>
                <span>&gt;</span>
            </li>
        </router-link>
        <router-link to="/history-transaksi" class="block">
            <li class="bg-white px-5 py-4 flex justify-between items-center hover:bg-[#FCE8E8] transition inter-font">
                <span>Riwayat Pesanan Selesai</span>
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
