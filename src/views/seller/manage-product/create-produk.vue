<template>
  <sellerside>
    <!-- Halaman Tambah Produk: Tempat seller mengunggah barang jualan baru -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4 navbar-font">Tambah Produk Baru</h2>
      
      <form @submit.prevent="submitForm">
        <!-- Input Nama Barang -->
        <div class="mb-4">
          <label class="block mb-1 navbar-font">Nama Produk</label>
          <input v-model="form.nama_product" type="text" class="w-full border px-3 py-2 rounded inter-font" required />
        </div>

        <!-- Input Deskripsi Lengkap -->
        <div class="mb-4">
          <label class="block mb-1 navbar-font">Deskripsi</label>
          <textarea v-model="form.deskripsi" class="w-full border px-3 py-2 rounded inter-font" rows="4" required></textarea>
        </div>

        <!-- Input Harga dan Stok -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block mb-1 navbar-font">Harga (Rp)</label>
            <input v-model="form.harga" type="number" class="w-full border px-3 py-2 rounded" required />
          </div>
          <div>
            <label class="block mb-1 navbar-font">Stok Barang</label>
            <input v-model="form.stock" type="number" class="w-full border px-3 py-2 rounded" required />
          </div>
        </div>

        <!-- Input Berat (Penting untuk perhitungan ongkir otomatis) -->
        <div class="mb-4">
          <label class="block mb-1 navbar-font">Berat (Gram)</label>
          <input v-model="form.berat" type="number" class="w-full border px-3 py-2 rounded" placeholder="Contoh: 1000 untuk 1kg" required />
        </div>

        <!-- Pilihan Status: Draft (Belum tayang) atau Publish (Langsung jual) -->
        <div class="mb-4">
          <label class="block mb-1 navbar-font">Status Tayang</label>
          <select v-model="form.status" class="w-full border px-3 py-2 rounded">
            <option value="draft">Draft (Simpan saja)</option>
            <option value="publish">Publish (Tampilkan di Toko)</option>
          </select>
        </div>

        <!-- Upload Foto Sampul (Cover) Produk -->
        <div class="mb-6">
          <label class="block mb-2 font-bold">Foto Utama Produk</label>
          <input type="file" @change="e => form.foto_cover = e.target.files[0]" accept="image/*" class="w-full border p-2" required />
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
          Upload Produk
        </button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import router from '@/router'
import { showError, showSuccess } from '@/utils/alert'

const form = ref({ nama_product: '', deskripsi: '', harga: '', stock: '', berat: '', status: 'publish', foto_cover: null });

/**
 * Mengirim data produk baru ke server menggunakan FormData.
 */
const submitForm = async () => {
  const fd = new FormData();
  Object.keys(form.value).forEach(key => { if(form.value[key]) fd.append(key, form.value[key]); });

  try {
    await api.post('/product', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    showSuccess('Produk berhasil ditambahkan!'); router.push('/manage-produk');
  } catch (e) { showError('Gagal menambah produk. Cek kembali data Anda.'); }
}
</script>
