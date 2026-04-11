<template>
  <AdminSide>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl navbar-font text-[#7D0A0A]">Manage Pengajuan Seller</h1>
      </div>

      <!-- Skeleton Cards -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow p-5 space-y-3">
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
          class="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border-gray-100 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span
                :class="[
                  'px-3 py-1 text-xs rounded-full navbar-font capitalize',
                  (item.status.toLowerCase() === 'accepted')
                    ? 'bg-green-100 text-green-700'
                    : item.status.toLowerCase() === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ item.status }}
              </span>
            </div>

            <h2 class="text-lg inter-font text-gray-800 mb-1">
              {{ item.nama_lengkap }}
            </h2>
            <p class="text-sm text-gray-500 inter-font">NIK: {{ item.nik }}</p>
          </div>

          <div class="mt-6 flex justify-between items-center">
            <button
              v-if="item.status.toLowerCase() !== 'accepted'"
              @click="openDetail(item)"
              class="bg-[#7D0A0A] hover:bg-[#BF3131] text-white px-4 py-2 rounded-lg text-sm shadow-md transition navbar-font"
            >
              Detail
            </button>
            <button
              v-if="item.status.toLowerCase() === 'accepted'"
              @click="deleteRequest(item.id)"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow-md transition navbar-font"
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
        <div class="bg-white rounded-xl shadow-xl w-11/12 md:w-1/2 lg:w-1/2 p-4 relative">
          <button
            @click="selectedItem = null"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >✕</button>

          <h2 class="text-2xl navbar-font text-[#7D0A0A] mb-6">
            Detail Pengajuan Seller
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <p><span class="inter-font">Status:</span> {{ selectedItem?.status }}</p>
            <p><span class="inter-font">Note:</span> {{ selectedItem?.note }}</p>
            <p><span class="inter-font">NIK:</span> {{ selectedItem?.nik }}</p>
            <p><span class="inter-font">Nama Lengkap:</span> {{ selectedItem?.nama_lengkap }}</p>
            <p><span class="inter-font">Tempat Lahir:</span> {{ selectedItem?.tempat_lahir }}</p>
            <p><span class="inter-font">Tanggal Lahir:</span> {{ selectedItem?.tanggal_lahir }}</p>
            <p><span class="inter-font">Jenis Kelamin:</span> {{ selectedItem?.jenis_kelamin }}</p>
            <p><span class="inter-font">Alamat KTP:</span> {{ selectedItem?.alamat_ktp }}</p>
          </div>

          <div class="mt-6" v-if="selectedItem?.foto_ktp">
            <span class="inter-font">Foto KTP:</span><br/>
            <img :src="selectedItem?.foto_ktp" class="w-56 h-36 object-cover rounded-lg border mt-3 shadow"/>
          </div>

          <div class="mt-6">
            <label class="inter-font block mb-2">Catatan Admin</label>
            <textarea
              v-model="admin_note"
              rows="3"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none"
            ></textarea>
          </div>

          <div class="mt-8 flex justify-end gap-4">
            <button
              @click="updateStatus(selectedItem?.id, 'rejected')"
              class="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm shadow-md transition"
            >
              Reject
            </button>
            <button
              @click="updateStatus(selectedItem?.id, 'accepted')"
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
import { showSuccess, showError, showConfirm } from '@/utils/alert'
import { ref, onMounted } from 'vue'

const requests = ref([])
const selectedItem = ref(null)
const note = ref('')
const admin_note = ref('')
const isLoading = ref(true)
const pagination = ref({
  current_page: 1,
  last_page: 1,
});

const isAccepted = (status) => {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return s === 'accepted';
};

const getRequestSeller = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await api.get('/requestseller', {
      params: { page }
    });
    const resData = response.data.data;

    if (Array.isArray(resData)) {
      requests.value = resData;
      pagination.value.current_page = 1;
      pagination.value.last_page = 1;
    } else {
      requests.value = Array.isArray(resData?.data) ? resData.data : [];
      pagination.value.current_page = resData?.current_page || 1;
      pagination.value.last_page = resData?.last_page || 1;
    }
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
    await api.put(`/requestseller/${id}`, { status, note: admin_note.value })
    const index = requests.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      requests.value[index].status = status
      requests.value[index].note = note.value
    }
    selectedItem.value.status = status
    selectedItem.value.note = note.value
    showSuccess(`Pengajuan berhasil diubah menjadi ${status}`)
    selectedItem.value = null; // Tutup modal setelah update
  } catch (error) {
    console.error('Gagal update status:', error)
    showError('Gagal mengubah status!')
  }
}

const deleteRequest = async (id) => {
  const konfirmasi = await showConfirm('Yakin ingin menghapus pengajuan ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/requestseller/${id}`);
    requests.value = requests.value.filter(r => r.id !== id);
    showSuccess('Pengajuan berhasil dihapus.');
  } catch (error) {
    console.error('Gagal menghapus pengajuan:', error);
    showError('Gagal menghapus pengajuan.');
  }
};

onMounted(() => {
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
