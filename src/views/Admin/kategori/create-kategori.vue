<template>
    <adminside>
      <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl font-bold mb-4">Form Tambah Kategori</h2>
        <!-- Form buat bikin kategori baru, dicegah biar gak reload pas disubmit -->
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
  import adminside from '@/components/navbar/admin-side.vue'
  import { showSuccess, showError } from '@/utils/alert'
  
  // Data formnya disimpen di sini
  const form = ref({
    nama_category: '',
  })
  
  // Fungsi buat ngirim data kategori baru ke server
  const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('nama_category', form.value.nama_category)

    const response = await api.post('/category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // Kalo sukses, kasih tau user terus kosongin lagi inputannya
    showSuccess('category berhasil ditambahkan!')
    form.value.nama_category = ''

  } catch (error) {
    // Kalo ada yang salah, kita kumpulin pesan errornya buat ditampilin
    const errors = error.response?.data?.errors;
    let errorMessage = error.response?.data?.message || 'Gagal menambahkan produk.';

    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }

    showError(errorMessage);
  }
} 
  </script>
  