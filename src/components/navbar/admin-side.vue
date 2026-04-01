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
      <div class="px-4 py-6">
        <ul class="mt-6 space-y-1">
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
            </router-link>
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

          <button
            @click="logout"
            class="w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#A61D1D]"
          >
            Logout
          </button>

        </ul>
      </div>
    </div>

    <div class="flex-1 p-4 lg:p-8 bg-gray-100 w-full overflow-auto">
      <button
        @click="toggleSidebar"
        class="lg:hidden mb-4 inline-flex items-center rounded-md bg-[#7D0A0A] px-4 py-2 text-white hover:bg-[#A61D1D]"
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

const router = useRouter()
const userName = ref('')
const email = ref('')
const userRole = ref('')
const isSidebarOpen = ref(false)

function linkClass(path) {
  return [
    'text-white',
    router.currentRoute.value.path === path ? 'bg-[#5E0A0A]' : 'bg-[#7D0A0A] hover:bg-[#A61D1D]',
  ]
}

const logout = async () => {
  const confirmed = window.confirm("Are you sure you want to log out?")
  if (!confirmed) return

  try {
    await api.post('/auth/logout')
    localStorage.removeItem("token")
    router.push('/login')
    alert('Logged out successfully!')
  } catch (error) {
    console.error('Logout failed:', error)
    alert('Logout failed, please try again.')
  }
}

onMounted(async () => {
  try {
    const response = await api.get('/profile')
    userName.value = response.data.data.name
    email.value = response.data.data.email
    userRole.value = response.data.data.nama_role

    if (userRole.value === 'seller' || userRole.value === 'buyer') {
      router.push('/dashboard')
    }
  } catch (error) {
    router.push('/login')
  }
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>
