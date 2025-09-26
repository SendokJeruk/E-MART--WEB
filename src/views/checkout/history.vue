<template>
  <Navbar />

  <div class="bg-gray-50 min-h-screen pb-10">
    <h1 class="text-2xl font-bold navbar-font mb-6 text-black m-4">| History</h1>

    <div class="px-4 py-4 max-w-5xl mx-auto">
      <!-- List Pengiriman -->
      <div class="space-y-6 max-h-[700px] overflow-y-auto pr-2">
        <div
          v-for="(shipment, sIndex) in shipmentList"
          :key="sIndex"
          class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
        >
          <!-- Header -->
          <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-b">
            <div class="flex items-center gap-6">
              <span class="text-sm text-gray-500">
                {{ formatDate(shipment.created_at) }}
              </span>
              <span class="text-sm">
                No. Pesanan: {{ shipment.id || generateOrderNumber() }}
              </span>
            </div>
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

          <!-- Detail Produk -->
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
                <p class="text-xs text-gray-500 mb-1">Variasi: Standar</p>
                <p class="text-xs text-gray-500">Jumlah: {{ detail.detail_transaction.jumlah }}</p>
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

          <!-- Total Belanja -->
          <div class="px-6 py-4 bg-gray-50 border-t flex justify-end">
            <div class="flex items-center gap-2 text-sm">
              <span class="text-gray-600">Total Belanja:</span>
              <span class="text-lg font-bold text-[#FF5722]">
                Rp {{ formatPrice(shipment.transaction.total_harga) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="px-6 py-4 flex justify-end gap-3 border-t">
            <router-link
              :to="`/track-order/${shipment.id}`"
              class="px-5 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition inline-block"
            >
              Lihat Detail
            </router-link>

            <!-- Tombol Konfirmasi kalau status = tiba -->
            <button
              v-if="shipment.status_pengiriman === 'tiba'"
              @click="postConfirmation(shipment.id)"
              class="px-5 py-2 text-sm bg-[#FF5722] text-white rounded-md hover:bg-orange-600 transition"
            >
              Konfirmasi Pesanan
            </button>

            <!-- Tombol Rating -->
            <button
              v-else-if="shipment.status_pengiriman === 'diterima' && !shipment.detail_shipments[0]?.detail_transaction.product.sudah_rating"
              @click="openRatingModal(shipment)"
              class="px-5 py-2 text-sm border border-[#FF5722] text-[#FF5722] rounded-md hover:bg-orange-50 transition"
            >
              Beri Rating
            </button>

            <!-- Kalau sudah dirating -->
            <span
              v-else-if="shipment.status_pengiriman === 'diterima'"
              class="px-5 py-2 text-sm text-gray-400 border border-gray-200 rounded-md"
            >
              Sudah diberi rating
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Rating -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold mb-4">Beri Rating</h2>

        <form @submit.prevent="submitRating">
          <!-- Bintang Rating -->
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

          <!-- Deskripsi -->
          <textarea
            v-model="form.deskripsi"
            placeholder="Tulis ulasan..."
            class="w-full border rounded-md p-2 mb-4 text-sm"
          ></textarea>

          <!-- Upload Foto -->
          <input 
            type="file" 
            @change="handleFileUpload" 
            class="mb-4 border border-gray-300 rounded-md p-2 w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#BF3131] file:text-white hover:file:bg-orange-600"
          />

          <!-- Tombol -->
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

const shipmentList = ref([])

// modal
const showModal = ref(false)
const selectedShipment = ref(null)
const form = ref({
  product_id: null,
  rating: 0,
  deskripsi: '',
  foto_review: null
})

// format
const formatPrice = (price) => Number(price).toLocaleString('id-ID')
const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-'
const generateOrderNumber = () => 'INV' + Math.floor(10000000 + Math.random() * 90000000)

const getShipment = async () => {
  try {
    const response = await api.get('/pengiriman')
    shipmentList.value = response.data.data.data
  } catch (error) {
    console.error(error)
  }
}

// konfirmasi pesanan
const postConfirmation = async (id) => {
  try {
    await api.post(`/pengiriman/confirm-received/${id}`)
    alert('Pesanan dikonfirmasi!')
    getShipment()
  } catch (error) {
    console.error('Gagal konfirmasi pesanan:', error)
    alert('Gagal konfirmasi pesanan')
  }
}

// modal handler
const openRatingModal = (shipment) => {
  selectedShipment.value = shipment
  form.value.product_id = shipment.detail_shipments[0]?.detail_transaction.product.id // ambil produk pertama
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
  form.value = { product_id: null, rating: 0, deskripsi: '', foto_review: null }
}

// file upload
const handleFileUpload = (e) => {
  form.value.foto_review = e.target.files[0]
}

// kirim rating
const submitRating = async () => {
  try {
    const fd = new FormData()
    fd.append('product_id', form.value.product_id)
    fd.append('rating', form.value.rating)
    fd.append('deskripsi', form.value.deskripsi)
    if (form.value.foto_review) {
      fd.append('foto_review', form.value.foto_review)
    }

    await api.post('/rating', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert('Rating berhasil dikirim!')
    closeModal()
    getShipment()
  } catch (error) {
    console.error('Gagal kirim rating:', error)
    alert('Gagal kirim rating')
  }
}

onMounted(() => {
  getShipment()
})
</script>
