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
                to="/seller"
                :class="{
                  'bg-[#7D0A0A]': $route.path !== '/seller',
                  'bg-[#5E0A0A]': $route.path === '/seller'
                }"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#7D0A0A]"
              >
                Home
              </router-link>
            </li>
  
            <li>
              <router-link
                to="/manageproduk"
                :class="{
                  'bg-[#7D0A0A]': $route.path !== '/manageproduk',
                  'bg-[#5E0A0A]': $route.path === '/manageproduk'
                }"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#7D0A0A]"
              >
                Manage Produk
              </router-link>
            </li>
  
            <li>
              <router-link
                to="/managekategori"
                :class="{
                  'bg-[#7D0A0A]': $route.path !== '/managekategori',
                  'bg-[#5E0A0A]': $route.path === '/managekategori'
                }"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#7D0A0A]"
              >
                Manage Kategori Produk
              </router-link>
            </li>

            <li>
              <router-link
                to="/managetoko"
                :class="{
                  'bg-[#7D0A0A]': $route.path !== '/managetoko',
                  'bg-[#5E0A0A]': $route.path === '/managetoko'
                }"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#7D0A0A]"
              >
                Manage Toko
              </router-link>
            </li>
  
            <li>
              <router-link
                to="/dashboard"
                :class="{
                  'bg-[#7D0A0A]': $route.path !== '/dashboard',
                  'bg-[#5E0A0A]': $route.path === '/dashboard'
                }"
                class="block rounded-lg px-4 py-2 text-sm font-medium text-white hover:bg-[#7D0A0A]"
              >
                Kembali
              </router-link>
            </li>
          </ul>
        </div>
  
        <div class="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-[#7D0A0A]">
          <a href="#" class="flex items-center gap-2 p-4 hover:bg-BF3131">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&auto=format&fit=crop&w=1770&q=80"
              class="size-10 rounded-full object-cover"
            />
            <div>
              <p class="text-xs">
                <strong class="block font-medium text-white">{{ email }}</strong>
                <span class="text-white">{{ userName }}</span>
              </p>
            </div>
          </a>
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
  
  const userName = ref('')
  const email = ref('')
  const isSidebarOpen = ref(false)
  
  onMounted(async () => {
    try {
      const response = await api.get('/profile')
      userName.value = response.data.data.name
      email.value = response.data.data.email
    } catch (error) {
      console.log('User not logged in')
    }
  })
  
  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }
  </script>
  