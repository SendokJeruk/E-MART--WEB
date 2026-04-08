<template>
    <adminside>
      <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl navbar-font mb-4">Form Edit Kategori</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="nama_category" class="block mb-1 navbar-font">Nama Kategori</label>
            <input
              id="nama_category"
              name="nama_category"
              v-model="form.nama_category"
              type="text"
              class="w-full border px-3 py-2 rounded inter-font"
            />
          </div>
  
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 navbar-font"
          >
            Submit
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

const form = ref({
  nama_category: '',
})

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('nama_category', form.value.nama_category)
    formData.append('_method', 'PUT')  
    
    const response = await api.post(`/category/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    showSuccess('Kategori berhasil diperbarui!')
    router.push('/kategori') 
  } catch (error) {
    const errors = error.response?.data?.errors;
    let errorMessage = error.response?.data?.message || 'Gagal mengubah kategori.';

    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }

    showError(errorMessage);
  }
}
</script>
