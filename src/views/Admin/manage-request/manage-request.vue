<template>
  <AdminSide>
    <!-- Halaman Verifikasi Penjual: Admin meninjau data KTP dan alasan user ingin menjadi seller -->
    <div class="p-6">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl navbar-font text-[#7D0A0A]">Manage Pengajuan Seller</h1>
      </div>

      <!-- GRID KARTU PENGAJUAN -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="n in 3" :key="n" class="bg-white p-5 rounded-xl shadow"><Skeleton width="100%" height="100px"/></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="item in requests" :key="item.id" class="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
          <div>
            <span :class="['px-3 py-1 text-xs rounded-full navbar-font', item.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
              {{ item.status }}
            </span>
            <h2 class="text-lg inter-font font-bold mt-3">{{ item.nama_lengkap }}</h2>
            <p class="text-sm text-gray-500">NIK: {{ item.nik }}</p>
          </div>

          <div class="mt-6 flex gap-2">
            <button @click="openDetail(item)" class="bg-[#7D0A0A] text-white px-4 py-2 rounded-lg text-sm">Detail</button>
            <button v-if="item.status === 'accepted'" @click="deleteRequest(item.id)" class="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Hapus</button>
          </div>
        </div>
      </div>

      <!-- MODAL DETAIL PENGAJUAN -->
      <div v-if="selectedItem" class="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
          <button @click="selectedItem = null" class="absolute top-4 right-4">✕</button>
          <h2 class="text-2xl navbar-font text-[#7D0A0A] mb-6">Detail Data Seller</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
            <p><strong>Nama:</strong> {{ selectedItem.nama_lengkap }}</p>
            <p><strong>NIK:</strong> {{ selectedItem.nik }}</p>
            <p><strong>Alamat KTP:</strong> {{ selectedItem.alamat_ktp }}</p>
            <p><strong>Alasan:</strong> {{ selectedItem.note }}</p>
          </div>

          <!-- Tampilan Foto KTP untuk divalidasi -->
          <div v-if="selectedItem.foto_ktp" class="mb-6">
            <p class="mb-2 font-bold">Foto KTP:</p>
            <img :src="selectedItem.foto_ktp" class="w-full rounded-lg border shadow" />
          </div>

          <!-- Tombol Keputusan Admin -->
          <div class="flex justify-end gap-4 border-t pt-6">
            <button @click="updateStatus(selectedItem.id, 'rejected')" class="bg-red-500 text-white px-6 py-2 rounded-lg">Tolak</button>
            <button @click="updateStatus(selectedItem.id, 'accepted')" class="bg-green-600 text-white px-6 py-2 rounded-lg">Terima Jadi Seller</button>
          </div>
        </div>
      </div>
    </div>
  </AdminSide>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminSide from '@/components/navbar/admin-side.vue'
import api from '@/plugins/axios'
import Skeleton from '@/components/Skeleton.vue'
import { showSuccess, showError, showConfirm } from '@/utils/alert'

const requests = ref([])
const selectedItem = ref(null)
const isLoading = ref(true)

const getRequestSeller = async () => {
  try {
    const res = await api.get('/requestseller')
    requests.value = res.data.data.data || res.data.data || []
  } finally { isLoading.value = false }
}

/**
 * Fungsi untuk menyetujui atau menolak pengajuan seller.
 * Jika disetujui, role user akan otomatis berubah menjadi 'seller'.
 */
const updateStatus = async (id, status) => {
  try {
    await api.put(`/requestseller/${id}`, { status })
    showSuccess(`Pengajuan ${status}`); selectedItem.value = null; getRequestSeller()
  } catch (e) { showError('Gagal memproses data') }
}

const openDetail = (item) => { selectedItem.value = item }

onMounted(() => { getRequestSeller() })
</script>
