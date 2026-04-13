<template>
    <adminside>
      <!-- Halaman Formulir: Digunakan admin untuk menambah kategori produk baru ke sistem -->
      <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl navbar-font mb-4">Form Tambah Kategori</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="nama_category" class="block mb-1 navbar-font">Nama Kategori</label>
            <input
              id="nama_category"
              v-model="form.nama_category"
              type="text"
              class="w-full border px-3 py-2 rounded inter-font"
              placeholder="Contoh: Elektronik"
              required
            />
          </div>
  
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 navbar-font">
            Simpan Kategori
          </button>
        </form>
      </div>
    </adminside>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import api from '@/plugins/axios'
  import adminside from '@/components/navbar/admin-side.vue'
  import { showSuccess, showError } from '@/utils/alert'
  
  const form = ref({ nama_category: '' })
  
  /**
   * Mengirim data kategori baru ke server.
   */
  const submitForm = async () => {
    try {
      const formData = new FormData()
      formData.append('nama_category', form.value.nama_category)
      await api.post('/category', formData)
      showSuccess('Kategori berhasil ditambahkan!')
      form.value.nama_category = '' // Reset input setelah berhasil
    } catch (error) {
      showError(error.response?.data?.message || 'Gagal menambahkan kategori.');
    }
  } 
  </script>
