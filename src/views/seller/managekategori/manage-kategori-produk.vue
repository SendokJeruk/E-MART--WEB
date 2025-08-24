<template>
  <sellerside>
    <div class="p-6 overflow-x-auto">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manage Kategori Produk</h1>

        <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://via.placeholder.com/100'" class="w-10 h-10 bg-gray-300 rounded-full" />
        </div>
      </div>


      <router-link
        class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5 ml-2"
        to="/create-kategori-produk"
      >
        <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"></span>
        <span class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white">
          Tambah Kategori Produk
        </span>
      </router-link>

      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-fixed divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Nama Produk</th>
              <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Kategori</th>
              <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in ProductSeller" :key="item.id">
              <td class="px-4 py-2 text-sm text-gray-900">{{ item.nama_product }}</td>
              <td class="px-4 py-2 text-sm text-gray-900">
                <ul>
                  <li v-for="category in item.categories" :key="category.id">{{ category.nama_category }}</li>
                </ul>
              </td>
              <td class="px-4 py-2 text-sm text-gray-900">
                <div v-for="category in item.categories" :key="category.id">
                  <button
                    @click="deleteCategoryProduct(item.id, category.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mb-2 ml-3"
                  >
                    Hapus
                  </button>
                  <router-link
                    :to="`/edit-kategori-produk/${item.id}`"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mb-2 ml-3"
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
const user = ref({});
const ProductSeller = ref([]);

const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  }
};

const getProduct = async () => {
  try {
    const response = await api.get('/product');
    const allProducts = response.data.data.data;
    product.value = allProducts;
    ProductSeller.value = allProducts.filter(p => p.user_id === user.value.id);
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};

const deleteCategoryProduct = async (productId, categoryId) => {
  const konfirmasi = confirm('Yakin ingin menghapus kategori ini dari produk ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/category-product/${productId}/${categoryId}`);
    await getProduct();
    alert('Kategori berhasil dihapus dari produk.');
  } catch (error) {
    console.error('Gagal menghapus kategori dari produk:', error);
    alert(error.response?.data?.message || 'Terjadi kesalahan.');
  }
};

onMounted(async () => {
  await getProfile();
  await getProduct();
});
</script>
