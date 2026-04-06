<template>
  <!-- Navbar utama -->
  <Navbar />

  <!-- Kontainer utama toko -->
  <div class="max-w-6xl mx-auto px-4 py-6" v-if="toko">
    <!-- Header Toko -->
    <div class="flex items-center gap-6 border-b pb-4 mb-6">
      <!-- Logo Toko (placeholder) -->
      <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
        <span class="text-gray-500">Logo</span>
      </div>

      <!-- Informasi Toko -->
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-[#7D0A0A]">{{ toko.nama_toko }}</h1>
        <p class="text-yellow-600 font-semibold">⭐ {{ toko.rating || '0.0' }}</p>
      </div>      
    </div>

    <!-- Tab Navigasi Toko -->
    <div class="flex gap-8 border-b mb-6">
      <button class="pb-2 border-b-2 border-[#7D0A0A] text-[#7D0A0A] font-semibold">
        Toko
      </button>
    </div>

    <!-- Banner Toko -->
    <div class="space-y-4 mb-8">
      <div class="h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
        Banner Field
      </div>
      <div class="h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
        Banner Field
      </div>
    </div>

    <!-- Daftar Produk Toko -->
    <h2 class="text-lg font-semibold mb-4">Produk Dari Toko Ini</h2>
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
      <!-- Render setiap produk -->
      <div
        v-for="product in products"
        :key="product.id"
        @click="goToProduct(product.id)"
        class="border rounded-lg p-2 text-center text-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition"
      >
        <!-- Gambar produk -->
        <div class="bg-gray-100 h-28 flex items-center justify-center">
          <img
            v-if="product.foto_cover"
            :src="product.foto_cover"
            alt="Produk"
            class="w-full h-full object-contain"
          />
          <span v-else class="text-gray-500">No Image</span>
        </div>

        <!-- Nama, harga, dan rating produk -->
        <p class="mt-2 font-medium">{{ product.nama_product }}</p>
        <p class="text-[#7D0A0A] font-bold">Rp {{ formatRupiah(product.harga) }}</p>
        <p class="text-xs text-gray-500">
          ⭐ {{ product.rating.length ? product.rating[0].rating : '0.0' }}
        </p>
      </div>

      <!-- Pesan jika tidak ada produk -->
      <div v-if="products.length === 0" class="col-span-full text-gray-500 py-10 text-center">
        Tidak ada produk ditemukan.
      </div>
    </div>
  </div>

  <!-- Loading state jika data toko belum siap -->
  <div v-else class="text-center py-20 text-gray-500">
    Memuat data toko...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'

// Route untuk ambil parameter nama_toko dari URL
const route = useRoute()
const router = useRouter()

// State
const toko = ref(null)         // Data toko saat ini
const products = ref([])       // Produk dari toko

// Fungsi mengambil data toko berdasarkan nama_toko dari URL
const getTokoByName = async () => {
  try {
    // Ambil semua toko dari API
    const response = await api.get('/toko') 
    const allToko = response.data.data.data

    // Ambil nama_toko dari URL dan ubah dari slug menjadi nama
    const namaTokoUrl = decodeURIComponent(route.params.nama_toko)
    const namaTokoFromSlug = namaTokoUrl.replace(/-/g, ' ')

    // Cari toko yang sesuai dengan nama dari slug
    toko.value = allToko.find(
      t => t.nama_toko.toLowerCase() === namaTokoFromSlug.toLowerCase()
    ) || null

    if (!toko.value) {
      console.warn('Toko tidak ditemukan')
      return
    }

    const resProduk = await api.get('/product', {
      params: { user_id: toko.value.user_id, status: 'publish' }
    })
    products.value = resProduk.data.data.data || []
    console.log('Produk toko:', products.value)
  } catch (error) {
    console.error('Gagal mengambil toko:', error)
  }
}

// Fungsi untuk format angka menjadi rupiah
const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(value)


const goToProduct = (id) => {
  router.push(`/produk/${id}`)
}
onMounted(() => {
  getTokoByName()
})
</script>
