import axios from "axios"
import { useLoaderStore } from "@/stores/loader" 

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.url.startsWith("/")) {
      const loader = useLoaderStore()
      loader.showLoader()
    }

    return config
  },
  (error) => {
    const loader = useLoaderStore()
    loader.hideLoader()
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    if (response.config.url.startsWith("/")) {
      const loader = useLoaderStore()
      loader.hideLoader()
    }
    return response
  },
  (error) => {
    if (error.config?.url?.startsWith("/")) {
      const loader = useLoaderStore()
      loader.hideLoader()
    }
    return Promise.reject(error)
  }
)

export default api
