<template>
  <!-- Halaman Dashboard: Tampilan utama yang berisi banner, kategori, dan daftar produk -->
  <Navbar @search="doSearch" />

  <!-- Bagian Atas: Slider Gambar Promo -->
  <div class="p-4">
    <Carousel :images="imagesA" />
  </div>

  <!-- Bagian Tengah: Daftar Kategori (Bisa digeser ke samping) -->
  <div class="flex space-x-2 overflow-x-auto p-4">
    <!-- Tombol untuk menampilkan semua produk -->
    <button
      @click="clearCategory"
      :class="['px-4 py-1 rounded-full whitespace-nowrap', selectedCategories.length === 0 ? 'bg-[#7D0A0A] text-white' : 'border border-[#7D0A0A] text-[#7D0A0A]']"
    >
      Semua Kategori
    </button>

    <!-- Tombol-tombol Kategori -->
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="toggleCategory(cat.id)"
      :class="['px-4 py-1 rounded-full whitespace-nowrap', selectedCategories.includes(cat.id) ? 'bg-[#7D0A0A] text-white' : 'border border-[#7D0A0A] text-[#7D0A0A] navbar-font']"
    >
      {{ cat.nama_category }}
    </button>
  </div>

  <!-- Bagian Bawah: Grid Daftar Produk -->
  <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">
    <!-- Skeleton: Tampilan saat data produk sedang dimuat -->
    <template v-if="isLoading && products.length === 0">
      <div v-for="n in 12" :key="n">
        <Skeleton height="180px"/>
        <Skeleton width="70%" height="18px"/>
        <Skeleton width="40%" height="18px"/>
      </div>
    </template>

    <!-- Menampilkan setiap produk dalam bentuk kartu (Card) -->
    <template v-else>
      <div v-for="product in products" :key="product.id">
        <Product :product="product" :namaToko="getNamaToko(product)" class="h-72"/>
      </div>
    </template>

    <!-- Pesan jika pencarian tidak menemukan hasil -->
    <div v-if="!isLoading && products.length === 0" class="col-span-full text-gray-500 py-10 text-center">
      Produk tidak ditemukan
    </div>
  </div>

  <!-- Tombol 'Tampilkan Lebih Banyak' jika masih ada sisa produk di server -->
  <div v-if="currentPage < lastPage" class="flex justify-center my-6">
    <button @click="loadMore" class="bg-[#7D0A0A] text-white px-6 py-2 rounded hover:bg-[#BF3131] transition inter-font" :disabled="isLoading">
      {{ isLoading ? 'Memuat...' : 'Tampilkan Lebih Banyak' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '@/components/navbar/navbar.vue'
import Product from '@/components/card/product.vue'
import api from "@/plugins/axios"
import Skeleton from "@/components/Skeleton.vue"
import Carousel from '@/components/card/carousel.vue'

const router = useRouter()
const products = ref([])       
const currentPage = ref(1)     
const lastPage = ref(null)     
const isLoading = ref(false)   
const searchQuery = ref("")    
const categories = ref([])
const selectedCategories = ref([])
const imagesA = ref([])

/**
 * Menerima data hasil pencarian dari komponen Navbar.
 */
const doSearch = (data) => {
  products.value = data.products
  searchQuery.value = data.query
  currentPage.value = 1
}

/**
 * Cek role user saat masuk halaman utama.
 * Jika admin, langsung arahkan ke halaman dashboard admin.
 */
const checkRoleAndRedirect = async () => {
  if (!localStorage.getItem("token")) return
  try {
    const response = await api.get('/profile')
    if (response.data.data.nama_role === 'admin') {
      router.push('/admin')
    }
  } catch (error) { console.error(error) }
}

/**
 * Mengambil daftar produk dari API.
 * Mendukung filter berdasarkan nama, kategori, dan pembagian halaman (pagination).
 */
const fetchProducts = async (page = 1) => {
  try {
    isLoading.value = true
    const response = await api.get("/product", {
      params: { 
        status: 'publish',
        page: page,
        nama_product: searchQuery.value,
        categories: selectedCategories.value.join(',')
      }
    })

    if (response.data?.data?.data) {
      const dataBaru = response.data.data.data
      // Jika halaman 1, ganti list produk. Jika halaman > 1, tambahkan ke list yang sudah ada.
      products.value = page === 1 ? dataBaru : [...products.value, ...dataBaru]
      currentPage.value = response.data.data.current_page
      lastPage.value = response.data.data.last_page
    }
  } catch (error) { console.error(error) }
  finally { isLoading.value = false }
}

const getNamaToko = (product) => product.user?.toko?.nama_toko || 'Nama Seller'

// Memuat halaman berikutnya saat tombol diklik
const loadMore = () => {
  if (currentPage.value < lastPage.value && !isLoading.value) {
    fetchProducts(currentPage.value + 1)
  }
}

// Mengambil gambar promo untuk carousel
const getBannerDashboard = async () => {
  try {
    const res = await api.get('/content?section=dashboard')
    const fetchedImages = res.data?.data?.map(item => item.image) || []
    imagesA.value = fetchedImages.length > 0 ? fetchedImages : ['https://placehold.co/1200x400/7D0A0A/FFF?text=Space+Available']
  } catch (error) { console.error(error) }
}

const getCategories = async () => {
  try {
    const res = await api.get('/category')
    categories.value = res.data.data.data || []
  } catch (error) { console.error(error) }
}

/**
 * Fungsi untuk memilih/batal memilih kategori tertentu.
 */
const toggleCategory = async (id) => {
  const index = selectedCategories.value.indexOf(id)
  if (index === -1) { selectedCategories.value.push(id) } 
  else { selectedCategories.value.splice(index, 1) }
  currentPage.value = 1
  await fetchProducts(1)
}

const clearCategory = async () => {
  selectedCategories.value = []
  currentPage.value = 1
  await fetchProducts(1)
}

onMounted(async () => {
  await checkRoleAndRedirect()
  await Promise.all([fetchProducts(1), getBannerDashboard(), getCategories()])
})
</script>
