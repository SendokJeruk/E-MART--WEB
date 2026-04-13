<template>
  <Navbar />
  <!-- Halaman Pendaftaran Seller: Tempat pembeli mengajukan diri menjadi penjual dengan melengkapi data KTP -->
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
    <h2 class="text-2xl text-gray-800 mb-6 text-center navbar-font">Form Pengajuan Jadi Seller</h2>

    <!-- Loading: Saat sistem mengecek apakah user sudah pernah mengajukan sebelumnya -->
    <div v-if="isLoading" class="text-center py-10"><p class="text-gray-500">Mengecek status...</p></div>

    <!-- TAMPILAN STATUS (Jika sudah pernah mengajukan) -->
    <div v-else-if="existingRequest && !isReapplying" class="text-center py-10 space-y-4">
      <h3 class="text-xl font-bold">Status: <span class="uppercase text-red-600">{{ existingRequest.status }}</span></h3>
      <p v-if="existingRequest.status === 'pending'">Mohon tunggu, admin sedang memeriksa data Anda.</p>
      <p v-if="existingRequest.status === 'rejected'">Maaf, pengajuan ditolak. Alasan: {{ existingRequest.note }}</p>
      <button v-if="existingRequest.status === 'rejected'" @click="isReapplying = true" class="bg-[#7D0A0A] text-white px-6 py-2 rounded-lg">Ajukan Ulang</button>
    </div>

    <!-- FORMULIR PENGAJUAN (Jika belum mengajukan atau ingin ajukan ulang) -->
    <form v-else @submit.prevent="submitForm" class="space-y-5">
      <div><label class="block text-sm font-medium mb-1">NIK (16 Digit)</label><input v-model="form.nik" type="text" class="w-full border rounded-lg p-2" required /></div>
      <div><label class="block text-sm font-medium mb-1">Nama Lengkap Sesuai KTP</label><input v-model="form.nama_lengkap" type="text" class="w-full border rounded-lg p-2" required /></div>
      <div><label class="block text-sm font-medium mb-1">Alamat KTP</label><textarea v-model="form.alamat_ktp" class="w-full border rounded-lg p-2" required></textarea></div>
      <div><label class="block text-sm font-medium mb-1">Foto KTP</label><input type="file" @change="e => form.foto_ktp = e.target.files[0]" accept="image/*" class="w-full border p-2" required /></div>
      <button type="submit" class="w-full py-3 bg-[#7D0A0A] text-white rounded-lg font-bold">Kirim Pengajuan</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Navbar from '@/components/navbar/navbar.vue';
import { showSuccess, showError } from '@/utils/alert';

const isLoading = ref(true);
const existingRequest = ref(null);
const isReapplying = ref(false);
const form = ref({ note: '', nik: '', nama_lengkap: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: '', alamat_ktp: '', foto_ktp: null });

// Mengecek apakah user ini sudah punya riwayat pengajuan di database
const checkStatus = async () => {
  try {
    const res = await api.get('/requestseller');
    existingRequest.value = res.data.data;
  } finally { isLoading.value = false; }
};

const submitForm = async () => {
  const fd = new FormData();
  Object.keys(form.value).forEach(key => fd.append(key, form.value[key]));
  try {
    await api.post('/requestseller', fd);
    showSuccess('Berhasil dikirim!'); checkStatus();
  } catch (e) { showError('Gagal mengirim data'); }
};

onMounted(() => { checkStatus(); });
</script>
