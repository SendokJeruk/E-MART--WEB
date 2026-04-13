<template>
  <sellerside>
    <!-- Halaman Manajemen Produk: Tempat penjual melihat dan mencari produk miliknya sendiri -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 class="text-2xl md:text-3xl navbar-font text-gray-800">Manage Produk</h1>
      </div>

      <!-- KOTAK PENCARIAN PRODUK -->
      <div class="mb-4 flex gap-3">
        <input v-model="searchQuery" @keyup.enter="searchProduct" type="text" placeholder="Cari produk Anda..." class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#7D0A0A]" />
        <button @click="searchProduct" class="px-6 py-2 bg-[#7D0A0A] text-white rounded-lg">Cari</button>
      </div>

      <!-- TOMBOL AKSI CEPAT -->
      <div class="flex flex-wrap gap-3 mb-5">
        <router-link to="/create-produk" class="px-5 py-2 border border-[#7D0A0A] text-[#7D0A0A] rounded-lg font-medium hover:bg-[#7D0A0A] hover:text-white transition">
          + Tambah Produk
        </router-link>
        <router-link to="/manage-foto-product" class="px-5 py-2 border border-gray-400 text-gray-600 rounded-lg">
          Kelola Foto
        </router-link>
      </div>

      <!-- TABEL DAFTAR PRODUK -->
      <div class="overflow-x-auto rounded-lg shadow border">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-100 text-gray-700">
            <tr>
              <th class="px-4 py-3">Nama Produk</th>
              <th class="px-4 py-3">Harga</th>
              <th class="px-4 py-3">Stok</th>
              <th class="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          
          <tbody v-if="isLoading" class="divide-y"><tr v-for="n in 3" :key="n"><td colspan="4" class="p-4"><Skeleton width="100%" height="20px"/></td></tr></tbody>

          <tbody v-else class="divide-y">
            <tr v-for="p in product" :key="p.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">{{ p.nama_product }}</td>
              <td class="px-4 py-3">Rp {{ Number(p.harga).toLocaleString('id-ID') }}</td>
              <td class="px-4 py-3">{{ p.stock }}</td>
              <td class="px-4 py-3 flex gap-2">
                <router-link :to="`/edit-produk/${p.id}`" class="text-yellow-600 font-bold">Edit</router-link>
                <button @click="deleteProduct(p.id)" class="text-red-600 font-bold">Hapus</button>
              </td>
            </tr>
            <tr v-if="!product.length"><td colspan="4" class="p-10 text-center text-gray-400">Belum ada produk.</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </sellerside>
</template>

<script setup>
import sellerside from '@/components/navbar/seller-side.vue';
import { ref, onMounted } from 'vue';
import api from "@/plugins/axios";
import Skeleton from '@/components/Skeleton.vue';
import { showSuccess, showError, showConfirm } from '@/utils/alert';

const product = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');

/**
 * Mengambil daftar produk milik seller yang sedang login.
 */
const getProduct = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/product/myproducts', { params: { myproducts: true, nama_product: searchQuery.value } });
    product.value = res.data.data.data || [];
  } finally { isLoading.value = false; }
};

const searchProduct = () => { getProduct() };

/**
 * Menghapus produk setelah konfirmasi.
 */
const deleteProduct = async (id) => {
  if (!await showConfirm('Hapus produk ini secara permanen?')) return;
  try {
    await api.delete(`/product/${id}`);
    showSuccess('Produk dihapus!'); getProduct();
  } catch (e) { showError('Gagal menghapus produk') }
};

onMounted(() => { getProduct() });
</script>
