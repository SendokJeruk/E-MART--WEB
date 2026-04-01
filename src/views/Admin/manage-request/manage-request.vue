<template>
  <AdminSide>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-[#7D0A0A]">Manage Pengajuan Seller</h1>

        <!-- Profile -->
        <div v-if="isLoading" class="bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-3 w-64 border border-gray-200">
          <Skeleton type="circle" size="48px"/>
          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>
        </div>

        <div
          v-else
          class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60"
        >
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

      <!-- Skeleton Cards -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow p-5 border space-y-3">
          <div class="flex justify-between">
            <Skeleton height="18px" width="70px"/>
            <Skeleton height="12px" width="40px"/>
          </div>
          <Skeleton height="16px" width="60%"/>
          <Skeleton height="12px" width="40%"/>
          <div class="flex justify-between mt-4">
            <Skeleton height="34px" width="90px"/>
            <Skeleton height="34px" width="90px"/>
          </div>
        </div>
      </div>

      <!-- Data Cards -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(item, index) in requests"
          :key="index"
          class="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border border-gray-100 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span
                :class="[
                  'px-3 py-1 text-xs rounded-full font-semibold capitalize',
                  item.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : item.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ item.status }}
              </span>
              <span class="text-xs text-gray-400">#{{ item.id }}</span>
            </div>

            <h2 class="text-lg font-semibold text-gray-800 mb-1">
              {{ item.nama_lengkap }}
            </h2>
            <p class="text-sm text-gray-500">NIK: {{ item.nik }}</p>
          </div>

          <div class="mt-6 flex justify-between items-center">
            <button
              @click="openDetail(item)"
              class="bg-[#7D0A0A] hover:bg-[#BF3131] text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
            >
              Detail
            </button>
            <button
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition"
            >
              Delete
            </button>
          </div>
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
              ? 'bg-[#7D0A0A] text-white'
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
      <div v-if="!isLoading && requests.length === 0" class="text-center text-gray-500 mt-10">
        Tidak ada pengajuan seller
      </div>
    </div>

    <!-- Modal Detail (tidak perlu skeleton karena muncul setelah klik) -->
    <transition name="modal-fade">
      <div v-if="selectedItem" class="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
        <div class="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative">
          <button
            @click="selectedItem = null"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >✕</button>

          <h2 class="text-2xl font-bold text-[#7D0A0A] mb-6">
            Detail Pengajuan Seller
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <p><span class="font-semibold">Status:</span> {{ selectedItem.status }}</p>
            <p><span class="font-semibold">Note:</span> {{ selectedItem.note }}</p>
            <p><span class="font-semibold">NIK:</span> {{ selectedItem.nik }}</p>
            <p><span class="font-semibold">Nama Lengkap:</span> {{ selectedItem.nama_lengkap }}</p>
            <p><span class="font-semibold">Tempat Lahir:</span> {{ selectedItem.tempat_lahir }}</p>
            <p><span class="font-semibold">Tanggal Lahir:</span> {{ selectedItem.tanggal_lahir }}</p>
            <p><span class="font-semibold">Jenis Kelamin:</span> {{ selectedItem.jenis_kelamin }}</p>
            <p><span class="font-semibold">Alamat KTP:</span> {{ selectedItem.alamat_ktp }}</p>
          </div>

          <div class="mt-6">
            <span class="font-semibold">Foto KTP:</span><br/>
            <img :src="selectedItem.foto_ktp" class="w-56 h-36 object-cover rounded-lg border mt-3 shadow"/>
          </div>

          <div class="mt-6">
            <label class="font-semibold block mb-2">Catatan Admin</label>
            <textarea
              v-model="note"
              rows="3"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none"
            ></textarea>
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              @click="updateStatus(selectedItem.id, 'rejected')"
              class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm shadow-md transition"
            >
              Reject
            </button>
            <button
              @click="updateStatus(selectedItem.id, 'accepted')"
              class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm shadow-md transition"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </transition>
  </AdminSide>
</template>

<script setup>
import AdminSide from '@/components/navbar/admin-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/plugins/axios'
import { showSuccess } from '@/utils/alert'
import { ref, onMounted } from 'vue'

const user = ref({})
const requests = ref([])
const selectedItem = ref(null)
const note = ref('')
const isLoading = ref(true)
const pagination = ref({
  current_page: 1,
  last_page: 1,
});

const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

const getRequestSeller = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await api.get('/requestseller', {
      params: { page }
    });
    const resData = response.data.data;
    requests.value = Array.isArray(resData.data) ? resData.data : [];
    pagination.value.current_page = resData.current_page;
    pagination.value.last_page = resData.last_page;
  } catch (error) {
    console.error('Gagal mengambil request seller:', error);
    requests.value = [];
  } finally {
    isLoading.value = false;
  }
};

const changePage = async (page) => {
  if (page < 1 || page > pagination.value.last_page) return;

  await getRequestSeller(page);
};

const openDetail = (item) => {
  selectedItem.value = item
  note.value = item.note || ''
}

const updateStatus = async (id, status) => {
  try {
    await api.put(`/requestseller/${id}`, { status, note: note.value })
    const index = requests.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      requests.value[index].status = status
      requests.value[index].note = note.value
    }
    selectedItem.value.status = status
    selectedItem.value.note = note.value
    showSuccess(`Pengajuan berhasil diubah menjadi ${status}`)
  } catch (error) {
    console.error('Gagal update status:', error)
    showError('Gagal mengubah status!')
  }
}

onMounted(() => {
  getProfile()
  getRequestSeller(1)
})
</script>

<style>
/* Animasi modal fade + scale */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
