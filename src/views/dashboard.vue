<template>
  <Navbar v-model="searchQuery" />

  <div class="p-4">
    <carousel :images="imagesA" />
  </div>

  <div class="flex space-x-2 overflow-x-auto p-4">
    <button class="px-4 py-1 bg-[#7D0A0A] text-white rounded-full whitespace-nowrap">Semua Kategori</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Pedas</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Manis</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Asin</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Murah</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Promo</button>
  </div>

  <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">
    <div v-for="product in filteredProducts" :key="product.id">
      <product :product="product" :namaToko="getNamaToko(product)" class="h-72"/>
    </div>

    <div v-if="filteredProducts.length === 0" class="col-span-full text-gray-500 py-10 text-center">
      Tidak ada produk ditemukan.
    </div>
  </div>



  <div v-if="currentPage < lastPage" class="flex justify-center my-6">
    <button
      @click="loadMore"
      class="bg-[#7D0A0A] text-white px-6 py-2 rounded hover:bg-[#BF3131] transition"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Memuat...' : 'Tampilkan Lebih Banyak' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/navbar/navbar.vue'
import product from '@/components/card/product.vue'
import api from "@/plugins/axios"
import Carousel from '@/components/card/carousel.vue'

const router = useRouter()

const products = ref([])
const currentPage = ref(1)
const lastPage = ref(null)
const isLoading = ref(false)
const searchQuery = ref("")

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

const imagesA = [
  'https://placehold.co/300',
  'https://placehold.co/300',
  'https://placehold.co/300',
  'https://placehold.co/300'
]

const checkRoleAndRedirect = async () => {
  try {
    const response = await api.get('/profile')
    const role = response.data.data.nama_role

    userName.value = response.data.data.name
    userRole.value = role

    if (role === 'admin') {
      router.push('/admin')
    }
  } catch (error) {
    isLoggedIn.value = false
  }
}


const fetchProducts = async (page = 1) => {
  try {
    isLoading.value = true

    const response = await api.get("/product", {
      params: { status: 'publish', page: page }
    })

    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      const newProducts = response.data.data.data
      products.value.push(...newProducts)
      currentPage.value = response.data.data.current_page
      lastPage.value = response.data.data.last_page
    }
  } catch (error) {
    console.error("Gagal mengambil produk:", error)
  } finally {
    isLoading.value = false
  }
}

const getNamaToko = (product) => {
  return product.user?.toko?.nama_toko || 'Nama Seller'
}

const loadMore = () => {
  if (currentPage.value < lastPage.value && !isLoading.value) {
    fetchProducts(currentPage.value + 1)
  }
}

const filteredProducts = computed(() => {
  return products.value.filter((product) =>
    product.nama_product.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

onMounted(async () => {
  await checkRoleAndRedirect()
  await fetchProducts(currentPage.value)
})
</script>

<style>
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #7D0A0A;
  border-radius: 3px;
}
</style>
