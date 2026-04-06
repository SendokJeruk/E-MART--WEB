<template>
  <Navbar />

  <div class="bg-gray-50 min-h-screen pb-10">
    <!-- Judul buat liat-liat belanjaan lama kita -->
    <h1 class="text-2xl font-bold navbar-font mb-6 text-black m-4">| History</h1>

    <div class="px-4 py-4 max-w-5xl mx-auto">

      <!-- Tampilan skeleton pas datanya lagi ditarik dari database -->
      <template v-if="isLoading">
        <div class="space-y-6">
          <div
            v-for="n in 3"
            :key="n"
            class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200 p-6 space-y-4"
          >

            <!-- header skeleton -->
            <div class="flex justify-between">
              <Skeleton width="150px" height="16px"/>
              <Skeleton width="100px" height="16px"/>
            </div>

            <!-- produk skeleton -->
            <div
              v-for="i in 2"
              :key="i"
              class="flex items-center gap-4"
            >

              <Skeleton width="80px" height="80px"/>

              <div class="flex-1 space-y-2">
                <Skeleton width="70%" height="16px"/>
                <Skeleton width="40%" height="14px"/>
                <Skeleton width="30%" height="14px"/>
              </div>

              <div class="space-y-2">
                <Skeleton width="80px" height="14px"/>
                <Skeleton width="80px" height="14px"/>
              </div>

            </div>

            <!-- total skeleton -->
            <div class="flex justify-end">
              <Skeleton width="120px" height="18px"/>
            </div>

            <!-- tombol skeleton -->
            <div class="flex justify-end">
              <Skeleton width="120px" height="36px"/>
            </div>

          </div>
        </div>
      </template>

      <!-- Daftar barang-barang yang udah pernah dibeli (History) -->
      <template v-else-if="shipmentList.length">
        <div class="space-y-6 max-h-[700px] overflow-y-auto pr-2">
           
          <div
            v-for="(shipment, sIndex) in shipmentList"
            :key="sIndex"
            class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
          >

            <!-- Bagian atas kartu history: tgl beli, kode pesanan, ama statusnya -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
              <div class="flex items-center gap-6">

                <span class="text-sm text-gray-500">
                  {{ formatDate(shipment.created_at) }}
                </span>

                <span class="text-sm">
                  Kode Pesanan: {{ shipment.kode_transaksi || "SJK-GAGAL-KODE" }}
                </span>

              </div>

              <!-- Warna status dibikin beda-beda biar enak diliat -->
              <span
                :class="{
                  'text-green-600 font-medium': shipment.status_pengiriman === 'diterima',
                  'text-orange-500 font-medium': shipment.status_pengiriman === 'dalam pengiriman',
                  'text-blue-600 font-medium': shipment.status_pengiriman === 'dibuat',
                  'text-red-600 font-medium': shipment.status_pengiriman === 'dibatalkan',
                  'text-purple-600 font-medium': shipment.status_pengiriman === 'tiba',
                }"
                class="text-sm font-semibold"
              >
                {{ shipment.status_pengiriman }}
              </span>

            </div>

            <!-- List barang-barang di dalam satu pesanan itu -->
            <div class="divide-y divide-gray-100">

              <div
                v-for="(detail, index) in shipment.detail_shipments"
                :key="index"
                class="flex p-6"
              >
                <img
                  :src="detail.detail_transaction.product.foto_cover || '/placeholder-product.jpg'"
                  :alt="detail.detail_transaction.product.nama_product"
                  class="w-20 h-20 object-cover rounded-lg border"
                />

                <div class="ml-5 flex-1">
                  <h3 class="text-base font-medium text-gray-800 mb-1 line-clamp-2">
                    {{ detail.detail_transaction.product.nama_product }}
                  </h3>

                  <p class="text-xs text-gray-500 mb-1">
                    Variasi: Standar
                  </p>

                  <p class="text-xs text-gray-500">
                    Jumlah: {{ detail.detail_transaction.jumlah }}
                  </p>
                </div>

                <div class="text-right">
                  <p class="text-sm font-semibold text-gray-800">
                    Rp {{ formatPrice(detail.detail_transaction.harga) }}
                  </p>

                  <p class="text-xs text-gray-500 mt-1">
                    Total: Rp {{ formatPrice(detail.detail_transaction.harga * detail.detail_transaction.jumlah) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Bagian rincian total belanjaan satu pesanan -->
            <div class="px-6 py-4 bg-gray-50 border-t flex justify-end">

              <div class="flex items-center gap-2 text-sm">

                <span class="text-gray-600">
                  Total Belanja:
                </span>

                <span class="text-lg font-bold text-[#FF5722]">
                  Rp {{ formatPrice(shipment.transaction.total_harga) }}
                </span>

              </div>
            </div>

            <!-- Tombol-tombol aksi sesuai status barangnya -->
            <div class="px-6 py-4 flex justify-end gap-3 border-t">
              <router-link
                :to="`/track-order/${shipment.id}`"
                class="px-5 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition inline-block"
              >
                Lihat Detail
              </router-link>

              <!-- Tombol download invoice kalo barang udah nyampe --> 
              <button
                v-if="shipment.status_pengiriman === 'diterima'"
                @click="downloadInvoice(shipment.kode_transaksi)"
                class="px-5 py-2 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition"
              >
                Unduh Invoice
              </button>

              <!-- Konfirmasi kalo barang udah di tangan tapi statusnya belom update -->
              <button
                v-if="shipment.status_pengiriman === 'tiba'"
                @click="postConfirmation(shipment.id)"
                class="px-5 py-2 text-sm bg-[#FF5722] text-white rounded-md hover:bg-orange-600 transition"
              >
                Konfirmasi Pesanan
              </button>

              <!-- Tombol buat ngasih bintang ama ulasan -->
              <button
                v-else-if="shipment.status_pengiriman === 'diterima' && !hasRating(shipment)"
                @click="openRatingModal(shipment)"
                class="px-5 py-2 text-sm border border-[#FF5722] text-[#FF5722] rounded-md hover:bg-orange-50 transition"
              >
                Beri Rating
              </button>

              <!-- Kalo udah dikasih ulasan, kasih liat bintangnya -->
              <div
                v-else-if="shipment.status_pengiriman === 'diterima' && hasRating(shipment)"
                class="flex items-center gap-1 px-5 py-2 text-sm border border-yellow-400 rounded-md text-yellow-500"
              >
                <span
                  v-for="n in 5"
                  :key="n"
                  class="text-lg"
                  :class="n <= getRatingValue(shipment) ? 'text-yellow-400' : 'text-gray-300'"
                >
                  ★
                </span>

              </div>
            </div>
          </div>
        </div>
      </template>



      <!-- Kalo user belom pernah belanja sama sekali -->
      <template v-else>
        <div class="text-center py-20 text-gray-400">
          Belum ada history transaksi nih. Yuk belanja!
        </div>
      </template>
    </div>

    <!-- Modal buat ngisi rating ama upload foto bukti barangnya oke -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >

      <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">

        <h2 class="text-lg font-bold mb-4">
          Beri Rating
        </h2>

        <form @submit.prevent="submitRating">
          <!-- Pilih jumlah bintangnya (1 ampe 5) -->
          <div class="flex gap-2 mb-4">
            <span
              v-for="n in 5"
              :key="n"
              @click="form.rating = n"
              class="cursor-pointer text-2xl"
              :class="n <= form.rating ? 'text-yellow-400' : 'text-gray-300'"
            >
              ★
            </span>
          </div>

          <!-- Tulis uneg-uneg atau pujian buat barangnya -->
          <textarea
            v-model="form.deskripsi"
            placeholder="Tulis ulasan kamu di sini..."
            class="w-full border rounded-md p-2 mb-4 text-sm"
            required
          ></textarea>

          <!-- Inputan buat upload foto barang aslinya -->
          <input
            type="file"
            @change="handleFileUpload"
            class="mb-4 border border-gray-300 rounded-md p-2 w-full text-sm
            file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
            file:text-sm file:font-semibold file:bg-[#BF3131] file:text-white
            hover:file:bg-orange-600"
          />

          <!-- Tombol buat batalin atau kirim ulasannya -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm bg-gray-200 rounded-md"
            >
              Batal
            </button>

            <button
              type="submit"
              class="px-4 py-2 text-sm bg-[#BF3131] text-white rounded-md hover:bg-orange-600"
            >
              Kirim
            </button>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue'
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import Skeleton from '@/components/Skeleton.vue'
import { showError, showSuccess } from '@/utils/alert'

// List data history belanjaan
const shipmentList = ref([])
const isLoading = ref(true)

// Urusan modal rating
const showModal = ref(false)
const selectedShipment = ref(null)
// Data form buat dikirim ke server rating
const form = ref({
  detail_transaction_id: null,
  product_id: null,
  rating: 0,
  deskripsi: '',
  foto_review: null
})

// Fungsi bantu buat ngerapiin tampilan angka duit
const formatPrice = (price) => Number(price).toLocaleString('id-ID')
// Fungsi bantu buat ngerapiin format tanggal
const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'

// Ambil semua data pengiriman (history) milik si buyer
const getShipment = async () => {
  try {
    const response = await api.get('/pengiriman/buyer')
    shipmentList.value = response.data.data.data || []
    console.log('Shipment List:', shipmentList.value)
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// Fungsi buat buyer ngonfirmasi kalo barangnya beneran udah nyampe
const postConfirmation = async (id) => {
  try {
    await api.post(`/pengiriman/confirm-received/${id}`)
    showSuccess('Pesanan udah kamu terima ya, mantap!')
    getShipment() // Tarik ulang biar statusnya ganti
  } catch (error) {
    showError("Aduh, gagal konfirmasi nih. Coba lagi ya.")
    console.error('Gagal konfirmasi pesanan:', error)
  }
}

// Persiapin data barang yang mau dikasih ulasan
const openRatingModal = (shipment) => {
  const firstDetail = shipment.detail_shipments[0]
  selectedShipment.value = shipment
  form.value.detail_transaction_id = firstDetail?.detail_transaction?.id
  form.value.product_id = firstDetail?.detail_transaction?.product?.id
  showModal.value = true
}

// Reset form ama tutup modal rating
const closeModal = () => {
  showModal.value = false
  form.value = { product_id: null, rating: 0, deskripsi: '', foto_review: null }
}

// Nyimpen file foto ulasan yang kepilih
const handleFileUpload = (e) => {
  form.value.foto_review = e.target.files[0]
}

// Ngirim ulasan bintang ama teks ke server
const submitRating = async () => {
  try {
    const fd = new FormData()
    fd.append('detail_transaction_id', form.value.detail_transaction_id)
    fd.append('product_id', form.value.product_id)
    fd.append('rating', form.value.rating)
    fd.append('deskripsi', form.value.deskripsi)
    if (form.value.foto_review) {
      fd.append('foto_review', form.value.foto_review)
    }

    await api.post('/rating', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    showSuccess("Rating kamu udah masuk, makasih ya!")
    closeModal()
    getShipment() // Update data biar tombol rating ilang
  } catch (error) {
    console.error('Gagal kirim rating:', error)
    showError("Gagal ngirim ulasan nih.")
  }
}

// Fungsi buat nyolong file invoice PDF dari server
const downloadInvoice = async (kodeTransaksi) => {
  if (!kodeTransaksi) {
    showError("Kode transaksinya gak ada nih")
    return
  }
  try {
    const response = await api.get(`/report/invoice/${kodeTransaksi}`, {
      responseType: 'blob', // Penting nih biar dapetnya file mentah
    })

    // Bikin link download buatan biar filenya bisa di-save user
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Invoice-${kodeTransaksi}.pdf`)
    document.body.appendChild(link)
    link.click()

    // Bersih-bersih sisa link tadi
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)

    showSuccess("Invoice udah kedownload ya")
  } catch (error) {
    console.error('Gagal download invoice:', error)
    showError("Gagal ngambil invoice-nya")
  }
}

// Fungsi bantu buat ngecek apakah barang ini udah pernah diulas user apa belom
const hasRating = (shipment) => {
  const firstDetail = shipment.detail_shipments[0]
  return firstDetail?.detail_transaction?.rating !== undefined && firstDetail?.detail_transaction?.rating !== null
}

// Ambil nilai bintang yang udah pernah dikasih
const getRatingValue = (shipment) => {
  const firstDetail = shipment.detail_shipments[0]
  return firstDetail?.detail_transaction?.rating?.rating || 0
}

// Pas halaman kebuka, langsung tarik semua data historynya
onMounted(() => {
  getShipment()
})
</script>
