<template>
    <sellerside>
      <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl font-bold mb-4">Form Tambah Kategori Produk</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="product_id" class="block mb-1">Pilih Produk</label>
            <select
              id="product_id"
              v-model="form.product_id"
              class="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Produk --</option>
              <option
                v-for="product in ProductSeller"
                :key="product.id"
                :value="product.id"
              >
                {{ product.nama_product }}
              </option>
            </select>
          </div>
  
          <div class="mb-4">
            <label for="category_id" class="block mb-1">Pilih Kategori</label>
            <select
              id="category_id"
              v-model="form.category_id"
              class="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Kategori --</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.nama_category }}
              </option>
            </select>
          </div>
  
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </sellerside>
  </template>
  
  <script setup>
  import Sellerside from '@/components/navbar/seller-side.vue'
  import { ref, onMounted } from 'vue'
  import api from '@/plugins/axios'
  import { useRouter } from 'vue-router'
  
  const user = ref({})
  const products = ref([])
  const categories = ref([]) 
  const ProductSeller = ref([])
  const router = useRouter()
  
  const form = ref({
    product_id: '',
    category_id: ''
  })
  
  const getProfile = async () => {
    try {
      const response = await api.get('/profile')
      user.value = response.data.data 
      await getProduct()
      await getCategories()
    } catch (error) {
      console.error('Gagal mengambil profil:', error)
    }
  }
  
  const getProduct = async () => {
    try {
      const response = await api.get('/product/myproduct')
      if (Array.isArray(response.data.data.data)) {
        products.value = response.data.data.data
        ProductSeller.value = products.value.filter(p => p.user_id === user.value.id)
      } else {
        console.error('Data Produk tidak berupa array:', response.data.data.data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    }
  }
  
  const getCategories = async () => {
    try {
      const response = await api.get('/category')
      if (Array.isArray(response.data.data.data)) {
        categories.value = response.data.data.data
      } else {
        console.error("Data category tidak berupa array:", response.data.data.data)
      }
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  }
  
  const submitForm = async () => {
    try {
      const formData = new FormData()
      formData.append('product_id', form.value.product_id)
      formData.append('category_id', form.value.category_id)

      console.log("Data yang dikirim:", form.value)

      const response = await api.post('/category-product', formData)
      alert('Category Produk Berhasil Ditambahkan!')
      form.value = {
        product_id: '',
        category_id: ''
      }
      router.push('/manage-kategori-produk')
    } catch (error) {
        console.log(error)
        console.log(error.response)
        console.log(error.response?.data)

        alert(error.response?.data?.message || 'Gagal menambahkan produk')
      }
  }
  
  onMounted(async () => {
    await getProfile()
  })
  </script>
  
  <style scoped>
  </style>
    