<template>
  <SellerSide>
    <div class="p-6 overflow-x-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manage Pengiriman</h1>

        <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://via.placeholder.com/100'" class="w-10 h-10 bg-gray-300 rounded-full" />
        </div>
      </div>

      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Kode Transaksi</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Kurir</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Plat Nomor</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Estimasi Tiba</th>
              <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in pengiriman" :key="item.id">
              <td class="px-4 py-2 text-sm text-gray-900">{{ item.id }}</td>
              <td class="px-4 py-2 text-sm text-gray-900">{{ item.kode_transaksi }}</td>
              <td class="px-4 py-2 text-sm text-gray-900">{{ item.kurir || '-' }}</td>
              <td class="px-4 py-2 text-sm text-gray-900">{{ item.plat_nomor || '-' }}</td>
              <td class="px-4 py-2 text-sm text-gray-900">
                <select 
                  v-model="item.status_pengiriman" 
                  @change="updateStatus(item)" 
                  class="border rounded px-2 py-1"
                  :disabled="item.status_pengiriman === 'dijadwalkan'"
                >
                  <option value="dibuat">Dibuat</option>
                  <option value="dijadwalkan">Dijadwalkan</option>
                </select>
              </td>
              <td class="px-4 py-2 text-sm text-gray-900">{{ item.estimasi_tiba || '-' }}</td>
              <td class="px-4 py-2 text-sm text-gray-900">
                <button 
                  @click="deletePengiriman(item.id)" 
                  class="px-3 py-1 rounded"
                  :class="item.status_pengiriman === 'dijadwalkan' 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 text-white'"
                  :disabled="item.status_pengiriman === 'dijadwalkan'"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SellerSide>
</template>

<script setup>
import SellerSide from '@/components/navbar/seller-side.vue';
import api from '@/plugins/axios';
import { onMounted, ref } from 'vue';

const user = ref({});
const pengiriman = ref([]);

const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  }
};

const getPengiriman = async () => {
  try {
    const response = await api.get('/pengiriman');
    pengiriman.value = response.data.data?.data || [];
    console.log(pengiriman.value);
  } catch (error) {
    console.log(error);
    pengiriman.value = [];
  }
};

const updateStatus = async (item) => {
  try {
    await api.put(`/pengiriman/${item.id}`, {
      status_pengiriman: item.status_pengiriman,
      kode_transaksi: item.kode_transaksi
    });
    alert('Status berhasil diperbarui!');
  } catch (error) {
    console.log(error);
    alert('Gagal update status');
    getPengiriman(); // reset data jika gagal
  }
};

// Hapus pengiriman
const deletePengiriman = async (id) => {
  if (!confirm('Yakin ingin menghapus pengiriman ini?')) return;
  try {
    await api.delete(`/pengiriman/${id}`);
    pengiriman.value = pengiriman.value.filter(p => p.id !== id);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  getProfile();
  getPengiriman();
});
</script>