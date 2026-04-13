<template>
  <AdminSide>
    <!-- Halaman Kelola Income: Tempat admin memverifikasi permintaan penarikan dana dari para penjual -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 class="text-xl sm:text-2xl md:text-3xl navbar-font text-gray-800">Manage Income</h1>
      </div>

      <!-- Tampilan Kotak Permintaan Penarikan (Withdraw) -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="bg-white shadow rounded-xl p-4 space-y-3">
          <Skeleton height="14px" width="60%" /><Skeleton height="12px" width="80%" /><Skeleton height="18px" width="40%" />
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- List permintaan penarikan dana -->
        <div v-for="withdraw in withdraws" :key="withdraw.id" class="bg-white shadow rounded-xl p-4 flex flex-col justify-between">
          <div>
            <p class="font-bold text-gray-800 navbar-font text-sm sm:text-base">{{ withdraw.user.name }}</p>
            <p class="text-xs text-gray-500 mb-2 inter-font">{{ withdraw.user.email }}</p>
            <p class="text-lg sm:text-xl font-bold text-red-700 navbar-font">Rp {{ withdraw.jumlah.toLocaleString('id-ID') }}</p>

            <span class="mt-2 inline-block px-3 py-1 rounded-full text-xs navbar-font"
              :class="{
                'bg-yellow-100 text-yellow-700': withdraw.status === 'pending',
                'bg-green-100 text-green-700': withdraw.status === 'accepted',
                'bg-red-100 text-red-700': withdraw.status === 'rejected'
              }">
              {{ withdraw.status }}
            </span>
          </div>

          <button class="mt-4 w-full px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition navbar-font" @click="openDetail(withdraw)">
            Lihat Detail
          </button>
        </div>
      </div>

      <!-- Modal Detail: Berisi info rekening dan tombol Setujui/Tolak -->
      <transition name="fade">
        <div v-if="selectedWithdraw" class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
          <div class="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative">
            <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-700" @click="selectedWithdraw = null">✖</button>
            <h2 class="text-lg sm:text-xl navbar-font mb-4 text-gray-800">Detail Withdraw</h2>

            <div class="space-y-2 text-xs sm:text-sm text-gray-700">
              <p><strong>Seller:</strong> {{ selectedWithdraw.user.name }}</p>
              <p><strong>Jumlah:</strong> Rp {{ selectedWithdraw.jumlah.toLocaleString('id-ID') }}</p>
              <p><strong>Metode:</strong> {{ selectedWithdraw.metode }}</p>
              <p><strong>Rekening:</strong> {{ selectedWithdraw.rekening_tujuan }}</p>
              <p><strong>Catatan:</strong> {{ selectedWithdraw.catatan || '-' }}</p>
            </div>

            <!-- Tombol Aksi: Hanya muncul jika statusnya masih 'pending' -->
            <div class="flex flex-col sm:flex-row gap-3 mt-6" v-if="selectedWithdraw.status === 'pending'">
              <button class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 navbar-font" :disabled="loading" @click="updateStatus(selectedWithdraw.id, 'approved')">
                Setujui
              </button>
              <button class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 navbar-font" :disabled="loading" @click="updateStatus(selectedWithdraw.id, 'rejected')">
                Tolak
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </AdminSide>
</template>

<script setup>
import AdminSide from '@/components/navbar/admin-side.vue';
import Skeleton from '@/components/Skeleton.vue';
import api from '@/plugins/axios';
import { onMounted, ref } from 'vue';

const withdraws = ref([]);
const selectedWithdraw = ref(null);
const loading = ref(false);
const isLoading = ref(true);

const getWithdraw = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/withdraw');
    withdraws.value = response.data?.data?.data || response.data?.data || [];
  } catch (error) {
    console.error('Gagal mengambil data withdraw:', error);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Fungsi untuk mengubah status penarikan dana (Disetujui atau Ditolak).
 */
const updateStatus = async (id, status) => {
  loading.value = true;
  try {
    const backendStatus = status === 'approved' ? 'accepted' : 'rejected';
    await api.post(`/withdraw/handle/${id}`, { status: backendStatus });
    await getWithdraw();
    selectedWithdraw.value = null;
  } catch (error) {
    console.error('Gagal update status:', error);
  } finally {
    loading.value = false;
  }
};

const openDetail = (withdraw) => { selectedWithdraw.value = withdraw; };

onMounted(() => { getWithdraw(); });
</script>
