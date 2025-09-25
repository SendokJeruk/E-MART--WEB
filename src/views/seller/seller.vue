<template>
  <sellerside>
    <div class="p-6 bg-[#F9FAFB] min-h-screen">
      <!-- Header -->
      <div class="flex justify-between items-center pb-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-800">📊 Dashboard Seller</h1>

        <div class="bg-white shadow-sm rounded-xl px-4 py-3 flex items-center gap-4 w-72">
          <img
            :src="user?.foto_profil || 'https://via.placeholder.com/100'"
            class="w-12 h-12 rounded-full object-cover border border-gray-300"
          />
          <div class="flex-1">
            <p class="text-sm font-semibold text-gray-800">{{ user.name }}</p>
            <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div class="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition">
          <h2 class="font-medium text-gray-600 mb-2">Total Product</h2>
          <p class="text-2xl font-bold text-red-700">{{ ProductSeller.length }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition">
          <h2 class="font-medium text-gray-600 mb-2">Total Penjualan</h2>
          <p class="text-2xl font-bold text-red-700">{{ totalPenjualan }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-sm border p-6 text-center hover:shadow-md transition">
          <h2 class="font-medium text-gray-600 mb-2">Total Income</h2>
          <p class="text-2xl font-bold text-red-700">
            Rp. {{ totalIncome.toLocaleString('id-ID') }}
          </p>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="bg-white mt-10 rounded-xl shadow-sm border p-6">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">📈 Performance Chart</h2>
        <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import Sellerside from '@/components/navbar/seller-side.vue'
import VueApexCharts from 'vue3-apexcharts'

// daftar komponen global khusus di file ini
const apexchart = VueApexCharts

// state
const ProductSeller = ref([])
const user = ref({})
const totalPenjualan = ref(0)
const totalIncome = ref(0)

// chart state
const series = ref([
  {
    name: 'Terjual',
    data: []
  }
])

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 350
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      borderRadius: 5,
      borderRadiusApplication: 'end'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    categories: [] // nanti diisi nama_product
  },
  yaxis: {
    title: {
      text: 'Jumlah Terjual'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val + ' pcs'
      }
    }
  }
})

// API calls
const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

const getProducts = async () => {
  try {
    const response = await api.get('/product/myproducts', {
      params: { myproducts: true }
    })
    const allProducts = response.data.data.data
    ProductSeller.value = allProducts.filter((p) => p.user_id === user.value.id)
  } catch (error) {
    console.error('Gagal mengambil produk:', error)
  }
}

const getStatistic = async () => {
  try {
    const response = await api.get('/product/statistic')
    const data = response.data.data

    // Debug
    console.log('Categories:', data.map((item) => item.nama_product))
    console.log('Values:', data.map((item) => item.terjual))

    // isi kategori produk
    chartOptions.value.xaxis.categories = data.map((item) => String(item.nama_product))

    // isi series penjualan
    series.value = [
      {
        name: 'Terjual',
        data: data.map((item) => Number(item.terjual))
      }
    ]
  } catch (error) {
    console.error('Gagal mengambil statistik produk:', error)
  }
}

onMounted(async () => {
  await getProfile()
  await getProducts()
  await getStatistic()
})
</script>