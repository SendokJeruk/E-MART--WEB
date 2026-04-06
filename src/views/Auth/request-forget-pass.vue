<template>
    <div class="flex justify-center items-center min-h-screen bg-[#eeeeee] p-4">
        <div
            class="bg-[#7d0a0a] rounded-xl shadow-lg overflow-hidden w-full max-w-md p-10 text-white text-center flex flex-col justify-center">
            <h2 class="navbar-font text-2xl mb-2">Lupa Password?</h2>
            <p class="text-sm text-gray-200 mb-6 inter-font">
                Santai, ketik aja email kamu yang kedaftar. Nanti kita kirimin tautan buat bikin password baru.
            </p>

            <!-- Nongol pas lagi ngirim email tautan reset -->
            <div v-if="isLoading" class="flex flex-col items-center w-full py-4">
                <svg class="animate-spin h-12 w-12 text-[#ead196] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="text-lg">Lagi ngirim tautan...</p>
                <p class="text-sm text-gray-300 mt-2">Mohon tunggu sebentar ya.</p>
            </div>

            <!-- Form buat user masukin email yang mau direset password-nya -->
            <form v-else @submit.prevent="sendResetLink" class="space-y-4 inter-font">
                <input v-model="email" type="email" placeholder="Alamat Email" required
                    class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black" />

                <button type="submit" :disabled="!email" :class="[
                    'w-full mt-4 p-3 border-2 rounded font-bold transition oswald-font',
                    !email
                        ? 'bg-gray-400 border-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-white text-[#7d0a0a] border-[#bf3131] hover:bg-[#bf3131] hover:text-white hover:border-[#7d0a0a]'
                ]">
                    Kirim Tautan Reset
                </button>

                <router-link to="/login" class="block mt-4 text-sm text-[#ead196] hover:underline">
                    Gak jadi, inget lagi kok! Balik ke Login
                </router-link>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/plugins/axios'
import { showSuccess, showError } from '@/utils/alert'

const isLoading = ref(false)
const email = ref('')

// Fungsi buat nyuruh server ngirim email tautan reset password
const sendResetLink = async () => {
    if (!email.value) return

    isLoading.value = true

    try {
        const response = await api.post("/auth/forgot-password", {
            email: email.value
        })

        if (response.data.status === "Success" || response.status === 200) {
            showSuccess(response.data.message || "Tautan reset udah kita kirim ke email kamu ya.")
            // Bersihin inputan email-nya
            email.value = ''
        } else {
            showError(response.data.message || "Yah, gagal ngirim tautan reset nih.")
        }
    } catch (error) {
        console.error(error)
        showError("Gagal ngirim nih. Pastiin emailnya bener atau coba lagi ntar.")
    } finally {
        isLoading.value = false
    }
}
</script>