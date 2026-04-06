<template>
  <header class="bg-[#BF3131] shadow-md">

    <!-- Skeleton Navbar saat loading -->
    <div v-if="isLoading" class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-4">
      <div class="flex items-center gap-4">
        <Skeleton width="120px" height="40px"/>
        <Skeleton type="circle" size="48px"/>
        <Skeleton height="36px" class="flex-1"/>
        <Skeleton type="circle" size="32px"/>
        <Skeleton type="circle" size="32px"/>
        <Skeleton width="90px" height="36px"/>
      </div>
    </div>

    <!-- Navbar utama -->
    <div v-else class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 py-4">

        <!-- Logo mengarah ke dashboard -->
        <router-link to="/dashboard">
          <img src="@/assets/img/LOGO E-MART APP.png"
               alt="Logo"
               class="h-10 sm:h-14 w-auto object-contain" />
        </router-link>

        <!-- Foto profil, default jika tidak ada -->
        <img
          :src="user?.foto_profil || 'https://placehold.co/100'"
          alt="Foto Profil"
          class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border"
        />

        <!-- Search bar -->
        <div class="flex-grow w-full md:mx-8">
          <input
            v-model="search"
            type="text"
            placeholder="Cari di E-MART"
            class="w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md bg-white"
            @keyup.enter="searchBar"
          />
        </div>

        <!-- Icon hanya muncul jika user login -->
        <div v-if="isLoggedIn" class="flex items-center gap-3">
          <router-link to="/cart" class="material-symbols-outlined text-white text-2xl">shopping_cart</router-link>
          <router-link to="/settings" class="material-symbols-outlined text-white text-2xl">settings</router-link>
        </div>

        <!-- Tombol login/register atau logout -->
        <div class="flex items-center gap-2">
          <div v-if="!isLoggedIn" class="flex gap-2">
            <buttonred label="Login" to="/login" />
            <buttonred label="Register" to="/register" />
          </div>

          <div v-else>
            <button
              @click="logout"
              class="bg-white text-[#7D0A0A] font-semibold px-4 py-2 rounded-lg hover:bg-red-100">
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>

  </header>
</template>

<script setup>
/*
  Navbar menggunakan:
  - localStorage token sebagai sumber login utama
  - API /profile untuk mengambil data user
  - computed digunakan agar status login selalu sinkron
*/

import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from "@/plugins/axios"
import buttonred from "@/components/button/buttonred.vue"
import Skeleton from "@/components/Skeleton.vue"
import { showConfirm, showError } from '@/utils/alert'

const search = ref('')
const isLoading = ref(false)
const user = ref(null)

const router = useRouter()
const emit = defineEmits(['search'])

/*
  Status login berdasarkan token
*/
const isLoggedIn = computed(() => {
  return !!localStorage.getItem("token")
})

/*
  Mengambil data profil jika token tersedia
*/
const getProfile = async () => {
  if (!localStorage.getItem("token")) return

  try {
    isLoading.value = true
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    user.value = null
  } finally {
    isLoading.value = false
  }
}

/*
  Fungsi pencarian produk
*/
const searchBar = async () => {
  if (!search.value) return

  try {
    const response = await api.get(`/product`, {
      params: {
        nama_product: search.value,
        page: 1
      }
    })

    const result = response?.data?.data?.data || []

    emit('search', {
      products: result,
      query: search.value,
      notFound: result.length === 0
    })

  } catch (error) {
    console.error("Search error:", error)
  }
}

/*
  Logout:
  - hapus token
  - reset user
  - redirect ke login
*/
const logout = async () => {
  const confirmed = await showConfirm("Anda yakin mau logout ? ")
  if (!confirmed) return

  try {
    await api.post('/auth/logout')
    localStorage.removeItem("token")
    user.value = null
    router.push('/login')
  } catch (error) {
    showError('Logout failed, please try again.')
  }
}

onMounted(() => {
  getProfile()
})
</script>