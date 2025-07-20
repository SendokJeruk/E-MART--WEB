<template>
  <Navbar v-model="searchQuery" />
  <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 p-4">
    <product
      v-for="product in filteredProducts"
      :key="product.id"
      :product="product"
    />
    <div v-if="filteredProducts.length === 0" class="col-span-full text-center text-gray-500 py-10 oswald-font">
      Tidak ada produk ditemukan.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/navbar/navbar.vue'
import product from '@/components/card/product.vue'
import api from "@/plugins/axios"

const router = useRouter()
const products = ref([])
const searchQuery = ref("")

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

const checkRoleAndRedirect = async () => {
  try {
    const response = await api.get('/profile')
    const role = response.data.data.nama_role

    isLoggedIn.value = true
    userName.value = response.data.data.name
    userRole.value = role

    if (role === 'admin') {
      router.push('/admin')
    }
  } catch (error) {
    router.push('/auth/login')
  }
}

const fetchProducts = async () => {
  try {
    const response = await api.get("/product", {
      params: {
        status: 'publish'
      }
    })

    if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
      products.value = response.data.data.data.sort(() => Math.random() - 0.5)
    } else {
      console.error("Expected an array but got:", typeof response.data.data)
    }
  } catch (error) {
    console.error("Error fetching products:", error)
  }
}

onMounted(async () => {
  await checkRoleAndRedirect()
  await fetchProducts()
})

const filteredProducts = computed(() => {
  return products.value.filter((product) =>
    product.nama_product.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
