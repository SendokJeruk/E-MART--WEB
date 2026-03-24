<template>
  <sellerside>
    <div class="p-6 bg-[#F9FAFB] min-h-screen">

      <!-- HEADER -->
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">

        <h1 class="text-2xl font-bold text-gray-800">
          Dashboard Seller
        </h1>

        <!-- Header Skeleton -->
        <div v-if="isLoading"
        class="bg-white shadow-sm rounded-xl px-4 py-3 flex items-center gap-4 w-72">

          <Skeleton type="circle" size="48px"/>

          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>

        </div>

        <!-- Header Real -->
        <div v-else
        class="bg-white shadow-sm rounded-xl px-4 py-3 flex items-center gap-4 w-72">

          <img
            :src="user?.foto_profil || 'https://placehold.co/100'"
            class="w-12 h-12 rounded-full object-cover border"
          />

          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
          </div>

        </div>

      </div>


      <!-- STAT CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        <!-- Skeleton Cards -->
        <template v-if="isLoading">

          <div v-for="n in 4" :key="n"
          class="bg-white rounded-xl shadow-sm border p-6">

            <Skeleton height="14px" width="60%" class="mx-auto mb-3"/>

            <div class="flex justify-center">
              <Skeleton height="28px" width="80px"/>
            </div>

          </div>

        </template>


        <!-- Real Cards -->
        <template v-else>

          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="font-medium text-gray-600 mb-2">Total Product</h2>
            <p class="text-2xl font-bold text-red-700">{{ ProductSeller.length }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="font-medium text-gray-600 mb-2">Total Penjualan</h2>
            <p class="text-2xl font-bold text-red-700">{{ totalPenjualan }}</p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="font-medium text-gray-600 mb-2">Total Income</h2>
            <p class="text-2xl font-bold text-red-700">
              Rp. {{ totalIncome.toLocaleString('id-ID') }}
            </p>
          </div>

          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="font-medium text-gray-600 mb-2">Total Wallet</h2>
            <p class="text-2xl font-bold text-red-700">
              Rp. {{ totalWallet.toLocaleString('id-ID') }}
            </p>
          </div>

        </template>

      </div>


      <!-- CHART -->
      <div class="bg-white mt-10 rounded-xl shadow-sm border p-6">

        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Performance Chart
        </h2>

        <!-- Chart Skeleton -->
        <div v-if="isLoading">
          <Skeleton height="350px"/>
        </div>

        <!-- Chart Real -->
        <apexchart
          v-else
          type="bar"
          height="350"
          class="w-full"
          :options="chartOptions"
          :series="series"
        />

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

// state
const ProductSeller = ref([])
const user = ref({})
const totalPenjualan = ref(0)
const totalIncome = ref(0)
const totalWallet = ref(0) // <- tambahkan ini
const isLoading = ref(true) // state untuk loading

// chart state
const series = ref([{ name: "Terjual", data: [] }])
const chartOptions = ref({
  chart: { type: "bar", height: 350 },
  plotOptions: { bar: { horizontal: false, columnWidth: "55%", borderRadius: 5 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ["transparent"] },
  xaxis: { categories: [] },
  yaxis: { title: { text: "Jumlah Terjual" } },
  fill: { opacity: 1 },
  tooltip: { y: { formatter: (val) => `${val} pcs` } },
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
    console.log("Wallet data:", wallet)
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

const getStatistic = async () => {
  try {
    const response = await api.get('/product/statistic')
    const data = response.data.data
    console.log("Statistik produk:", data)
    chartOptions.value = { ...chartOptions.value, xaxis: { categories: data.map(i => i.nama_product) } }
    series.value = [{ name: 'Terjual', data: data.map(i => Number(i.terjual)) }]
  } catch (error) {
    console.error('Gagal mengambil statistik produk:', error)
  }
}

onMounted(async () => {
  try {
    isLoading.value = true

    await getProfile()
    await getIncome()
    await getWallet()
    await getProducts()
    await getStatistic()

  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>
