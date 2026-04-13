<template>
  <adminside>
    <!-- Halaman Dashboard Admin: Menampilkan ringkasan statistik seluruh aplikasi -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <!-- JUDUL HALAMAN -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 border-b border-gray-200 pb-4">
        <h1 class="text-xl sm:text-2xl md:text-3xl navbar-font text-gray-800">
          Dashboard Admin
        </h1>
      </div>

      <!-- BAGIAN FILTER TANGGAL & EKSPOR DATA -->
      <div class="mt-6 flex flex-col lg:flex-row justify-between gap-4">
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <!-- Filter Tanggal Mulai -->
          <div class="w-full">
            <label class="text-xs text-gray-600 mb-1 block">Mulai</label>
            <input type="date" v-model="startDate" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-700 outline-none"/>
          </div>
          <!-- Filter Tanggal Selesai -->
          <div class="w-full">
            <label class="text-xs text-gray-600 mb-1 block">Sampai</label>
            <input type="date" v-model="endDate" class="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-700 outline-none"/>
          </div>
          <!-- Tombol Terapkan Filter -->
          <button @click="applyFilter" class="w-full sm:w-auto px-5 py-2.5 bg-red-700 text-white text-sm rounded-lg font-semibold shadow-md hover:bg-red-800 active:scale-95 transition">
            Filter
          </button>
        </div>

        <!-- Tombol Download Laporan Excel -->
        <button @click="exportExcel" class="w-full sm:w-auto px-5 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition">
         Export Excel
        </button>
      </div>

      <!-- KARTU STATISTIK (ANGKA UTAMA) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 mt-5">
        <!-- Tampilan Loading (Skeleton) -->
        <template v-if="isLoading">
          <div v-for="n in 4" :key="n" class="bg-white rounded-xl shadow-sm border p-5 md:p-6 text-center">
            <Skeleton height="14px" width="60%" class="mx-auto mb-3" />
            <div class="flex justify-center"><Skeleton height="30px" width="80px" /></div>
          </div>
        </template>

        <!-- Tampilan Data Asli -->
        <template v-else>
          <!-- Total GMV: Total nilai transaksi -->
          <div class="bg-white rounded-xl shadow-sm border p-5 md:p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2 text-sm md:text-base">Total GMV</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700 inter-font">Rp {{ summary.total_gmv.toLocaleString('id-ID') }}</p>
          </div>
          <!-- Pengguna Baru: Jumlah pendaftar baru -->
          <div class="bg-white rounded-xl shadow-sm border p-5 md:p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2 text-sm md:text-base">Pengguna Baru</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700 inter-font">{{ summary.total_new_users }}</p>
          </div>
          <!-- Transaksi Sukses: Jumlah order yang sudah dibayar -->
          <div class="bg-white rounded-xl shadow-sm border p-5 md:p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2 text-sm md:text-base">Transaksi Sukses</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700 inter-font">{{ summary.total_success_transactions }}</p>
          </div>
          <!-- Toko Terdaftar: Jumlah seller yang punya toko -->
          <div class="bg-white rounded-xl shadow-sm border p-5 md:p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2 text-sm md:text-base">Toko Terdaftar</h2>
            <p class="text-xl md:text-2xl font-bold text-red-700 inter-font">{{ summary.total_stores }}</p>
          </div>
        </template>
      </div>

      <!-- GRAFIK GARIS (Tren Penjualan) -->
      <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 mb-8">
        <h2 class="text-base md:text-lg navbar-font text-gray-700 mb-4">Tren GMV ({{ groupingType }})</h2>
        <div v-if="isLoading"><Skeleton height="250px" class="md:h-[350px]" /></div>
        <apexchart v-else type="line" height="300" class="w-full" :options="lineOptions" :series="lineSeries" />
      </div>

      <!-- BAGIAN BAWAH (Grafik Bar & Tabel Top Seller) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Grafik Pertumbuhan User Baru -->
        <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <h2 class="text-base md:text-lg navbar-font text-gray-700 mb-4">Pertumbuhan Pengguna Baru</h2>
          <div v-if="isLoading"><Skeleton height="250px" class="md:h-[300px]" /></div>
          <apexchart v-else type="bar" height="300" class="w-full" :options="barOptions" :series="barSeries" />
        </div>

        <!-- Tabel 5 Seller dengan Pendapatan Tertinggi -->
        <div class="bg-white rounded-xl shadow-sm border p-4 md:p-6 flex flex-col">
          <h2 class="text-base md:text-lg navbar-font text-gray-700 mb-4">Top 5 Seller</h2>
          <div v-if="isLoading" class="flex-1 space-y-3">
            <Skeleton v-for="n in 5" :key="n" height="40px" class="w-full" />
          </div>
          <div v-else class="overflow-x-auto flex-1">
            <table class="min-w-[500px] w-full text-xs sm:text-sm text-left">
              <thead class="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th class="px-4 py-3 navbar-font whitespace-nowrap">Nama Toko</th>
                  <th class="px-4 py-3 text-right navbar-font whitespace-nowrap">Total Pendapatan</th>
                  <th class="px-4 py-3 text-center navbar-font whitespace-nowrap">Pesanan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(seller, index) in topSellers" :key="index" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3 font-semibold text-gray-800 inter-font whitespace-nowrap">{{ seller.nama_toko }}</td>
                  <td class="px-4 py-3 text-right text-red-600 font-medium inter-font whitespace-nowrap">Rp {{ Number(seller.total_pendapatan).toLocaleString('id-ID') }}</td>
                  <td class="px-4 py-3 text-center text-gray-600 inter-font whitespace-nowrap">{{ seller.total_pesanan }}</td>
                </tr>
                <tr v-if="topSellers.length === 0">
                  <td colspan="3" class="px-4 py-8 text-center text-gray-500">Tidak ada data seller</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </adminside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import adminside from '@/components/navbar/admin-side.vue'
import { useRouter } from 'vue-router'
import VueApexCharts from "vue3-apexcharts"
import Skeleton from '@/components/Skeleton.vue'

const apexchart = VueApexCharts
const router = useRouter()

const user = ref({})
const isLoading = ref(true)
const startDate = ref('')
const endDate = ref('')

// Objek untuk menyimpan ringkasan statistik
const summary = ref({
  total_gmv: 0,
  total_new_users: 0,
  total_success_transactions: 0,
  total_stores: 0
})
const groupingType = ref('Harian')
const topSellers = ref([])

// Konfigurasi tampilan grafik garis
const lineSeries = ref([{ name: "Total GMV", data: [] }])
const lineOptions = ref({
  chart: { type: "line", height: 350, toolbar: { show: false } },
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
  tooltip: { theme: 'dark', y: { formatter: (val) => `Rp ${val.toLocaleString('id-ID')}` } }
})

// Konfigurasi tampilan grafik batang
const barSeries = ref([{ name: "Pengguna Baru", data: [] }])
const barOptions = ref({
  chart: { type: "bar", height: 300, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 4 } },
  colors: ["#10b981"],
  xaxis: { categories: [] },
  yaxis: { labels: { formatter: (value) => Math.floor(value) } },
  dataLabels: { enabled: false },
  tooltip: { theme: 'dark', y: { formatter: (val) => `${val} user` } }
})

// Fungsi mengecek profil untuk memastikan yang mengakses benar-benar admin
const checkRoleAndRedirect = async () => {
  try {
    const response = await api.get('/profile')
    const role = response.data.data.nama_role
    if (role === 'seller' || role === 'buyer') {
      router.push('/dashboard')
    }
  } catch {
    router.push('/login')
  }
}

/**
 * Mengambil data statistik dari server (Angka ringkasan, Data grafik, dan Top Seller).
 */
const fetchAdminStatistic = async () => {
  isLoading.value = true
  try {
    const params = {}
    if (startDate.value) params.start_date = formatToDMY(startDate.value)
    if (endDate.value) params.end_date = formatToDMY(endDate.value)

    const response = await api.get('/report/admin/statistic', { params })
    const resData = response.data

    groupingType.value = resData.grouping_type || 'Harian'
    
    // Perbarui angka-angka di kartu statistik
    if (resData.summary) {
      summary.value = {
        total_gmv: Number(resData.summary.total_gmv) || 0,
        total_new_users: Number(resData.summary.total_new_users) || 0,
        total_success_transactions: Number(resData.summary.total_success_transactions) || 0,
        total_stores: Number(resData.summary.total_stores) || 0
      }
    }

    // Perbarui data grafik dan tabel
    if (resData.data) {
      if (resData.data.gmv_trend) {
        lineOptions.value = { ...lineOptions.value, xaxis: { categories: Object.keys(resData.data.gmv_trend) } }
        lineSeries.value = [{ name: 'Total GMV', data: Object.values(resData.data.gmv_trend).map(v => Number(v)) }]
      }
      if (resData.data.user_growth) {
        barOptions.value = { ...barOptions.value, xaxis: { categories: Object.keys(resData.data.user_growth) } }
        barSeries.value = [{ name: 'Pengguna Baru', data: Object.values(resData.data.user_growth).map(v => Number(v)) }]
      }
      if (resData.data.top_sellers) {
        topSellers.value = resData.data.top_sellers.slice(0, 5)
      }
    }
  } catch (error) {
    console.error('Gagal mengambil statistik admin:', error)
  } finally {
    isLoading.value = false
  }
}

// Fungsi tombol filter tanggal
const applyFilter = () => { fetchAdminStatistic() }

// Fungsi untuk mengunduh laporan dalam format Excel
const exportExcel = async () => {
  try {
    const params = {}
    if (startDate.value) params.start_date = formatToDMY(startDate.value)
    if (endDate.value) params.end_date = formatToDMY(endDate.value)

    const response = await api.get('/report/admin/periodic-excel', { params, responseType: 'blob' })
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `Laporan_Admin_${formatToDMY(startDate.value) || 'all'}_${formatToDMY(endDate.value) || 'all'}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Gagal export excel:', error)
  }
}

// Setel tanggal awal filter (dari tanggal 1 bulan ini sampai hari ini)
const initDates = () => {
  const today = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  startDate.value = firstDay.toISOString().split('T')[0]
  endDate.value = today.toISOString().split('T')[0]
}

onMounted(async () => {
  initDates()
  await checkRoleAndRedirect()
  await fetchAdminStatistic()
})
</script>
