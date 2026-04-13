<template>
  <sellerside>
    <!-- Halaman Kelola Toko: Tempat penjual mengatur informasi dasar toko mereka -->
    <div class="p-6 overflow-x-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl navbar-font">Manage Toko</h1>
      </div>

      <!-- Tombol Buat Toko (Hanya muncul jika belum punya toko) -->
      <router-link
        v-if="!isLoading && tokoseller.length === 0"
        class="inline-block px-8 py-3 bg-[#7D0A0A] text-white rounded-lg mb-5 navbar-font"
        to="/create-toko"
      >
        + Buat Toko Baru
      </router-link>

      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-sm navbar-font">Nama Toko</th>
              <th class="px-4 py-2 text-left text-sm navbar-font">Deskripsi</th>
              <th class="px-4 py-2 text-left text-sm navbar-font">No Telepon</th>
              <th class="px-4 py-2 text-left text-sm navbar-font">Aksi</th>
            </tr>
          </thead>

          <tbody v-if="isLoading" class="divide-y">
            <tr v-for="n in 2" :key="n"><td colspan="4" class="p-4"><Skeleton width="100%" height="20px"/></td></tr>
          </tbody>

          <tbody v-else class="divide-y">
            <tr v-for="item in tokoseller" :key="item.id">
              <td class="px-4 py-2 text-sm font-medium">{{ item.nama_toko }}</td>
              <td class="px-4 py-2 text-sm text-gray-600">{{ item.deskripsi }}</td>
              <td class="px-4 py-2 text-sm">{{ item.no_telp }}</td>
              <td class="px-4 py-2 text-sm flex gap-3">
                <router-link :to="`/edit-toko/${item.id}`" class="text-yellow-600 font-bold">Edit</router-link>
                <button @click="deleteToko(item.id)" class="text-red-600 font-bold">Hapus</button>
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
import { showSuccess, showError, showConfirm } from '@/utils/alert';

const tokoseller = ref([]);
const isLoading = ref(true);

/**
 * Mengambil data toko milik user yang sedang login.
 */
const getToko = async () => {
  try {
    const res = await api.get('/toko?self');
    tokoseller.value = res.data.data.data || [];
  } finally { isLoading.value = false; }
}

const deleteToko = async (id) => {
  if (!await showConfirm('Hapus toko ini? Semua produk di dalamnya juga akan terpengaruh.')) return;
  try {
    await api.delete(`/toko/${id}`);
    showSuccess('Toko berhasil dihapus.'); getToko();
  } catch (e) { showError('Gagal menghapus toko'); }
};

onMounted(() => { getToko(); }) 
</script>
