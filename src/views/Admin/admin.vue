<template>
  <adminside>
    <div>
      <h1 class="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-2xl shadow p-6 text-center">
          <h2 class="text-xl font-semibold mb-2">Total Pengguna</h2>
          <p class="text-3xl font-bold text-red-600">{{ totalUsers }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow p-6 text-center">
          <h2 class="text-xl font-semibold mb-2">Total Seluruh Product</h2>
          <p class="text-3xl font-bold text-red-600">{{ totalProducts }}</p>
        </div>
        <div class="bg-white rounded-2xl shadow p-6 text-center">
          <h2 class="text-xl font-semibold mb-2">Total Komentar</h2>
          <p class="text-3xl font-bold text-red-600">2,104</p>
        </div>
      </div>
    </div>
  </adminside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import adminside from '@/components/navbar/adminside.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const users = ref([])
const Product = ref([])

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')

const totalUsers = ref(0)

const getUsers = async () => {
  try {
    const response = await api.get('/manage-user')
    const resData = response.data.data

    if (Array.isArray(resData.data)) {
      users.value = resData.data
      totalUsers.value = resData.total 
    } else {
      console.error("Data pengguna tidak berupa array:", resData.data)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const totalProducts = ref(0)

const getProducts = async ()=> {
  try {
    const response = await api.get('/product')
    if (Array.isArray(response.data.data.data)) {
      Product.value = response.data.data.data
      totalProducts.value = response.data.data.total
    } else {
      console.error("Data Produk Tidak Berupa Array:", response.data.data.data)
    }
  } catch (error) {
    console.error('Error Fetching Products:', error)
  }
}

const checkRoleAndRedirect = async () => {
  try {
    const response = await api.get('/profile')
    const role = response.data.data.nama_role

    isLoggedIn.value = true
    userName.value = response.data.data.name
    userRole.value = role

    if (role === 'seller' || role === 'user') {
  router.push('/dashboard')
}
  } catch (error) {
    router.push('/auth/login')
  }
}

onMounted(async () => {
  await checkRoleAndRedirect()
  getUsers()
  getProducts()
})
</script>
