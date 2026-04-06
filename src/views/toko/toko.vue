<template>
  <!-- Navbar utama, biar buyer bisa nyari barang lain juga -->
  <Navbar />

  <!-- Bagian utama halaman profil toko -->
  <div class="max-w-6xl mx-auto px-4 py-6" v-if="toko">
    <!-- Header Toko: pajang nama ama rating-nya -->
    <div class="flex items-center gap-6 border-b pb-4 mb-6">
      <!-- Logo Toko, sementara pake placeholder dulu ya -->
      <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
        <span class="text-gray-500">Logo</span>
      </div>

      <!-- Info nama toko ama akumulasi bintang ulasan buyer -->
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-[#7D0A0A]">{{ toko.nama_toko }}</h1>
        <p class="text-yellow-600 font-semibold">⭐ {{ toko.rating || '0.0' }}</p>
      </div>      
    </div>

    <!-- Tab menu toko, sementara cuma ada Beranda Toko aja -->
    <div class="flex gap-8 border-b mb-6">
      <button class="pb-2 border-b-2 border-[#7D0A0A] text-[#7D0A0A] font-semibold">
        Profil Toko
      </button>
    </div>

    <!-- Banner hiasan toko biar keliatan profesional -->
    <div class="space-y-4 mb-8">
      <div class="h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
        Pajangan Banner Toko 1
      </div>
      <div class="h-32 bg-gray-100 border rounded-lg flex items-center justify-center">
        Pajangan Banner Toko 2
      </div>
    </div>

    <!-- Daftar semua produk yang dijual toko ini -->
    <h2 class="text-lg font-semibold mb-4">Semua Produk Toko Ini</h2>
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
      <!-- Looping tiap produk biar nongol kartu-kartunya -->
      <div
        v-for="product in products"
        :key="product.id"
        @click="goToProduct(product.id)"
        class="border rounded-lg p-2 text-center text-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition"
      >
        <!-- Pratinjau gambar produknya -->
        <div class="bg-gray-100 h-28 flex items-center justify-center">
          <img
            v-if="product.foto_cover"
            :src="product.foto_cover"
            alt="Produk"
            class="w-full h-full object-contain"
          />
          <span v-else class="text-gray-500">Gak ada foto</span>
        </div>

        <!-- Info ringkas produk (nama, harga, rating) -->
        <p class="mt-2 font-medium">{{ product.nama_product }}</p>
        <p class="text-[#7D0A0A] font-bold">Rp {{ formatRupiah(product.harga) }}</p>
        <p class="text-xs text-gray-500">
          ⭐ {{ product.rating.length ? product.rating[0].rating : '0.0' }}
        </p>
      </div>

      <!-- Kalo ternyata toko-nya lagi kosong melompong barangnya -->
      <div v-if="products.length === 0" class="col-span-full text-gray-500 py-10 text-center">
        Toko ini belom jualan barang apapun nih.
      </div>
    </div>
  </div>

  <!-- Tampilan pas lagi narik data toko dari server -->
  <div v-else class="text-center py-20 text-gray-500">
    Lagi loading data tokonya nih, tunggu ya...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'

const route = useRoute()
const router = useRouter()

// State buat nampung data toko ama list barangnya
const toko = ref(null)
const products = ref([])

// Fungsi buat nyari info toko berdasarkan nama di URL
const getTokoByName = async () => {
  try {
    // Ambil dulu semua daftar toko
    const response = await api.get('/toko') 
    const allToko = response.data.data.data

    // Ubah format nama toko dari URL (slug) balik ke nama asli
    const namaTokoUrl = decodeURIComponent(route.params.nama_toko)
    const namaTokoFromSlug = namaTokoUrl.replace(/-/g, ' ')

    // Cari toko yang namanya cocok
    toko.value = allToko.find(
      t => t.nama_toko.toLowerCase() === namaTokoFromSlug.toLowerCase()
    ) || null

    if (!toko.value) {
      console.warn('Toko-nya gak nemu nih')
      return
    }

    // Kalo toko nemu, baru sikat ambil semua produknya
    const resProduk = await api.get('/product', {
      params: { user_id: toko.value.user_id, status: 'publish' }
    })
    products.value = resProduk.data.data.data || []
    console.log('Produk toko:', products.value)
  } catch (error) {
    console.error('Yah, gagal ngintip tokonya:', error)
  }
}

// Fungsi ngerapiin tampilan duit Rupiah
const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(value)

// Pas buyer klik salah satu barang, langsung anter ke detailnya
const goToProduct = (id) => {
  router.push(`/produk/${id}`)
}

// Pas halaman kebuka, langsung gas tarik data tokonya
onMounted(() => {
  getTokoByName()
})
</script>
