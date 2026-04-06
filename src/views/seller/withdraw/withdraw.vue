<template>
  <SellerSide>
    <div class="p-6 overflow-x-auto">
      <!-- Header urusan tarik duit (Withdraw) -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Withdraw</h1>

        <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img
            :src="user?.foto_profil || 'https://placehold.co/100'"
            class="w-10 h-10 bg-gray-300 rounded-full"
          />
        </div>
      </div>

      <!-- Tombol buat buka modal permintaan withdraw baru -->
      <button
        @click="showModal = true"
        class="px-6 py-2 mb-6 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow"
      >
        + Mau Tarik Duit
      </button>

      <!-- Daftar riwayat withdraw yang udah pernah diajuin -->
        <!-- skeleton pas nunggu data list withdraw -->
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

        <!-- Data riwayat withdraw asli -->
        <div v-else-if="withdraws.length > 0" class="grid gap-4">
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
                <!-- Catatan tambahan dari seller kalo ada -->
                <p class="text-sm text-gray-600" v-if="item.catatan">
                  Catatan: {{ item.catatan }}
                </p>
              </div>

              <!-- Label status permintaan (diproses, beres, atau gagal) -->
              <span
                class="px-3 py-1 text-sm font-semibold rounded-lg"
                :class="{
                  'bg-yellow-100 text-yellow-700': item.status === 'pending',
                  'bg-green-100 text-green-700': item.status === 'success' || item.status === 'accepted',
                  'bg-red-100 text-red-700': item.status === 'failed' || item.status === 'rejected'
                }"
              >
                {{ item.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Navigasi halaman biar gak penuh-penuhin layar -->
        <div
          v-if="withdraws.length"
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

      <!-- Modal pop-up buat ngisi form withdraw -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <h2 class="text-xl font-bold mb-4">Request Tarik Saldo</h2>

          <form @submit.prevent="submitWithdraw">
            <!-- Nominal duit yang mau ditarik -->
            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Jumlah (Rp)</label>
              <input
                type="number"
                v-model="form.jumlah"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Min 10.000, Max 1.000.000 ya"
                required
              />
            </div>

            <!-- Pilih mau dikirim kemana duitnya -->
            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Metode Transfer</label>
              <select
                v-model="form.metode"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">-- Pilih Metode --</option>
                <option value="bank_transfer">Transfer Bank</option>
                <option value="gopay">GoPay</option>
                <option value="ovo">OVO</option>
                <option value="dana">DANA</option>
                <option value="shopeePay">ShopeePay</option>
              </select>
            </div>

            <!-- Nomor rekening atau ID dompet digital -->
            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Nomor Rekening / ID</label>
              <input
                type="text"
                v-model="form.rekening_tujuan"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Ketik nomor rekening kamu di sini..."
                required
              />
            </div>

            <!-- Tambahin keterangan kalo perlu -->
            <div class="mb-4">
              <label class="block text-sm font-semibold mb-1">Catatan (Kalo butuh)</label>
              <textarea
                v-model="form.catatan"
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600"
                placeholder="Tulis pesan buat admin kalo ada"
              ></textarea>
            </div>

            <!-- Slot buat info error atau sukses -->
            <p v-if="error" class="text-red-600 text-sm mb-3">{{ error }}</p>
            <p v-if="success" class="text-green-600 text-sm mb-3">{{ success }}</p>

            <!-- Tombol aksi modal -->
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
              >
                Gak jadi
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg shadow"
                :disabled="loading"
              >
                {{ loading ? 'Lagi kirim...' : 'Ajukan Sekarang' }}
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

const user = ref({});
const withdraws = ref([]);
const showModal = ref(false);
const loading = ref(false);
const error = ref('');
const success = ref('');
const isLoading = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);

// Siapin objek form withdraw
const form = ref({
  jumlah: '',
  metode: '',
  rekening_tujuan: '',
  catatan: ''
});

// Tarik data profil seller
const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (err) {
    console.error('Gagal mengambil profil:', err);
  }
};

// Ambil riwayat withdraw milik seller ini doang
const getWithdraw = async (page = 1) => {
  try {
    const response = await api.get('/withdraw/self', {
      params: { page }
    });

    const resData = response.data.data;

    // Simpen list-nya ama info halamannya
    withdraws.value = resData.data;
    currentPage.value = resData.current_page;
    lastPage.value = resData.last_page;

  } catch (err) {
    console.error('Gagal mengambil data withdraw kamu:', err);
  } finally {
    isLoading.value = false;
  }
};

// Pas pindah-pindah halaman riwayat
const changePage = async (page) => {
  if (page < 1 || page > lastPage.value) return;
  await getWithdraw(page);
};

// Fungsi buat ngirim permintaan withdraw baru ke server
const submitWithdraw = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;
  try {
    const response = await api.post('/withdraw/submit', form.value);
    success.value = response.data.message;
    // Reset form kalo udah beres
    form.value = { jumlah: '', metode: '', rekening_tujuan: '', catatan: '' };
    // Tarik ulang list biar yang baru nongol
    await getWithdraw(); 
  } catch (err) {
    // Kalo gagal, kasih tau alesannya kenapa
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Aduh, gagal kirim nih. Coba lagi ntar ya.';
    }
  } finally {
    loading.value = false;
  }
};

// Bersih-bersih pas modal ditutup
const closeModal = () => {
  showModal.value = false;
  error.value = '';
  success.value = '';
};

// Pas halaman kebuka, sikat ambil profil ama riwayatnya
onMounted(async () => {
  await getProfile();
  await getWithdraw();
});
</script>
