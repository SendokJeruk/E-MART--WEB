<template>
    <!-- Halaman Reset Password: Tempat user memasukkan kata sandi baru -->
    <div class="flex justify-center items-center min-h-screen bg-[#eeeeee] p-4">
        <div
            class="bg-[#7d0a0a] rounded-xl shadow-lg overflow-hidden w-full max-w-md p-10 text-white text-center flex flex-col justify-center">
            <h2 class="navbar-font text-2xl mb-6">Reset Password</h2>

            <!-- Tampilan saat sedang menyimpan password baru -->
            <div v-if="isLoading" class="flex flex-col items-center w-full py-8">
                <svg class="animate-spin h-12 w-12 text-[#ead196] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="text-lg">Sedang memproses...</p>
                <p class="text-sm text-gray-300 mt-2">Mohon tunggu sebentar.</p>
            </div>

            <!-- Formulir input password baru -->
            <form v-else @submit.prevent="resetPassword" class="space-y-4 inter-font">
                <p class="text-sm text-gray-200 mb-4">Silakan masukkan password baru untuk akun Anda.</p>

                <!-- Input Password Baru -->
                <input v-model="form.password" type="password" placeholder="Password Baru" required
                    class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black" />

                <!-- Input Konfirmasi Password Baru -->
                <input v-model="form.password_confirmation" type="password" placeholder="Konfirmasi Password" required
                    class="w-full p-3 border-2 border-[#bf3131] rounded focus:outline-none focus:border-[#ead196] bg-white text-black" />

                <!-- Indikator Syarat Password Kuat -->
                <div v-if="unmetRequirements.length" class="text-xs text-left mt-1 mb-2 space-y-1">
                    <p v-for="(req, i) in unmetRequirements" :key="i" class="text-white">
                        • {{ req }}
                    </p>
                </div>

                <!-- Pesan error jika password tidak sama -->
                <div v-if="passwordMismatch" class="text-xs text-left mt-1 text-[#ead196]">
                    • Konfirmasi password tidak cocok
                </div>

                <button type="submit" :disabled="isSubmitDisabled" :class="[
                    'w-full mt-6 p-3 border-2 rounded font-bold transition oswald-font',
                    isSubmitDisabled
                        ? 'bg-gray-400 border-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-white text-[#7d0a0a] border-[#bf3131] hover:bg-[#bf3131] hover:text-white hover:border-[#7d0a0a]'
                ]">
                    Simpan Password Baru
                </button>

                <router-link to="/login" class="block mt-4 text-sm text-[#ead196] hover:underline">
                    Kembali ke Halaman Login
                </router-link>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import { showSuccess, showError } from '@/utils/alert'

const route = useRoute()
const router = useRouter()
const isLoading = ref(false)

// Menampung token dari URL dan password baru user
const form = ref({
    token: '',
    email: '',
    password: '',
    password_confirmation: ''
})

// Syarat-syarat agar password aman
const requirements = [
    { label: "Minimal 8 karakter", test: (pw) => pw.length >= 8 },
    { label: "Huruf besar", test: (pw) => /[A-Z]/.test(pw) },
    { label: "Huruf kecil", test: (pw) => /[a-z]/.test(pw) },
    { label: "Angka", test: (pw) => /\d/.test(pw) },
    { label: "Simbol (@, #, $, dll)", test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
]

// Mengecek kriteria password mana yang belum dipenuhi
const unmetRequirements = computed(() => {
    return requirements
        .filter(rule => !rule.test(form.value.password))
        .map(rule => rule.label)
})

// Mengecek apakah input password kedua sama dengan yang pertama
const passwordMismatch = computed(() => {
    if (!form.value.password_confirmation) return false
    return form.value.password !== form.value.password_confirmation
})

// Tombol simpan akan mati jika syarat belum lengkap atau password tidak cocok
const isSubmitDisabled = computed(() => {
    return (
        !form.value.password ||
        !form.value.password_confirmation ||
        unmetRequirements.value.length > 0 ||
        passwordMismatch.value
    )
})

onMounted(() => {
    // Otomatis mengambil token dan email dari alamat URL saat halaman dibuka
    form.value.token = route.query.token || ''
    form.value.email = route.query.email || ''

    if (!form.value.token || !form.value.email) {
        showError("Tautan tidak valid atau tidak lengkap.")
    }
})

/**
 * Fungsi untuk mengirim password baru ke server.
 * Jika berhasil, user akan diarahkan kembali ke halaman Login.
 */
const resetPassword = async () => {
    if (isSubmitDisabled.value) return
    isLoading.value = true
    try {
        const response = await api.post("/auth/reset-password", form.value)

        if (response.data.status === "Success" || response.status === 200) {
            showSuccess(response.data.message || "Password berhasil diubah!")
            router.push("/login")
        } else {
            showError(response.data.message || "Gagal mengubah password.")
        }
    } catch (error) {
        console.error(error)
        showError("Terjadi kesalahan. Tautan mungkin kedaluwarsa atau tidak valid.")
    } finally {
        isLoading.value = false
    }
}
</script>
