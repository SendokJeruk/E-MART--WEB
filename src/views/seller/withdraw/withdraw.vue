<template>
  <SellerSide>
    <div class="p-6 overflow-x-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl navbar-font">Withdraw</h1>
      </div>

      <!-- Tombol Withdraw -->
      <button
        @click="showModal = true"
        class="px-6 py-2 mb-6 bg-red-700 hover:bg-red-800 text-white navbar-font rounded-lg shadow"
      >
        + Withdraw
      </button>

      <!-- Daftar Withdraw -->
              <!-- Skeleton -->
        <div v-if="isLoading" class="grid gap-4">
          <div
            v-for="i in 3"
            :key="i"
            class="bg-white shadow rounded-lg p-4 border"
          >
            <Skeleton height="20px" width="120px" class="mb-2"/>
            <Skeleton height="14px" width="200px" class="mb-1"/>
            <Skeleton height="14px" width="180px" class="mb-1"/>
            <Skeleton height="14px" width="150px"/>
          </div>
        </div>

        <!-- Data Withdraw -->
        <div v-else-if="withdraws.length > 0" class="grid gap-4">
          <div
            v-for="item in withdraws"
            :key="item.id"
            class="bg-white shadow rounded-lg p-4 border"
          >
            <div class="flex justify-between items-center">
              <div>
                <p class="text-lg navbar-font">Rp {{ item.jumlah.toLocaleString() }}</p>
                <p class="text-sm text-gray-600 inter-font">Metode: {{ item.metode }}</p>
                <p class="text-sm text-gray-600 inter-font">Rekening: {{ item.rekening_tujuan }}</p>
                <p class="text-sm text-gray-600 inter-font" v-if="item.catatan">
                  Catatan: {{ item.catatan }}
                </p>
              </div>

              <span
                class="px-3 py-1 text-sm navbar-font rounded-lg"
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

        <!-- Empty State -->
        <div v-else class="text-center py-10 text-gray-500 bg-white shadow rounded-lg border">
          Tidak ada data penarikan
        </div>

        <div
          v-if="lastPage > 1"
          class="flex justify-center mt-4 space-x-2 mb-4"
        >
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            v-for="page in lastPage"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 rounded',
              page === currentPage
                ? 'bg-[#7D0A0A] text-white'
                : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

      <!-- Modal (form withdraw tetap ada di bawah) -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <h2 class="text-xl mb-4 navbar-font">Withdraw Request</h2>

          <form @submit.prevent="submitWithdraw">
            <div class="mb-4">
              <label class="block text-sm navbar-font mb-1">Jumlah (Rp)</label>
              <input
                type="number"
                v-model="form.jumlah"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 inter-font"
                placeholder="Minimal 10000, Maksimal 1000000"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm navbar-font mb-1">Metode</label>
              <select
                v-model="form.metode"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 inter-font"
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
              <label class="block text-sm navbar-font mb-1">Rekening Tujuan</label>
              <input
                type="text"
                v-model="form.rekening_tujuan"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 inter-font"
                placeholder="Nomor rekening / ID e-wallet"
                required
              />
            </div>

            <div class="mb-4">
              <label class="block text-sm navbar-font mb-1">Catatan (Opsional)</label>
              <textarea
                v-model="form.catatan"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 inter-font"
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
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg navbar-font"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-red-700 hover:bg-red-800 text-white navbar-font rounded-lg shadow navbar-font"
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
import Skeleton from '@/components/Skeleton.vue';
import api from '@/plugins/axios';
import { onMounted, ref } from 'vue';

const withdraws = ref([]);
const showModal = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');
const isLoading = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);

const form = ref({
  jumlah: '',
  metode: '',
  rekening_tujuan: '',
  catatan: ''
});

const getWithdraw = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await api.get('/withdraw/self', {
      params: { page }
    });

    let dataList = [];
    let currPage = 1;
    let lastPg = 1;

    // Check the structure: response.data is the main JSON object
    if (response.data && response.data.data) {
      const paginator = response.data.data;
      if (paginator.data && Array.isArray(paginator.data)) {
         dataList = paginator.data;
         currPage = paginator.current_page || 1;
         lastPg = paginator.last_page || 1;
      } else if (Array.isArray(paginator)) {
         dataList = paginator;
      }
    }

    withdraws.value = dataList;
    currentPage.value = currPage;
    lastPage.value = lastPg;

  } catch (err) {
    console.error('Gagal mengambil data withdraw:', err);
    withdraws.value = [];
  } finally {
    isLoading.value = false;
  }
};

const changePage = async (page) => {
  if (page < 1 || page > lastPage.value) return;
  await getWithdraw(page);
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
    const errors = err.response?.data?.errors;
    let errorMessage = err.response?.data?.message || 'Terjadi kesalahan, coba lagi.';
    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }
    error.value = errorMessage;
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
  await getWithdraw();
});
</script>
