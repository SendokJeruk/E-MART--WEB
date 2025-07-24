<template>
    <sellerside>
      <div>
        <h1 class="text-3xl font-bold mb-6">Dashboard Seller</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-2xl shadow p-6 text-center">
            <h2 class="text-xl font-semibold mb-2">Total Product</h2>
            <p class="text-3xl font-bold text-red-600">{{ ProductSeller.length }}</p> 
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
  
  <style scoped>

  </style>
  