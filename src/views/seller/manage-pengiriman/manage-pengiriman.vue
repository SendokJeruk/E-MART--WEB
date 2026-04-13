<template>
  <SellerSide>
    <!-- Halaman Kelola Pengiriman: Tempat seller menginput nomor resi dan memantau status kiriman -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">
      <h1 class="text-2xl md:text-3xl navbar-font text-gray-800 mb-8">Kelola Pengiriman</h1>

      <!-- TABEL DAFTAR PESANAN MASUK -->
      <div class="bg-white shadow-xl rounded-xl border overflow-x-auto">
        <table class="min-w-[900px] w-full text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3">ID Pesanan</th>
              <th class="px-4 py-3">Kurir</th>
              <th class="px-4 py-3">Nomor Resi</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Aksi</th>
            </tr>
          </thead>

          <tbody class="divide-y">
            <!-- Tampilan saat memuat data -->
            <tr v-if="isLoading"><td colspan="5" class="p-10 text-center"><Skeleton width="100%" height="20px"/></td></tr>

            <!-- List setiap pengiriman yang harus diproses seller -->
            <tr v-for="item in pengiriman" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-bold">{{ item.kode_transaksi }}</td>
              <td class="px-4 py-3">{{ item.kurir || '-' }}</td>
              
              <!-- Input Nomor Resi: Wajib diisi agar barang bisa dilacak -->
              <td class="px-4 py-3">
                <input v-model="item.kode_resi" type="text" placeholder="Input Resi di sini" class="border rounded px-2 py-1 w-full" />
              </td>

              <!-- Pilihan Status Pengiriman -->
              <td class="px-4 py-3">
                <select v-model="item.status_pengiriman" @change="updateStatus(item)" class="border rounded px-2 py-1">
                  <option value="dibuat">Baru Masuk</option>
                  <option value="dijadwalkan">Sudah Pick-up</option>
                  <option value="dalam_proses">Sedang Dikirim</option>
                  <option value="tiba">Sudah Sampai</option>
                </select>
              </td>

              <td class="px-4 py-3 flex gap-2">
                <button @click="openDetail(item)" class="bg-blue-500 text-white px-3 py-1 rounded">Detail</button>
                <!-- Tombol untuk cetak label pengiriman -->
                <button @click="cetakStruk(item.id)" class="border border-gray-400 px-3 py-1 rounded">Cetak Struk</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </SellerSide>
</template>

<script setup>
import SellerSide from '@/components/navbar/seller-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/plugins/axios'
import { showError, showSuccess } from '@/utils/alert'
import { onMounted, ref } from 'vue'

const pengiriman = ref([])
const isLoading = ref(true)

const getPengiriman = async () => {
  try {
    const res = await api.get('/pengiriman/seller');
    pengiriman.value = res.data.data.data || [];
  } finally { isLoading.value = false }
}

/**
 * Mengupdate status pengiriman ke server.
 * Jika status diubah menjadi 'Dikirim', nomor resi biasanya wajib ada.
 */
const updateStatus = async (item) => {
  try {
    await api.put(`/pengiriman/${item.id}`, { status_pengiriman: item.status_pengiriman, resi: item.kode_resi });
    showSuccess('Status pengiriman diperbarui!'); getPengiriman();
  } catch (e) { showError('Gagal update status') }
}

onMounted(() => { getPengiriman() })
</script>
