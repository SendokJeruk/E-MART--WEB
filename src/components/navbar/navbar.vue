<template>
  <header class="bg-white shadow-md">
    <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between space-x-4">
        <div class="flex items-center m-3">
          <a href="#" aria-label="Home">
            <img src="@/assets/img/LOGO E-MART APP.png" alt="Logo" class="h-12 sm:h-16 w-auto object-contain" />
          </a>
        </div>

        <input
          v-model="search"
          id="search-query"
          name="search-query"
          class="w-full p-2 border border-gray-300 rounded-md pl-7 sm:pl-9 text-sm sm:text-base m-10"
          placeholder="Search..."
          type="text"
        />

        <nav class="hidden md:flex items-center gap-6 text-sm">
          <div class="relative inline-flex">
            <span class="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white shadow-sm">
              <button
                type="button"
                class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
              >
                Home
              </button>

              <button
                type="button"
                @click="toggleDropdown"
                class="px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative"
                aria-label="Menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </span>

            <div
              v-show="dropdownVisible"
              role="menu"
              class="absolute end-0 top-12 z-50 w-56 overflow-hidden rounded border border-gray-300 bg-white shadow-sm"
            >
              <router-link
                to="/profile"
                class="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
              >
                Profil
              </router-link>

              <router-link
                to="/cart"
                class="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                role="menuitem"
              >
                Keranjang
              </router-link>

              <a
                href="#"
                class="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#7D0A0A]"
                role="menuitem"
              >
                Stock
              </a>
              <router-link v-if="userRole === 'admin'" class="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#7D0A0A]" to="/admin">Admin</router-link>
              <router-link v-if="userRole === 'seller'" class="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#7D0A0A]" to="/seller">Seller</router-link>
            </div>
          </div>
        </nav>

        <div class="flex items-center gap-4">
          <div v-if="!isLoggedIn" class="hidden sm:flex gap-2">
            <buttonred label="Login" to="/login" />
            <buttonred label="Register" to="/register" />
          </div>

          <div v-else class="hidden sm:flex items-center gap-2">
            <span class="text-gray-600 font-semibold mr-5 truncate max-w-xs" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              Hello, {{ userName }}
            </span>
            <buttonred @click="logout" label="Logout" aria-label="Logout" />
          </div>


          <button @click="toggleSidebar" class="md:hidden block p-2 text-gray-600 hover:text-teal-600" aria-label="Toggle sidebar">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2"
              viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSidebar" class="md:hidden bg-white border-t shadow-md">
      <nav class="flex flex-col p-4 gap-3 text-sm">
        <a href="#" class="block bg-white shadow rounded-lg px-4 py-2 text-gray-700 hover:[#7D0A0A] hover:shadow-md transition">Home</a>
        <a href="#" class="block bg-white shadow rounded-lg px-4 py-2 text-gray-700 hover:[#7D0A0A] hover:shadow-md transition">Keranjang</a>
        <a href="#" class="block bg-white shadow rounded-lg px-4 py-2 text-gray-700 hover:[#7D0A0A] hover:shadow-md transition">History</a>
        <a href="#" class="block bg-white shadow rounded-lg px-4 py-2 text-gray-700 hover:[#7D0A0A] hover:shadow-md transition">Setting</a>
        <router-link v-if="userRole === 'admin'" to="/admin" class="block bg-white shadow rounded-lg px-4 py-2 text-gray-700 hover:text-[#7D0A0A] hover:shadow-md transition">Admin</router-link>
        <router-link v-if="userRole === 'seller'" to="/seller" class="block bg-white shadow rounded-lg px-4 py-2 text-gray-700 hover:text-[#7D0A0A] hover:shadow-md transition">Seller</router-link>

        <div v-if="!isLoggedIn" class="pt-4 space-y-2">
          <buttonred class="mr-3" label="Login" to="/login" />
          <buttonred label="Register" to="/register" />
        </div>

        <div v-else class="pt-4 space-y-2">
          <span class="flex items-center">
            <span class="h-px flex-1 bg-gray-300"></span>

            <span class="shrink-0 px-4 text-gray-900">Hello, {{ userName }}</span>
          
            <span class="h-px flex-1 bg-gray-300"></span>
          </span>
          <buttonred @click="logout" label="Logout" aria-label="Logout" />
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from "@/plugins/axios"

import buttonred from "@/components/button/buttonred.vue"
const search = defineModel()

const isLoggedIn = ref(false)
const userName = ref('')
const userRole = ref('')
const showSidebar = ref(false)
const dropdownVisible = ref(false)

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value 
}

const logout = async () => {
  const confirmed = window.confirm("Are you sure you want to log out?")
  if (!confirmed) return

  try {
    await api.post('/auth/logout')
    isLoggedIn.value = false
    userName.value = ''
    userRole.value = ''
    showSidebar.value = false
    dropdownVisible.value = false 
    alert('Logged out successfully!')
  } catch (error) {
    console.error('Logout failed:', error)
    alert('Logout failed, please try again.')
  }
}

onMounted(async () => {
  try {
    const response = await api.get('/profile')
    isLoggedIn.value = true
    userName.value = response.data.data.name      
    userRole.value = response.data.data.nama_role 
  } catch (error) {
    console.log('User not logged in')
  }
})
</script>
