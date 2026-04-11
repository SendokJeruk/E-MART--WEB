<template>
  <adminside>
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl navbar-font text-gray-800">
          Manage User
        </h1>
      </div>

      <!-- SEARCH INPUT -->
      <div class="mb-4">
        <input
          v-model="searchQuery"
          class="w-full px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-2 focus:ring-[#7D0A0A] outline-none"
          placeholder="Search..."
          type="text"
          @input="handleSearch"
        />
      </div>

      <!-- BUTTON TAMBAH USER -->
      <div class="mb-5">
        <router-link
          to="/create-user"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg focus:ring-2 focus:ring-[#BF3131] focus:outline-none"
        >
          <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all duration-200 group-hover:h-full"></span>
          <span class="relative text-xs sm:text-sm font-medium text-[#7D0A0A] group-hover:text-white navbar-font">
            Tambah User
          </span>
        </router-link>
      </div>

      <!-- TABLE USER -->
      <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-[500px] w-full table-auto divide-y divide-gray-200 text-xs sm:text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left navbar-font text-gray-700 whitespace-nowrap">
                Name
              </th>
              <th class="px-4 py-3 text-left navbar-font text-gray-700 whitespace-nowrap">
                Email
              </th>
              <th class="px-4 py-3 text-left navbar-font text-gray-700 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">

            <!-- Skeleton saat loading -->
            <template v-if="isLoading">
              <tr v-for="n in 6" :key="n">
                <td class="px-4 py-3">
                  <Skeleton height="14px" width="80%" />
                </td>
                <td class="px-4 py-3">
                  <Skeleton height="14px" width="90%" />
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-2">
                    <Skeleton height="30px" width="60px" />
                    <Skeleton height="30px" width="60px" />
                  </div>
                </td>
              </tr>
            </template>

            <!-- Data user -->
            <template v-else-if="users.length > 0">
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 font-medium inter-font text-gray-900 whitespace-nowrap">
                  {{ user.name }}
                </td>
                <td class="px-4 py-3 inter-font text-gray-700 break-all">
                  {{ user.email }}
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-2">
                    <button
                      @click="deleteUser(user.id)"
                      class="px-3 py-1 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded navbar-font transition"
                    >
                      Hapus
                    </button>

                    <router-link
                      :to="`/edit-user/${user.id}`"
                      class="px-3 py-1 text-xs sm:text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded navbar-font transition"
                    >
                      Edit
                    </router-link>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <template v-else>
              <tr>
                <td colspan="3" class="px-4 py-8 text-center text-gray-500">
                  Tidak ada data user
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="flex flex-wrap justify-center items-center gap-2 mt-6">
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-3 py-1 text-xs sm:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          v-for="page in pagination.last_page"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1 text-xs sm:text-sm rounded',
            page === pagination.current_page
              ? 'bg-[#7D0A0A] text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-3 py-1 text-xs sm:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </adminside>
</template>

<script setup>
/*
  Komponen ini menangani:
  - Menampilkan data user
  - Search user
  - Pagination
  - Delete user

  Prinsip utama:
  Search dan pagination harus selalu berjalan bersamaan
*/

import adminside from '@/components/navbar/admin-side.vue'
import { ref, onMounted } from 'vue'
import api from "@/plugins/axios"
import Skeleton from '@/components/Skeleton.vue'

/*
  State utama
*/
const users = ref([])
const isLoading = ref(true)
const searchQuery = ref('')

/*
  State pagination dari backend
*/
const pagination = ref({
  current_page: 1,
  last_page: 1,
})

/*
  FUNCTION UTAMA
  Mengambil data user dengan parameter:
  - page
  - searchQuery
*/
const fetchUsers = async (page = 1) => {
  try {
    isLoading.value = true

    const response = await api.get('/manage-user', {
      params: {
        page: page,
        name: searchQuery.value
      }
    })

    const responseData = response.data?.data || {}

    if (Array.isArray(responseData)) {
      users.value = responseData
      pagination.value.current_page = 1
      pagination.value.last_page = 1
    } else {
      users.value = Array.isArray(responseData.data) ? responseData.data : []
      pagination.value.current_page = responseData.current_page || 1
      pagination.value.last_page = responseData.last_page || 1
    }

  } catch (error) {
    console.error('Error fetching users:', error)
    users.value = []
  } finally {
    isLoading.value = false
  }
}

/*
  Pagination handler
*/
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchUsers(page)
  }
}

/*
  Debounce search agar tidak spam API
*/
let timeout = null

const handleSearch = () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    pagination.value.current_page = 1
    fetchUsers(1)
  }, 500)
}

/*
  Delete user dan reload data sesuai page sekarang
*/
const deleteUser = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus user ini?')
  if (!konfirmasi) return

  try {
    await api.delete(`/manage-user/${id}`)
    fetchUsers(pagination.value.current_page)
  } catch (error) {
    console.error('Gagal menghapus user:', error)
  }
}

/*
  Lifecycle saat komponen pertama kali dimuat
*/
onMounted(() => {
  fetchUsers(1)
})
</script>

<style scoped>
table {
  border-collapse: collapse;
}

th, td {
  text-align: left;
}

@media (max-width: 768px) {
  table {
    width: 100%;
    display: block;
    overflow-x: auto;
  }
}
</style>