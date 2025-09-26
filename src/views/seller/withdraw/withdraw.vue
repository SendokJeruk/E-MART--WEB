<template>
  <SellerSide>
    <div class="p-6 overflow-x-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Withdraw</h1>

        <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img
            :src="user?.foto_profil || 'https://via.placeholder.com/100'"
            class="w-10 h-10 bg-gray-300 rounded-full"
          />
        </div>
      </div>

      <!-- Tombol Withdraw -->
      <button
        @click="showModal = true"
        class="px-6 py-2 mb-6 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow"
      >
        + Withdraw
      </button>

      <!-- Daftar Withdraw -->
      <div v-if="withdraws.length > 0" class="grid gap-4">
        <div
          v-for="item in withdraws"
          :key="item.id"
          class="bg-white shadow rounded-lg p-4 border"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="font-bold text-lg">Rp {{ item.jumlah.toLocaleString() }}</p>
              <p class="text-sm text-gray-600">Metode: {{ item.metode }}</p>
              <p class="text-sm text-gray-600">Rekening: {{ item.rekening_tujuan }}</p>
              <p class="text-sm text-gray-600" v-if="item.catatan">Catatan: {{ item.catatan }}</p>
            </div>
            <span
              class="px-3 py-1 text-sm font-semibold rounded-lg"
              :class="{
                'bg-yellow-100 text-yellow-700': item.status === 'pending',
                'bg-green-100 text-green-700': item.status === 'success',
                'bg-red-100 text-red-700': item.status === 'failed'
              }"
            >
              {{ item.status }}
            </span>
          </div>
        </div>
      </div>
      <p v-else class="text-gray-500">Belum ada withdraw.</p>

      <!-- Modal (form withdraw tetap ada di bawah) -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <h2 class="text-xl font-bold mb-4">Withdraw Request</h2>

          <form @submit.prevent="submitWithdraw">
            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Jumlah (Rp)</label>
              <input
                type="number"
                v-model="form.jumlah"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Minimal 10000, Maksimal 1000000"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Metode</label>
              <select
                v-model="form.metode"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">-- Pilih Metode --</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="gopay">GoPay</option>
                <option value="ovo">OVO</option>
                <option value="dana">DANA</option>
                <option value="shopeePay">ShopeePay</option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Rekening Tujuan</label>
              <input
                type="text"
                v-model="form.rekening_tujuan"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Nomor rekening / ID e-wallet"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Catatan (Opsional)</label>
              <textarea
                v-model="form.catatan"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Tambahkan catatan jika perlu"
              ></textarea>
            </div>

            <!-- Error / Success -->
            <p v-if="error" class="text-red-600 text-sm mb-3">{{ error }}</p>
            <p v-if="success" class="text-green-600 text-sm mb-3">{{ success }}</p>

            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow"
                :disabled="loading"
              >
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
import api from '@/plugins/axios';
import { onMounted, ref } from 'vue';

const user = ref({});
const withdraws = ref([]);
const showModal = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');

const form = ref({
  jumlah: '',
  metode: '',
  rekening_tujuan: '',
  catatan: ''
});

const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (err) {
    console.error('Gagal mengambil profil:', err);
  }
};

const getWithdraw = async () => {
  try {
    const response = await api.get('/withdraw/self');
    withdraws.value = response.data.data.data; 
  } catch (err) {
    console.error('Gagal mengambil data withdraw:', err);
  }
};

const submitWithdraw = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const response = await api.post('/withdraw/submit', form.value);
    success.value = response.data.message;
    form.value = { jumlah: '', metode: '', rekening_tujuan: '', catatan: '' };
    await getWithdraw(); 
  } catch (err) {
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Terjadi kesalahan, coba lagi.';
    }
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
  error.value = '';
  success.value = '';
};

onMounted(async () => {
  await getProfile();
  await getWithdraw();
});
</script>
