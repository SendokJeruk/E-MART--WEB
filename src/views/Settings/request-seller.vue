<template>
  <Navbar />

  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      Form Pengajuan Jadi Seller
    </h2>

    <form class="space-y-5" @submit.prevent="submitForm">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alasan Menjadi Seller</label>
        <textarea v-model="form.note" rows="3" placeholder="Ceritakan Alasan atau motivasi Anda menjadi seller"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">NIK</label>
        <input v-model="form.nik" type="text" placeholder="Masukkan 16 digit NIK"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input v-model="form.nama_lengkap" type="text" placeholder="Nama lengkap sesuai KTP"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
        <input v-model="form.tempat_lahir" type="text" placeholder="Contoh: Jakarta"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir</label>
        <input v-model="form.tanggal_lahir" type="date"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
        <select v-model="form.jenis_kelamin"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none">
          <option value="" disabled selected>Pilih jenis kelamin</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alamat KTP</label>
        <textarea v-model="form.alamat_ktp" rows="3" placeholder="Tuliskan alamat sesuai KTP"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Upload Foto KTP</label>
        <input type="file" accept="image/*"
          @change="e => form.foto_ktp = e.target.files[0]"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
        <p class="text-xs text-gray-500 mt-1">Format: JPG, JPEG, PNG (max 2MB)</p>
      </div>

      <div class="pt-4">
        <button type="submit"
          class="w-full py-3 bg-[#7D0A0A] text-white font-semibold rounded-lg shadow hover:bg-[#BF3131] transition duration-300">
          Kirim Pengajuan
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref } from 'vue';
import api from '@/plugins/axios';
import { showSuccess,showError } from '@/utils/alert';
import router from '@/router';

const form = ref({
  note: '',
  nik: '',
  nama_lengkap: '',
  tempat_lahir: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  alamat_ktp: '',
  foto_ktp: null,
});

const submitForm = async () => {
  try {
    const formData = new FormData();
    formData.append('note', form.value.note);
    formData.append('nik', form.value.nik);
    formData.append('nama_lengkap', form.value.nama_lengkap);
    formData.append('tempat_lahir', form.value.tempat_lahir);
    formData.append('tanggal_lahir', form.value.tanggal_lahir);
    formData.append('jenis_kelamin', form.value.jenis_kelamin);
    formData.append('alamat_ktp', form.value.alamat_ktp);
    if (form.value.foto_ktp) {
      formData.append('foto_ktp', form.value.foto_ktp);
    }

    await api.post('/requestseller', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    showSuccess('Pengajuan berhasil dikirim!');

    form.value = {
      note: '',
      nik: '',
      nama_lengkap: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      alamat_ktp: '',
      foto_ktp: null,
    };

    router.push('/profile');
  } catch (error) {
    console.error('Gagal submit form:', error)
    showError(error.response?.data?.message || 'Gagal mengirim pengajuan.');
  }
}
</script>
