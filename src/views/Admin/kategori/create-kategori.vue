<template>
    <adminside>
      <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl font-bold mb-4">Form Tambah Kategori</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="nama_category" class="block mb-1">Nama Kategori</label>
            <input
              id="nama_category"
              name="nama_category"
              v-model="form.nama_category"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
  
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </adminside>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import api from '@/plugins/axios'
  import adminside from '@/components/navbar/adminside.vue'
  
  const form = ref({
    nama_category: '',
  })
  
  const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('nama_category', form.value.nama_category)

    const response = await api.post('/category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    alert('category berhasil ditambahkan!')
    form.value.nama_category = ''

  } catch (error) {
    console.error('Gagal submit form:', error)
    alert(error.response?.data?.message || 'Gagal menambahkan category.')
  }
} 
  </script>
  