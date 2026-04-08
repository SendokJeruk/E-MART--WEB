<template>
  <AdminSide>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl navbar-font">Manage Income</h1>

        <!-- Profile -->
        <div v-if="isLoading" class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <Skeleton type="circle" size="40px"/>
          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>
        </div>

        <div v-else class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold inter-font">{{ user.name }}</p>
            <p class="text-xs text-gray-600 inter-font">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://placehold.co/100'" class="w-10 h-10 bg-gray-300 rounded-full"/>
        </div>
      </div>

      <!-- Grid Withdraw -->
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="bg-white shadow rounded-xl p-4 space-y-3">
          <Skeleton height="14px" width="60%"/>
          <Skeleton height="12px" width="80%"/>
          <Skeleton height="18px" width="40%"/>
          <Skeleton height="20px" width="70px"/>
          <Skeleton height="36px" width="100%"/>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="withdraw in withdraws"
          :key="withdraw.id"
          class="bg-white shadow rounded-xl p-4 flex flex-col justify-between"
        >
          <div>
            <p class="font-bold text-gray-800 navbar-font">{{ withdraw.user.name }}</p>
            <p class="text-xs text-gray-500 mb-2 inter-font">{{ withdraw.user.email }}</p>
            <p class="text-lg font-bold text-red-700 navbar-font">
              Rp {{ withdraw.jumlah.toLocaleString() }}
            </p>

            <span
              class="mt-2 inline-block px-3 py-1 rounded-full text-xs navbar-font"
              :class="{
                'bg-yellow-100 text-yellow-700': withdraw.status === 'pending',
                'bg-green-100 text-green-700': withdraw.status === 'accepted',
                'bg-red-100 text-red-700': withdraw.status === 'rejected'
              }"
            >
              {{ withdraw.status }}
            </span>
          </div>

          <button
            class="mt-4 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 navbar-font"
            @click="openDetail(withdraw)"
          >
            Lihat Detail
          </button>
        </div>
      </div>

      <div
        v-if="pagination.last_page > 1"
        class="flex justify-center mt-6 space-x-2"
      >
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          v-for="page in pagination.last_page"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-4 py-2 rounded',
            page === pagination.current_page
              ? 'bg-red-700 text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <!-- Empty -->
      <div v-if="!isLoading && withdraws.length === 0" class="p-6 text-center text-gray-500">
        Tidak ada data penarikan
      </div>

      <!-- Modal -->
      <transition name="fade">
        <div v-if="selectedWithdraw" class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <transition name="scale">
            <div v-if="selectedWithdraw" class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
              <button class="absolute top-3 right-3 text-gray-500 hover:text-gray-700" @click="selectedWithdraw = null">✖</button>

              <h2 class="text-xl navbar-font mb-4">Detail Withdraw</h2>

              <div class="space-y-2 text-sm text-gray-700">
                <p><span class="inter-font">Seller:</span> {{ selectedWithdraw.user.name }}</p>
                <p><span class="inter-font">Email:</span> {{ selectedWithdraw.user.email }}</p>
                <p><span class="inter-font">Jumlah:</span> Rp {{ selectedWithdraw.jumlah.toLocaleString() }}</p>
                <p><span class="inter-font">Metode:</span> {{ selectedWithdraw.metode }}</p>
                <p><span class="inter-font">Rekening Tujuan:</span> {{ selectedWithdraw.rekening_tujuan }}</p>
                <p><span class="inter-font">Catatan:</span> {{ selectedWithdraw.catatan }}</p>

                <p>
                  <span class="inter-font">Status:</span>
                  <span
                    class="ml-2 px-3 py-1 rounded-full text-xs navbar-font"
                    :class="{
                      'bg-yellow-100 text-yellow-700': selectedWithdraw.status === 'pending',
                      'bg-green-100 text-green-700': selectedWithdraw.status === 'accepted',
                      'bg-red-100 text-red-700': selectedWithdraw.status === 'rejected'
                    }"
                  >
                    {{ selectedWithdraw.status }}
                  </span>
                </p>
              </div>

              <div class="flex gap-3 mt-6" v-if="selectedWithdraw.status !== 'accepted'">
                <button
                  class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 navbar-font"
                  :disabled="loading"
                  @click="updateStatus(selectedWithdraw.id, 'approved')"
                >
                  {{ loading ? 'Processing...' : 'Approve' }}
                </button>

                <button
                  class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 navbar-font"
                  :disabled="loading"
                  @click="updateStatus(selectedWithdraw.id, 'rejected')"
                >
                  {{ loading ? 'Processing...' : 'Reject' }}
                </button>
              </div>
            </div>
          </transition>
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

const user = ref({});
const withdraws = ref([]);
const selectedWithdraw = ref(null);
const loading = ref(false);
const isLoading = ref(true);
const pagination = ref({
  current_page: 1,
  last_page: 1,
});

const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  }
};

const getWithdraw = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await api.get('/withdraw', {
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
    pagination.value.current_page = currPage;
    pagination.value.last_page = lastPg;

  } catch (error) {
    console.error('Gagal mengambil data withdraw:', error);
    withdraws.value = [];
  } finally {
    isLoading.value = false;
  }
};

const changePage = async (page) => {
  if (page < 1 || page > pagination.value.last_page) return;

  await getWithdraw(page);
};

const updateStatus = async (id, status) => {
  loading.value = true;
  try {
    const backendStatus = status === 'approved' ? 'accepted' : 'rejected';
    await api.post(`/withdraw/handle/${id}`, { status: backendStatus });
    await getWithdraw();
    selectedWithdraw.value = null;
  } catch (error) {
    console.error('Gagal update status:', error.response?.data || error);
  } finally {
    loading.value = false;
  }
};

const openDetail = (withdraw) => {
  selectedWithdraw.value = withdraw;
};

onMounted(async () => {
  await getProfile();
  await getWithdraw(1);
});
</script>

<style>
/* Animasi fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animasi scale */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}
.scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
