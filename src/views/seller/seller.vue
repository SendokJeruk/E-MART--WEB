<template>
  <sellerside>
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <!-- HEADER -->
      <div class="flex flex-col md:flex-row justify-between md:items-center gap-4 pb-4 border-b border-gray-200">

        <h1 class="text-xl md:text-2xl font-bold text-gray-800 navbar-font">
          Dashboard Seller
        </h1>
      </div>

      <!-- STAT CARDS -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6">

        <template v-if="isLoading">
          <div v-for="n in 4" :key="n" class="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <Skeleton height="14px" width="60%" class="mx-auto mb-3"/>
            <div class="flex justify-center">
              <Skeleton height="28px" width="80px"/>
            </div>
          </div>
        </template>

        <template v-else>

          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Product</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">{{ ProductCount }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Penjualan</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">{{ totalPenjualan }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Income</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">
              Rp. {{ totalIncome.toLocaleString('id-ID') }}
            </p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 text-center">
            <h2 class="text-sm md:text-base text-gray-600 mb-2">Total Wallet</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700">
              Rp. {{ totalWallet.toLocaleString('id-ID') }}
            </p>
          </div>

        </template>
      </div>

      <!-- FILTER & EXPORT -->
      <div class="mt-6 flex flex-col lg:flex-row justify-between gap-4">

        <!-- FILTER -->
        <div class="flex flex-col sm:flex-row gap-3 w-full">

          <div class="w-full">
            <label class="text-xs text-gray-600 mb-1 block">Mulai</label>
            <input type="date" v-model="startDate"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-700 outline-none"/>
          </div>

          <div class="w-full">
            <label class="text-xs text-gray-600 mb-1 block">Sampai</label>
            <input type="date" v-model="endDate"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-700 outline-none"/>
          </div>

          <button
            @click="applyFilter"
            class="w-full sm:w-auto px-5 py-2.5 bg-red-700 text-white text-sm rounded-lg font-semibold shadow-md hover:bg-red-800 active:scale-95 transition"
          >
            Filter
          </button>

        </div>

        <!-- EXPORT -->
        <button
          @click="exportExcel"
          class="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition"
        >
         Export Excel
        </button>

      </div>

      <!-- CHART -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6">

        <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h2 class="text-base md:text-lg text-gray-700 mb-4">Tren Penjualan</h2>
          <Skeleton v-if="isLoading" height="300px"/>
          <apexchart v-else type="line" height="300" :options="lineOptions" :series="lineSeries"/>
        </div>

        <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h2 class="text-base md:text-lg text-gray-700 mb-4">5 Produk Terlaris</h2>
          <Skeleton v-if="isLoading" height="300px"/>

          <div v-else-if="doughnutSeries.length === 0"
            class="h-[300px] flex items-center justify-center text-gray-500">
            Tidak ada produk terjual
          </div>

          <apexchart v-else type="donut" height="300"
            :options="doughnutOptions"
            :series="doughnutSeries"/>
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
import { showError, showSuccess } from "@/utils/alert"

const apexchart = VueApexCharts

// state
const ProductSeller = ref([])
const ProductCount = ref([])
const user = ref({})
const totalPenjualan = ref(0)
const totalIncome = ref(0)
const totalWallet = ref(0)
const isLoading = ref(true)

// date filters
const startDate = ref('')
const endDate = ref('')

// Line chart state
const lineSeries = ref([{ name: "Pendapatan", data: [] }])
const lineOptions = ref({
  chart: { type: "line", height: 300, toolbar: { show: false } },
  stroke: { curve: "smooth", width: 3, colors: ["#6366f1"] },
  markers: { size: 5, colors: ["#6366f1"], strokeColors: "#fff", strokeWidth: 2, hover: { size: 7 } },
  xaxis: { categories: [] },
  yaxis: {
    labels: {
      formatter: (value) => {
        if (value >= 1000000) return 'Rp ' + (value / 1000000).toFixed(1) + ' jt'
        if (value >= 1000) return 'Rp ' + (value / 1000).toFixed(0) + ' rb'
        return 'Rp ' + value
      }
    }
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val) => `Rp ${val.toLocaleString('id-ID')}` }
  }
})

// Doughnut chart state
const doughnutSeries = ref([])
const doughnutOptions = ref({
  chart: { type: "donut", height: 300 },
  labels: [],
  dataLabels: { enabled: true },
  plotOptions: { pie: { donut: { size: '65%' } } },
  legend: { position: 'bottom' }
})

// API calls
const getProfile = async () => {
  try {
    const response = await api.get("/profile")
    user.value = response.data.data
  } catch (error) {
    console.error("Gagal mengambil profil:", error)
  }
}

const getCountProducts = async () => {
  try {
    const response = await api.get("/product/myproducts?count")
    ProductCount.value = response.data.data
  } catch (error) {
    console.error("Gagal mengambil jumlah produk:", error)
  }
}

const getProducts = async () => {
  try {
    const response = await api.get("/product/myproducts", { params: { myproducts: true } })
    const allProducts = response.data.data.data
    ProductSeller.value = allProducts.filter((p) => p.user_id === user.value.id)
  } catch (error) {
    console.error("Gagal mengambil produk:", error)
  }
}

const getWallet = async () => {
  try {
    const response = await api.get("/balance")
    const wallet = response.data.data
    totalWallet.value = wallet.balance?.balance || 0
  } catch (error) {
    console.error("Gagal mengambil wallet:", error)
  }
}

const getIncome = async () => {
  try {
    const response = await api.get("/income")
    const myIncome = response.data.data.income
    totalIncome.value = myIncome.jumlah_total || 0
    totalPenjualan.value = myIncome.total_penjualan || 0
  } catch (error) {
    console.error("Gagal mengambil income:", error)
  }
}

const getDoughnutStatistic = async () => {
  try {
    const response = await api.get('/product/statistic')
    let data = response.data.data || []
    
    data = data.filter(i => Number(i.terjual) > 0)
    data.sort((a, b) => Number(b.terjual) - Number(a.terjual))
    data = data.slice(0, 5)
    
    doughnutOptions.value = { ...doughnutOptions.value, labels: data.map(i => i.nama_product) }
    doughnutSeries.value = data.map(i => Number(i.terjual))
  } catch (error) {
    console.error('Gagal mengambil statistik produk:', error)
  }
}

const formatToDMY = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}

const getLineStatistic = async () => {
  try {
    const params = {}
    if (startDate.value) params.start_date = formatToDMY(startDate.value)
    if (endDate.value) params.end_date = formatToDMY(endDate.value)

    const response = await api.get('/report/seller/statistic', { params })
    const data = response.data.data || {}
    
    const dates = Object.keys(data)
    const revenues = Object.values(data).map(v => Number(v))
    
    lineOptions.value = { ...lineOptions.value, xaxis: { categories: dates } }
    lineSeries.value = [{ name: 'Pendapatan', data: revenues }]
  } catch (error) {
    console.error('Gagal mengambil statistik penjualan:', error)
  }
}

const applyFilter = () => {
  getLineStatistic()
}

const exportExcel = async () => {
  try {
    const params = {}
    if (startDate.value) params.start_date = formatToDMY(startDate.value)
    if (endDate.value) params.end_date = formatToDMY(endDate.value)

    const response = await api.get('/report/seller/periodic-excel', {
      params,
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `Laporan_Penjualan_${formatToDMY(startDate.value) || 'all'}_${formatToDMY(endDate.value) || 'all'}.xlsx`)
    
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)

    showSuccess("Berhasil mengunduh laporan excel")
  } catch (error) {
    console.error('Gagal export excel:', error)
    
    if (error.response && error.response.data instanceof Blob) {
      error.response.data.text().then(text => {
        console.error("Detail error dari server:", text)
        try {
          const json = JSON.parse(text)
          showError(json.message || 'Terjadi kesalahan di server (500).')
        } catch {
          showError('Gagal mengunduh excel. Server bermasalah.')
        }
      })
    } else {
      showError('Gagal mengunduh excel')
    }
  }
}

const initDates = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  
  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]
}

onMounted(async () => {
  initDates()
  
  try {
    isLoading.value = true
    await Promise.all([
      getProfile(),
      getIncome(),
      getWallet(),
      getProducts(),
      getDoughnutStatistic(),
      getLineStatistic(),
      getCountProducts()
    ])
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>
