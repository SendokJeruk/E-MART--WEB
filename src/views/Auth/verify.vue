<template>
    <div class="flex justify-center items-center min-h-screen bg-[#eeeeee] p-4">
      <div
        class="bg-[#7d0a0a] rounded-xl shadow-lg overflow-hidden w-full max-w-md p-10 text-white text-center flex flex-col justify-center"
      >
        <h2 class="navbar-font text-2xl mb-6">Verifikasi Akun</h2>
  
        <div class="space-y-6 inter-font flex flex-col items-center">
          
          <!-- Nongol pas lagi ngecek token verifikasi ke server -->
          <div v-if="isLoading" class="flex flex-col items-center w-full">
            <svg class="animate-spin h-12 w-12 text-[#ead196] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-lg">Lagi verifikasi nih...</p>
            <p class="text-sm text-gray-300 mt-2">Mohon tunggu sebentar ya.</p>
          </div>
  
          <!-- Tampilan kalo verifikasinya sukses mantap -->
          <div v-else-if="verificationStatus === 'Success'" class="flex flex-col items-center w-full">
            <svg class="h-16 w-16 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-bold mb-2 text-[#ead196]">{{ verificationMessage }}</h3>
            <p class="text-sm mb-6">Asik! Akun kamu udah aktif. Sekarang udah bisa masuk ke sistem nih.</p>
            
            <router-link
              to="/login"
              class="w-full block p-3 bg-white text-[#7d0a0a] border-2 border-[#bf3131] rounded font-bold hover:bg-[#bf3131] hover:text-white hover:border-[#7d0a0a] transition oswald-font text-center"
            >
              Cus, Login Sekarang
            </router-link>
          </div>
  
          <!-- Tampilan kalo ada kendala pas verifikasi -->
          <div v-else class="flex flex-col items-center w-full">
            <svg class="h-16 w-16 text-[#ead196] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-bold mb-2">{{ verificationMessage || 'Verifikasi Gagal' }}</h3>
            <p class="text-sm mb-6 text-gray-300">Tautan-nya gak valid, udah basi, atau sistem lagi galau nih.</p>
            
            <router-link
              to="/register"
              class="w-full block p-3 bg-white text-[#7d0a0a] border-2 border-[#bf3131] rounded font-bold hover:bg-[#bf3131] hover:text-white hover:border-[#7d0a0a] transition oswald-font text-center"
            >
              Balik ke Register Lagi
            </router-link>
          </div>
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import api from '@/plugins/axios'
  import { showSuccess, showError } from '@/utils/alert'
  
  const route = useRoute()

  // Status buat ngatur tampilan di template
  const isLoading = ref(true)
  const verificationStatus = ref(null) 
  const verificationMessage = ref('')
  
  // Fungsi utama buat nge-aktifin akun user
  const verifyAccount = async () => {
    // Ambil token dari parameter URL
    const token = route.query.token
  
    // Kalo gak bawa token ya gak bisa diproses
    if (!token) {
      isLoading.value = false
      verificationStatus.value = 'Failed'
      verificationMessage.value = 'Data verifikasi-nya kurang lengkap nih!'
      return
    }
  
    try {
      // Kirim token ke server buat divalidasi
      const response = await api.post("/auth/verify-registration", {
        token: token,
      })
  
      const data = response.data
  
      if (data.status === "Success") {
        verificationStatus.value = "Success"
        verificationMessage.value = "Verifikasi mantap, berhasil!"
      } else {
        verificationStatus.value = "Failed"
        verificationMessage.value = "Yah, verifikasi-nya gagal nih."
      }
    } catch (error) {
      verificationStatus.value = "Failed"
      verificationMessage.value = "Tautan gak valid, udah basi, atau sistem lagi ada kendala."
    } finally {
      isLoading.value = false
    }
  }
  
  // Pas halaman dibuka, langsung gas verifikasi
  onMounted(() => {
    verifyAccount()
  })
  </script>