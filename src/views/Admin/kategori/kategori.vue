<template>
    <adminside>
      <div class="p-6 overflow-x-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold">Manage Kategori</h1>

          <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
            <div class="flex-1">
              <p class="text-sm font-bold">{{ user.name }}</p>
              <p class="text-xs text-gray-600">{{ user.email }}</p>
            </div>
            <img :src="user?.foto_profil || 'https://via.placeholder.com/100'" class="w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        </div>

        <router-link
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5"
          to="/create-kategori"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"
          ></span>
  
          <span
            class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white"
          >
            Tambah Kategori
          </span>
        </router-link>
  
        <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
          <table class="min-w-full table-auto divide-y divide-gray-200">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nama Kategori</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="category in categories" :key="category.id">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ category.nama_category }}</td>
                <td class="px-6 py-4">
                  <button
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-2 ml-3"
                    @click="deleteCategory(category.id)"
                  >
                    Delete
                  </button>

                  <router-link
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mb-2 ml-3"
                  :to="`/edit-kategori/${category.id}`"
                >
                  Edit
                </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="flex justify-center mt-6 space-x-2">
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
  
  const categories = ref([]);

  const user = ref({}); 

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
  
  const getCategories = async () => {
  try {
    const response = await api.get('/category');
    if (Array.isArray(response.data.data.data)) {
      categories.value = response.data.data.data;
    } else {
      console.error("Data category tidak berupa array:", response.data.data.data);
    }
  } catch (error) {
    console.error('Error fetching category:', error);
  }
};

  
  const deleteCategory = async (id) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      await api.delete(`/category/${id}`);
      categories.value = categories.value.filter(cat => cat.id !== id);
      alert('Kategori berhasil dihapus');
    } catch (error) {
      console.error('Gagal menghapus kategori:', error);
      alert('Terjadi kesalahan saat menghapus kategori.');
    }
  };
  
  onMounted(() => {
    getCategories();
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
  