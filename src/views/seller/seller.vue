<template>
  <sellerside>
    <div class="p-6 bg-[#F3F3F3] min-h-screen">
      <div class="flex justify-between items-start">
        <h1 class="text-2xl font-bold">Dashboard Seller</h1>

        <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://via.placeholder.com/100'" class="w-10 h-10 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div class="bg-white rounded-lg shadow border p-6 text-center">
          <h2 class="font-semibold text-lg mb-2">Total Product</h2>
          <p class="text-lg font-bold text-red-700">{{ ProductSeller.length }}</p>
        </div>
        <div class="bg-white rounded-lg shadow border p-6 text-center">
          <h2 class="font-semibold text-lg mb-2">Total Penjualan</h2>
          <p class="text-lg font-bold text-red-700">{{ totalPenjualan }}</p>
        </div>
        <div class="bg-white rounded-lg shadow border p-6 text-center">
          <h2 class="font-semibold text-lg mb-2">Total Income</h2>
          <p class="text-lg font-bold text-red-700">Rp. {{ totalIncome.toLocaleString('id-ID') }}</p>
        </div>
      </div>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import Sellerside from '@/components/navbar/seller-side.vue'

const ProductSeller = ref([])
const user = ref({})
const totalPenjualan = ref(10) 
const totalIncome = ref(2000000) 

const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data 
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

const getProducts = async () => {
  try {
    const response = await api.get('/product')
    const allProducts = response.data.data.data
    ProductSeller.value = allProducts.filter(p => p.user_id === user.value.id) 
  } catch (error) {
    console.error('Gagal mengambil produk:', error)
  }
}

onMounted(async () => {
  await getProfile()
  await getProducts()
})
</script>
