<template>
  <sellerside>
    <!-- Halaman Kelola Kategori Produk: Mengelompokkan produk ke kategori yang sesuai -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">
      <h1 class="text-2xl md:text-3xl navbar-font text-gray-800 mb-6">Kelola Kategori Produk</h1>

      <!-- Tombol Navigasi -->
      <div class="flex gap-3 mb-6">
        <router-link to="/create-kategori-produk" class="px-5 py-2 bg-[#7D0A0A] text-white rounded-lg text-sm">+ Hubungkan Produk ke Kategori</router-link>
      </div>

      <!-- TABEL HUBUNGAN PRODUK & KATEGORI -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3">Nama Produk</th>
              <th class="px-4 py-3">Daftar Kategori</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="p in groupedProducts" :key="p.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ p.nama }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap gap-2">
                  <!-- Menampilkan tag kategori yang bisa dihapus satu per satu -->
                  <span v-for="cat in p.categories" :key="cat.pivotId" class="px-2 py-1 bg-gray-200 rounded text-xs flex items-center gap-2">
                    {{ cat.nama }}
                    <button @click="deleteRelation(cat.pivotId)" class="text-red-500 font-bold">×</button>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import { showConfirm, showSuccess } from '@/utils/alert'

const allData = ref([])

/**
 * Mengambil semua data relasi produk dan kategori milik seller.
 */
const fetchData = async () => {
  const res = await api.get('/category-product')
  allData.value = res.data.data.data || []
}

/**
 * Mengelompokkan data berdasarkan produk agar satu baris tabel bisa berisi banyak kategori.
 */
const groupedProducts = computed(() => {
  const groups = {}
  allData.value.forEach(item => {
    if (!item.product) return
    if (!groups[item.product.id]) groups[item.product.id] = { nama: item.product.nama_product, categories: [] }
    groups[item.product.id].categories.push({ nama: item.category?.nama_category, pivotId: item.id })
  })
  return groups
})

/**
 * Menghapus hubungan antara produk dengan salah satu kategorinya.
 */
const deleteRelation = async (id) => {
  if (!await showConfirm('Hapus kategori dari produk ini?')) return
  await api.delete(`/category-product/${id}`)
  showSuccess('Kategori dilepas dari produk'); fetchData()
}

onMounted(() => { fetchData() })
</script>
