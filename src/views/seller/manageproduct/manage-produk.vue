<template>
    <sellerside>
      <div class="p-6 overflow-x-auto">
        <h1 class="text-3xl font-bold mb-6">Manage Produk</h1>
        <router-link
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5 ml-2"
          to="/create-produk"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"
          ></span>

          <span
            class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white"
          >
            Tambah Produk
          </span>
        </router-link>

        <router-link
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5 ml-2"
          to="/manage-foto-product"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"
          ></span>

          <span
            class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white"
          >
            Manage Foto
          </span>
        </router-link>
  
      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-fixed divide-y divide-gray-200">
            <thead class="bg-gray-200">
            <tr>
                <th class="w-1/6 px-4 py-2 text-left text-sm font-semibold text-gray-700">Nama</th>
                <th class="w-1/6 px-4 py-2 text-left text-sm font-semibold text-gray-700">Deskripsi</th>
                <th class="w-1/12 px-4 py-2 text-left text-sm font-semibold text-gray-700">Harga</th>
                <th class="w-1/12 px-4 py-2 text-left text-sm font-semibold text-gray-700">Stok</th>
                <th class="w-1/6 px-4 py-2 text-left text-sm font-semibold text-gray-700">Foto</th>
                <th class="w-1/12 px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                <th class="w-1/6 px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
            <tr v-for="produk in ProductSeller" :key="produk.id">
                <td class="px-4 py-2 text-sm text-gray-900">{{ produk.nama_product }}</td>
                <td class="px-4 py-2 text-sm text-gray-900 truncate max-w-[200px]">{{ produk.deskripsi }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ produk.harga }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ produk.stock }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">
                <img :src="produk.foto_cover" alt="cover" class="w-16 h-16 object-cover rounded" />
                </td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ produk.status_produk }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">
                  <button
                  @click="deleteProduct(produk.id)"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-2 ml-3"
                >
                  Hapus
                </button>
                <div>
                  <router-link
                  class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mb-2 ml-3"
                  :to="`/edit-produk/${produk.id}`"
                >
                  Edit
                </router-link>
                </div>
                </td>
                </tr>
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

const product = ref([]);
const user = ref({})
const ProductSeller = ref([]);

const deleteProduct = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus Produk ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/product/${id}`);
    product.value = product.value.filter(product => product.id !== id);
    alert('product berhasil dihapus.');
    await getProduct();
  } catch (error) {
    console.error('Gagal menghapus product:', error);
    alert(error.response?.data?.message || 'Terjadi kesalahan saat menghapus product.');
  }
};

const getProfile = async () => {
    try {
      const response = await api.get('/profile')
      user.value = response.data.data 
    } catch (error) {
      console.error('Gagal mengambil profil:', error)
    }
  }

  const getProduct = async () => {
  try {
    const response = await api.get('/product');
    if (Array.isArray(response.data.data.data)) {
      product.value = response.data.data.data;
      ProductSeller.value = product.value.filter(p => p.user_id === user.value.id);
    } else {
      console.error("Data Produk tidak berupa array:", response.data.data.data);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};

onMounted(async () => {
  await getProfile(); 
  await getProduct(); 
});
</script>

  
  <style scoped>
  table {
    border-collapse: collapse;
  }
  
  th, td {
    text-align: left;
  }
  
  @media (max-width: 768px) {
    table {
      width: 100%;
      display: block;
      overflow-x: auto;
    }
  }
  </style>
  