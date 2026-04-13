<template>
  <Navbar />
  <!-- Halaman Edit Profil: Tempat user mengubah nama, email, nomor HP, atau foto profil -->
  <div class="flex justify-center items-start min-h-screen bg-gray-100 py-10 px-4">
    
    <!-- LOADING SKELETON -->
    <div v-if="isLoading" class="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5">
      <div class="flex justify-center"><Skeleton type="circle" size="96px"/></div>
      <Skeleton height="40px" v-for="n in 4" :key="n"/>
    </div>

    <!-- FORMULIR EDIT PROFIL -->
    <form v-else @submit.prevent="updateProfile" class="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5">
      <h2 class="text-2xl navbar-font text-center text-gray-700">Edit Profil</h2>

      <!-- Bagian Foto Profil (Bisa diklik untuk ganti gambar) -->
      <div class="text-center">
        <img :src="previewImage || user?.foto_profil || 'https://placehold.co/100'" class="w-24 h-24 mx-auto rounded-full object-cover mb-3 border-2 border-[#7D0A0A]" />
        <input type="file" @change="onFileChange" accept="image/*" class="block mx-auto text-sm text-gray-600 mt-2" />
      </div>

      <!-- Input Nama -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Nama Lengkap</label>
        <input type="text" v-model="form.name" class="w-full px-4 py-2 border rounded-lg text-sm inter-font" />
      </div>

      <!-- Input Email -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Alamat Email</label>
        <input type="email" v-model="form.email" class="w-full px-4 py-2 border rounded-lg text-sm inter-font" />
      </div>

      <!-- Input Nomor Telepon -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">No Telepon</label>
        <input type="text" v-model="form.no_telp" class="w-full px-4 py-2 border rounded-lg text-sm inter-font" />
      </div>

      <!-- Input Password (Isi jika ingin ganti) -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Password Baru (Kosongkan jika tidak ganti)</label>
        <input type="password" v-model="form.password" class="w-full px-4 py-2 border rounded-lg text-sm" />
      </div>

      <button type="submit" :disabled="isLoading" class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg navbar-font">
        Simpan Perubahan
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';
import { showError, showSuccess } from '@/utils/alert';

const user = ref(null);
const form = ref({ name: '', email: '', no_telp: '', password: '' });
const foto_profil = ref(null);
const previewImage = ref(null);
const isLoading = ref(false);

const getProfile = async () => {
  try {
    const res = await api.get('/profile');
    user.value = res.data.data;
    form.value.name = user.value.name;
    form.value.email = user.value.email;
    form.value.no_telp = user.value.no_telp;
  } catch (e) {}
};

// Fungsi saat user memilih file gambar dari komputernya
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    foto_profil.value = file;
    previewImage.value = URL.createObjectURL(file); // Buat URL sementara untuk preview
  }
};

/**
 * Mengirimkan data profil yang sudah diubah ke server.
 * Menggunakan FormData karena terdapat pengiriman file gambar.
 */
const updateProfile = async () => {
  isLoading.value = true;
  const fd = new FormData();
  if (form.value.name) fd.append('name', form.value.name);
  if (form.value.email) fd.append('email', form.value.email);
  if (form.value.no_telp) fd.append('no_telp', form.value.no_telp);
  if (form.value.password) fd.append('password', form.value.password);
  if (foto_profil.value) fd.append('foto_profil', foto_profil.value);
  fd.append('_method', 'PUT'); // Memberitahu server Laravel bahwa ini aksi Update

  try {
    await api.post('/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    showSuccess('Profil diperbarui!'); getProfile();
  } catch (e) { showError('Gagal memperbarui profil'); }
  finally { isLoading.value = false; }
};

onMounted(() => { getProfile(); });
</script>
