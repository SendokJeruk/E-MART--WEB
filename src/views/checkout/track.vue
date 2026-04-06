<template>
  <Navbar />

  <div class="bg-gray-50 min-h-screen py-6">
    <div class="max-w-4xl mx-auto px-4">

      <!-- Judul halaman lacak pesanan -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-black">Lacak Pesanan</h1>
      </div>


      <!-- Info singkat produk yang lagi di jalan -->
      <div
        v-if="pengiriman?.detail_shipments?.length"
        class="bg-white rounded-xl shadow p-4 flex items-center gap-4 mb-6"
      >

        <img
          :src="pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.foto_cover"
          class="w-20 h-20 rounded-lg object-cover"
        />

        <div class="flex-1">
          <h3 class="text-lg font-semibold">
            {{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.nama_product }}
          </h3>

          <p class="text-gray-500 text-sm">
            Toko :
            {{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.user?.toko?.nama_toko ?? '-' }}
          </p>

          <p class="text-red-600 font-bold">
            Rp.{{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.harga }}
          </p>
        </div>

        <!-- Detail nomor resi ama kurir yang ngebawa -->
        <div class="text-right text-sm">
          <p>
            <span class="font-semibold">Nomor Resi :</span>
            {{ pengiriman?.kode_resi ?? '-' }}
          </p>

          <p>
            <span class="font-semibold">Kurir :</span>
            {{ pengiriman?.kurir ?? '-' }}
          </p>
        </div>

      </div>



      <!-- Bagian Progress Bar biar tau paket udah sampe mana (visual) -->
      <div v-if="pengiriman" class="mb-6">

        <div class="relative">

          <!-- Garis dasar abu-abu -->
          <div class="absolute top-3 left-0 right-0 h-1 bg-gray-300"></div>

          <!-- Garis merah penanda progres, panjangnya otomatis sesuai tahap -->
          <div
            class="absolute top-3 left-0 h-1 bg-red-600 transition-all duration-500"
            :style="{ width: progressWidth }"
          ></div>

          <!-- Titik-titik angka tahapan pengiriman -->
          <div class="flex justify-between relative z-10">

            <div
              v-for="step in 5"
              :key="step"
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              :class="stepClass(step)"
            >
              {{ step }}
            </div>

          </div>

        </div>


        <!-- Teks keterangan buat tiap tahapan pengiriman -->
        <div class="flex justify-between text-xs mt-2 font-medium">

          <span :class="stepTextClass(1)">Diproses</span>
          <span :class="stepTextClass(2)">Pickup</span>
          <span :class="stepTextClass(3)">Transit</span>
          <span :class="stepTextClass(4)">Dikirim</span>
          <span :class="stepTextClass(5)">Tiba</span>

        </div>

      </div>



      <!-- Bagian Timeline detil perjalanan paket dari kurir -->
      <div class="bg-white rounded-xl shadow p-4 space-y-4" v-if="manifest.length">

        <div
          v-for="(item,index) in manifest"
          :key="index"
          class="flex items-start gap-3"
        >

          <!-- Titik merah buat status terbaru, abu-abu buat yang lama -->
          <div
            class="w-3 h-3 rounded-full mt-1"
            :class="index === 0 ? 'bg-red-600' : 'bg-gray-300'"
          ></div>

          <div>

            <!-- Info waktu ama keterangan posisi paket -->
            <p class="text-sm font-medium">
              {{ item.manifest_date }} - {{ item.manifest_time }}
            </p>

            <p
              :class="index === 0 ? 'text-red-600 font-semibold' : 'text-gray-600'"
            >
              {{ item.manifest_description }}
            </p>

            <!-- Nama kotanya biar tau paket lagi mampir dimana -->
            <p class="text-xs text-gray-400">
              {{ item.city_name }}
            </p>

          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script setup>

import Navbar from '@/components/navbar/navbar.vue'
import api from '@/plugins/axios'

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State buat nampung data pengiriman ama detil tracking kurir
const pengiriman = ref(null)
const shippingData = ref(null)

const idShipment = route.params.id



// Fungsi utama buat tarik data pengiriman dari server kita
const getShipment = async () => {

  try {

    const response = await api.get(`/pengiriman/${idShipment}`)

    const data = response.data.data

    pengiriman.value = data
    shippingData.value = data.shippingData

  } catch (error) {

    console.error("Yah, gagal ambil data pengiriman nih", error)

  }

}



// Ngolah data manifest kurir biar yang paling baru nongol paling atas
const manifest = computed(() => {

  const data = shippingData.value?.data?.manifest ?? []

  return [...data].reverse()

})



// Nentuin sekarang lagi di tahap keberapa buat progress bar
const currentStep = computed(() => {

  const list = shippingData.value?.data?.manifest ?? []

  if (!list.length) return 1

  const latest = list[list.length - 1].title

  // Cocokin teks status dari kurir ama angka tahapannya
  switch (latest) {

    case "Pickup":
      return 2

    case "Transit Center":
      return 3

    case "On Delivery":
      return 4

    case "Delivered":
      return 5

    default:
      return 1
  }

})



// Ngitung lebar garis merah progress bar pake persen
const progressWidth = computed(() => {

  return `${((currentStep.value - 1) / 4) * 100}%`

})



// Fungsi buat ngatur warna buletan tahapan
const stepClass = (step) => {

  return step <= currentStep.value
    ? "bg-red-600 text-white"
    : "bg-gray-300 text-black"

}



// Fungsi buat ngatur warna teks keterangan tahapan
const stepTextClass = (step) => {

  return step <= currentStep.value
    ? "text-red-600"
    : "text-gray-400"

}



// Fungsi buat download file invoice PDF (kalo user butuh)
const getInvoice = async (kodeTransaksi) => {

  try {

    const response = await api.get(`/report/invoice/${kodeTransaksi}`, {
      responseType: "blob"
    })

    const blob = new Blob([response.data], { type: "application/pdf" })

    const link = document.createElement("a")

    link.href = window.URL.createObjectURL(blob)

    link.download = `invoice-${kodeTransaksi}.pdf`

    link.click()

  } catch (error) {

    console.error("Gagal download invoice-nya", error)

  }

}



// Pas halaman baru dibuka, langsung sikat ambil datanya
onMounted(() => {

  getShipment()

})

</script>