<template>
  <header class="bg-[#BF3131] shadow-md">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 py-4">
        <router-link to="/dashboard">
          <img src="@/assets/img/LOGO E-MART APP.png" alt="Logo" class="h-10 sm:h-14 w-auto object-contain" />
        </router-link>

        <img
          :src="user?.foto_profil || 'https://placehold.co/100'"
          alt="Foto Profil"
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border"
        />

        <div class="flex-grow w-full md:mx-8">
          <input
            v-model="search"
            type="text"
            placeholder="Cari di E-MART"
            class="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white"
            @keyup.enter="$emit('search', search)"
          />
        </div>

        <div v-if="!isLoggedIn">
          
        </div>
        <div v-else class="flex items-center gap-3">
          <router-link to="/cart" class="material-symbols-outlined text-white text-2xl">shopping_cart</router-link>
          <router-link to="/settings" class="material-symbols-outlined text-white text-2xl">settings</router-link>
        </div>

        <div class="flex items-center gap-2">
          <div v-if="!isLoggedIn" class="flex gap-2">
            <buttonred label="Login" to="/login" />
            <buttonred label="Register" to="/register" />
          </div>
          <div v-else>
            <button @click="logout" label="Logout" class="bg-white text-[#7D0A0A] font-semibold px-4 py-2 rounded-lg transition hover:bg-red-100 ">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from "@/plugins/axios"
import buttonred from "@/components/button/buttonred.vue"

const search = ref('')
const isLoggedIn = ref(false)
const isLoading = ref(false)
const userName = ref('')
const userRole = ref('')
const user = ref(null)
const router = useRouter()

const getProfile = async () => {
  try {
    isLoading.value = true
    const response = await api.get('/profile')
    user.value = response.data.data
    userName.value = user.value.name
    userRole.value = user.value.nama_role
    isLoggedIn.value = true
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  } finally {
    isLoading.value = false
  }
}

const searchBar = async () => {
  if (!search.value) return
  try {
    const response = await api.get(`/product?nama_product=${search.value}`)
    console.log("Hasil search:", response.data)
  } catch (error) {
    console.error("Search error:", error)
  }
}

const logout = async () => {
  const confirmed = window.confirm("Are you sure you want to log out?")
  if (!confirmed) return

  try {
    await api.post('/auth/logout')
    isLoggedIn.value = false
    userName.value = ''
    userRole.value = ''
    alert('Logged out successfully!')
    router.push('/login')
  } catch (error) {
    alert('Logout failed, please try again.')
  }
}

onMounted(() => {
  getProfile()
})
</script>