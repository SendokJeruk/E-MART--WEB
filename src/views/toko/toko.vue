<template>
  <navbar />

  <div class="max-w-6xl mx-auto px-4 py-6">
    <!-- Header Toko -->
    <div class="flex items-center gap-6 border-b pb-4 mb-6">
      <div class="w-20 h-20 bg-gray-200 rounded-full"></div>
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-[#7D0A0A]">Store SS</h1>
        <p class="text-sm text-gray-600">3.3k Followers</p>
        <p class="text-yellow-600 font-semibold">⭐ 5.0</p>
      </div>
      <div class="flex gap-2">
        <button class="border border-[#7D0A0A] text-[#7D0A0A] px-4 py-1 rounded-lg">
          + Follow
        </button>
        <button class="bg-[#7D0A0A] text-white px-4 py-1 rounded-lg">
          Chat
        </button>
      </div>
    </div>

    <!-- Tab Navigasi -->
    <div class="flex gap-8 border-b mb-6">
      <button class="pb-2 border-b-2 border-[#7D0A0A] text-[#7D0A0A] font-semibold">
        Toko
      </button>
      <button class="pb-2 text-gray-600 hover:text-[#7D0A0A]">Produk</button>
      <button class="pb-2 text-gray-600 hover:text-[#7D0A0A]">Kategori</button>
    </div>

    <!-- Banner -->
    <div class="space-y-4 mb-8">
      <div class="h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
        Banner Field
      </div>
      <div class="h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
        Banner Field
      </div>
    </div>

    <!-- Produk -->
    <h2 class="text-lg font-semibold mb-4">Produk Dari Toko Ini</h2>
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
      <div
        v-for="n in 12"
        :key="n"
        class="border rounded-lg p-2 text-center text-sm"
      >
        <div class="bg-gray-100 h-28 flex items-center justify-center">
          No Image
        </div>
        <p class="mt-2 font-medium">Barang Daun jeruk</p>
        <p class="text-[#7D0A0A] font-bold">Rp 0</p>
        <p class="text-xs text-gray-500">5.0 ⭐</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import navbar from '@/components/navbar/navbar.vue'
</script>
