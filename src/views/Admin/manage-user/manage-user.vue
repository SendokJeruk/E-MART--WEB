<template>
  <adminside>
    <div class="p-6 overflow-x-auto">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manage User</h1>

        <!-- Header Skeleton -->
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

        <!-- Header Real -->
        <div
          v-else
          class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60"
        >
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img
            :src="user?.foto_profil || 'https://placehold.co/100'"
            class="w-10 h-10 bg-gray-300 rounded-full"
          />
        </div>
      </div>

      <!-- SEARCH -->
      <input
        v-model="searchQuery"
        id="search-query"
        name="search-query"
        class="w-full p-2 border border-gray-300 rounded-md pl-7 sm:pl-9 text-sm sm:text-base mb-4"
        placeholder="Search..."
        type="text"
        @input="searchUsers"
      />

      <!-- BUTTON -->
      <router-link
        class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5"
        to="/create-user"
      >
        <span
          class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"
        ></span>
        <span
          class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white"
        >
          Tambah User
        </span>
      </router-link>

      <!-- TABLE -->
      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-auto divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <!-- Skeleton Rows -->
            <template v-if="isLoading">
              <tr v-for="n in 6" :key="n">
                <td class="px-6 py-4">
                  <Skeleton height="14px" width="80%"/>
                </td>

                <td class="px-6 py-4">
                  <Skeleton height="14px" width="90%"/>
                </td>

                <td class="px-6 py-4 flex gap-2">
                  <Skeleton height="30px" width="60px"/>
                  <Skeleton height="30px" width="60px"/>
                </td>
              </tr>
            </template>

            <!-- Real Data -->
            <template v-else-if="users.length > 0">
              <tr v-for="user in users" :key="user.id">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ user.name }}
                </td>

                <td class="px-6 py-4 text-sm text-gray-500">
                  {{ user.email }}
                </td>

                <td class="px-6 py-4 text-sm text-red-600">
                  <button
                    @click="deleteUser(user.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-2 ml-3"
                  >
                    Hapus
                  </button>

                  <router-link
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mb-2 ml-3"
                    :to="`/edit-user/${user.id}`"
                  >
                    Edit
                  </router-link>
                </td>
              </tr>
            </template>

            <template v-else>
              <tr>
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                  Tidak ada data user
                </td>
              </tr>
            </template>

          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION -->
    <div v-if="pagination.last_page > 1" class="flex justify-center mt-6 space-x-2">
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
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
            : 'bg-gray-200 text-gray-700'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </adminside>
</template>

<script setup>
import adminside from '@/components/navbar/admin-side.vue';
import { ref, onMounted } from 'vue';
import api from "@/plugins/axios";
import Skeleton from '@/components/Skeleton.vue';
import { showSuccess } from '@/utils/alert';


const users = ref([]);
const user = ref({});
const isLoading = ref(true);
const searchQuery = ref('');

let searchTimeout;

const pagination = ref({
  current_page: 1,
  last_page: 1,
});

const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data 
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

const getUsers = async (page = 1) => {
  try {
    isLoading.value = true;
    const response = await api.get('/manage-user', {
      params: { page, name: searchQuery.value }
    });

    const responseData = response.data?.data || {};
    
    users.value = Array.isArray(responseData.data) ? responseData.data : [];
    pagination.value.current_page = responseData.current_page || 1;
    pagination.value.last_page = responseData.last_page || 1;
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    getUsers(page);
  }
};


const searchUsers = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    getUsers(1);
  }, 300);
};

const deleteUser = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus user ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/manage-user/${id}`);
    users.value = users.value.filter(user => user.id !== id);
    showSuccess('User berhasil dihapus.');
  } catch (error) {
    console.error('Gagal menghapus user:', error);
    showError('Terjadi kesalahan saat menghapus user.');
  }
};

onMounted(() => {
  getUsers(1);
  getProfile();
});
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