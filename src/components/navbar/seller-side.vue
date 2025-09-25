<template>
  <div class="flex h-screen">
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-30 bg-transparent lg:hidden transition-opacity duration-300 ease-in-out"
    ></div>

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

    <div class="flex-1 p-4 lg:p-8 bg-gray-100 w-full overflow-auto">
      <button
        @click="toggleSidebar"
        class="lg:hidden mb-4 inline-flex items-center rounded-md bg-[#7D0A0A] px-4 py-2 text-white hover:bg-[#A61D1D] navbar-font"
      >
        ☰ Menu
      </button>

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

function linkClass(path) {
  return [
    'text-white',
    router.currentRoute.value.path === path ? 'bg-[#5E0A0A]' : 'bg-[#7D0A0A] hover:bg-[#A61D1D]',
    !hasToko.value && path !== '/manage-toko' ? 'opacity-50 pointer-events-none' : ''
  ]
}

const getProfile = async () => {
  try {
    const res = await api.get('/profile')
    user.value = res.data.data
    const role = user.value.nama_role

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
    router.push('/auth/login')
  }
}

const getToko = async () => {
  try {
    const res = await api.get('/toko')
    const alltoko = res.data.data.data
    tokoseller.value = alltoko.filter(t => t.user_id === user.value.id)
    hasToko.value = tokoseller.value.length > 0

    if (!hasToko.value && router.currentRoute.value.path !== '/create-toko') {
      router.push('/create-toko')
    }
  } catch (err) {}
}

onMounted(() => {
  getProfile()
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>