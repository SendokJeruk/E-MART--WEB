<template>
  <!-- Navbar atas, sekalian nerima data kalo user lagi nyari barang -->
  <Navbar @search="doSearch" />

  <!-- Slider banner iklan di bagian paling atas -->
  <div class="p-4">
    <carousel :images="imagesA" />
  </div>

  <!-- Barisan tombol filter kategori yang bisa digeser-geser -->
  <div class="flex space-x-2 overflow-x-auto p-4">
    
    <!-- Tombol buat nampilin semua barang tanpa pilih-pilih kategori -->
    <button
      @click="clearCategory"
      :class="[
        'px-4 py-1 rounded-full whitespace-nowrap',
        selectedCategories.length === 0
          ? 'bg-[#7D0A0A] text-white'
          : 'border border-[#7D0A0A] text-[#7D0A0A]'
      ]"
    >
      Semua Kategori
    </button>

    <!-- Looping tombol tiap kategori yang ada -->
    <button
      v-for="cat in categories"
      :key="cat.id"
      @click="toggleCategory(cat.id)"
      :class="[
        'px-4 py-1 rounded-full whitespace-nowrap',
        selectedCategories.includes(cat.id)
          ? 'bg-[#7D0A0A] text-white'
          : 'border border-[#7D0A0A] text-[#7D0A0A]'
      ]"
    >
      {{ cat.nama_category }}
    </button>

  </div>

  <!-- Area utama buat majang semua kartu produk (grid) -->
  <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">

    <!-- Skeleton loading kotak-kotak pas datanya lagi dijemput -->
    <template v-if="isLoading && products.length === 0">
      <div v-for="n in 12" :key="n">
        <Skeleton height="180px"/>
        <Skeleton class="mt-2" width="70%" height="18px"/>
        <Skeleton class="mt-1" width="40%" height="18px"/>
      </div>
    </template>

    <!-- Pajang barang dagangannya kalo datanya udah siap -->
    <template v-else>
      <div v-for="product in products" :key="product.id">
        <product :product="product" :namaToko="getNamaToko(product)" class="h-72"/>
      </div>
    </template>

    <!-- Kalo ternyata barang yang dicari gak ada di planet ini -->
    <div 
      v-if="!isLoading && products.length === 0"
      class="col-span-full text-gray-500 py-10 text-center"
    >
      Yah, produknya gak ketemu nih. Coba cari yang lain ya!
    </div>

  </div>

  <!-- Tombol buat muat barang lebih banyak lagi di bawah (Load More) -->
  <div v-if="currentPage < lastPage" class="flex justify-center my-6">
    <button
      @click="loadMore"
      class="bg-[#7D0A0A] text-white px-6 py-2 rounded hover:bg-[#BF3131] transition"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Lagi muat...' : 'Tampilin Lebih Banyak' }}
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

// State buat urusan data produk ama navigasi halaman
const products = ref([])
const currentPage = ref(1)
const lastPage = ref(null)
const isLoading = ref(false)
const searchQuery = ref("")
const isNotFound = ref(false)

// State buat urusan filter-filteran kategori
const categories = ref([])
const selectedCategories = ref([])

// State buat nyatet siapa yang lagi operasional
const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

// State buat nampung gambar banner iklan
const imagesA = ref([])

// Fungsi pas user abis ngetik di kotak cari di navbar
const doSearch = (data) => {
  products.value = data.products
  searchQuery.value = data.query
  currentPage.value = 1 // Reset ke halaman awal kalo nyari barang baru
  isNotFound.value = data.notFound
}

// Cek profil user, kalo admin ya tendang ke halaman admin
const checkRoleAndRedirect = async () => {
  try {
    const response = await api.get('/profile')
    const role = response.data.data.nama_role
    userName.value = response.data.data.name
    userRole.value = role

    if (role === 'admin') {
      router.push('/admin')
    }
  } catch {
    isLoggedIn.value = false
  }
}

// Fungsi utama buat tarik daftar produk dari server
const fetchProducts = async (page = 1) => {
  try {
    isLoading.value = true

    const response = await api.get("/product", {
      params: { 
        status: 'publish', // Cuma ambil barang yang udah tayang
        page: page,
        nama_product: searchQuery.value,
        categories: selectedCategories.value.join(',') // Filter kategori kalo ada yang dipilih
      }
    })

    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      // Acak urutan barangnya dikit biar gak bosen liatnya
      const shuffled = response.data.data.data.sort(() => Math.random() - 0.5)

      if (page === 1) {
        products.value = shuffled
      } else {
        // Kalo load more, tambahin datanya di ekor list
        products.value.push(...shuffled)
      }

      currentPage.value = response.data.data.current_page
      lastPage.value = response.data.data.last_page
    } else {
      products.value = []
    }
  } catch (error) {
    console.error("Gagal ambil produk dari planet lain:", error)
  } finally {
    isLoading.value = false
  }
}

// Shortcut buat dapet nama toko dari data barang
const getNamaToko = (product) => {
  return product.user?.toko?.nama_toko || 'Toko Misterius'
}

// Pas user pengen liat barang lebih banyak lagi di bawah
const loadMore = () => {
  if (currentPage.value < lastPage.value && !isLoading.value) {
    fetchProducts(currentPage.value + 1)
  }
}

// Tarik data banner iklan khusus buat dashboard
const getBannerDashboard = async () => {
  try {
    const res = await api.get('/content?section=dashboard')
    const fetchedImages = res.data?.data?.map(item => item.image) || []
    
    if (fetchedImages.length > 0) {
      imagesA.value = fetchedImages
    } else {
      // Kalo gak ada banner, pake placeholder aja biar gak bolong
      imagesA.value = [
        'https://placehold.co/1200x400/7D0A0A/FFF?text=Space+Available'
      ]
    }
  } catch (error) {
    console.error('Yah, gagal ambil banner dashboard-nya:', error)
    imagesA.value = [
      'https://placehold.co/1200x400/7D0A0A/FFF?text=Space+Available'
    ]
  } finally{
    isLoading.value = false
  }
}

// Tarik semua daftar kategori barang yang tersedia
const getCategories = async () => {
  try {
    const res = await api.get('/category')
    categories.value = res.data.data.data || []
  } catch (error) {
    console.error('Gagal ambil kategori barang nih:', error)
  }
}

// Fungsi buat milih atau ngebatalin pilihan kategori barang
const toggleCategory = async (id) => {
  const index = selectedCategories.value.indexOf(id)

  if (index === -1) {
    selectedCategories.value.push(id) // Belom ada? Tambahin
  } else {
    selectedCategories.value.splice(index, 1) // Udah ada? Copot
  }

  currentPage.value = 1
  await fetchProducts(1) // Tarik ulang barangnya sesuai saringan kategori
}

// Fungsi buat reset semua saringan kategori barang
const clearCategory = async () => {
  selectedCategories.value = []
  currentPage.value = 1
  await fetchProducts(1)
}

// Pas halaman dashboard baru nongol di layar
onMounted(async () => {
  await checkRoleAndRedirect()
  await fetchProducts(currentPage.value)
  await getBannerDashboard()
  await getCategories()
})
</script>

<style>
/* Custom styling buat scroll horizontal kategorinya biar gak kaku */
::-webkit-scrollbar {
  height: 6px;
}
::-webkit-scrollbar-thumb {
  background: #7D0A0A;
  border-radius: 3px;
}
</style>
