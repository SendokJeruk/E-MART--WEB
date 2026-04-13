<template>
  <sellerside>
    <!-- Halaman Manajemen Foto: Tempat seller mengelola galeri foto tambahan untuk setiap produk -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">
      <h1 class="text-2xl md:text-3xl navbar-font text-gray-800 mb-6">Kelola Foto Produk</h1>

      <div class="flex gap-3 mb-6">
        <router-link to="/create-foto-product" class="px-5 py-2 bg-[#7D0A0A] text-white rounded-lg text-sm">+ Upload Foto Baru</router-link>
      </div>

      <div class="bg-white rounded-lg shadow overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3">Nama Produk</th>
              <th class="px-4 py-3">Galeri Foto</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="p in products" :key="p.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">{{ p.nama_product }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-3 overflow-x-auto py-2">
                  <!-- List foto-foto tambahan milik produk -->
                  <div v-for="f in p.foto" :key="f.id" class="relative group flex-shrink-0">
                    <img :src="f.foto" class="w-20 h-20 object-cover rounded border" />
                    <!-- Tombol hapus muncul saat foto diklik atau di-hover -->
                    <button @click="deleteFoto(f.id)" class="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 rounded-full text-xs shadow-lg">×</button>
                  </div>
                  <p v-if="!p.foto?.length" class="text-gray-400 italic">Belum ada foto tambahan.</p>
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
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import { showConfirm, showSuccess } from '@/utils/alert'

const products = ref([])

/**
 * Mengambil produk seller beserta foto-foto galerinya.
 */
const getProducts = async () => {
  const res = await api.get('/product/myproducts')
  products.value = res.data.data.data || []
}

/**
 * Menghapus salah satu foto dari galeri produk.
 */
const deleteFoto = async (id) => {
  if (!await showConfirm('Hapus foto ini?')) return
  await api.delete(`/foto/${id}`)
  showSuccess('Foto dihapus'); getProducts()
}

onMounted(() => { getProducts() })
</script>
