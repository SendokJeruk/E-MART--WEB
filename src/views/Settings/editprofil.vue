<template>
  <Navbar />

  <div class="flex justify-center items-start min-h-screen bg-gray-100 py-10 px-4">

    <!-- Skeleton buat area form edit pas lagi loading narik data lama -->
    <div v-if="isLoading"
    class="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5">

      <div class="flex justify-center">
        <Skeleton type="circle" size="96px"/>
      </div>

      <Skeleton height="18px" width="40%" class="mx-auto"/>

      <Skeleton height="40px"/>
      <Skeleton height="40px"/>
      <Skeleton height="40px"/>
      <Skeleton height="40px"/>

      <Skeleton height="40px"/>

    </div>


    <!-- Form asli buat ngubah data diri kamu -->
    <form
      v-else
      @submit.prevent="updateProfile"
      class="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg space-y-5"
    >

      <h2 class="text-2xl font-bold text-center text-gray-700">Edit Profil Kamu</h2>

      <!-- Bagian ganti foto profil, ada pratinjau-nya lho -->
      <div class="text-center">
        <img
          :src="previewImage || user?.foto_profil || 'https://placehold.co/100'"
          class="w-24 h-24 mx-auto rounded-full object-cover mb-3 border-2 border-yellow-500"
        />

        <input
          type="file"
          @change="onFileChange"
          accept="image/*"
          class="block mx-auto text-sm text-gray-600 mt-2"
        />
      </div>

      <!-- Input nama baru -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Nama</label>
        <input
          type="text"
          v-model="form.name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <!-- Input email baru -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Email</label>
        <input
          type="email"
          v-model="form.email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <!-- Input nomor telepon baru -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">No Telepon</label>
        <input
          type="text"
          v-model="form.no_telp"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <!-- Input password baru (kalo mau diganti) -->
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">Password Baru</label>
        <input
          type="password"
          v-model="form.password"
          placeholder="Isi kalo mau ganti aja..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      <!-- Tombol buat simpen semua perubahan datanya -->
      <button
        type="submit"
        :disabled="isLoading"
        class="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg hover:bg-yellow-600 transition"
      >
        Simpan Perubahan
      </button>

    </form>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import Skeleton from "@/components/Skeleton.vue"
import api from '@/plugins/axios';
import { showError, showSuccess } from '@/utils/alert';

const user = ref(null);
// State form buat nangkep inputan user
const form = ref({
  name: '',
  email: '',
  no_telp: '',
  password: '',
});
const foto_profil = ref(null);
const previewImage = ref(null);
const isLoading = ref(false);

// Fungsi buat nyomot data profil lama biar nongol di form
const getProfile = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/profile');
    user.value = response.data.data;

    // Pasang data lamanya ke form biar user tinggal ngedit dikit
    form.value.name = user.value.name || '';
    form.value.email = user.value.email || '';
    form.value.no_telp = user.value.no_telp || '';
  } catch (error) {
    console.error('Yah, gagal ambil profil kamu nih:', error);
  } finally {
    isLoading.value = false;
  }
};

// Pas user milih file foto baru, kita bikin preview-nya biar gak salah upload
const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    foto_profil.value = file;
    previewImage.value = URL.createObjectURL(file);
  }
};

// Fungsi utama buat ngirim data update profil ke server
const updateProfile = async () => {
  try {
    isLoading.value = true;

    const formData = new FormData();
    // Masukin semua inputan ke FormData
    for (const key in form.value) {
      if (form.value[key]) {
        formData.append(key, form.value[key]);
      }
    }
    // Tambahin file foto profil-nya kalo ada
    if (foto_profil.value) {
      formData.append('foto_profil', foto_profil.value);
    }

    // Pake trik _method=PUT karena kirim file lewat FormData
    formData.append('_method', 'PUT');

    await api.post('/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    showSuccess('Profil kamu udah berhasil diperbarui, sip!');
    // Tarik ulang data profil biar tampilannya sinkron
    getProfile();
  } catch (error) {
    console.error('Gagal update profil kamu nih:', error);
    showError('Yah, ada masalah pas mau update profil.');
  } finally {
    isLoading.value = false;
  }
};

// Pas halaman dibuka, langsung gas tarik datanya
onMounted(() => {
  getProfile();
});
</script>
