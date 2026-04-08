<template>
  <adminside>
    <div class="p-6 bg-[#F9FAFB] min-h-screen">

      <!-- Header -->
      <div class="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
        <h1 class="text-2xl navbar-font text-gray-800">Dashboard Admin</h1>

        <!-- Skeleton Profile -->
        <div
          v-if="isLoading"
          class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60"
        >
          <Skeleton type="circle" size="40px"/>
          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%"/>
            <Skeleton height="12px" width="90%"/>
          </div>
        </div>

        <!-- Real Profile -->
        <div
          v-else
          class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60"
        >
          <div class="flex-1">
            <p class="text-sm font-bold inter-font">{{ user.name }}</p>
            <p class="text-xs text-gray-600 inter-font">{{ user.email }}</p>
          </div>
          <img
            :src="user?.foto_profil || 'https://placehold.co/100'"
            class="w-10 h-10 bg-gray-300 rounded-full object-cover"
          />
        </div>
      </div>

      <!-- FILTER & EXPORT -->
      <div class="mb-8 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
        <div class="flex flex-col md:flex-row items-center gap-3">
          <div>
            <label class="text-sm font-medium text-gray-600 block mb-1 inter-font">Mulai Tanggal</label>
            <input type="date" v-model="startDate" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7D0A0A] outline-none" />
          </div>
          <div>
            <label class="text-sm font-medium text-gray-600 block mb-1 inter-font">Sampai Tanggal</label>
            <input type="date" v-model="endDate" class="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#7D0A0A] outline-none" />
          </div>
          <button @click="applyFilter" class="mt-auto px-4 py-2 bg-[#7D0A0A] text-white text-sm rounded-lg hover:bg-[#BF3131] transition navbar-font">Filter</button>
        </div>
        <button @click="exportExcel" class="mt-auto px-4 py-2 bg-green-600 text-white font-medium text-sm rounded-lg hover:bg-green-700 transition navbar-font">
          Export Excel
        </button>
      </div>

      <!-- Statistik Cards (4 Cards) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <template v-if="isLoading">
          <div v-for="n in 4" :key="n" class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <Skeleton height="14px" width="60%" class="mx-auto mb-3"/>
            <div class="flex justify-center"><Skeleton height="30px" width="80px"/></div>
          </div>
        </template>
        <template v-else>
          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2">Total GMV</h2>
            <p class="text-2xl font-bold text-red-700 inter-font">Rp {{ summary.total_gmv.toLocaleString('id-ID') }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2">Pengguna Baru</h2>
            <p class="text-2xl font-bold text-red-700 inter-font">{{ summary.total_new_users }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2">Transaksi Sukses</h2>
            <p class="text-2xl font-bold text-red-700 inter-font">{{ summary.total_success_transactions }}</p>
          </div>
          <div class="bg-white rounded-xl shadow-sm border p-6 text-center">
            <h2 class="navbar-font text-gray-600 mb-2">Toko Terdaftar</h2>
            <p class="text-2xl font-bold text-red-700 inter-font">{{ summary.total_stores }}</p>
          </div>
        </template>
      </div>

      <!-- Line Chart (Tren GMV) Full Width -->
      <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 class="text-lg navbar-font text-gray-700 mb-4">Tren GMV ({{ groupingType }})</h2>
        <div v-if="isLoading"><Skeleton height="350px"/></div>
        <apexchart v-else type="line" height="350" class="w-full" :options="lineOptions" :series="lineSeries" />
      </div>

      <!-- Bottom Section: Bar Chart & Table -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Bar Chart (User Growth) -->
        <div class="bg-white rounded-xl shadow-sm border p-6">
          <h2 class="text-lg navbar-font text-gray-700 mb-4">Pertumbuhan Pengguna Baru</h2>
          <div v-if="isLoading"><Skeleton height="300px"/></div>
          <apexchart v-else type="bar" height="300" class="w-full" :options="barOptions" :series="barSeries" />
        </div>

        <!-- Data Table (Top Sellers) -->
        <div class="bg-white rounded-xl shadow-sm border p-6 overflow-hidden flex flex-col">
          <h2 class="text-lg navbar-font text-gray-700 mb-4">Top 5 Seller</h2>
          <div v-if="isLoading" class="flex-1 space-y-3">
            <Skeleton v-for="n in 5" :key="n" height="40px" class="w-full" />
          </div>
          <div v-else class="overflow-x-auto flex-1">
            <table class="min-w-full text-sm text-left">
              <thead class="bg-gray-50 text-gray-600 border-b">
                <tr>
                  <th class="px-4 py-3 navbar-font">Nama Toko</th>
                  <th class="px-4 py-3 text-right navbar-font">Total Pendapatan</th>
                  <th class="px-4 py-3 text-center navbar-font">Pesanan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(seller, index) in topSellers" :key="index" class="hover:bg-gray-50 transition">
                  <td class="px-4 py-3 font-semibold text-gray-800 inter-font">{{ seller.nama_toko }}</td>
                  <td class="px-4 py-3 text-right text-red-600 font-medium inter-font">Rp {{ Number(seller.total_pendapatan).toLocaleString('id-ID') }}</td>
                  <td class="px-4 py-3 text-center text-gray-600 inter-font">{{ seller.total_pesanan }}</td>
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

// State
const user = ref({})
const isLoading = ref(true)

// Date Filters
const startDate = ref('')
const endDate = ref('')

// Summary Data
const summary = ref({
  total_gmv: 0,
  total_new_users: 0,
  total_success_transactions: 0,
  total_stores: 0
})
const groupingType = ref('Harian')

// Top Sellers Table Data
const topSellers = ref([])

// Line Chart (GMV Trend)
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
  tooltip: {
    theme: 'dark',
    y: { formatter: (val) => `Rp ${val.toLocaleString('id-ID')}` }
  }
})

// Bar Chart (User Growth)
const barSeries = ref([{ name: "Pengguna Baru", data: [] }])
const barOptions = ref({
  chart: { type: "bar", height: 300, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 4 } },
  colors: ["#10b981"], // emerald-500
  xaxis: { categories: [] },
  yaxis: {
    labels: {
      formatter: (value) => Math.floor(value)
    }
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'dark',
    y: { formatter: (val) => `${val} user` }
  }
})

const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

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

const formatToDMY = (dateStr) => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}-${m}-${y}`;
}

const fetchAdminStatistic = async () => {
  isLoading.value = true
  try {
    const params = {}
    if (startDate.value) params.start_date = formatToDMY(startDate.value)
    if (endDate.value) params.end_date = formatToDMY(endDate.value)

    const response = await api.get('/report/admin/statistic', { params })
    const resData = response.data

    groupingType.value = resData.grouping_type || 'Harian'
    
    // Update Summary
    if (resData.summary) {
      summary.value = {
        total_gmv: Number(resData.summary.total_gmv) || 0,
        total_new_users: Number(resData.summary.total_new_users) || 0,
        total_success_transactions: Number(resData.summary.total_success_transactions) || 0,
        total_stores: Number(resData.summary.total_stores) || 0
      }
    }

    // Update Data
    if (resData.data) {
      // Line Chart: GMV Trend
      if (resData.data.gmv_trend) {
        lineOptions.value = { ...lineOptions.value, xaxis: { categories: Object.keys(resData.data.gmv_trend) } }
        lineSeries.value = [{ name: 'Total GMV', data: Object.values(resData.data.gmv_trend).map(v => Number(v)) }]
      }

      // Bar Chart: User Growth
      if (resData.data.user_growth) {
        barOptions.value = { ...barOptions.value, xaxis: { categories: Object.keys(resData.data.user_growth) } }
        barSeries.value = [{ name: 'Pengguna Baru', data: Object.values(resData.data.user_growth).map(v => Number(v)) }]
      }

      // Table: Top Sellers
      if (resData.data.top_sellers) {
        topSellers.value = resData.data.top_sellers.slice(0, 5) // ensure max 5
      }
    }

  } catch (error) {
    console.error('Gagal mengambil statistik admin:', error)
  } finally {
    isLoading.value = false
  }
}

const applyFilter = () => {
  fetchAdminStatistic()
}

const exportExcel = async () => {
  try {
    const params = {}
    if (startDate.value) params.start_date = formatToDMY(startDate.value)
    if (endDate.value) params.end_date = formatToDMY(endDate.value)

    const response = await api.get('/report/admin/periodic-excel', {
      params,
      responseType: 'blob'
    })

    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', `Laporan_Admin_${formatToDMY(startDate.value) || 'all'}_${formatToDMY(endDate.value) || 'all'}.xlsx`)
    
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
    await checkRoleAndRedirect()
    await getProfile()
    await fetchAdminStatistic()
  } catch (error) {
    console.error(error)
    isLoading.value = false
  }
})
</script>