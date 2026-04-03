<template>
  <adminside>
    <div>

      <!-- Header -->
      <div class="flex justify-between items-start mb-6">
        <h1 class="text-2xl font-bold">Dashboard Admin</h1>

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
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>

          <img
            :src="user?.foto_profil || 'https://placehold.co/100'"
            class="w-10 h-10 bg-gray-300 rounded-full"
          />
        </div>
      </div>


      <!-- Statistik Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <!-- Skeleton Cards -->
        <template v-if="isLoading">

          <div
            v-for="n in 3"
            :key="n"
            class="bg-white rounded-2xl shadow p-6 text-center"
          >
            <Skeleton height="14px" width="60%" class="mx-auto mb-3"/>
            <Skeleton height="30px" width="80px" class="mx-auto"/>
          </div>

        </template>

        <!-- Real Cards -->
        <template v-else>

          <div class="bg-white rounded-2xl shadow p-6 text-center">
            <h2 class="text-xl font-semibold mb-2">Total Pengguna</h2>
            <p class="text-3xl font-bold text-red-600">
              {{ totalUsers }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow p-6 text-center">
            <h2 class="text-xl font-semibold mb-2">Total Seluruh Product</h2>
            <p class="text-3xl font-bold text-red-600">
              {{ totalProducts }}
            </p>
          </div>

          <div class="bg-white rounded-2xl shadow p-6 text-center">
            <h2 class="text-xl font-semibold mb-2">Total Komentar</h2>
            <p class="text-3xl font-bold text-red-600">
              2,104
            </p>
          </div>

        </template>

      </div>

      <!-- Chart -->
      <div class="bg-white rounded-2xl shadow p-6">

        <!-- Skeleton Chart -->
        <div v-if="isLoading">
          <Skeleton height="350px"/>
        </div>

        <!-- Real Chart -->
        <apexchart
          v-else
          type="bar"
          height="350"
          :options="chartOptions"
          :series="series"
        />

      </div>

    </div>
  </adminside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import adminside from '@/components/navbar/admin-side.vue'
import { useRouter } from 'vue-router'
import ApexCharts from "vue3-apexcharts"
import Skeleton from '@/components/Skeleton.vue'

// =====================================================
// REGISTER COMPONENT
// =====================================================
const components = { apexchart: ApexCharts }

// =====================================================
// REACTIVE STATE
// =====================================================
const router = useRouter()
const user = ref({})
const isLoading = ref(true)
const totalUsers = ref(0)
const totalProducts = ref(0)
const series = ref([]) // Chart series
const chartOptions = ref({
  chart: { type: 'bar', height: 350 },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%', borderRadius: 5 } },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 2, colors: ['transparent'] },
  xaxis: { categories: [] },
  yaxis: { title: { text: 'Value' } },
  fill: { opacity: 1 },
  tooltip: { y: { formatter: val => val } }
})

// =====================================================
// FUNCTIONS
// =====================================================
const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

const getUsers = async () => {
  try {
    const response = await api.get('/manage-user')
    if (Array.isArray(response.data.data.data)) {
      totalUsers.value = response.data.data.total
    }
  } catch (error) {
    console.error(error)
  }
}

const getProducts = async () => {
  try {
    const response = await api.get('/product')
    if (Array.isArray(response.data.data.data)) {
      totalProducts.value = response.data.data.total
    }
  } catch (error) {
    console.error(error)
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

const getTopSeller = async () => {
  try {
    const response = await api.get('/sellerinfo/topseller')
    const data = response.data.data || []
    console.log('Top Seller Data:', response)

    if (data.length === 0) return

    // Mapping nama seller ke X-axis
    chartOptions.value.xaxis.categories = data.map(item => item.seller)

    // Mapping income & penjualan_total ke series chart
    series.value = [
      { name: 'Income', data: data.map(item => item.income) },
      { name: 'Penjualan Total', data: data.map(item => item.penjualan_total) }
    ]
  } catch (error) {
    console.error('Error fetching top sellers:', error)
  }
}

// =====================================================
// ON MOUNTED
// =====================================================
onMounted(async () => {
  try{
    isLoading.value = true

    await checkRoleAndRedirect()
    await getProfile()
    await getUsers()
    await getProducts()
    await getTopSeller()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>
