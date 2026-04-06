<template>
  <div class="flex h-screen">
    <!-- Overlay transparan pas sidebar mobile kebuka -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-30 bg-transparent lg:hidden transition-opacity duration-300 ease-in-out"
    ></div>

    <!-- Sidebar seller, isinya menu-menu buat jualan -->
    <div
      :class="[ 
        'fixed z-40 lg:static flex h-full flex-col justify-between border-e border-gray-100 transition-transform duration-300 ease-in-out', 
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', 
        'w-64', 
        'bg-[#7D0A0A]' 
      ]"
    >
      <div class="px-4 py-6 h-full flex flex-col justify-center">
        <ul class="space-y-1">

          <!-- Menu navigasi seller, ada yang dimatiin kalo belom punya toko -->
          <li>
            <router-link
              to="/seller"
              :class="linkClass('/seller')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
              :disabled="!hasToko"
            >
              Home
            </router-link>
          </li>

          <li>
            <router-link
              to="/manage-produk"
              :class="linkClass('/manage-produk')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
              :disabled="!hasToko"
            >
              Manage Produk
            </router-link>
          </li>

          <li>
            <router-link
              to="/manage-kategori-produk"
              :class="linkClass('/manage-kategori-produk')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
              :disabled="!hasToko"
            >
              Manage Kategori Produk
            </router-link>
          </li>

          <li>
            <router-link
              to="/manage-toko"
              :class="linkClass('/manage-toko')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage Toko
            </router-link>
          </li>

          <li>
            <router-link
              to="/manage-pengiriman"
              :class="linkClass('/manage-pengiriman')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Manage Pengiriman
            </router-link>
          </li>

          <li>
            <router-link
              to="/withdraw"
              :class="linkClass('/withdraw')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
            >
              Withdraw
            </router-link>
          </li>

          <li>
            <router-link
              to="/dashboard"
              :class="linkClass('/dashboard')"
              class="block rounded-lg px-4 py-2 text-sm font-medium navbar-font mb-6"
              :disabled="!hasToko"
            >
              Kembali
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <!-- Konten di sebelah sidebar -->
    <div class="flex-1 p-4 lg:p-8 bg-gray-100 w-full overflow-auto">
      <!-- Tombol menu hamburger buat mobile -->
      <button
        @click="toggleSidebar"
        class="lg:hidden mb-4 inline-flex items-center rounded-md bg-[#7D0A0A] px-4 py-2 text-white hover:bg-[#A61D1D] navbar-font"
      >
        ☰ Menu
      </button>

      <!-- View-view seller bakal nongol di sini -->
      <router-view />
      <slot/>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'

const user = ref(null)
const tokoseller = ref([])
const hasToko = ref(false)
const isSidebarOpen = ref(false)
const router = useRouter()

// Fungsi buat ngatur warna menu yang lagi aktif atau lagi dikunci
function linkClass(path) {
  return [
    'text-white',
    router.currentRoute.value.path === path ? 'bg-[#5E0A0A]' : 'bg-[#7D0A0A] hover:bg-[#A61D1D]',
    !hasToko.value && path !== '/manage-toko' ? 'opacity-50 pointer-events-none' : ''
  ]
}

// Cek profil user buat nentuin boleh masuk sini apa gak
const getProfile = async () => {
  try {
    const res = await api.get('/profile')
    user.value = res.data.data
    const role = user.value.nama_role

    // Tendang balik kalo ternyata admin atau buyer nyasar kesini
    if (role === 'admin') {
      router.push('/admin')
      return
    }
    if (role === 'buyer') {
      router.push('/dashboard')
      return
    }
    if (role === 'seller') {
      await getToko()
    }
  } catch (err) {
    router.push('/login')
  }
}

// Cek apakah seller ini udah bikin toko apa belom
const getToko = async () => {
  try {
    const res = await api.get('/toko')
    const alltoko = res.data.data.data
    // Filter toko yang punya user ini doang
    tokoseller.value = alltoko.filter(t => t.user_id === user.value.id)
    hasToko.value = tokoseller.value.length > 0

    // Kalo belom punya toko, paksa bikin dulu
    if (!hasToko.value && router.currentRoute.value.path !== '/create-toko') {
      router.push('/create-toko')
    }
  } catch (err) {}
}

onMounted(() => {
  getProfile()
})

// Fungsi saklar sidebar mobile
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>