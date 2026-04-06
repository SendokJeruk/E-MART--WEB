<template>
  <adminside>
    <div class="p-6 overflow-x-auto">

      <!-- Bagian atas halaman manage kategori -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold navbar-font">Manage Kategori</h1>

        <!-- Skeleton pas datanya belom beres ditarik -->
        <div v-if="isLoading" class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <Skeleton type="circle" size="40px"/>
          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>
        </div>

        <!-- Profil user admin yang lagi login -->
        <div v-else class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://placehold.co/100'" class="w-10 h-10 rounded-full"/>
        </div>
      </div>

      <!-- Kotak buat nyari kategori biar gak pusing nyarinya satu-satu -->
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search kategori..."
        class="w-full p-2 border border-gray-300 rounded-md text-sm mb-4"
        @input="handleSearch"
      />

      <!-- Tombol buat pindah ke halaman tambah kategori baru -->
      <router-link
        class="group inline-block border border-[#7D0A0A] px-8 py-3 mb-5"
        to="/create-kategori"
      >
        <span class="text-[#7D0A0A] group-hover:text-white">Tambah Kategori</span>
      </router-link>

      <!-- Tabel buat nampilin semua daftar kategorinya -->
      <div class="overflow-x-auto rounded-lg shadow-lg">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left">Nama Kategori</th>
              <th class="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            <!-- Skeleton baris tabel pas lagi loading -->
            <template v-if="isLoading">
              <tr v-for="n in 5" :key="n">
                <td class="px-6 py-4"><Skeleton height="14px"/></td>
                <td class="px-6 py-4"><Skeleton height="30px" width="100px"/></td>
              </tr>
            </template>

            <!-- Ini data kategori aslinya dari database -->
            <template v-else>
              <tr v-for="category in categories" :key="category.id">
                <td class="px-6 py-4 text-sm inter-font text-gray-900">{{ category.nama_category }}</td>
                <td class="px-6 py-4">
                  <!-- Tombol hapus kategori, bakal nanya konfirmasi dulu -->
                  <button
                    @click="deleteCategory(category.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Delete
                  </button>

                  <!-- Tombol buat masuk ke halaman edit -->
                  <router-link
                    :to="`/edit-kategori/${category.id}`"
                    class="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </router-link>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tombol navigasi halaman (Pagination) -->
    <div class="flex justify-center mt-6 space-x-2">
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-4 py-2 bg-gray-300 rounded"
      >
        Previous
      </button>

      <!-- Angka halamannya dibikin list -->
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
import adminside from '@/components/navbar/admin-side.vue'
import { ref, onMounted } from 'vue'
import api from "@/plugins/axios"
import Skeleton from '@/components/Skeleton.vue'
import { showSuccess } from '@/utils/alert'

// Siapin state buat nampung data
const categories = ref([])
const user = ref({})
const isLoading = ref(true)
const searchQuery = ref('')

// Info halaman buat pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
})

// Ambil profil admin yang lagi operasional
const getProfile = async () => {
  try {
    const res = await api.get('/profile')
    user.value = res.data.data
  } catch (err) {
    console.error(err)
  }
}

// Fungsi utama buat narik data kategori, gabungin search ama pagination
const fetchCategories = async (page = 1) => {
  try {
    isLoading.value = true

    const res = await api.get('/category', {
      params: {
        page: page,
        nama_category: searchQuery.value // Lempar kata kunci pencarian
      }
    })

    const data = res.data.data

    // Simpen datanya ke variabel state kita
    categories.value = data.data
    pagination.value.current_page = data.current_page
    pagination.value.last_page = data.last_page

  } catch (err) {
    console.error('Error fetching category:', err)
  } finally {
    isLoading.value = false
  }
}

// Pas user ganti halaman pagination
const changePage = (page) => {
  if (page < 1 || page > pagination.value.last_page) return
  fetchCategories(page)
}

// Debounce buat search, biar gak spam request API pas lagi ngetik
let timeout = null

const handleSearch = () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    // Balikin ke halaman satu kalo lagi nyari
    pagination.value.current_page = 1
    fetchCategories(1)
  }, 500)
}

// Fungsi buat ngebuang kategori yang gak dibutuhin lagi
const deleteCategory = async (id) => {
  if (!confirm('Yakin ingin menghapus kategori ini?')) return

  try {
    await api.delete(`/category/${id}`)
    showSuccess('Kategori berhasil dihapus')

    // Refresh datanya di halaman yang lagi dibuka
    fetchCategories(pagination.value.current_page)
  } catch (err) {
    console.error(err)
  }
}

// Pas halaman pertama kali nongol, langsung tarik datanya
onMounted(() => {
  fetchCategories(1)
  getProfile()
})
</script>

<style scoped>
/* Styling tabel biar gak berantakan */
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