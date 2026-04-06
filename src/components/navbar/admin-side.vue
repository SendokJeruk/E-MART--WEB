<template>
  <div class="flex h-screen">
    <!-- Overlay buat nutup sidebar pas lagi di mobile -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-30 bg-transparent lg:hidden transition-opacity duration-300 ease-in-out"
    ></div>

    <!-- Sidebar samping, warnanya merah gelap biar keliatan tegas -->
    <div
      :class="[ 
        'fixed z-40 lg:static flex h-full flex-col justify-between border-e border-gray-100 transition-transform duration-300 ease-in-out', 
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', 
        'w-64', 
        'bg-[#7D0A0A]' 
      ]"
    >
      <div class="px-4 py-6">
        <ul class="mt-6 space-y-1">
          <!-- Menu-menu navigasi buat admin, dari home sampe manage banner -->
          <li>
            <router-link
              to="/admin"
              :class="linkClass('/admin')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Home
            </router-link>
          </li>

          <li>
            <router-link
              to="/manage-user"
              :class="linkClass('/manage-user')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage User
            </router-link>
          </li>

          <li>
            <router-link
              to="/kategori"
              :class="linkClass('/kategori')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage Kategori
            </router-link>
          </li>

          <li>
            <router-link
              to="/manage-request"
              :class="linkClass('/manage-request')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage Request Seller
            </router-link>
          </li>

          <li>
            <router-link
              to="/settings-admin"
              :class="linkClass('/settings-admin')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage Setting Admin
            </label>
          </li>

          <li>
            <router-link
              to="/manage-income"
              :class="linkClass('/manage-income')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage Income
            </router-link>
          </li>

          <li>
            <router-link
              to="/manage-banner"
              :class="linkClass('/manage-banner')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage Banner
            </router-link>
          </li>

          <!-- Tombol buat keluar, nanya dulu biar gak salah pencet -->
          <button
            @click="logout"
            class="w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#A61D1D]"
          >
            Logout
          </button>

        </ul>
      </div>
    </div>

    <!-- Bagian konten utama di sebelah kanan sidebar -->
    <div class="flex-1 p-4 lg:p-8 bg-gray-100 w-full overflow-auto">
      <!-- Tombol menu buat nampilin sidebar pas di layar kecil -->
      <button
        @click="toggleSidebar"
        class="lg:hidden mb-4 inline-flex items-center rounded-md bg-[#7D0A0A] px-4 py-2 text-white hover:bg-[#A61D1D]"
      >
        ☰ Menu
      </button>

      <!-- Tempat nampilin view-view admin -->
      <router-view />
      <slot/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'
import { showConfirm, showError, showSuccess } from '@/utils/alert'

const router = useRouter()
const userName = ref('')
const email = ref('')
const userRole = ref('')
const isSidebarOpen = ref(false)

// Fungsi buat nentuin gaya link menu, biar keliatan mana yang lagi aktif
function linkClass(path) {
  return [
    'text-white',
    router.currentRoute.value.path === path ? 'bg-[#5E0A0A]' : 'bg-[#7D0A0A] hover:bg-[#A61D1D]',
  ]
}

// Proses logout, hapus token terus tendang ke halaman login
const logout = async () => {
  const confirmed = await showConfirm("Anda Yakin Mau Logout ?")
  if (!confirmed) return

  try {
    await api.post('/auth/logout')
    localStorage.removeItem("token")
    router.push('/login')
    showSuccess("Logout Berhasil")
  } catch (error) {
    console.error('Logout failed:', error)
    showError('Gagal Untuk Logout.')
  }
}

// Pas halaman kebuka, cek profil dulu, pastiin emang admin yang masuk
onMounted(async () => {
  try {
    const response = await api.get('/profile')
    userName.value = response.data.data.name
    email.value = response.data.data.email
    userRole.value = response.data.data.nama_role

    // Kalo bukan admin, balikin ke dashboard user biasa
    if (userRole.value === 'seller' || userRole.value === 'buyer') {
      router.push('/dashboard')
    }
  } catch (error) {
    // Kalo gagal ambil profil (mungkin token basi), suruh login lagi
    router.push('/login')
  }
})

// Buka tutup sidebar buat tampilan mobile
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>
