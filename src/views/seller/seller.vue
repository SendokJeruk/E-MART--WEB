<template>
  <sellerside>
    <div class="p-6 bg-[#F9FAFB] min-h-screen">

      <!-- Header Dashboard khusus buat seller, pamer dikit profilnya -->
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">

        <h1 class="text-2xl font-bold text-gray-800">
          Dashboard Seller
        </h1>

        <!-- Penampakan profil pas lagi loading, pake skeleton biar tetep kece -->
        <div v-if="isLoading"
        class="bg-white shadow-sm rounded-xl px-4 py-3 flex items-center gap-4 w-72">

          <Skeleton type="circle" size="48px"/>

          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>

        </div>

        <!-- Profil asli seller-nya -->
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


      <!-- Kumpulan kartu info: total barang, jualan, ama sisa duit -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">

        <!-- Baris kotak skeleton pas nunggu data statistik -->
        <template v-if="isLoading">

          <div v-for="n in 4" :key="n"
          class="bg-white rounded-xl shadow-sm border p-6">

            <Skeleton height="14px" width="60%" class="mx-auto mb-3"/>

            <div class="flex justify-center">
              <Skeleton height="28px" width="80px"/>
            </div>

          </div>

        </template>


        <!-- Info statistik aslinya -->
        <template v-else>

          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="font-medium text-gray-600 mb-2">Total Produk</h2>
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
            <h2 class="font-medium text-gray-600 mb-2">Sisa Saldo (Wallet)</h2>
            <p class="text-2xl font-bold text-red-700">
              Rp. {{ totalWallet.toLocaleString('id-ID') }}
            </p>
          </div>

        </template>

      </div>


      <!-- Bagian grafik performa jualan biar seller tau mana barang yang laku -->
      <div class="bg-white mt-10 rounded-xl shadow-sm border p-6">

        <h2 class="text-lg font-semibold text-gray-700 mb-4">
          Grafik Performa
        </h2>

        <!-- skeleton buat area grafiknya -->
        <div v-if="isLoading">
          <Skeleton height="350px"/>
        </div>

        <!-- Ini grafiknya pake bar chart biar gampang bacanya -->
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

// Daftarin komponen chart-nya
const apexchart = VueApexCharts

// State buat nyimpen data jualan seller
const ProductSeller = ref([])
const user = ref({})
const totalPenjualan = ref(0)
const totalIncome = ref(0)
const totalWallet = ref(0) 
const isLoading = ref(true)

// Konfigurasi buat tampilan grafiknya
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

// Fungsi tarik data profil seller
const getProfile = async () => {
  try {
    const response = await api.get("/profile")
    user.value = response.data.data
  } catch (error) {
    console.error("Gagal mengambil profil:", error)
  }
}

// Ambil list semua produk yang dipunya seller ini
const getProducts = async () => {
  try {
    const response = await api.get("/product/myproducts", { params: { myproducts: true } })
    const allProducts = response.data.data.data
    // Filter biar bener-bener punya dia doang
    ProductSeller.value = allProducts.filter((p) => p.user_id === user.value.id)
  } catch (error) {
    console.error("Gagal mengambil produk:", error)
  }
}

// Tarik data sisa saldo yang ada di dompet digital seller
const getWallet = async () => {
  try {
    const response = await api.get("/balance")
    const wallet = response.data.data
    totalWallet.value = wallet.balance?.balance || 0
    console.log("Data dompet:", wallet)
  } catch (error) {
    console.error("Gagal mengambil info dompet:", error)
  }
}


// Ambil info pendapatan kotor seller selama ini
const getIncome = async () => {
  try {
    const response = await api.get("/income")
    const myIncome = response.data.data.income
    totalIncome.value = myIncome.jumlah_total || 0
    totalPenjualan.value = myIncome.total_penjualan || 0
  } catch (error) {
    console.error("Gagal mengambil info income:", error)
  }
}

// Tarik data statistik buat dipajang di grafik batang
const getStatistic = async () => {
  try {
    const response = await api.get('/product/statistic')
    const data = response.data.data
    console.log("Statistik produk:", data)
    // Pasang nama barang di sumbu X, angka laku di sumbu Y
    chartOptions.value = { ...chartOptions.value, xaxis: { categories: data.map(i => i.nama_product) } }
    series.value = [{ name: 'Terjual', data: data.map(i => Number(i.terjual)) }]
  } catch (error) {
    console.error('Gagal mengambil statistik produk:', error)
  }
}

// Pas halaman dibuka, langsung gas sikat semua data-datanya
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
