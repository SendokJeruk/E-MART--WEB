<template>
  <adminside>
    <div class="p-6 overflow-x-auto">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold navbar-font">Manage Kategori</h1>

        <!-- Skeleton -->
        <div v-if="isLoading" class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <Skeleton type="circle" size="40px"/>
          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>
        </div>

        <!-- User -->
        <div v-else class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://placehold.co/100'" class="w-10 h-10 rounded-full"/>
        </div>
      </div>

      <!-- SEARCH -->
      <!-- Search tidak mematikan pagination, tetap kirim page + keyword -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search kategori..."
        class="w-full p-2 border border-gray-300 rounded-md text-sm mb-4"
        @input="handleSearch"
      />

      <!-- BUTTON -->
      <router-link
        class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 mb-5"
        to="/create-kategori"
      >
        <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] group-hover:h-full"></span>
        <span class="relative text-sm font-medium text-[#7D0A0A] group-hover:text-white navbar-font">
          Tambah Kategori
        </span>
      </router-link>

      <!-- TABLE -->
      <div class="overflow-x-auto rounded-lg shadow-lg">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left navbar-font">Nama Kategori</th>
              <th class="px-6 py-3 text-left navbar-font">Action</th>
            </tr>
          </thead>

          <tbody>
            <!-- Skeleton -->
            <template v-if="isLoading">
              <tr v-for="n in 5" :key="n">
                <td class="px-6 py-4"><Skeleton height="14px"/></td>
                <td class="px-6 py-4"><Skeleton height="30px" width="100px"/></td>
              </tr>
            </template>

            <!-- Data -->
            <template v-else-if="categories.length > 0">
              <tr v-for="category in categories" :key="category.id">
                <td class="px-6 py-4 text-sm inter-font text-gray-900">{{ category.nama_category }}</td>
                <td class="px-6 py-4">
                  <button
                    @click="deleteCategory(category.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded mr-2 navbar-font"
                  >
                    Delete
                  </button>

                  <router-link
                    :to="`/edit-kategori/${category.id}`"
                    class="bg-yellow-500 text-white px-3 py-1 rounded navbar-font"
                  >
                    Edit
                  </router-link>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td colspan="2" class="text-center py-10 text-gray-500">Tidak ada kategori</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION -->
    <div class="flex justify-center mt-6 space-x-2">
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-4 py-2 bg-gray-300 rounded"
      >
        Previous
      </button>

      <button
        v-for="page in pagination.last_page"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-4 py-2 rounded',
          page === pagination.current_page
            ? 'bg-[#7D0A0A] text-white'
            : 'bg-gray-200'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="px-4 py-2 bg-gray-300 rounded"
      >
        Next
      </button>
    </div>
  </adminside>
</template>

<script setup>
/*
  Fitur:
  - Ambil kategori (pagination)
  - Search kategori
  - Delete kategori

  Prinsip:
  Search dan pagination HARUS pakai 1 function
*/

import adminside from '@/components/navbar/admin-side.vue'
import { ref, onMounted } from 'vue'
import api from "@/plugins/axios"
import Skeleton from '@/components/Skeleton.vue'
import { showConfirm, showSuccess } from '@/utils/alert'

/* STATE */
const categories = ref([])
const user = ref({})
const isLoading = ref(true)
const searchQuery = ref('')

const pagination = ref({
  current_page: 1,
  last_page: 1,
})

/*
  Ambil profil user
*/
const getProfile = async () => {
  try {
    const res = await api.get('/profile')
    user.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

/*
  FUNCTION UTAMA
  - Menggabungkan search + pagination
*/
const fetchCategories = async (page = 1) => {
  try {
    isLoading.value = true

    const res = await api.get('/category', {
      params: {
        page: page,
        nama_category: searchQuery.value // parameter search
      }
    })

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

/*
  Pagination handler
*/
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  fetchCategories(page)
}

/*
  Debounce search
  - reset ke page 1
*/
let timeout = null

const handleSearch = () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    pagination.value.current_page = 1
    fetchCategories(1)
  }, 500)
}

/*
  Delete kategori
*/
const deleteCategory = async (id) => {
  if (!await showConfirm('Yakin ingin menghapus kategori ini?')) return

  try {
    await api.delete(`/category/${id}`)
    showSuccess('Kategori berhasil dihapus')

    /* reload data setelah delete */
    fetchCategories(pagination.value.current_page)
  } catch (err) {
    console.error(err)
  }
}

/*
  Lifecycle awal
*/
onMounted(() => {
  fetchCategories(1)
  getProfile()
})
</script>

<style scoped>
table {
  border-collapse: collapse;
}

@media (max-width: 768px) {
  table {
    display: block;
    overflow-x: auto;
  }
}
</style>