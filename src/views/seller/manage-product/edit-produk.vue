<template>
  <Sellerside>
    <!-- Halaman Edit Produk: Tempat seller memperbarui informasi barang yang sudah dijual -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Form Edit Produk</h2>

      <!-- Skeleton: Tampil saat data produk sedang diambil -->
      <div v-if="isLoading" class="space-y-4"><Skeleton height="40px" v-for="n in 5" :key="n" /></div>

      <form v-else @submit.prevent="submitForm">
        <!-- Input Nama, Deskripsi, Harga, Stok, Berat -->
        <div class="mb-4"><label class="block mb-1">Nama Produk</label><input v-model="form.nama_product" type="text" class="w-full border p-2" required /></div>
        <div class="mb-4"><label class="block mb-1">Deskripsi</label><textarea v-model="form.deskripsi" class="w-full border p-2" rows="3"></textarea></div>
        
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-4"><label class="block mb-1">Harga (Rp)</label><input v-model="form.harga" type="number" class="w-full border p-2" /></div>
          <div class="mb-4"><label class="block mb-1">Stok</label><input v-model="form.stock" type="number" class="w-full border p-2" /></div>
        </div>

        <!-- Pilihan Status Tayang (Draft/Publish) -->
        <div class="mb-4">
          <label class="block mb-1">Status Produk</label>
          <select v-model="form.status" class="w-full border p-2">
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
        </div>

        <!-- Ganti Foto Sampul Produk -->
        <div class="mb-6">
          <label class="block mb-1">Ganti Foto Cover (Kosongkan jika tidak ganti)</label>
          <input type="file" @change="e => form.foto_cover = e.target.files[0]" class="w-full border p-2" />
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Perbarui Produk</button>
      </form>
    </div>
  </Sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Sellerside from '@/components/navbar/seller-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import { showError, showSuccess } from '@/utils/alert'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const form = ref({ nama_product: '', deskripsi: '', harga: '', stock: '', berat: '', status: '', foto_cover: null })

/**
 * Mengambil data produk lama berdasarkan ID dari URL.
 */
const fetchProduct = async () => {
  try {
    const res = await api.get(`/product?id=${route.params.id}`);
    const p = res.data.data.data[0];
    form.value = { nama_product: p.nama_product, deskripsi: p.deskripsi, harga: p.harga, stock: p.stock, berat: p.berat, status: p.status_produk, foto_cover: null };
  } finally { isLoading.value = false; }
};

const submitForm = async () => {
  const fd = new FormData();
  Object.keys(form.value).forEach(key => { if(form.value[key]) fd.append(key, form.value[key]); });
  fd.append('_method', 'PUT'); // Memberitahu Laravel untuk melakukan Update

  try {
    await api.post(`/product/${route.params.id}`, fd);
    showSuccess('Produk diperbarui!'); router.push('/manage-produk');
  } catch (e) { showError('Gagal memperbarui data.'); }
};

onMounted(() => { fetchProduct() })
</script>
