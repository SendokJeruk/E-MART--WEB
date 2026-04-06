import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import api from './plugins/axios'
import router from './router'
import './assets/tailwind.css'
import './assets/font.css'
import VueApexCharts from "vue3-apexcharts"

// Mulai bikin aplikasinya di sini
const app = createApp(App)

// Pasang api (axios) ke global biar bisa dipanggil dari mana aja pake $api
app.config.globalProperties.$api = api

// Pake router, pinia buat state management, ama chart biar keren
app.use(router)
app.use(createPinia())
app.use(VueApexCharts) 

// Tancepin aplikasinya ke div id="app" di index.html
app.mount('#app')
