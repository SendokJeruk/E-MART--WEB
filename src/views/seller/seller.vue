<template>
  <sellerside>
    <!-- Dashboard Seller: Menampilkan ringkasan performa penjualan toko milik seller -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-gray-200">
        <h1 class="text-xl md:text-2xl font-bold text-gray-800 navbar-font">Dashboard Seller</h1>
      </div>

      <!-- KARTU STATISTIK TOKO -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">
        <template v-if="isLoading">
          <div v-for="n in 4" :key="n" class="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <Skeleton height="14px" width="60%" class="mx-auto mb-3" />
            <div class="flex justify-center"><Skeleton height="28px" width="80px" /></div>
          </div>
        </template>

        <template v-else>
          <!-- Jumlah seluruh produk yang dimiliki -->
          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Product</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">{{ ProductCount }}</p>
          </div>
          <!-- Jumlah item yang sudah terjual -->
          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Penjualan</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">{{ totalPenjualan }}</p>
          </div>
          <!-- Total pendapatan kotor selama ini -->
          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Income</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">Rp. {{ totalIncome.toLocaleString('id-ID') }}</p>
          </div>
          <!-- Saldo yang saat ini bisa dicairkan (Wallet) -->
          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Wallet</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">Rp. {{ totalWallet.toLocaleString('id-ID') }}</p>
          </div>
        </template>
      </div>

      <!-- FILTER TANGGAL DAN EKSPOR EXCEL -->
      <div class="mt-6 flex flex-col lg:flex-row justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <div class="w-full">
            <label class="text-xs text-gray-600 mb-1 block">Mulai</label>
            <input type="date" v-model="startDate" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-700 outline-none"/>
          </div>
          <div class="w-full">
            <label class="text-xs text-gray-600 mb-1 block">Sampai</label>
            <input type="date" v-model="endDate" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-700 outline-none"/>
          </div>
          <button @click="applyFilter" class="w-full sm:w-auto px-5 py-2.5 bg-red-700 text-white text-sm rounded-lg font-semibold shadow-md hover:bg-red-800 active:scale-95 transition">Filter</button>
        </div>
        <button @click="exportExcel" class="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition">Export Excel</button>
      </div>

      <!-- GRAFIK PENJUALAN DAN PRODUK TERLARIS -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6">
        <!-- Grafik garis tren pendapatan -->
        <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h2 class="text-base md:text-lg text-gray-700 mb-4">Tren Penjualan</h2>
          <Skeleton v-if="isLoading" height="300px"/>
          <apexchart v-else type="line" height="300" :options="lineOptions" :series="lineSeries"/>
        </div>
        <!-- Grafik donat 5 produk paling banyak dibeli -->
        <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h2 class="text-base md:text-lg text-gray-700 mb-4">5 Produk Terlaris</h2>
          <Skeleton v-if="isLoading" height="300px"/>
          <div v-else-if="doughnutSeries.length === 0" class="h-[300px] flex items-center justify-center text-gray-500">Tidak ada produk terjual</div>
          <apexchart v-else type="donut" height="300" :options="doughnutOptions" :series="doughnutSeries"/>
        </div>
      </div>

    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/plugins/axios"
import Sellerside from "@/components/navbar/seller-side.vue"
import Skeleton from "@/components/Skeleton.vue"
import VueApexCharts from "vue3-apexcharts"

const apexchart = VueApexCharts
const isLoading = ref(true)
const ProductCount = ref(0)
const totalPenjualan = ref(0)
const totalIncome = ref(0)
const totalWallet = ref(0)
const startDate = ref('')
const endDate = ref('')

// Pengaturan grafik garis (Tren)
const lineSeries = ref([{ name: "Pendapatan", data: [] }])
const lineOptions = ref({
  chart: { type: "line", height: 300, toolbar: { show: false } },
  stroke: { curve: "smooth", width: 3, colors: ["#6366f1"] },
  xaxis: { categories: [] },
  yaxis: { labels: { formatter: (value) => 'Rp ' + value.toLocaleString('id-ID') } },
  tooltip: { theme: 'dark', y: { formatter: (val) => `Rp ${val.toLocaleString('id-ID')}` } }
})

// Pengaturan grafik donat (Produk Terlaris)
const doughnutSeries = ref([])
const doughnutOptions = ref({
  chart: { type: "donut", height: 300 },
  labels: [],
  legend: { position: 'bottom' }
})

/**
 * Mengambil data pendapatan (income) penjual.
 */
const getIncome = async () => {
  try {
    const response = await api.get("/income")
    const myIncome = response.data.data.income
    totalIncome.value = myIncome.jumlah_total || 0
    totalPenjualan.value = myIncome.total_penjualan || 0
  } catch (error) { console.error(error) }
}

/**
 * Mengambil saldo yang bisa dicairkan (balance).
 */
const getWallet = async () => {
  try {
    const response = await api.get("/balance")
    totalWallet.value = response.data.data.balance?.balance || 0
  } catch (error) { console.error(error) }
}

/**
 * Mengambil 5 data produk terlaris untuk grafik donat.
 */
const getDoughnutStatistic = async () => {
  try {
    const response = await api.get('/product/statistic')
    let data = response.data.data || []
    data = data.filter(i => Number(i.terjual) > 0).sort((a, b) => b.terjual - a.terjual).slice(0, 5)
    doughnutOptions.value = { ...doughnutOptions.value, labels: data.map(i => i.nama_product) }
    doughnutSeries.value = data.map(i => Number(i.terjual))
  } catch (error) { console.error(error) }
}

onMounted(async () => {
  const today = new Date()
  startDate.value = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]
  
  try {
    isLoading.value = true
    await Promise.all([getIncome(), getWallet(), getDoughnutStatistic()])
  } finally { isLoading.value = false }
})
</script>
