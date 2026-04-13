<template>
  <!-- Layout Dashboard Admin dengan Sidebar -->
  <div class="flex h-screen overflow-hidden">
    
    <!-- Lapisan Hitam Transparan (Overlay) saat sidebar terbuka di HP -->
    <transition name="fade">
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
      ></div>
    </transition>

    <!-- Sidebar: Menu Navigasi Samping -->
    <aside
      :class="[
        'fixed lg:static z-40 h-full w-64 bg-gradient-to-b from-[#7D0A0A] to-[#5E0A0A] text-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Bagian Atas Sidebar (Judul) -->
      <div class="px-6 py-6 text-center border-b border-white/10">
        <h1 class="text-xl font-bold tracking-wide">Admin Panel</h1>
      </div>

      <!-- Bagian Tengah Sidebar (Daftar Menu) -->
      <div class="flex-1 flex items-center justify-center overflow-y-auto">
        <ul class="space-y-3 w-full px-6">
          <li v-for="item in menuItems" :key="item.path">
            <router-link
              :to="item.path"
              :class="linkClass(item.path)"
              @click="closeSidebar"
              class="block w-full text-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
            >
              {{ item.label }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Bagian Bawah Sidebar (Informasi Profil & Logout) -->
      <div class="p-4 border-t border-white/10">
        <!-- Tampilan Loading Profil (Skeleton) -->
        <div
          v-if="isLoading"
          class="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/10 animate-pulse"
        >
          <div class="w-16 h-16 rounded-full bg-white/30"></div>
          <div class="h-3 w-2/3 bg-white/30 rounded"></div>
          <div class="h-3 w-1/2 bg-white/20 rounded"></div>
        </div>

        <!-- Data Profil Admin Asli -->
        <div
          v-else
          class="flex flex-col items-center text-center p-4 rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
        >
          <img
            :src="user?.foto_profil || 'https://placehold.co/100x100'"
            alt="Admin Avatar"
            class="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md mb-2"
          />

          <p class="text-sm font-semibold truncate w-full">
            {{ user?.name || 'Admin' }}
          </p>
          <p class="text-xs text-white/70 truncate w-full">
            {{ user?.email || 'admin@example.com' }}
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

    <!-- Area Konten Utama di sebelah kanan sidebar -->
    <div class="flex-1 flex flex-col bg-gray-100 overflow-auto">
      
      <!-- Header khusus tampilan HP (untuk tombol buka menu) -->
      <header class="lg:hidden p-4 bg-white shadow flex items-center">
        <button
          @click="toggleSidebar"
          class="inline-flex items-center rounded-md bg-[#7D0A0A] px-4 py-2 text-white hover:bg-[#A61D1D] transition"
        >
          ☰ Menu
        </button>
      </header>

      <!-- Tempat menampilkan isi halaman admin -->
      <main class="flex-1 p-4 lg:p-8">
        <router-view />
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter, useRoute } from 'vue-router'
import { showConfirm, showError, showSuccess } from '@/utils/alert'

const router = useRouter()
const route = useRoute()

const user = ref(null)
const isSidebarOpen = ref(false)
const isLoading = ref(true)

/**
 * Daftar item menu navigasi untuk admin.
 */
const menuItems = [
  { label: 'Home', path: '/admin' },
  { label: 'Manage User', path: '/manage-user' },
  { label: 'Manage Kategori', path: '/kategori' },
  { label: 'Manage Request Seller', path: '/manage-request' },
  { label: 'Manage Setting Admin', path: '/settings-admin' },
  { label: 'Manage Income', path: '/manage-income' },
  { label: 'Manage Banner', path: '/manage-banner' }
]

/**
 * Menentukan gaya tampilan link menu (berubah warna jika aktif).
 */
function linkClass(path) {
  return [
    'text-white',
    route.path === path
      ? 'bg-white/20 shadow-lg'
      : 'hover:bg-white/10'
  ]
}

/**
 * Membuka atau menutup sidebar (untuk tampilan mobile).
 */
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

/**
 * Menutup sidebar secara otomatis saat menu diklik di HP.
 */
function closeSidebar() {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false
  }
}

/**
 * Fungsi Logout: Menghapus token dan mengarahkan kembali ke halaman Login.
 */
const logout = async () => {
  const confirmed = await showConfirm("Anda Yakin Mau Logout?")
  if (!confirmed) return

  try {
    await api.post('/auth/logout')
    localStorage.removeItem('token')
    showSuccess("Logout Berhasil")
    router.push('/login')
  } catch (error) {
    console.error(error)
    showError("Gagal Untuk Logout.")
  }
}

/**
 * Mengambil data profil admin dari server saat halaman dimuat.
 * Jika yang login bukan admin, maka akan ditendang ke dashboard utama.
 */
const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data

    if (user.value.nama_role !== 'admin') {
      router.push('/dashboard')
    }
  } catch (error) {
    router.push('/login')
  } finally {
    isLoading.value = false
  }
}

// Jalankan pengambilan profil saat komponen mulai muncul
onMounted(() => {
  getProfile()
})
</script>
