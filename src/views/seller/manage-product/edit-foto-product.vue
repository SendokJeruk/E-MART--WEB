<template>
  <sellerside>
    <!-- Halaman Edit Foto: Digunakan seller untuk memperbarui file gambar yang sudah ada di galeri -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Ganti Foto Galeri</h2>
      
      <form @submit.prevent="submitForm">
        <!-- Info Produk Terkait (Tidak bisa diubah di sini) -->
        <div class="mb-4">
          <label class="block mb-1 navbar-font">Produk Terkait</label>
          <input type="text" :value="search" class="w-full border px-3 py-2 rounded bg-gray-50" disabled />
        </div>

        <!-- Input Unggah File Baru -->
        <div class="mb-4">
          <label class="block rounded border border-gray-300 p-4 text-center cursor-pointer">
            <span class="navbar-font">Pilih Foto Baru</span>
            <div v-if="selectedFileName" class="text-xs text-green-600 mt-1">{{ selectedFileName }}</div>
            <input type="file" @change="handleFileUpload" class="sr-only" required />
          </label>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold">Simpan Perubahan</button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import { showError, showSuccess } from '@/utils/alert'

const route = useRoute()
const router = useRouter()
const search = ref('')
const selectedFileName = ref('')
const form = ref({ foto: null })

/**
 * Mengambil nama produk terkait untuk ditampilkan sebagai informasi.
 */
const getInitialInfo = async () => {
  try {
    const res = await api.get(`/foto-product/${route.params.id}`);
    search.value = res.data.data.product.nama_product;
  } catch (e) {}
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]; if (file) { form.value.foto = file; selectedFileName.value = file.name; }
}

/**
 * Fungsi Submit: Mengirim file foto baru untuk menindih foto lama berdasarkan ID.
 */
const submitForm = async () => {
  try {
    const fd = new FormData();
    fd.append('foto', form.value.foto);
    fd.append('_method', 'PUT'); // Metode Update Laravel

    await api.post(`/foto/${route.params.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    showSuccess('Foto berhasil diperbarui!'); router.push('/manage-foto-product');
  } catch (error) { showError('Gagal memperbarui foto.') }
}

onMounted(() => { getInitialInfo() })
</script>
