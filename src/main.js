import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import api from './plugins/axios'
import router from './router'
import './assets/tailwind.css'
import './assets/font.css'
import VueApexCharts from "vue3-apexcharts"

/**
 * File inisialisasi utama aplikasi Vue.
 * Di sini kita menghubungkan berbagai library (Router, Pinia, Charts) ke aplikasi.
 */
const app = createApp(App)

/**
 * Mendaftarkan instance API (Axios) agar bisa diakses secara global di seluruh komponen
 * menggunakan perintah this.$api (untuk mempermudah pemanggilan data dari server).
 */
app.config.globalProperties.$api = api

// Mengaktifkan sistem navigasi (Router)
app.use(router)

// Mengaktifkan sistem manajemen penyimpanan data (Pinia)
app.use(createPinia())

// Mengaktifkan library grafik (ApexCharts)
app.use(VueApexCharts) 

// Menampilkan aplikasi ke dalam elemen HTML dengan id 'app'
app.mount('#app')
