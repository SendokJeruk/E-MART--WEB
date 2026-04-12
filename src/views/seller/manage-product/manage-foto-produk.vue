<template>
  <sellerside>
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">
 
      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl navbar-font text-gray-800">
          Manage Foto Produk
        </h1>
      </div>
 
      <!-- NAVIGATION BUTTONS -->
      <div class="flex flex-wrap gap-3 mb-5">
        <router-link
          to="/create-foto-product"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg focus:ring-2 focus:ring-[#BF3131] focus:outline-none"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all duration-200 group-hover:h-full"
          ></span>
          <span
            class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white navbar-font"
          >
            Tambah Foto Produk
          </span>
        </router-link>
 
        <router-link
          to="/manage-produk"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg focus:ring-2 focus:ring-[#BF3131] focus:outline-none"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all duration-200 group-hover:h-full"
          ></span>
          <span
            class="relative text-sm font-medium text-[#7D0A0A] transition-colors group-hover:text-white navbar-font"
          >
            Manage Product
          </span>
        </router-link>
      </div>
 
      <!-- TABLE -->
      <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-[600px] w-full table-auto divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs md:text-sm text-gray-700 navbar-font whitespace-nowrap">
                Nama Produk
              </th>
              <th class="px-4 py-3 text-left text-xs md:text-sm text-gray-700 navbar-font whitespace-nowrap">
                Foto
              </th>
            </tr>
          </thead>
 
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="produk in ProductSeller"
              :key="produk.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- NAMA PRODUK -->
              <td class="px-4 py-3 text-xs md:text-sm text-gray-900 inter-font whitespace-nowrap">
                {{ produk.nama_product }}
              </td>
 
              <!-- FOTO PRODUK -->
              <td class="px-4 py-3">
                <div
                  v-if="Array.isArray(produk.foto) && produk.foto.length > 0"
                  class="overflow-x-auto"
                >
                  <div class="flex gap-2 w-max">
                    <div
                      v-for="(item, index) in produk.foto"
                      :key="item.id"
                      class="relative flex-shrink-0"
                    >
                      <img
                        :src="item.foto"
                        alt="foto produk"
                        class="w-16 h-16 md:w-20 md:h-20 object-cover rounded cursor-pointer border"
                        @click="toggleMenu(produk.id, index)"
                      />
 
                      <!-- MENU AKSI - HORIZONTAL DI KANAN -->
                      <div
                        v-if="openMenuIndex === `${produk.id}-${index}`"
                        class="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-white border shadow-lg rounded-md p-2 space-x-2 z-20 flex whitespace-nowrap"
                      >
                        <router-link
                          :to="`/edit-foto-product/${item.id}`"
                          class="text-xs md:text-sm text-yellow-600 hover:underline inter-font px-2 py-1"
                        >
                          Edit
                        </router-link>
                        <button
                          @click="deleteFoto(item.id)"
                          class="text-xs md:text-sm text-red-600 hover:underline inter-font px-2 py-1"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
 
                <div v-else>
                  <p class="text-xs md:text-sm text-gray-500">
                    Tidak ada foto
                  </p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
 
        <!-- PAGINATION -->
        <div
          class="flex flex-wrap justify-center items-center gap-2 mt-4 mb-4 px-2"
        >
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-xs md:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
 
          <button
            v-for="page in lastPage"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 text-xs md:text-sm rounded',
              page === currentPage
                ? 'bg-[#7D0A0A] text-white'
                : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ page }}
          </button>
 
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-3 py-1 text-xs md:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50"
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