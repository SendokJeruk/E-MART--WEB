<template>
  <Navbar />
  <!-- Halaman Riwayat: Menampilkan daftar semua pesanan yang pernah dibuat oleh pembeli -->
  <div class="bg-gray-50 min-h-screen pb-10">
    <h1 class="text-2xl font-bold navbar-font mb-6 text-black m-4">| Riwayat Pesanan</h1>

    <div class="px-4 py-4 max-w-5xl mx-auto">
      <!-- Tampilan saat data sedang diambil -->
      <template v-if="isLoading">
        <div v-for="n in 2" :key="n" class="bg-white rounded-xl shadow p-6 mb-6"><Skeleton width="100%" height="150px"/></div>
      </template>

      <!-- LIST RIWAYAT PESANAN -->
      <template v-else-if="shipmentList.length">
        <div class="space-y-6">
          <div v-for="(shipment, index) in shipmentList" :key="index" class="bg-white rounded-xl shadow border p-6">
            
            <!-- HEADER KARTU PESANAN (Status & Kode) -->
            <div class="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <p class="text-xs text-gray-500">Tanggal: {{ formatDate(shipment.created_at) }}</p>
                <p class="font-bold">ID Transaksi: {{ shipment.kode_transaksi }}</p>
              </div>
              <!-- Status pengiriman (Dikemas, Dikirim, Selesai, dll) -->
              <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase">
                {{ shipment.status_pengiriman }}
              </span>
            </div>

            <!-- Daftar barang dalam pesanan ini -->
            <div v-for="detail in shipment.detail_shipments" :key="detail.id" class="flex gap-4 mb-4">
              <img :src="detail.detail_transaction.product.foto_cover" class="w-16 h-16 object-cover rounded" />
              <div class="flex-1">
                <p class="font-medium">{{ detail.detail_transaction.product.nama_product }}</p>
                <p class="text-xs text-gray-500">{{ detail.detail_transaction.jumlah }} barang x Rp {{ formatPrice(detail.detail_transaction.harga) }}</p>
              </div>
            </div>

            <!-- TOTAL BAYAR DAN TOMBOL AKSI -->
            <div class="flex justify-between items-center border-t pt-4">
              <div><p class="text-sm text-gray-500">Total Belanja</p><p class="text-lg font-bold text-[#7D0A0A]">Rp {{ formatPrice(shipment.transaction.total_harga) }}</p></div>
              <div class="flex gap-2">
                <!-- Tombol Lacak untuk melihat posisi kurir -->
                <router-link :to="`/track-order/${shipment.id}`" class="px-4 py-2 text-sm border rounded-lg">Lacak</router-link>
                <!-- Tombol Konfirmasi jika barang sudah sampai -->
                <button v-if="shipment.status_pengiriman === 'tiba'" @click="postConfirmation(shipment.id)" class="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg">Selesai</button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Tampilan jika belum ada riwayat -->
      <div v-else class="text-center py-20 text-gray-400">Belum ada history transaksi</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'
import Skeleton from '@/components/Skeleton.vue'
import { showSuccess, showError } from '@/utils/alert'

const shipmentList = ref([])
const isLoading = ref(true)

const formatPrice = (p) => Number(p).toLocaleString('id-ID')
const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

/**
 * Mengambil daftar kiriman/pesanan milik user.
 */
const getShipment = async () => {
  try {
    const res = await api.get('/pengiriman/buyer')
    shipmentList.value = res.data.data.data || []
  } finally { isLoading.value = false }
}

/**
 * Mengkonfirmasi bahwa barang sudah diterima oleh pembeli.
 */
const postConfirmation = async (id) => {
  try {
    await api.post(`/pengiriman/confirm-received/${id}`)
    showSuccess('Pesanan selesai!'); getShipment()
  } catch (e) { showError('Gagal konfirmasi') }
}

onMounted(() => { getShipment() })
</script>
