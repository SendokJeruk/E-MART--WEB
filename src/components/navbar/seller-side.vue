<template>
  <!-- Layout Dashboard untuk Penjual (Seller) -->
  <div class="flex h-screen overflow-hidden">
    
    <!-- Lapisan Hitam Transparan (Overlay) saat sidebar terbuka di HP -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
      ></div>
    </transition>

    <!-- Sidebar: Menu Navigasi Penjual -->
    <aside
      :class="[
        'fixed lg:static z-40 h-full w-64 bg-gradient-to-b from-[#7D0A0A] to-[#5E0A0A] text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Judul Dashboard -->
      <div class="px-6 py-6 text-center border-b border-white/10">
        <h1 class="text-xl font-bold tracking-wide navbar-font">Seller Dashboard</h1>
      </div>

      <!-- Bagian Tengah (Daftar Menu Navigasi) -->
      <div class="flex-1 flex items-center justify-center">
        <ul class="space-y-3 w-full px-6">
          <li v-for="item in menuItems" :key="item.path">
            <router-link
              :to="item.path"
              :class="linkClass(item.path, item.requiresToko)"
              @click="closeSidebar"
              class="block w-full text-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 navbar-font"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Bagian Bawah (Profil Penjual) -->
      <div class="p-4 border-t border-white/10">
        <!-- Skeleton Loading Profil -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/10 animate-pulse"
        >
          <div class="w-14 h-14 rounded-full bg-white/30"></div>
          <div class="h-3 w-2/3 bg-white/30 rounded"></div>
          <div class="h-3 w-1/2 bg-white/20 rounded"></div>
        </div>

        <!-- Informasi Profil Asli -->
        <div
          v-else
          class="flex flex-col items-center text-center p-4 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
        >
          <img
            :src="user?.foto_profil || 'https://placehold.co/100x100'"
            alt="User Avatar"
            class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mb-2"
          />

          <p class="text-sm font-semibold truncate w-full">
            {{ user?.name || 'Nama Pengguna' }}
          </p>
          <p class="text-xs text-white/70 truncate w-full">
            {{ user?.email || 'email@example.com' }}
          </p>

          <!-- Tombol Keluar (Logout) -->
          <button
            @click="logout"
            class="mt-4 w-full px-4 py-2 text-sm font-medium rounded-lg bg-white/20 hover:bg-white/30 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>

    <!-- Konten Utama di Sebelah Kanan -->
    <div class="flex-1 flex flex-col bg-gray-100 overflow-auto">
      
      <!-- Tombol Menu untuk HP -->
      <header class="lg:hidden p-4 bg-white shadow flex items-center">
        <button
          @click="toggleSidebar"
          class="inline-flex items-center rounded-md bg-[#7D0A0A] px-4 py-2 text-white hover:bg-[#A61D1D] transition"
        >
          ☰ Menu
        </button>
      </header>

      <!-- Tempat Konten Halaman Penjual -->
      <main class="flex-1 p-4 lg:p-8">
        <router-view />
        <slot />
      </main>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/plugins/axios'
import { showConfirm, showError } from '@/utils/alert'

const router = useRouter()
const route = useRoute()

const user = ref(null)
const tokoseller = ref([])
const hasToko = ref(false)
const isSidebarOpen = ref(false)
const isLoading = ref(true)

/**
 * Daftar item menu navigasi penjual.
 * requiresToko: menentukan menu hanya aktif jika penjual sudah punya toko.
 */
const menuItems = [
  { label: 'Home', path: '/seller', requiresToko: true },
  { label: 'Manage Produk', path: '/manage-produk', requiresToko: true },
  { label: 'Manage Kategori Produk', path: '/manage-kategori-produk', requiresToko: true },
  { label: 'Manage Toko', path: '/manage-toko', requiresToko: false },
  { label: 'Manage Pengiriman', path: '/manage-pengiriman', requiresToko: false },
  { label: 'Withdraw', path: '/withdraw', requiresToko: false },
  { label: 'Kembali', path: '/dashboard', requiresToko: true }
]

/**
 * Menentukan tampilan link menu.
 * Menu akan terlihat transparan jika user belum membuat toko tapi menu tersebut butuh toko.
 */
function linkClass(path, requiresToko) {
  return [
    'text-white',
    route.path === path
      ? 'bg-white/20 shadow-lg'
      : 'hover:bg-white/10',
    !hasToko.value && requiresToko
      ? 'opacity-50 pointer-events-none'
      : ''
  ]
}

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function closeSidebar() {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}

/**
 * Mengambil data profil user dan mengecek apakah dia seller yang sah.
 */
const getProfile = async () => {
  try {
    const res = await api.get('/profile')
    user.value = res.data.data
    const role = user.value.nama_role

    // Mengarahkan ke dashboard yang sesuai berdasarkan role
    if (role === 'admin') return router.push('/admin')
    if (role === 'buyer') return router.push('/dashboard')
    if (role === 'seller') await getToko()
  } catch (error) {
    router.push('/login')
  } finally {
    isLoading.value = false
  }
}

/**
 * Mengecek apakah penjual ini sudah memiliki toko.
 * Jika belum punya toko, diarahkan ke halaman buat toko.
 */
const getToko = async () => {
  try {
    const res = await api.get('/toko')
    const alltoko = res.data.data.data
    tokoseller.value = alltoko.filter(
      (t) => t.user_id === user.value.id
    )
    hasToko.value = tokoseller.value.length > 0

    if (!hasToko.value && route.path !== '/create-toko') {
      router.push('/create-toko')
    }
  } catch (error) {
    console.error(error)
  }
}

const logout = async () => {
  const confirmed = await showConfirm("Anda yakin mau logout ? ")
  if (!confirmed) return
  try {
    await api.post('/auth/logout')
    localStorage.removeItem("token")
    user.value = null
    router.push('/login')
  } catch (error) {
    showError('Gagal keluar, silakan coba lagi.')
  }
}

onMounted(() => {
  getProfile()
})
</script>
