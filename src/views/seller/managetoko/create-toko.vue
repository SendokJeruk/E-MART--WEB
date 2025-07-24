<template>
    <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Form Tambah Toko</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="nama_toko" class="block mb-1">Nama Toko</label>
          <input
            type="text"
            id="nama_toko"
            v-model="form.nama_toko"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
  
        <div class="mb-4">
          <label for="deskripsi" class="block mb-1">Deskripsi</label>
          <input
            type="text"
            id="deskripsi"
            v-model="form.deskripsi"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>
  
        <div class="mb-4">
          <label for="no_telp" class="block mb-1">No. Telepon</label>
          <input
            type="text"
            id="no_telp"
            v-model="form.no_telp"
            class="w-full border px-3 py-2 rounded"
            required
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
</sellerside>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Sellerside from '@/components/navbar/seller-side.vue';
  import api from '@/plugins/axios';
  
  const form = ref({
    user_id: '',
    nama_toko: '',
    deskripsi: '',
    no_telp: '',
  });
  
  const user = ref({});
  
  const getProfile = async () => {
    try {
      const response = await api.get('/profile');
      user.value = response.data.data;
      form.value.user_id = user.value.id;
    } catch (error) {
      console.error('Gagal mengambil profil:', error);
    }
  };
  
  const submitForm = async () => {
    try {
      const response = await api.post('/toko', form.value);
      alert('Toko berhasil dibuat!');
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        alert(`Gagal: ${error.response.data.message}`);
        console.error(error.response.data.errors || error.response.data.error);
      } else {
        console.error(error);
        alert('Terjadi kesalahan saat mengirim data.');
      }
    }
  };
  
  onMounted(() => {
    getProfile();
  });
  </script>
  
  <style>
  </style>
  