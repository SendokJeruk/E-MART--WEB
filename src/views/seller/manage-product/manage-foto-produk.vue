<template>
  <sellerside>
    <div class="p-6 overflow-x-auto">
        
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl navbar-font">Manage Foto Produk</h1>

          <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
            <div class="flex-1">
              <p class="text-sm font-bold inter-font">{{ user.name }}</p>
              <p class="text-xs text-gray-600 inter-font">{{ user.email }}</p>
            </div>
            <img :src="user?.foto_profil || 'https://placehold.co/100'" class="w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        </div>

        <router-link
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5 ml-2"
          to="/create-foto-product"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"
          ></span>

          <span
            class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white navbar-font"
          >
            Tambah Foto Produk
          </span>
        </router-link>

        <router-link
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 focus:ring-2 focus:ring-[#BF3131] focus:outline-none mb-5 ml-2"
          to="/manage-produk"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"
          ></span>

          <span
            class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white navbar-font"
          >
            Manage Product
          </span>
        </router-link>

        <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-fixed divide-y divide-gray-200">
            <thead class="bg-gray-200">
            <tr>
                <th class="w-1/6 px-4 py-2 text-left text-sm text-gray-700 navbar-font">Nama</th>
                <th class="w-1/6 px-4 py-2 text-left text-sm text-gray-700 navbar-font">Foto</th>

            </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
            <tr v-for="produk in ProductSeller" :key="produk.id">
                <td class="px-4 py-2 text-sm text-gray-900 inter-font">{{ produk.nama_product }}</td>
                <td class="px-4 py-2 text-sm text-gray-900 max-w-[200px]">
                <div v-if="Array.isArray(produk.foto) && produk.foto.length > 0" class="overflow-x-auto">
                    <div class="flex w-max">
                        <div 
                            v-for="(item, index) in produk.foto" 
                            :key="index" 
                            class="text-center flex-shrink-0 relative"
                            :class="openMenuIndex === `${produk.id}-${index}` ? 'mr-20' : 'mr-2'" 
                            >
                            <img 
                                :src="item.foto" 
                                alt="foto produk" 
                                class="w-16 h-16 object-cover rounded mb-1 cursor-pointer"
                                @click="toggleMenu(produk.id, index)"
                            />

                            <div 
                                v-if="openMenuIndex === `${produk.id}-${index}`" 
                                class="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 bg-white border shadow-md rounded p-2 space-y-2 z-20"
                            >
                                <router-link :to="`/edit-foto-product/${item.id}`" class="block w-full text-sm text-yellow-600 hover:underline inter-font">
                                Edit
                                </router-link>
                                <button @click="deleteFoto(item.id)" class="block w-full text-sm text-red-600 hover:underline inter-font">
                                    Hapus
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
                <div v-else>
                    <p class="text-sm text-gray-500">Tidak ada foto</p>
                </div>
            </td>
            </tr>
            </tbody>
            </table>
              <div class="flex justify-center mt-4 space-x-2 mb-4">
                <button
                  @click="changePage(currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  v-for="page in lastPage"
                  :key="page"
                  @click="changePage(page)"
                  :class="['px-3 py-1 rounded', page === currentPage ? 'bg-[#7D0A0A] text-white' : 'bg-gray-200 text-gray-700']"
                >
                  {{ page }}
                </button>

                <button
                  @click="changePage(currentPage + 1)"
                  :disabled="currentPage === lastPage"
                  class="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
        </div>
      </div>
  </sellerside>
</template>

<script setup>
import Sellerside from '@/components/navbar/seller-side.vue';
import api from "@/plugins/axios";
import { showError, showSuccess, showConfirm } from '@/utils/alert';
import { ref, onMounted } from "vue";

const user = ref({});
const ProductSeller = ref([]);
const openMenuIndex = ref(null);

const currentPage = ref(1);
const lastPage = ref(1);

const toggleMenu = (produkId, fotoIndex) => {
  const id = `${produkId}-${fotoIndex}`;
  openMenuIndex.value = openMenuIndex.value === id ? null : id;
};

const deleteFoto = async (id) => {
  const konfirmasi = await showConfirm('Yakin ingin menghapus Foto Ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/foto/${id}`);
    showSuccess('Foto berhasil dihapus.');
    await getProduct(currentPage.value);
  } catch (error) {
    console.error('Gagal Menghapus Foto:', error);
    showError('Gagal menghapus foto.');
  }
};

const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  }
};

const getProduct = async (page = 1) => {
  try {
    const response = await api.get(`/product/myproducts?page=${page}`);
    ProductSeller.value = response.data.data.data;
    console.log(ProductSeller.value);
    currentPage.value = response.data.data.current_page;
    lastPage.value = response.data.data.last_page;
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};

const changePage = async (page) => {
  if (page < 1 || page > lastPage.value) return;
  await getProduct(page);
};

onMounted(async () => {
  await getProfile();
  await getProduct();
});
</script>

<style>

</style>