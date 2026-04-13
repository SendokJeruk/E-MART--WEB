<template>
    <adminside>
      <!-- Halaman Edit Kategori: Digunakan admin untuk mengubah nama kategori yang sudah ada -->
      <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl navbar-font mb-4">Form Edit Kategori</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="nama_category" class="block mb-1 navbar-font">Nama Kategori</label>
            <input
              id="nama_category"
              v-model="form.nama_category"
              type="text"
              class="w-full border px-3 py-2 rounded inter-font"
              required
            />
          </div>
  
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 navbar-font">
            Update Kategori
          </button>
        </form>
      </div>
    </adminside>
  </template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import adminside from '@/components/navbar/admin-side.vue'
import { showSuccess, showError } from '@/utils/alert'

const route = useRoute()
const router = useRouter()
const form = ref({ nama_category: '' })

/**
 * Mengambil data nama kategori yang lama dari server saat halaman dibuka.
 */
const fetchCategory = async () => {
  try {
    const res = await api.get(`/category/${route.params.id}`)
    form.value.nama_category = res.data.data.nama_category
  } catch (e) {}
}

/**
 * Mengirimkan perubahan nama kategori ke server.
 */
const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('nama_category', form.value.nama_category)
    formData.append('_method', 'PUT') // Metode PUT untuk pembaruan data
    
    await api.post(`/category/${route.params.id}`, formData)
    showSuccess('Kategori berhasil diperbarui!'); router.push('/kategori') 
  } catch (error) { showError('Gagal mengubah kategori.') }
}

onMounted(() => { fetchCategory() })
</script>
