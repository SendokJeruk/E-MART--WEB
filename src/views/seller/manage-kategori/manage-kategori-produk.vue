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
              <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Produk</th>
              <th class="w-1/4 px-4 py-2 text-left text-sm font-semibold text-gray-700">Kategori</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="produk in groupedProducts" :key="produk.id">
              <td class="px-4 py-2 text-sm text-gray-900">{{ produk.nama }}</td>
              <td class="px-4 py-2 text-sm text-gray-900">
                <div class="flex gap-2 flex-wrap">
                  <span 
                    v-for="kategori in produk.categories" 
                    :key="kategori.id"
                    class="px-2 py-1 bg-gray-200 text-sm rounded flex items-center gap-1"
                  >
                    {{ kategori.nama }}
                    <button 
                      @click="deleteCategoryProduct(kategori.pivotId)" 
                      class="text-red-600 hover:underline text-xs ml-1"
                    >
                      ✕
                    </button>
                  </span>
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
import { ref, onMounted, computed } from 'vue';
import api from "@/plugins/axios";

const user = ref({});
const categoryProducts = ref([]);

// ambil profile
const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  }
};

// ambil data pivot
const getCategoryProduct = async () => {
  try {
    const response = await api.get('/category-product');
    categoryProducts.value = response.data.data; 
    console.log('Data category-product:', categoryProducts.value);
  } catch (error) {
    console.error('Error fetching category product:', error);
  }
};

// transform → group by product
const groupedProducts = computed(() => {
  const map = {};
  categoryProducts.value.forEach(item => {
    const p = item.product;
    if (!map[p.id]) {
      map[p.id] = {
        id: p.id,
        nama: p.nama_product,
        categories: []
      };
    }
    map[p.id].categories.push({
      id: item.category.id,
      nama: item.category.nama_category,
      pivotId: item.id
    });
  });
  return Object.values(map);
});

const deleteCategoryProduct = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus kategori ini dari produk ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/category-product/${id}`);
    await getCategoryProduct();
    alert('Kategori berhasil dihapus.');
  } catch (error) {
    console.error('Gagal menghapus kategori dari produk:', error);
    alert(error.response?.data?.message || 'Terjadi kesalahan.');
  }
};

onMounted(async () => {
  await getProfile();
  await getCategoryProduct();
});
</script>