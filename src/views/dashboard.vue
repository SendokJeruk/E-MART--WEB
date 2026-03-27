<template>
  <!-- Navbar dengan search input -->
  <Navbar v-model="searchQuery" @search="doSearch" />

  <!-- Carousel/Slider gambar -->
  <div class="p-4">
    <carousel :images="imagesA" />
  </div>

  <!-- Kategori produk -->
  <div class="flex space-x-2 overflow-x-auto p-4">
    <button class="px-4 py-1 bg-[#7D0A0A] text-white rounded-full whitespace-nowrap">Semua Kategori</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Pedas</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Manis</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Asin</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Murah</button>
    <button class="px-4 py-1 border border-[#7D0A0A] text-[#7D0A0A] rounded-full whitespace-nowrap">Promo</button>
  </div>

  <!-- Daftar Produk -->
  <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">

    <!-- Skeleton -->
    <template v-if="isLoading && products.length === 0">
      <div v-for="n in 12" :key="n">
        <Skeleton height="180px"/>
        <Skeleton width="70%" height="18px"/>
        <Skeleton width="40%" height="18px"/>
      </div>
    </template>

    <!-- Produk -->
    <template v-else>
      <div v-for="product in products" :key="product.id">
        <product :product="product" :namaToko="getNamaToko(product)" class="h-72"/>
      </div>
    </template>

    <!-- Tidak ada produk -->
    <div v-if="!isLoading && products.length === 0" class="col-span-full text-gray-500 py-10 text-center">
      Tidak ada produk ditemukan.
    </div>

  </div>

  <!-- Tombol Load More untuk pagination -->
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/navbar/navbar.vue'
import product from '@/components/card/product.vue'
import api from "@/plugins/axios"
import Skeleton from "@/components/Skeleton.vue"
import Carousel from '@/components/card/carousel.vue'

const router = useRouter()

// State produk & pagination
const products = ref([])       // Menyimpan data produk
const currentPage = ref(1)     // Halaman saat ini
const lastPage = ref(null)     // Halaman terakhir dari API
const isLoading = ref(false)   // Loading state
const searchQuery = ref("")    // Query pencarian produk

// State user
const isLoggedIn = ref(false)  // Status login
const userName = ref('')       // Nama user
const userRole = ref('')       // Role user

// Gambar carousel
const imagesA = ref([])

// Fungsi untuk menangani pencarian
const doSearch = (query) => {
  searchQuery.value = query
  fetchProducts(1) // Fetch ulang dari halaman 1
}

// Fungsi cek role user & redirect jika admin
const checkRoleAndRedirect = async () => {
  try {
    const response = await api.get('/profile')
    const role = response.data.data.nama_role
    userName.value = response.data.data.name
    userRole.value = role

    if (role === 'admin') {
      router.push('/admin') // Redirect admin ke halaman admin
    }
  } catch {
    isLoggedIn.value = false
  }
}

// Fetch produk dari API
const fetchProducts = async (page = 1) => {
  try {
    isLoading.value = true

    const response = await api.get("/product", {
      params: { 
        status: 'publish',      // Hanya produk publish
        page: page,             // Pagination
        nama_product: searchQuery.value // Search filter
      }
    })

    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      // Acak produk sebelum ditampilkan
      const shuffled = response.data.data.data.sort(() => Math.random() - 0.5)

      if (page === 1) {
        products.value = shuffled
      } else {
        products.value.push(...shuffled)
      }

      currentPage.value = response.data.data.current_page
      lastPage.value = response.data.data.last_page
    } else {
      products.value = []
    }
  } catch (error) {
    console.error("Gagal mengambil produk:", error)
  } finally {
    isLoading.value = false
  }
}

// Ambil nama toko dari object product
const getNamaToko = (product) => {
  return product.user?.toko?.nama_toko || 'Nama Seller'
}

// Fungsi load more untuk pagination
const loadMore = () => {
  if (currentPage.value < lastPage.value && !isLoading.value) {
    fetchProducts(currentPage.value + 1)
  }
}

const getBannerDashboard = async () => {
  try {
    const res = await api.get('/content?section=dashboard')
    imagesA.value = res.data.data.map(item => item.image) || []
    console.log("Fetched dashboard banners:", res)
  } catch (error) {
    console.error('Gagal ambil banner dashboard:', error)
  } finally{
    isLoading.value = false
  }
}

// Lifecycle hook
onMounted(async () => {
  await checkRoleAndRedirect()
  await fetchProducts(currentPage.value)
  await getBannerDashboard()
})
</script>

<style>
/* Styling scroll horizontal kategori */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #7D0A0A;
  border-radius: 3px;
}
</style>
