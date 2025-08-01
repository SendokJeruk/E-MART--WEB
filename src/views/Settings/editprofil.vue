<template>
  <Navbar />

  <div class="flex justify-center items-start min-h-screen bg-gray-100 py-10 px-4">
    <form
      @submit.prevent="updateProfile"
      class="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
    >
      <h2 class="text-2xl font-bold text-center text-gray-700">Edit Profil</h2>

      <!-- Foto Profil -->
      <div class="text-center">
        <img
          :src="previewImage || user?.foto_profil || 'https://via.placeholder.com/100'"
          class="w-24 h-24 mx-auto rounded-full object-cover mb-3 border-2 border-yellow-500"
          alt="Foto Profil"
        />
        <input
            type="file"
            @change="onFileChange"
            accept="image/*"
            class="block mx-auto text-sm text-gray-600 mt-2 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600 transition"
        />
      </div>

      <!-- Nama -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Nama</label>
        <input
          type="text"
          v-model="form.name"
          placeholder="Masukkan nama"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400 transition"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Email</label>
        <input
          type="email"
          v-model="form.email"
          placeholder="Masukkan email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400 transition"
        />
      </div>

      <!-- No Telepon -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">No Telepon</label>
        <input
          type="text"
          v-model="form.no_telp"
          placeholder="08xxxxxxxxxx"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400 transition"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Password</label>
        <input
          type="password"
          v-model="form.password"
          placeholder="Isi jika ingin mengganti"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 placeholder-gray-400 transition"
        />
      </div>

      <!-- Tombol Simpan -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
      >
        {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';

const user = ref(null);
const form = ref({
  name: '',
  email: '',
  no_telp: '',
  password: '',
});
const foto_profil = ref(null);
const previewImage = ref(null);
const isLoading = ref(false);

const getProfile = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/profile');
    user.value = response.data.data;

    form.value.name = user.value.name || '';
    form.value.email = user.value.email || '';
    form.value.no_telp = user.value.no_telp || '';
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  } finally {
    isLoading.value = false;
  }
};

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    foto_profil.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

const updateProfile = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    for (const key in form.value) {
      if (form.value[key]) {
        formData.append(key, form.value[key]);
      }
    }
    if (foto_profil.value) {
      formData.append('foto_profil', foto_profil.value);
    }

    formData.append('_method', 'PUT');

    await api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('Profil berhasil diperbarui');
    getProfile();
  } catch (error) {
    console.error('Gagal update profil:', error);
    alert('Gagal update profil');
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getProfile();
});
</script>

<style scoped>

</style>
