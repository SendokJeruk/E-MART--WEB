<template>
  <!-- Komponen Navbar Utama: Muncul di bagian atas setiap halaman -->
  <header class="bg-[#BF3131] shadow-md">
    <div class="mx-auto max-w-screen-xl px-3 sm:px-6 lg:px-8 py-3">

      <!-- ===================== -->
      <!-- SKELETON NAVBAR -->
      <!-- ===================== -->
      <!-- Tampilan loading saat data user sedang diambil -->
      <div v-if="isLoading" class="flex items-center gap-2 sm:gap-3">
        <Skeleton width="90px" height="32px" class="flex-shrink-0" />
        <div class="flex-1">
          <Skeleton height="32px" class="rounded-full w-full" />
        </div>
        <Skeleton type="circle" size="24px" />
        <Skeleton type="circle" size="24px" class="hidden md:block" />
        <Skeleton type="circle" size="36px" class="hidden md:block" />
        <Skeleton type="circle" size="26px" class="md:hidden" />
      </div>

      <!-- ===================== -->
      <!-- NAVBAR UTAMA -->
      <!-- ===================== -->
      <div v-else class="flex items-center gap-2 sm:gap-3">

        <!-- Logo Aplikasi -->
        <router-link to="/dashboard" class="flex-shrink-0">
          <img
            src="@/assets/img/LOGO E-MART APP.png"
            alt="Logo E-MART"
            class="h-8 sm:h-10 w-auto object-contain"
          />
        </router-link>

        <!-- Kotak Pencarian (Search Bar) -->
        <div class="relative flex-1 min-w-0">
          <span class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            search
          </span>
          <input
            v-model="search"
            type="text"
            placeholder="Cari..."
            class="w-full pl-8 pr-2 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-full bg-white focus:ring-2 focus:ring-red-300 focus:outline-none"
            @keyup.enter="searchBar"
          />
        </div>

        <!-- Kumpulan Ikon di Sebelah Kanan -->
        <div class="flex items-center gap-2 sm:gap-3 flex-shrink-0">

          <!-- Tombol Login/Daftar (Muncul jika belum login) -->
          <div v-if="!isLoggedIn" class="hidden md:flex items-center gap-2">
            <buttonred label="Login" to="/login" />
            <buttonred label="Register" to="/register" />
          </div>

          <!-- Ikon Keranjang (Muncul jika sudah login) -->
          <router-link
            v-if="isLoggedIn"
            to="/cart"
            class="relative text-white hover:scale-110 active:scale-95 transition-transform"
            aria-label="Keranjang"
          >
            <span class="material-symbols-outlined text-[22px] sm:text-2xl">
              shopping_cart
            </span>
            <!-- Angka indikator jumlah item di keranjang -->
            <span
              v-if="cartCount > 0"
              class="absolute -top-1.5 -right-1.5 bg-yellow-400 text-[#7D0A0A] text-[9px] sm:text-[10px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center"
            >
              {{ cartCount > 99 ? '99+' : cartCount }}
            </span>
          </router-link>

          <!-- Ikon Pengaturan (Desktop Saja) -->
          <router-link
            v-if="isLoggedIn"
            to="/settings"
            class="hidden md:block text-white hover:scale-110 active:scale-95 transition-transform"
            aria-label="Pengaturan"
          >
            <span class="material-symbols-outlined text-2xl">
              settings
            </span>
          </router-link>

          <!-- Foto Profil User (Desktop Saja) -->
          <router-link
            v-if="isLoggedIn"
            to="/profile"
            class="hidden md:block"
            aria-label="Profil"
          >
            <img
              :src="user?.foto_profil || 'https://placehold.co/100'"
              alt="Foto Profil"
              class="w-9 h-9 rounded-full object-cover border-2 border-white"
            />
          </router-link>

          <!-- Tombol Menu Garis Tiga (Mobile Saja) -->
          <button
            @click="toggleMenu"
            class="text-white md:hidden"
            aria-label="Menu"
          >
            <span class="material-symbols-outlined text-[26px]">
              {{ isMenuOpen ? 'close' : 'menu' }}
            </span>
          </button>
        </div>
      </div>

      <!-- ===================== -->
      <!-- MENU DROPDOWN MOBILE -->
      <!-- ===================== -->
      <!-- Menu yang muncul saat tombol hamburger di HP diklik -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isMenuOpen && !isLoading"
          class="md:hidden mt-3 bg-white rounded-xl shadow-lg p-4 space-y-3"
        >
          <router-link v-if="isLoggedIn" to="/profile" @click="toggleMenu" class="flex items-center gap-3">
            <img :src="user?.foto_profil || 'https://placehold.co/100'" class="w-10 h-10 rounded-full object-cover" />
            <span class="font-semibold text-gray-800">Profil</span>
          </router-link>

          <router-link v-if="isLoggedIn" to="/settings" @click="toggleMenu" class="flex items-center gap-3 text-gray-700">
            <span class="material-symbols-outlined">settings</span>
            <span>Pengaturan</span>
          </router-link>

          <button v-if="isLoggedIn" @click="logout" class="flex items-center gap-3 w-full text-left text-red-600 font-semibold">
            <span class="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>

          <div v-if="!isLoggedIn" class="flex flex-col gap-2">
            <buttonred label="Login" to="/login" @click="toggleMenu" />
            <buttonred label="Register" to="/register" @click="toggleMenu" />
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
/**
 * Penjelasan cara kerja Navbar:
 * - Mengandalkan 'token' di localStorage untuk mengecek apakah user sudah login.
 * - Mengambil data profil dari API /profile untuk menampilkan foto dan nama.
 * - Mengambil jumlah item di keranjang dari API /cart/count.
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
const isMenuOpen = ref(false);
const router = useRouter()
const emit = defineEmits(['search'])
const cartCount = ref(0)

// Status login otomatis berubah jika token ada/tidak ada
const isLoggedIn = computed(() => {
  return !!localStorage.getItem("token")
})

// Fungsi buka/tutup menu di mobile
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Mengambil data profil user
const getProfile = async () => {
  if (!localStorage.getItem("token")) return
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
  } catch (error) {
    user.value = null
  }
}

// Fungsi melakukan pencarian produk saat tekan Enter
const searchBar = async () => {
  if (!search.value) return
  try {
    const response = await api.get(`/product`, {
      params: { nama_product: search.value, page: 1 }
    })
    const result = response?.data?.data?.data || []
    // Mengirim hasil pencarian ke komponen dashboard
    emit('search', {
      products: result,
      query: search.value,
      notFound: result.length === 0
    })
  } catch (error) {
    console.error("Search error:", error)
  }
}

// Fungsi untuk logout (keluar akun)
const logout = async () => {
  const confirmed = await showConfirm("Anda yakin mau logout ? ")
  if (!confirmed) return
  try {
    await api.post('/auth/logout')
    localStorage.removeItem("token")
    user.value = null
    router.push('/login')
  } catch (error) {
    showError('Logout gagal, silakan coba lagi.')
  }
}

// Mengambil jumlah produk yang ada di keranjang
const getCartCount = async () => {
  try {
    const response = await api.get('/cart/count')
    cartCount.value = response.data.data || 0
  } catch (error) {
    console.error('Error fetching cart count:', error)
    cartCount.value = 0
  }
}

// Jalankan fungsi saat navbar mulai muncul di layar
onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    getProfile(),
    getCartCount()
  ])
  isLoading.value = false
})
</script>
