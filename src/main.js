import { createApp } from 'vue'
import App from './App.vue'
import api from './plugins/axios'
import router from './router'
import './assets/tailwind.css'


const app = createApp(App)

app.config.globalProperties.$api = api

app.use(router)

app.mount('#app')