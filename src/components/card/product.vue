<template>
  <router-link :to="`/produk/${product.id}`" class="group block bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm transition hover:shadow-md h-full flex flex-col text-xs">
    <div class="overflow-hidden h-30 bg-gray-100 flex items-center justify-center text-xs">
      <template v-if="product.foto_cover">
        <img
          :src="product.foto_cover"
          alt="Product Image"
          class="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          @error="(e) => e.target.src = 'https://placehold.co/400x400?text=Image+Not+Found'"
        />
      </template>
      <template v-else>
        <span class="text-gray-400 text-xs">No Images</span>
      </template>
    </div>

    <div class="h-1 bg-[#7D0A0A]"></div>

    <div class="p-3 font flex-1 flex flex-col justify-between">
      <div>
        <h3 class="font-bold text-black text-sm truncate overflow-hidden whitespace-nowrap">
          {{ product.nama_product }}
        </h3>


        <p class="text-[#7D0A0A] font-bold mt-1 inter-font text-sm">
          RP. {{ formatRupiah(product.harga) }}
        </p>

        <div class="text-gray-800 text-xs mt-1 inter-font truncate overflow-hidden whitespace-nowrap">
          {{ namaToko }}
        </div>
      </div>

      <div class="flex items-center text-xs mt-2">
        <div class="text-gray-600 text-xs inter-font mr-7">
          {{ product.stock || 0 }} Stock
          {{ product.terjual || 0 }} Sold
        </div>

        <span class="font-bold">{{ product.average_rating || 0 }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.853 1.507 8.341L12 18.896l-7.443 4.604 1.507-8.341-6.064-5.853 8.332-1.151z" />
        </svg>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
  namaToko: { type: String, default: 'Nama Seller' }
})

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
