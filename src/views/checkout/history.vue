<template>
  <Navbar />

  <div class="bg-gray-50 min-h-screen pb-10">
    <h1 class="text-2xl font-bold navbar-font mb-6 text-black m-4">| History</h1>

    <div class="px-4 py-4 max-w-5xl mx-auto">
      <!-- Filter / Pilih Tanggal -->
      <div class="flex flex-wrap gap-3 mb-6 items-center justify-between">
        <div class="relative">
          <button
            class="flex items-center gap-2 px-5 py-2.5 bg-white rounded-md text-sm border border-gray-300 hover:bg-gray-50 transition shadow"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Pilih Tanggal
          </button>
        </div>
      </div>

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
                'text-green-600 font-medium': shipment.status_pengiriman === 'sudah selesai',
                'text-orange-500 font-medium': shipment.status_pengiriman === 'dalam pengiriman',
                'text-blue-600 font-medium': shipment.status_pengiriman === 'dibuat',
                'text-red-600 font-medium': shipment.status_pengiriman === 'dibatalkan',
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

            <!-- <button
              class="px-5 py-2 text-sm bg-[#FF5722] text-white rounded-md hover:bg-orange-600 transition"
            >
              Beli Lagi
            </button>

            <button
              class="px-5 py-2 text-sm border border-[#FF5722] text-[#FF5722] rounded-md hover:bg-orange-50 transition"
            >
              Beri Ulasan
            </button> -->
          </div>
        </div>
      </div>

      <!-- Jika Belum Ada Pengiriman -->
      <div v-if="shipmentList.length === 0" class="text-center py-10">
        <div class="inline-block p-4 bg-gray-100 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-700 mb-1">
          Belum ada pengiriman
        </h3>
        <p class="text-gray-500 text-sm">
          Pengiriman yang Anda lakukan akan muncul di halaman ini
        </p>
        <button
          class="mt-4 px-6 py-2 bg-[#FF5722] text-white rounded-md hover:bg-orange-600 transition"
        >
          Mulai Belanja
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue'
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const shipmentList = ref([])

const formatPrice = (price) => {
  return Number(price).toLocaleString('id-ID')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const options = { day: 'numeric', month: 'long', year: 'numeric' }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

const generateOrderNumber = () => {
  return 'INV' + Math.floor(10000000 + Math.random() * 90000000)
}

const getShipment = async () => {
  try {
    const response = await api.get('/pengiriman')
    const data = response.data.data.data
    shipmentList.value = data
    console.log('Data pengiriman:', shipmentList.value)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getShipment()
})
</script>
