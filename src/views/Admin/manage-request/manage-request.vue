<template>
  <AdminSide>
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-[#7D0A0A]">Manage Pengajuan Seller</h1>

        <div
          class="bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-3 w-64 border border-gray-200"
        >
          <div class="flex-1">
            <p class="text-sm font-bold text-gray-800">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
          <img
            :src="user?.foto_profil || 'https://placehold.co/400'"
            class="w-12 h-12 rounded-full border object-cover"
          />
        </div>
      </div>

      <!-- Grid Card -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>

    <!-- Modal Detail -->
    <transition name="modal-fade">
      <div
        v-if="selectedItem"
        class="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
      >
        <div
          class="bg-white rounded-xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative transform transition-all duration-300 scale-95 opacity-0"
          :class="{'scale-100 opacity-100': selectedItem}"
        >
          <button
            @click="selectedItem = null"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
          >
            ✕
          </button>

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
            <span class="font-semibold">Foto KTP:</span><br />
            <img
              :src="selectedItem.foto_ktp"
              alt="Foto KTP"
              class="w-56 h-36 object-cover rounded-lg border mt-3 shadow"
            />
          </div>

          <!-- Note Input -->
          <div class="mt-6">
            <label for="note" class="font-semibold block mb-2">Catatan Admin</label>
            <textarea
              id="note"
              v-model="note"
              rows="3"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none"
              placeholder="Tulis catatan untuk pengajuan ini..."
            ></textarea>
          </div>

          <!-- Action Accept / Reject -->
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
import api from '@/plugins/axios'
import { ref, onMounted } from 'vue'

const user = ref({})
const requests = ref([])
const selectedItem = ref(null)
const note = ref('')

const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

const getRequestSeller = async () => {
  try {
    const response = await api.get('/requestseller')
    requests.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil request seller:', error)
  }
}

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
    alert(`Pengajuan berhasil diubah menjadi ${status}`)
  } catch (error) {
    console.error('Gagal update status:', error)
    alert('Gagal mengubah status!')
  }
}

onMounted(() => {
  getProfile()
  getRequestSeller()
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
