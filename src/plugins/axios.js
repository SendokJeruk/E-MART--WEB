import axios from "axios"

// Bikin instance axios, arahin ke backend kita yang di SMKN 11
const api = axios.create({
  baseURL: "http://backendemart.student.smkn11bdg.sch.id/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Sebelum kirim request, kita sisipin token login dulu kalo ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Kalo ada error pas mau ngirim, lempar aja
    return Promise.reject(error)
  }
)

// Pas dapet respon, kita liatin dulu
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Kalo error respon (misal 404/500), lempar juga biar ditangkep di catch
    return Promise.reject(error)
  }
)

export default api