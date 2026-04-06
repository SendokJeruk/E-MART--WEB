<template>
  <adminside>
    <div class="p-6 overflow-x-auto">

      <!-- Bagian atas halaman daftar user -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manage User</h1>

        <!-- Skeleton profil admin pas lagi nunggu data -->
        <div
          v-if="isLoading"
          class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60"
        >
          <Skeleton type="circle" size="40px"/>

          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>
        </div>

        <!-- Profil admin yang lagi operasional -->
        <div
          v-else
          class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60"
        >
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>

          <img
            :src="user?.foto_profil || 'https://via.placeholder.com/100'"
            class="w-10 h-10 bg-gray-300 rounded-full"
          />
        </div>
      </div>

      <!-- Inputan buat nyari user berdasarkan nama, biar gak pegel scrollnya -->
      <input
        v-model="searchQuery"
        class="w-full p-2 border border-gray-300 rounded-md text-sm mb-4"
        placeholder="Search..."
        type="text"
        @input="handleSearch"
      />

      <!-- Tombol buat nambah user baru secara manual -->
      <router-link
        class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 mb-5"
        to="/create-user"
      >
        <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] group-hover:h-full"></span>
        <span class="relative text-sm font-medium text-[#7D0A0A] group-hover:text-white">
          Tambah User
        </span>
      </router-link>

      <!-- Tabel buat nampilin daftar usernya, pake shadow biar ada dimensinya -->
      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-auto divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">

            <!-- Baris skeleton pas tabelnya lagi narik data dari server -->
            <template v-if="isLoading">
              <tr v-for="n in 6" :key="n">
                <td class="px-6 py-4"><Skeleton height="14px" width="80%"/></td>
                <td class="px-6 py-4"><Skeleton height="14px" width="90%"/></td>
                <td class="px-6 py-4 flex gap-2">
                  <Skeleton height="30px" width="60px"/>
                  <Skeleton height="30px" width="60px"/>
                </td>
              </tr>
            </template>

            <!-- Data user asli yang nongol dari database -->
            <template v-else>
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 text-sm font-medium inter-font text-gray-900 ">{{ user.name }}</td>
                <td class="px-6 py-4 text-sm font-medium inter-font text-gray-900">{{ user.email }}</td>

                <td class="px-6 py-4">
                  <!-- Tombol buat ngehapus user, ati-ati ya pas neken ini -->
                  <button
                    @click="deleteUser(user.id)"
                    class="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Hapus
                  </button>

                  <!-- Tombol buat masuk ke halaman edit user -->
                  <router-link
                    :to="`/edit-user/${user.id}`"
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

    <!-- Tombol navigasi halaman pagination -->
    <div class="flex justify-center mt-6 space-x-2">
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-4 py-2 bg-gray-300 rounded"
      >
        Previous
      </button>

      <!-- Looping angka halamannya -->
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

// Siapin state buat nampung data list user
const users = ref([])
const user = ref({}) // Profil admin sendiri
const isLoading = ref(true)
const searchQuery = ref('')

// Info buat ngatur pagination
const pagination = ref({
  current_page: 1,
  last_page: 1,
})

// Ambil profil admin yang lagi operasional
const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

// Fungsi utama buat tarik data user, gabungin search ama pagination
const fetchUsers = async (page = 1) => {
  try {
    isLoading.value = true

    const response = await api.get('/manage-user', {
      params: {
        page: page,
        name: searchQuery.value // Kirim nama yang lagi dicari
      }
    })

    const data = response.data.data

    // Simpen datanya ke state
    users.value = data.data
    pagination.value.current_page = data.current_page
    pagination.value.last_page = data.last_page

  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

// Pas user mindah-mindah halaman pagination
const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchUsers(page)
  }
}

// Trik debounce biar gak spam request API pas admin lagi ngetik di kotak search
let timeout = null

const handleSearch = () => {
  clearTimeout(timeout)

  timeout = setTimeout(() => {
    // Balikin ke halaman satu kalo abis ngetik pencarian baru
    pagination.value.current_page = 1
    fetchUsers(1)
  }, 500)
}

// Fungsi buat ngebuang user dari database
const deleteUser = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus user ini?')
  if (!konfirmasi) return

  try {
    await api.delete(`/manage-user/${id}`)
    // Refresh datanya di halaman yang lagi aktif
    fetchUsers(pagination.value.current_page)
  } catch (error) {
    console.error('Gagal menghapus user:', error)
  }
}

// Pas halaman dibuka, langsung sikat ambil profil ama data usernya
onMounted(() => {
  fetchUsers(1)
  getProfile()
})
</script>

<style scoped>
/* Styling tabel biar gak rapet-rapet amat */
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