<template>
  <sellerside>
    <!-- Halaman Kelola Foto Produk: Seller mengunggah file gambar dan menghubungkannya ke ID produk -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Upload Foto Baru</h2>
      
      <form @submit.prevent="submitForm">
        <!-- Pencarian Produk: Seller mengetik nama produk untuk memunculkan dropdown -->
        <div class="mb-4 relative">
          <label class="block mb-1 navbar-font">Cari Produk Anda</label>
          <input type="text" v-model="search" @focus="showDropdown = true" placeholder="Ketik nama produk..." class="w-full border px-3 py-2 rounded" />
          
          <ul v-show="showDropdown && ProductSeller.length" class="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow">
            <li v-for="p in ProductSeller" :key="p.id" @mousedown="selectProduct(p)" class="px-3 py-2 hover:bg-blue-100 cursor-pointer">
              {{ p.nama_product }}
            </li>
          </ul>
        </div>

        <!-- Bagian Unggah File Gambar -->
        <div class="mb-4">
          <label class="block rounded border border-gray-300 p-4 text-center cursor-pointer">
            <span class="navbar-font">Pilih File Foto</span>
            <div v-if="selectedFileName" class="text-xs text-blue-600 mt-1">{{ selectedFileName }}</div>
            <input type="file" @change="handleFileUpload" class="sr-only" required />
          </label>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold">Upload & Hubungkan</button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import { showError, showSuccess } from '@/utils/alert'

const ProductSeller = ref([])
const search = ref('')
const showDropdown = ref(false)
const selectedFileName = ref('')
const form = ref({ foto: null, product_id: '' })

/**
 * Mengambil daftar produk milik seller untuk keperluan dropdown.
 */
const getProductList = async () => {
  const response = await api.get('/product/myproducts', { params: { myproducts: true } })
  ProductSeller.value = response.data.data.data || []
}

const selectProduct = (p) => {
  search.value = p.nama_product; form.value.product_id = p.id; showDropdown.value = false;
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]; if (file) { form.value.foto = file; selectedFileName.value = file.name; }
}

/**
 * Fungsi Submit: 
 * 1. Mengunggah foto ke server.
 * 2. Mengaitkan foto tersebut dengan produk pilihan user.
 */
const submitForm = async () => {
  if (!form.value.product_id) return showError('Pilih produk terlebih dahulu!');
  try {
    const fd = new FormData(); fd.append('foto', form.value.foto);
    const resFoto = await api.post('/foto', fd); // Simpan file
    await api.post('/foto-product', { foto_id: resFoto.data.data.id, product_id: form.value.product_id }); // Simpan relasi
    showSuccess('Foto produk berhasil ditambahkan!'); search.value = ''; selectedFileName.value = '';
  } catch (error) { showError('Gagal mengunggah foto.') }
}

onMounted(() => { getProductList() })
</script>
