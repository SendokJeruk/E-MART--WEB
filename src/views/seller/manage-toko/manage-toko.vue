<template>
  <sellerside>
    <div class="p-6 overflow-x-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manage Toko</h1>

        <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://placehold.co/100'" class="w-10 h-10 bg-gray-300 rounded-full" />
        </div>
      </div>

      <router-link
        v-if="!isLoading && tokoseller.length === 0"
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

          <!-- SKELETON -->
          <tbody v-if="isLoading" class="divide-y divide-gray-200">
            <tr v-for="n in 4" :key="n">
              <td class="px-4 py-3">
                <Skeleton width="140px" height="14px" />
              </td>
              <td class="px-4 py-3">
                <Skeleton width="200px" height="14px" />
              </td>
              <td class="px-4 py-3">
                <Skeleton width="120px" height="14px" />
              </td>
              <td class="px-4 py-3 flex gap-2">
                <Skeleton width="60px" height="28px" />
                <Skeleton width="60px" height="28px" />
              </td>
            </tr>
          </tbody>

          <!-- DATA -->
          <tbody v-else class="divide-y divide-gray-200">
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
  import Skeleton from '@/components/Skeleton.vue';
import { showSuccess,showError } from '@/utils/alert';


  const user = ref({});
  const tokoseller = ref([]);
  const isLoading = ref(true);
  
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
        const response = await api.get('/toko?self');
        const alltoko = response.data.data.data;
        tokoseller.value = alltoko.filter(t => t.user_id === user.value.id);
    } catch (error) {
    console.error('Error fetching toko:', error);
  } finally {
    isLoading.value = false;
  }
}

const deleteToko = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus Toko ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/toko/${id}`);
    tokoseller.value = tokoseller.value.filter(toko => toko.id !== id);
    showSuccess('toko berhasil dihapus.');
    await getToko();
  } catch (error) {
    console.error('Gagal menghapus toko:', error);
    showError(error.response?.data?.message || 'Terjadi kesalahan saat menghapus toko.');
  }
};

onMounted(async () => {
    await getProfile();
    await getToko();
}) 
  
  </script>
  