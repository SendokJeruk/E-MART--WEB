<template>
  <SellerSide>
    <!-- Halaman Withdraw: Tempat penjual meminta pencairan saldo dari penjualan mereka -->
    <div class="p-6 overflow-x-auto">
      
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl navbar-font">Withdraw</h1>
      </div>

      <!-- Tombol untuk membuka kotak permintaan penarikan -->
      <button @click="showModal = true" class="px-6 py-2 mb-6 bg-red-700 hover:bg-red-800 text-white navbar-font rounded-lg shadow">
        + Withdraw
      </button>

      <!-- DAFTAR RIWAYAT PENARIKAN -->
      <div v-if="isLoading" class="grid gap-4">
        <div v-for="i in 3" :key="i" class="bg-white shadow rounded-lg p-4 border">
          <Skeleton height="20px" width="120px" class="mb-2"/><Skeleton height="14px" width="200px" />
        </div>
      </div>

      <div v-else-if="withdraws.length > 0" class="grid gap-4">
        <!-- Menampilkan setiap data penarikan beserta statusnya -->
        <div v-for="item in withdraws" :key="item.id" class="bg-white shadow rounded-lg p-4 border">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg navbar-font">Rp {{ item.jumlah.toLocaleString() }}</p>
              <p class="text-sm text-gray-600 inter-font">Metode: {{ item.metode }}</p>
              <p class="text-sm text-gray-600 inter-font">Rekening: {{ item.rekening_tujuan }}</p>
            </div>
            <!-- Status: Pending (kuning), Success (hijau), Failed (merah) -->
            <span class="px-3 py-1 text-sm navbar-font rounded-lg"
              :class="{
                'bg-yellow-100 text-yellow-700': item.status === 'pending',
                'bg-green-100 text-green-700': item.status === 'success',
                'bg-red-100 text-red-700': item.status === 'failed'
              }">
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10 text-gray-500 bg-white shadow rounded-lg border">
        Tidak ada data penarikan
      </div>

      <!-- MODAL FORMULIR PENARIKAN -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <h2 class="text-xl mb-4 navbar-font">Withdraw Request</h2>

          <form @submit.prevent="submitWithdraw">
            <!-- Input Nominal -->
            <div class="mb-4">
              <label class="block text-sm navbar-font mb-1">Jumlah (Rp)</label>
              <input type="number" v-model="form.jumlah" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 inter-font" placeholder="Minimal 10000" required />
            </div>

            <!-- Pilih Metode Pembayaran (Bank/E-Wallet) -->
            <div class="mb-4">
              <label class="block text-sm navbar-font mb-1">Metode</label>
              <select v-model="form.metode" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 inter-font" required>
                <option value="">-- Pilih Metode --</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="gopay">GoPay</option>
                <option value="ovo">OVO</option>
                <option value="dana">DANA</option>
              </select>
            </div>

            <!-- Input Nomor Rekening atau ID E-Wallet -->
            <div class="mb-4">
              <label class="block text-sm navbar-font mb-1">Rekening Tujuan</label>
              <input type="text" v-model="form.rekening_tujuan" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 inter-font" placeholder="Nomor rekening / ID e-wallet" required />
            </div>

            <div class="flex justify-end gap-3">
              <button type="button" @click="showModal = false" class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg navbar-font">Batal</button>
              <button type="submit" class="px-6 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow" :disabled="loading">
                {{ loading ? 'Mengirim...' : 'Submit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </SellerSide>
</template>

<script setup>
import SellerSide from '@/components/navbar/seller-side.vue';
import Skeleton from '@/components/Skeleton.vue';
import api from '@/plugins/axios';
import { onMounted, ref } from 'vue';

const withdraws = ref([]);
const showModal = ref(false);
const loading = ref(false);
const isLoading = ref(true);
const form = ref({ jumlah: '', metode: '', rekening_tujuan: '', catatan: '' });

/**
 * Mengambil daftar riwayat penarikan dana milik penjual yang sedang login.
 */
const getWithdraw = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/withdraw/self');
    withdraws.value = response.data?.data?.data || response.data?.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

/**
 * Mengirimkan formulir permintaan penarikan dana ke admin.
 */
const submitWithdraw = async () => {
  loading.value = true;
  try {
    await api.post('/withdraw/submit', form.value);
    showModal.value = false;
    form.value = { jumlah: '', metode: '', rekening_tujuan: '', catatan: '' };
    await getWithdraw();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => { getWithdraw(); });
</script>
