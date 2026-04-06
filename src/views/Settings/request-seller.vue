<template>
  <Navbar />

  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-6">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      Form Pendaftaran Jadi Seller
    </h2>

    <!-- Area buat nunggu proses cek status pendaftaran kamu -->
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-500">Lagi ngecek status pendaftaran kamu nih...</p>
    </div>

    <!-- Kalo kamu udah pernah daftar, kita tampilin statusnya di sini -->
    <div v-else-if="existingRequest && !isReapplying" class="text-center py-10 space-y-4">
      <div class="inline-block p-4 rounded-full" 
           :class="{
             'bg-yellow-100 text-yellow-600': existingRequest.status === 'pending',
             'bg-green-100 text-green-600': existingRequest.status === 'accepted' || existingRequest.status === 'approved',
             'bg-red-100 text-red-600': existingRequest.status === 'rejected'
           }">
        <!-- Ikon cakep penanda status pendaftaran -->
        <svg v-if="existingRequest.status === 'pending'" xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="existingRequest.status === 'accepted' || existingRequest.status === 'approved'" xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="existingRequest.status === 'rejected'" xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h3 class="text-xl font-bold text-gray-800">
        Statusnya: <span class="uppercase">{{ existingRequest.status }}</span>
      </h3>
      
      <!-- Pesan keterangan sesuai status yang didapet dari admin -->
      <p v-if="existingRequest.status === 'pending'" class="text-gray-600">
        Sabar ya, pengajuan kamu lagi dibaca-baca ama tim Admin. Tungguin kabar baiknya!
      </p>
      <p v-else-if="existingRequest.status === 'accepted' || existingRequest.status === 'approved'" class="text-gray-600">
        Mantap! Kamu udah resmi jadi Seller. Langsung sikat jualan yuk!
      </p>
      <p v-else-if="existingRequest.status === 'rejected'" class="text-gray-600">
        Yah, maaf banget pengajuan kamu belom bisa kita terima nih.
        <br>
        <span v-if="existingRequest.note" class="font-semibold block mt-2 text-red-500">Alasan Admin: {{ existingRequest.note }}</span>
      </p>

      <div class="pt-6 flex justify-center gap-4">
        <router-link to="/profile" class="inline-block px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
          Balik ke Profil
        </router-link>

        <!-- Tombol buat nyoba daftar lagi kalo kemaren ditolak -->
        <button v-if="existingRequest.status === 'rejected'" @click="reapply" class="inline-block px-6 py-2 bg-[#7D0A0A] text-white rounded-lg hover:bg-[#BF3131] transition">
          Benerin & Daftar Lagi
        </button>
      </div>
    </div>

    <!-- Ini form pendaftaran buat yang pengen mulai jualan -->
    <form v-else class="space-y-5" @submit.prevent="submitForm">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alesan Pengen Jualan</label>
        <textarea v-model="form.note" rows="3" placeholder="Ceritain dikit dong motivasi kamu mau jadi seller..."
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nomor NIK</label>
        <input v-model="form.nik" type="text" placeholder="Ketik 16 digit NIK kamu ya"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input v-model="form.nama_lengkap" type="text" placeholder="Nama asli sesuai KTP ya"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Lahir</label>
        <input v-model="form.tempat_lahir" type="text" placeholder="Contoh: Bandung"
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
          <option value="" disabled selected>Pilih salah satu</option>
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Alamat KTP</label>
        <textarea v-model="form.alamat_ktp" rows="3" placeholder="Tulis alamat kamu yang di KTP"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none"></textarea>
      </div>

      <!-- Upload foto KTP buat bukti kalo kamu bukan robot -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Upload Foto KTP</label>
        <input type="file" accept="image/*"
          @change="e => form.foto_ktp = e.target.files[0]"
          class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#7D0A0A] focus:outline-none" />
        <p class="text-xs text-gray-500 mt-1">Format: JPG, JPEG, PNG (Maks 2MB ya biar gak lemot)</p>
      </div>

      <!-- Tombol aksi form -->
      <div class="pt-4 flex gap-4">
        <button v-if="isReapplying" type="button" @click="isReapplying = false"
          class="w-1/3 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow hover:bg-gray-300 transition duration-300">
          Gak Jadi
        </button>
        <button type="submit"
          class="flex-1 py-3 bg-[#7D0A0A] text-white font-semibold rounded-lg shadow hover:bg-[#BF3131] transition duration-300">
          Kirim Pendaftaran
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { showSuccess,showError } from '@/utils/alert';
import router from '@/router';

const isLoading = ref(true);
const existingRequest = ref(null);
const isReapplying = ref(false);

// Objek form buat data pendaftaran
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

// Fungsi buat ngecek apakah kamu udah pernah daftar apa belom
const checkExistingRequest = async () => {
  try {
    const response = await api.get('/requestseller');
    const resData = response.data.data;

    // Nanganin respon datanya (bisa array atau object tunggal)
    if (resData && !Array.isArray(resData) && resData.id) {
      existingRequest.value = resData;
    } else if (Array.isArray(resData) && resData.length > 0) {
      existingRequest.value = resData[0];
    }
  } catch (error) {
    console.error('Belom ada request atau server lagi ngambek:', error);
  } finally {
    isLoading.value = false;
  }
};

// Fungsi buat persiapan daftar ulang kalo ditolak
const reapply = () => {
  if (existingRequest.value) {
    // Masukin data lama biar gak capek ngetik ulang
    form.value.note = existingRequest.value.note || '';
    form.value.nik = existingRequest.value.nik || '';
    form.value.nama_lengkap = existingRequest.value.nama_lengkap || '';
    form.value.tempat_lahir = existingRequest.value.tempat_lahir || '';
    form.value.tanggal_lahir = existingRequest.value.tanggal_lahir || '';
    form.value.jenis_kelamin = existingRequest.value.jenis_kelamin || '';
    form.value.alamat_ktp = existingRequest.value.alamat_ktp || '';
    form.value.foto_ktp = null; // Foto tetep harus upload ulang ya
  }
  isReapplying.value = true;
};

// Fungsi utama buat ngirim pendaftaran jadi seller ke server
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
      formData.append('foto_profil', form.value.foto_ktp);
    }

    await api.post('/requestseller', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    showSuccess('Sip! Pendaftaran kamu udah kekirim. Doain ya!');

    // Bersihin form-nya
    form.value = {
      note: '', nik: '', nama_lengkap: '', tempat_lahir: '',
      tanggal_lahir: '', jenis_kelamin: '', alamat_ktp: '', foto_ktp: null,
    };

    isReapplying.value = false;

    // Cek ulang status biar tampilannya update jadi pending
    await checkExistingRequest();
  } catch (error) {
    console.error('Gagal daftar nih:', error)
    showError(error.response?.data?.message || 'Yah, gagal ngirim pendaftaran.');
  }
}

// Pas halaman dibuka, langsung cek status pendaftaran
onMounted(() => {
  checkExistingRequest();
});
</script>
