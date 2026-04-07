<template>
  <!-- Navbar -->
  <Navbar />

  <!-- Content -->
  <div class="max-w-6xl mx-auto px-4 py-6" v-if="toko">

    <!-- HEADER TOKO -->
    <div class="flex items-center gap-6 border-b pb-4 mb-6">

      <div class="flex-1">
        <h1 class="text-2xl font-bold text-[#7D0A0A]">
          {{ toko.nama_toko }}
        </h1>
        <p class="text-sm text-gray-600">
          {{ toko.deskripsi }}
        </p>
        <p class="text-sm text-gray-600">
          {{ toko.no_telp }}
        </p>
      </div>
    </div>

    <!-- TAB -->
    <div class="flex gap-8 border-b mb-6">
      <button
        @click="activeTab = 'produk'"
        :class="[
          'pb-2',
          activeTab === 'produk'
            ? 'border-b-2 border-[#7D0A0A] text-[#7D0A0A] font-semibold'
            : 'text-gray-500'
        ]"
      >
        Semua Produk
      </button>

      <button
        @click="activeTab = 'info'"
        :class="[
          'pb-2',
          activeTab === 'info'
            ? 'border-b-2 border-[#7D0A0A] text-[#7D0A0A] font-semibold'
            : 'text-gray-500'
        ]"
      >
        Info Toko
      </button>
    </div>

    <!-- ===================== -->
    <!-- TAB: PRODUK -->
    <!-- ===================== -->
    <div v-if="activeTab === 'produk'">
      <h2 class="text-lg font-semibold mb-4">Produk Dari Toko Ini</h2>

      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div
          v-for="product in products"
          :key="product.id"
          @click="goToProduct(product.id)"
          class="border rounded-lg p-2 text-center text-sm cursor-pointer hover:shadow-md hover:scale-[1.02] transition"
        >
          <div class="bg-gray-100 h-28 flex items-center justify-center">
            <img
              v-if="product.foto_cover"
              :src="product.foto_cover"
              class="w-full h-full object-contain"
            />
            <span v-else class="text-gray-500">No Image</span>
          </div>

          <p class="mt-2 font-medium">
            {{ product.nama_product }}
          </p>

          <p class="text-[#7D0A0A] font-bold">
            Rp {{ formatRupiah(product.harga) }}
          </p>

          <p class="text-xs text-gray-500">
            ⭐ {{ product.rating.length ? product.rating[0].rating : '0.0' }}
          </p>
        </div>

        <div v-if="products.length === 0" class="col-span-full text-gray-500 py-10 text-center">
          Tidak ada produk ditemukan.
        </div>
      </div>
    </div>

    <!-- ===================== -->
    <!-- TAB: INFO TOKO -->
    <!-- ===================== -->
    <div v-if="activeTab === 'info'" class="space-y-4">

      <h2 class="text-lg font-semibold">Informasi Toko</h2>

      <div class="border rounded-lg p-4 bg-white shadow-sm space-y-2">

        <p><strong>Nama:</strong> {{ toko.nama_toko }}</p>
        <p><strong>Deskripsi:</strong> {{ toko.deskripsi }}</p>
        <p><strong>No Telp:</strong> {{ toko.no_telp }}</p>

        <hr />

        <p><strong>Alamat Lengkap:</strong></p>
        <p class="text-gray-600">
          {{ toko.alamat_toko?.detail_alamat }}
        </p>

        <p class="text-gray-600">
          {{ toko.alamat_toko?.subdistrict_name }},
          {{ toko.alamat_toko?.district_name }},
          {{ toko.alamat_toko?.city_name }},
          {{ toko.alamat_toko?.province_name }}
        </p>

      </div>
    </div>

  </div>

  <!-- LOADING -->
  <div v-else class="text-center py-20 text-gray-500">
    Memuat data toko...
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'

const route = useRoute()
const router = useRouter()

const toko = ref(null)
const products = ref([])
const activeTab = ref('produk')

// GET TOKO
const getTokoByName = async () => {
  try {
    const response = await api.get('/toko')
    const allToko = response.data.data.data

    const namaToko = route.query.nama_toko

    if (!namaToko) {
      console.warn('Parameter nama_toko tidak ada')
      return
    }

    toko.value = allToko.find(
      t => t.nama_toko.toLowerCase() === namaToko.toLowerCase()
    ) || null

    if (!toko.value) {
      console.warn('Toko tidak ditemukan')
      return
    }

    const resProduk = await api.get('/product', {
      params: {
        user_id: toko.value.user_id,
        status: 'publish'
      }
    })

    products.value = resProduk.data.data.data || []

  } catch (error) {
    console.error('Gagal mengambil toko:', error)
  }
}

// FORMAT RUPIAH
const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID').format(value)

// NAVIGATE
const goToProduct = (id) => {
  router.push(`/produk/${id}`)
}

onMounted(() => {
  getTokoByName()
})
</script>