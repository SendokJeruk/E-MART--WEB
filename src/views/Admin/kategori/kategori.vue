<template>
    <adminside>
      <!-- Halaman Tabel Kategori: Menampilkan daftar kategori produk yang tersedia -->
      <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

        <!-- HEADER -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 class="text-xl sm:text-2xl md:text-3xl font-bold navbar-font text-gray-800">
            Manage Kategori
          </h1>
        </div>

        <!-- INPUT PENCARIAN -->
        <div class="mb-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search kategori..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-2 focus:ring-[#7D0A0A] outline-none"
            @input="handleSearch"
          />
        </div>

        <!-- TOMBOL TAMBAH KATEGORI BARU -->
        <div class="mb-5">
          <router-link
            to="/create-kategori"
            class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg focus:ring-2 focus:ring-[#BF3131] focus:outline-none"
          >
            <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all duration-200 group-hover:h-full"></span>
            <span class="relative text-xs sm:text-sm font-medium text-[#7D0A0A] group-hover:text-white navbar-font">
              Tambah Kategori
            </span>
          </router-link>
        </div>

        <!-- TABEL DATA KATEGORI -->
        <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table class="min-w-[500px] w-full table-auto text-xs sm:text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left navbar-font text-gray-700 whitespace-nowrap">Nama Kategori</th>
                <th class="px-4 py-3 text-left navbar-font text-gray-700 whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <!-- Tampilan saat sedang mengambil data -->
              <template v-if="isLoading">
                <tr v-for="n in 5" :key="n">
                  <td class="px-4 py-3"><Skeleton height="14px" width="70%" /></td>
                  <td class="px-4 py-3"><div class="flex flex-wrap gap-2"><Skeleton height="30px" width="60px" /><Skeleton height="30px" width="60px" /></div></td>
                </tr>
              </template>

              <!-- Tampilan saat data ada -->
              <template v-else-if="categories.length > 0">
                <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3 inter-font text-gray-900 whitespace-nowrap">{{ category.nama_category }}</td>
                  <td class="px-4 py-3">
                    <div class="flex flex-wrap gap-2">
                      <button @click="deleteCategory(category.id)" class="px-3 py-1 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded navbar-font transition">Delete</button>
                      <router-link :to="`/edit-kategori/${category.id}`" class="px-3 py-1 text-xs sm:text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded navbar-font transition">Edit</router-link>
                    </div>
                  </td>
                </tr>
              </template>

              <!-- Tampilan saat data kosong -->
              <template v-else>
                <tr><td colspan="2" class="text-center py-10 text-gray-500">Tidak ada kategori</td></tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- PAGINATION (Pindah Halaman) -->
        <div class="flex flex-wrap justify-center items-center gap-2 mt-6">
          <button @click="changePage(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-3 py-1 text-xs sm:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50">Previous</button>
          <button v-for="page in pagination.last_page" :key="page" @click="changePage(page)" :class="['px-3 py-1 text-xs sm:text-sm rounded', page === pagination.current_page ? 'bg-[#7D0A0A] text-white' : 'bg-gray-200 text-gray-700']">{{ page }}</button>
          <button @click="changePage(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-3 py-1 text-xs sm:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </adminside>
</template>

<script setup>
import adminside from '@/components/navbar/admin-side.vue'
import { ref, onMounted } from 'vue'
import api from "@/plugins/axios"
import Skeleton from '@/components/Skeleton.vue'
import { showConfirm, showSuccess } from '@/utils/alert'

const categories = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const pagination = ref({ current_page: 1, last_page: 1 })

/**
 * Fungsi Utama: Mengambil data kategori dengan fitur pencarian dan pembagian halaman.
 */
const fetchCategories = async (page = 1) => {
  try {
    isLoading.value = true
    const res = await api.get('/category', { params: { page: page, nama_category: searchQuery.value } })
    const responseData = res.data?.data || {}

    if (Array.isArray(responseData)) {
      categories.value = responseData
      pagination.value.current_page = 1
      pagination.value.last_page = 1
    } else {
      categories.value = Array.isArray(responseData.data) ? responseData.data : []
      pagination.value.current_page = responseData.current_page || 1
      pagination.value.last_page = responseData.last_page || 1
    }
  } catch (err) {
    console.error('Error fetching category:', err)
    categories.value = []
  } finally {
    isLoading.value = false
  }
}

const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  fetchCategories(page)
}

let timeout = null
// Fungsi pencarian dengan penundaan (debounce) agar tidak memberatkan server
const handleSearch = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    pagination.value.current_page = 1
    fetchCategories(1)
  }, 500)
}

// Fungsi untuk menghapus kategori tertentu
const deleteCategory = async (id) => {
  if (!await showConfirm('Yakin ingin menghapus kategori ini?')) return
  try {
    await api.delete(`/category/${id}`)
    showSuccess('Kategori berhasil dihapus')
    fetchCategories(pagination.value.current_page)
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchCategories(1)
})
</script>
