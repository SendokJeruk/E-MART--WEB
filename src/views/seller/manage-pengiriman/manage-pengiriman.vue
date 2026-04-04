<template>
  <SellerSide>
    <div class="p-6">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">
          Manage Pengiriman
        </h1>

        <div class="bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-3 w-64">
          <img
            :src="user?.foto_profil || 'https://placehold.co/100'"
            class="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
            <p class="text-xs text-gray-500">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="bg-white shadow-xl rounded-xl overflow-hidden border">

        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left">Kode Transaksi</th>
              <th class="px-4 py-3 text-left">Kurir</th>
              <th class="px-4 py-3 text-left">Plat Nomor</th>
              <th class="px-4 py-3 text-left">Kode Resi</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Estimasi</th>
              <th class="px-4 py-3 text-left">Aksi</th>
            </tr>
          </thead>

          <!-- SKELETON -->
          <tbody v-if="isLoading">
            <tr v-for="i in 5" :key="i">
              <td class="px-4 py-3"><Skeleton height="16px" width="60px"/></td>
              <td class="px-4 py-3"><Skeleton height="16px" width="120px"/></td>
              <td class="px-4 py-3"><Skeleton height="16px" width="90px"/></td>
              <td class="px-4 py-3"><Skeleton height="16px" width="120px"/></td>
              <td class="px-4 py-3"><Skeleton height="30px" width="120px"/></td>
              <td class="px-4 py-3"><Skeleton height="16px" width="100px"/></td>
              <td class="px-4 py-3"><Skeleton height="32px" width="70px"/></td>
            </tr>
          </tbody>

          <!-- DATA -->
          <tbody v-else class="divide-y">
            <tr
              v-for="item in pengiriman"
              :key="item.id"
              class="hover:bg-gray-50 transition"
            >

              <td class="px-4 py-3">
                {{ item.kode_transaksi }}
              </td>

              <td class="px-4 py-3">
                {{ item.kurir || '-' }}
              </td>

              <td class="px-4 py-3">
                {{ item.plat_nomor || '-' }}
              </td>

              <!-- INPUT RESI -->
              <td class="px-4 py-3">
                <input
                  v-model="item.kode_resi"
                  type="text"
                  placeholder="Masukkan resi"
                  class="border rounded px-2 py-1 text-sm w-32"
                />
              </td>

              <!-- STATUS -->
              <td class="px-4 py-3">
                <select
                  v-model="item.status_pengiriman"
                  @change="updateStatus(item)"
                  class="border rounded-lg px-3 py-1 text-sm"
                  :disabled="isFinalStatus(item.status_pengiriman)"
                >
                  <option
                    v-for="status in getAvailableStatuses(item.status_pengiriman)"
                    :key="status"
                    :value="status"
                  >
                    {{ status }}
                  </option>
                </select>
              </td>

              <td class="px-4 py-3">
                {{ item.estimasi_tiba || '-' }}
              </td>

              <td class="px-4 py-3">
                <button
                  @click="deletePengiriman(item.id)"
                  class="px-3 py-1 rounded-lg text-sm font-medium"
                  :class="isFinalStatus(item.status_pengiriman)
                  ? 'bg-gray-300 text-gray-500'
                  : 'bg-red-500 hover:bg-red-600 text-white'"
                  :disabled="isFinalStatus(item.status_pengiriman)"
                >
                  Hapus
                </button>
              </td>

            </tr>

            <tr v-if="pengiriman.length === 0">
              <td colspan="7" class="text-center py-10 text-gray-500">
                Belum ada data pengiriman
              </td>
            </tr>

          </tbody>
        </table>

      </div>

      <!-- PAGINATION -->
      <div class="flex justify-center mt-4 space-x-2 mb-4">
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
          :class="['px-3 py-1 rounded', page === currentPage ? 'bg-[#7D0A0A] text-white' : 'bg-gray-200 text-gray-700']"
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

    </div>
  </SellerSide>
</template>

<script setup>
import SellerSide from '@/components/navbar/seller-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/plugins/axios'
import { showConfirm, showError, showSuccess } from '@/utils/alert'
import { onMounted, ref } from 'vue'

const user = ref({})
const pengiriman = ref([])
const isLoading = ref(true)

// Pagination
const currentPage = ref(1)
const lastPage = ref(1)

const statusOrder = [
  "dibuat",
  "dijadwalkan",
  "kurir_ditugaskan",
  "dalam_proses",
  "tiba",
  "diterima",
  "batal"
]

const getAvailableStatuses = (current) => {
  const index = statusOrder.indexOf(current)
  return statusOrder.slice(index, index + 2)
}

const isFinalStatus = (status) => {
  return status === "diterima" || status === "batal"
}

// Ambil profile
const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

// Ambil data pengiriman dengan pagination
const getPengiriman = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await api.get(`/pengiriman/seller?page=${page}`)
    pengiriman.value = response.data.data.data || []
    currentPage.value = response.data.data.current_page
    lastPage.value = response.data.data.last_page
  } catch (error) {
    pengiriman.value = []
  } finally {
    isLoading.value = false
  }
}

// Update status
const updateStatus = async (item) => {
  if (item.status_pengiriman === "dijadwalkan" && !item.kode_resi) {
    showError("Masukkan kode resi terlebih dahulu!")
    await getPengiriman(currentPage.value)
    return
  }

  try {
    await api.put(`/pengiriman/${item.id}`, {
      kode_transaksi: item.kode_transaksi,
      status_pengiriman: item.status_pengiriman,
      resi: item.kode_resi ?? null,
      ekspedisi: item.kurir ?? null,
      plat_nomor: item.plat_nomor ?? null,
      estimasi_tiba: item.estimasi_tiba ?? null,
      bukti_pengiriman: item.bukti_pengiriman ?? null
    })

    showSuccess("Status berhasil diperbarui!")
    await getPengiriman(currentPage.value)
  } catch (error) {
    console.error(error)
    showError("Gagal update status")
    await getPengiriman(currentPage.value)
  }
}

// Hapus pengiriman
const deletePengiriman = async (id) => {
  if (!confirm('Yakin ingin menghapus pengiriman ini?')) return

  try {
    await api.delete(`/pengiriman/${id}`)
    pengiriman.value = pengiriman.value.filter(p => p.id !== id)
  } catch (error) {
    console.log(error)
  }
}

// Ganti halaman
const changePage = async (page) => {
  if (page < 1 || page > lastPage.value) return
  await getPengiriman(page)
}

onMounted(() => {
  getProfile()
  getPengiriman()
})
</script>