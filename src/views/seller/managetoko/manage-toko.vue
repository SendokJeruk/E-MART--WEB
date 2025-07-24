<template>
    <sellerside>
      <div class="p-6 overflow-x-auto">
        <h1 class="text-3xl font-bold mb-6">Manage Toko</h1>
  
        <router-link
          v-if="tokoseller.length === 0"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5 ml-2"
          to="/create-toko"
        >
          <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"></span>
          <span class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white">
            Tambah Toko
          </span>
        </router-link>

  
        <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
          <table class="min-w-full table-fixed divide-y divide-gray-200">
            <thead class="bg-gray-200">
              <tr>
                <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Nama Toko</th>
                <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">No Telepon</th>
                <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="item in tokoseller" :key="item.id">
                <td class="px-4 py-2 text-sm text-gray-900">{{ item.nama_toko }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ item.deskripsi }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ item.no_telp }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">
                    <button
                      @click="deleteToko(item.id)"
                      class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-2 ml-3"
                    >
                      Hapus
                    </button>
                    <router-link
                      :to="`/edit-toko/${item.id}`"
                      class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mb-2 ml-3"
                    >
                      Edit
                    </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </sellerside>
  </template>
  
  <script setup>
  import sellerside from '@/components/navbar/seller-side.vue';
  import { ref, onMounted } from 'vue';
  import api from "@/plugins/axios";


  const user = ref({});
  const tokoseller = ref([]);
  
  const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  }
};

const getToko = async () => {
    try {
        const response = await api.get('/toko');
        const alltoko = response.data.data.data;
        tokoseller.value = alltoko.filter(t => t.user_id === user.value.id);
    } catch (error) {
    console.error('Error fetching toko:', error);
  }
}

const deleteToko = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus Toko ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/toko/${id}`);
    tokoseller.value = tokoseller.value.filter(toko => toko.id !== id);
    alert('toko berhasil dihapus.');
    await getToko();
  } catch (error) {
    console.error('Gagal menghapus toko:', error);
    alert(error.response?.data?.message || 'Terjadi kesalahan saat menghapus toko.');
  }
};

onMounted(async () => {
    await getProfile();
    await getToko();
}) 
  
  </script>
  