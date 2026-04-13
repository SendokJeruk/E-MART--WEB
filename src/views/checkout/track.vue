<template>
  <!-- Halaman Lacak Pesanan: Menampilkan status perjalanan kurir secara realtime -->
  <Navbar />
  <div class="bg-gray-50 min-h-screen py-6">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-2xl font-bold text-black navbar-font mb-4">Lacak Pesanan</h1>

      <!-- INFO PRODUK & RESI -->
      <div v-if="pengiriman" class="bg-white rounded-xl shadow p-4 flex items-center gap-4 mb-6">
        <img :src="pengiriman.detail_shipments[0]?.detail_transaction?.product?.foto_cover" class="w-20 h-20 rounded-lg object-cover" />
        <div class="flex-1">
          <h3 class="text-lg font-bold">{{ pengiriman.kode_transaksi }}</h3>
          <p class="text-sm text-gray-500">Kurir: {{ pengiriman.kurir }} (Resi: {{ pengiriman.kode_resi || 'Sedang diproses' }})</p>
        </div>
      </div>

      <!-- PROGRESS BAR (Langkah-langkah Pengiriman) -->
      <div v-if="pengiriman" class="relative py-10">
        <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2"></div>
        <div class="flex justify-between relative z-10">
          <div v-for="s in ['Diproses', 'Pickup', 'Transit', 'Dikirim', 'Tiba']" :key="s" class="flex flex-col items-center">
            <div class="w-8 h-8 rounded-full bg-[#7D0A0A] text-white flex items-center justify-center text-xs">✓</div>
            <span class="text-[10px] mt-2 font-bold">{{ s }}</span>
          </div>
        </div>
      </div>

      <!-- RIWAYAT PERJALANAN (Manifest dari Kurir) -->
      <div class="bg-white rounded-xl shadow p-6 space-y-6" v-if="shippingData?.data?.manifest">
        <h2 class="font-bold border-b pb-2">Detail Perjalanan</h2>
        <div v-for="(log, i) in [...shippingData.data.manifest].reverse()" :key="i" class="flex gap-4">
          <div class="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></div>
          <div>
            <p class="text-sm font-bold">{{ log.manifest_description }}</p>
            <p class="text-xs text-gray-400">{{ log.manifest_date }} {{ log.manifest_time }} - {{ log.city_name }}</p>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-10 text-gray-400 bg-white rounded-xl">Belum ada data pelacakan dari kurir.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'

const route = useRoute()
const pengiriman = ref(null)
const shippingData = ref(null)

/**
 * Mengambil data pengiriman dan log manifest (status kurir) dari server.
 */
const getTrackingInfo = async () => {
  try {
    const res = await api.get(`/pengiriman/${route.params.id}`)
    pengiriman.value = res.data.data
    shippingData.value = res.data.data.shippingData // Data manifest dari pihak kurir
  } catch (e) { console.error('Gagal melacak pesanan', e) }
}

onMounted(() => { getTrackingInfo() })
</script>
