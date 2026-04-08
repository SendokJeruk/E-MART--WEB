<template>
  <Navbar />

  <div class="bg-gray-50 min-h-screen py-6">
    <div class="max-w-4xl mx-auto px-4">

      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-black navbar-font">Pesanan</h1>
      </div>


      <!-- Produk -->
      <div
        v-if="pengiriman?.detail_shipments?.length"
        class="bg-white rounded-xl shadow p-4 flex items-center gap-4 mb-6"
      >

        <img
          :src="pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.foto_cover"
          class="w-20 h-20 rounded-lg object-cover"
        />

        <div class="flex-1">
          <h3 class="text-lg navbar-font">
            {{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.nama_product }}
          </h3>

          <p class="text-gray-500 text-sm inter-font">
            Toko :
            {{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.user?.toko?.nama_toko ?? '-' }}
          </p>

          <p class="text-red-600 navbar-font">
            Rp.{{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.harga }}
          </p>
        </div>

        <div class="text-right text-sm">
          <p>
            <span class="navbar-font">Nomor Resi :</span>
            {{ pengiriman?.kode_resi ?? '-' }}
          </p>

          <p>
            <span class="navbar-font">Kurir :</span>
            {{ pengiriman?.kurir ?? '-' }}
          </p>
        </div>

      </div>



      <!-- Progress Bar -->
      <div v-if="pengiriman" class="mb-6">

        <div class="relative">

          <div class="absolute top-3 left-0 right-0 h-1 bg-gray-300"></div>

          <div
            class="absolute top-3 left-0 h-1 bg-red-600 transition-all duration-500"
            :style="{ width: progressWidth }"
          ></div>

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


        <div class="flex justify-between text-xs mt-2 font-medium inter-font">

          <span :class="stepTextClass(1)">Diproses</span>
          <span :class="stepTextClass(2)">Pickup</span>
          <span :class="stepTextClass(3)">Transit</span>
          <span :class="stepTextClass(4)">Dikirim</span>
          <span :class="stepTextClass(5)">Tiba</span>

        </div>

      </div>



      <!-- Timeline Tracking -->
      <div class="bg-white rounded-xl shadow p-4 space-y-4" v-if="manifest.length">

        <div
          v-for="(item,index) in manifest"
          :key="index"
          class="flex items-start gap-3"
        >

          <div
            class="w-3 h-3 rounded-full mt-1"
            :class="index === 0 ? 'bg-red-600' : 'bg-gray-300'"
          ></div>

          <div>

            <p class="text-sm font-medium inter-font">
              {{ item.manifest_date }} - {{ item.manifest_time }}
            </p>

            <p
              :class="index === 0 ? 'text-red-600' : 'text-gray-600 navbar-font'"
            >
              {{ item.manifest_description }}
            </p>

            <p class="text-xs text-gray-400 inter-font">
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

const pengiriman = ref(null)
const shippingData = ref(null)

const idShipment = route.params.id



// GET DATA
const getShipment = async () => {

  try {

    const response = await api.get(`/pengiriman/${idShipment}`)

    const data = response.data.data

    pengiriman.value = data
    shippingData.value = data.shippingData

  } catch (error) {

    console.error("Gagal ambil data pengiriman", error)

  }

}



// MANIFEST TIMELINE
const manifest = computed(() => {

  const data = shippingData.value?.data?.manifest ?? []

  return [...data].reverse()

})



// CURRENT STEP DARI TITLE
const currentStep = computed(() => {

  const list = shippingData.value?.data?.manifest ?? []

  if (!list.length) return 1

  const latest = list[list.length - 1].title

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



// WIDTH PROGRESS
const progressWidth = computed(() => {

  return `${((currentStep.value - 1) / 4) * 100}%`

})



const stepClass = (step) => {

  return step <= currentStep.value
    ? "bg-red-600 text-white"
    : "bg-gray-300 text-black"

}



const stepTextClass = (step) => {

  return step <= currentStep.value
    ? "text-red-600"
    : "text-gray-400"

}



// DOWNLOAD INVOICE
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

    console.error("Gagal download invoice", error)

  }

}



onMounted(() => {

  getShipment()

})

</script>