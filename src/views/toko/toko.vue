<template>
  <!-- Navbar Utama -->
  <Navbar />

  <!-- Halaman Toko: Menampilkan profil toko dan daftar produk yang dijual oleh toko tersebut -->
  <div class="max-w-6xl mx-auto px-4 py-6" v-if="toko">

    <!-- HEADER TOKO (Nama, Deskripsi, No Telp) -->
    <div class="flex items-center gap-6 border-b pb-4 mb-6">
      <div class="flex-1">
        <h1 class="text-2xl font-bold text-[#7D0A0A] navbar-font">{{ toko.nama_toko }}</h1>
        <p class="text-sm text-gray-600 inter-font">{{ toko.deskripsi }}</p>
        <p class="text-sm text-gray-500 mt-1">Hubungi: {{ toko.no_telp }}</p>
      </div>
    </div>

    <!-- TAB NAVIGASI: Pilih antara Daftar Produk atau Informasi Toko -->
    <div class="flex gap-8 border-b mb-6">
      <button @click="activeTab = 'produk'" :class="['pb-2', activeTab === 'produk' ? 'border-b-2 border-[#7D0A0A] text-[#7D0A0A] font-bold' : 'text-gray-500']">
        Semua Produk
      </button>
      <button @click="activeTab = 'info'" :class="['pb-2', activeTab === 'info' ? 'border-b-2 border-[#7D0A0A] text-[#7D0A0A] font-bold' : 'text-gray-500']">
        Info Toko
      </button>
    </div>

    <!-- TAB 1: DAFTAR PRODUK TOKO -->
    <div v-if="activeTab === 'produk'">
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div v-for="p in products" :key="p.id" @click="router.push(`/produk/${p.id}`)" class="border rounded-lg p-2 text-center cursor-pointer hover:shadow-md transition">
          <div class="bg-gray-100 h-28 flex items-center justify-center overflow-hidden rounded">
            <img v-if="p.foto_cover" :src="p.foto_cover" class="w-full h-full object-cover" />
            <span v-else class="text-gray-400">No Image</span>
          </div>
          <p class="mt-2 text-xs font-medium truncate">{{ p.nama_product }}</p>
          <p class="text-[#7D0A0A] font-bold text-sm">Rp {{ formatRupiah(p.harga) }}</p>
        </div>
        <div v-if="!products.length" class="col-span-full py-10 text-center text-gray-400">Belum ada produk di toko ini.</div>
      </div>
    </div>

    <!-- TAB 2: INFORMASI LENGKAP TOKO -->
    <div v-if="activeTab === 'info'" class="space-y-4">
      <div class="border rounded-lg p-6 bg-white shadow-sm space-y-3">
        <p><strong>Nama Toko:</strong> {{ toko.nama_toko }}</p>
        <p><strong>Tentang Toko:</strong> {{ toko.deskripsi }}</p>
        <p><strong>Lokasi:</strong> 
          {{ toko.alamat_toko?.detail_alamat }}, {{ toko.alamat_toko?.subdistrict_name }}, 
          {{ toko.alamat_toko?.district_name }}, {{ toko.alamat_toko?.city_name }}, {{ toko.alamat_toko?.province_name }}
        </p>
      </div>
    </div>

  </div>

  <!-- Tampilan saat data sedang dimuat -->
  <div v-else class="text-center py-20 text-gray-500">Memuat data toko...</div>
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

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v)

/**
 * Mencari data toko berdasarkan parameter nama_toko yang ada di URL.
 * Setelah toko ditemukan, ambil semua produk yang dijual oleh toko tersebut.
 */
const getTokoByName = async () => {
  try {
    const resToko = await api.get('/toko');
    const namaTujuan = route.query.nama_toko;
    toko.value = resToko.data.data.data.find(t => t.nama_toko.toLowerCase() === namaTujuan?.toLowerCase());

    if (toko.value) {
      const resProduk = await api.get('/product', { params: { user_id: toko.value.user_id, status: 'publish' } });
      products.value = resProduk.data.data.data || [];
    }
  } catch (e) { console.error(e) }
}

onMounted(() => { getTokoByName() })
</script>
