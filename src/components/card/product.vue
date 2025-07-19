<template>
    <a href="#" class="group relative block overflow-hidden">
      <button
        class="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75"
      >
        <span class="sr-only">Wishlist</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
          />
        </svg>
      </button>
  
      <img
        :src="product.foto_cover"
        alt="Product Image"
        class="h-64 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-72"
      />
  
      <div class="relative border border-gray-100 bg-white p-4 sm:p-6 font">
        <h3 class="mt-1.5 text-lg font-medium text-gray-900">
          {{ product.nama_product }}
        </h3>
        <p class="mt-1.5 line-clamp-3 text-gray-700 font">
          {{ product.deskripsi || 'Tidak ada deskripsi.' }}
        </p>
        <p class="text-red-600 font-bold text-sm sm:text-base font">
          Rp.{{ formatRupiah(product.harga) }}
        </p>
        <form class="mt-4 flex gap-2">
          <router-link
            :to="`/produk/${product.id}`"
            class="flex-1 rounded-sm bg-[#7D0A0A] px-4 py-2 text-sm font-medium text-white transition hover:scale-105 font"
          >
            Lihat Produk
          </router-link>
        </form>
      </div>
    </a>
  </template>
  
  <script setup>
  defineProps({
    product: {
      type: Object,
      required: true
    }
  });
  const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value)
}
  </script>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Righteous&display=swap');
  
  .font {
      font-family: 'Righteous', cursive;
  }
  </style>