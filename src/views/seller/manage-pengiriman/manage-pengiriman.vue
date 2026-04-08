<template>
  <SellerSide>
    <div class="p-6">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl navbar-font text-gray-800">
          Manage Pengiriman
        </h1>

        <div class="bg-white shadow-md rounded-xl px-4 py-2 flex items-center gap-3 w-64">
          <img
            :src="user?.foto_profil || 'https://placehold.co/100'"
            class="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <p class="text-sm font-semibold text-gray-800 inter-font">{{ user.name }}</p>
            <p class="text-xs text-gray-500 inter-font">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="bg-white shadow-xl rounded-xl overflow-hidden border">

        <table class="min-w-full text-sm">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3 text-left navbar-font">Kode Transaksi</th>
              <th class="px-4 py-3 text-left navbar-font">Kurir</th>
              <th class="px-4 py-3 text-left navbar-font">Kode Resi</th>
              <th class="px-4 py-3 text-left navbar-font">Status</th>
              <th class="px-4 py-3 text-left navbar-font">Aksi</th>
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

              <td class="px-4 py-3 inter-font">
                {{ item.kode_transaksi }}
              </td>

              <td class="px-4 py-3 inter-font">
                {{ item.kurir || '-' }}
              </td>

              <!-- INPUT RESI -->
              <td class="px-4 py-3">
                <input
                  v-model="item.kode_resi"
                  type="text"
                  placeholder="Masukkan resi"
                  class="border rounded px-2 py-1 text-sm w-32 inter-font"
                />
              </td>

              <!-- STATUS -->
              <td class="px-4 py-3 inter-font">
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
                <div class="flex items-center gap-2">
                  <button
                    @click="openDetailModal(item)"
                    class="px-3 py-1 rounded-lg text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white navbar-font"
                  >
                    Detail
                  </button>
                  <button
                    @click="cetakStruk(item.id)"
                    class="px-3 py-1 rounded-lg text-sm font-medium border border-gray-600 text-gray-700 hover:bg-gray-100 navbar-font"
                  >
                    Cetak Struk
                  </button>
                </div>
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
      <div v-if="lastPage > 1" class="flex justify-center mt-4 space-x-2 mb-4">
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

    <!-- MODAL DETAIL -->
    <transition name="fade">
      <div v-if="selectedPengiriman" class="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 p-4">
        <div class="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col relative">
          <div class="p-5 border-b sticky top-0 bg-white z-10 rounded-t-xl flex justify-between items-center">
            <h2 class="text-xl navbar-font text-gray-800">Detail Pengiriman</h2>
            <button @click="closeDetailModal" class="text-gray-500 hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 overflow-y-auto flex-1 space-y-6">
            <!-- Info Transaksi -->
            <div>
              <h3 class="text-lg navbar-font text-[#7D0A0A] border-b pb-2 mb-3">Informasi Transaksi</h3>
              <div class="grid grid-cols-2 gap-y-2 text-sm">
                <p class="text-gray-600 navbar-font">Kode Transaksi</p>
                <p class="inter-font">: {{ selectedPengiriman.kode_transaksi }}</p>
                <p class="text-gray-600 navbar-font">Tanggal Transaksi</p>
                <p class="inter-font">: {{ selectedPengiriman.transaction?.tanggal_transaksi }}</p>
                <p class="text-gray-600 navbar-font">Total Harga Barang</p>
                <p class="inter-font text-red-600">: Rp {{ Number(selectedPengiriman.transaction?.total_harga || 0).toLocaleString('id-ID') }}</p>
                <p class="text-gray-600 navbar-font">Ongkos Kirim</p>
                <p class="inter-font text-red-600">: Rp {{ Number(selectedPengiriman.ongkir || 0).toLocaleString('id-ID') }}</p>
                <p class="text-gray-600 navbar-font">Total Berat</p>
                <p class="inter-font">: {{ selectedPengiriman.transaction?.total_berat }} gr</p>
              </div>
            </div>

            <!-- Info Pembeli & Tujuan -->
            <div>
              <h3 class="text-lg navbar-font text-[#7D0A0A] border-b pb-2 mb-3">Tujuan Pengiriman</h3>
              <div class="grid grid-cols-1 gap-y-2 text-sm bg-gray-50 p-4 rounded-lg border">
                <p><span class="inter-font text-gray-700">Penerima:</span> {{ selectedPengiriman.alamat?.nama_penerima }}</p>
                <p><span class="inter-font text-gray-700">No. Telp Pembeli:</span> {{ selectedPengiriman.transaction?.user?.no_telp || '-' }}</p>
                <p><span class="inter-font text-gray-700">Alamat Lengkap:</span></p>
                <p class="text-gray-600 leading-relaxed inter-font font-bold">
                  {{ selectedPengiriman.alamat?.detail_alamat }}<br/>
                  {{ selectedPengiriman.alamat?.subdistrict_name }}, {{ selectedPengiriman.alamat?.district_name }}<br/>
                  {{ selectedPengiriman.alamat?.city_name }}, {{ selectedPengiriman.alamat?.province_name }}<br/>
                  Kode Pos: {{ selectedPengiriman.alamat?.zip_code }}
                </p>
              </div>
            </div>

            <!-- Info Barang -->
            <div>
              <h3 class="text-lg navbar-font text-[#7D0A0A] border-b pb-2 mb-3">Daftar Barang</h3>
              <div class="space-y-3">
                <div v-for="detail in selectedPengiriman.detail_shipments" :key="detail.id" class="flex gap-4 border rounded-lg p-3 items-center">
                  <img 
                    :src="detail.detail_transaction?.product?.foto_cover" 
                    class="w-16 h-16 object-cover rounded border"
                    @error="(e) => e.target.src = 'https://placehold.co/400x400?text=Image+Not+Found'"
                  />
                  <div class="flex-1">
                    <p class="navbar-font text-gray-800">{{ detail.detail_transaction?.product?.nama_product }}</p>
                    <p class="text-xs text-gray-500 line-clamp-1 inter-font">{{ detail.detail_transaction?.product?.deskripsi }}</p>
                    <div class="flex justify-between items-center mt-2">
                      <p class="text-sm font-bold inter-font text-gray-700">{{ detail.detail_transaction?.jumlah }}x @ Rp {{ Number(detail.detail_transaction?.harga || 0).toLocaleString('id-ID') }}</p>
                      <p class="text-sm navbar-font text-red-600">Rp {{ Number(detail.detail_transaction?.subtotal || 0).toLocaleString('id-ID') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Modal Footer -->
          <div class="p-4 border-t sticky bottom-0 bg-white z-10 rounded-b-xl flex justify-end">
            <button @click="closeDetailModal" class="px-6 py-2 bg-gray-200 text-gray-800 navbar-font rounded-lg hover:bg-gray-300 transition">Tutup</button>
          </div>
        </div>
      </div>
    </transition>

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
const selectedPengiriman = ref(null)

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

const openDetailModal = (item) => {
  selectedPengiriman.value = item
}

const closeDetailModal = () => {
  selectedPengiriman.value = null
}

const cetakStruk = async (id) => {
  try {
    const response = await api.get(`/pengiriman/cetak-struk/${id}`, {
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Struk_Pengiriman_${id}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    showSuccess("Berhasil mengunduh struk pengiriman")
  } catch (error) {
    console.error('Gagal cetak struk:', error)
    if (error.response && error.response.data instanceof Blob) {
      error.response.data.text().then(text => {
        try {
          const json = JSON.parse(text)
          showError(json.message || 'Gagal mengunduh struk pengiriman')
        } catch {
          showError('Gagal mengunduh struk pengiriman')
        }
      })
    } else {
      showError('Gagal mengunduh struk pengiriman')
    }
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>