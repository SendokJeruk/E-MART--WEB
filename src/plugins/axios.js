import axios from "axios"

/**
 * Membuat instance axios dengan konfigurasi dasar untuk aplikasi.
 * Instance ini akan digunakan untuk semua pemanggilan API ke backend.
 */
const api = axios.create({
  // URL dasar (base URL) untuk semua endpoint API backend
  baseURL: "https://backendemart.student.smkn11bdg.sch.id/api",
  headers: {
    // Memberitahu server bahwa data yang dikirim dalam format JSON
    "Content-Type": "application/json",
  },
})

/**
 * Interceptor Request:
 * Bagian ini akan berjalan otomatis setiap kali aplikasi mengirimkan permintaan (request) ke server.
 */
api.interceptors.request.use(
  (config) => {
    // Mengambil token autentikasi yang tersimpan di penyimpanan lokal browser (localStorage)
    const token = localStorage.getItem("token")
    
    // Jika token ditemukan, masukkan ke dalam header Authorization.
    // Ini diperlukan agar server tahu bahwa permintaan berasal dari user yang sudah login.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Menangani error jika terjadi masalah saat pengiriman request
    return Promise.reject(error)
  }
)

/**
 * Interceptor Response:
 * Bagian ini akan berjalan otomatis setiap kali aplikasi menerima tanggapan (response) dari server.
 */
api.interceptors.response.use(
  (response) => {
    // Jika server memberikan respon sukses, langsung kembalikan datanya
    return response
  },
  (error) => {
    // Jika server memberikan respon error (seperti token kadaluwarsa atau server mati),
    // error tersebut akan ditangkap di sini untuk ditangani lebih lanjut.
    return Promise.reject(error)
  }
)

// Mengekspor instance 'api' agar bisa diimpor dan digunakan di file lain (seperti di komponen Vue)
export default api
