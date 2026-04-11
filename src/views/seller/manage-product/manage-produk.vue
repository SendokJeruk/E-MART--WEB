<template>
  <sellerside>
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 class="text-2xl md:text-3xl navbar-font text-gray-800">
          Manage Produk
        </h1>
      </div>

      <!-- SEARCH BAR -->
      <div class="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="searchProduct"
          placeholder="Cari produk..."
          class="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7D0A0A]"
        />
        <button
          @click="searchProduct"
          class="w-full sm:w-auto px-4 py-2 bg-[#7D0A0A] text-white text-sm font-medium rounded-lg hover:bg-[#5C0707] transition"
        >
          Cari
        </button>
      </div>

      <!-- BUTTONS -->
      <div class="flex flex-wrap gap-3 mb-5">
        <router-link
          to="/create-produk"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg"
        >
          <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"></span>
          <span class="relative text-sm font-medium text-[#7D0A0A] group-hover:text-white navbar-font">
            Tambah Produk
          </span>
        </router-link>

        <router-link
          to="/manage-foto-product"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg"
        >
          <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"></span>
          <span class="relative text-sm font-medium text-[#7D0A0A] group-hover:text-white navbar-font">
            Manage Foto
          </span>
        </router-link>
      </div>

      <!-- ================= LOADING ================= -->
      <template v-if="isLoading">
        <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table class="min-w-[700px] w-full table-auto">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-sm">Nama</th>
                <th class="px-4 py-3 text-left text-sm">Harga</th>
                <th class="px-4 py-3 text-left text-sm">Stok</th>
                <th class="px-4 py-3 text-left text-sm">Status</th>
                <th class="px-4 py-3 text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in 6" :key="n" class="border-t">
                <td class="px-4 py-3"><Skeleton width="120px" height="14px" /></td>
                <td class="px-4 py-3"><Skeleton width="80px" height="14px" /></td>
                <td class="px-4 py-3"><Skeleton width="40px" height="14px" /></td>
                <td class="px-4 py-3"><Skeleton width="80px" height="14px" /></td>
                <td class="px-4 py-3 flex gap-2">
                  <Skeleton width="60px" height="30px" />
                  <Skeleton width="60px" height="30px" />
                  <Skeleton width="60px" height="30px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ================= DATA ================= -->
      <template v-else-if="product.length">
        <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
          <table class="min-w-[700px] w-full table-auto divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-3 text-left text-xs md:text-sm text-gray-700 navbar-font whitespace-nowrap">Nama</th>
                <th class="px-4 py-3 text-left text-xs md:text-sm text-gray-700 navbar-font whitespace-nowrap">Harga</th>
                <th class="px-4 py-3 text-left text-xs md:text-sm text-gray-700 navbar-font whitespace-nowrap">Stok</th>
                <th class="px-4 py-3 text-left text-xs md:text-sm text-gray-700 navbar-font whitespace-nowrap">Status</th>
                <th class="px-4 py-3 text-left text-xs md:text-sm text-gray-700 navbar-font whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr
                v-for="produk in product"
                :key="produk.id"
                class="hover:bg-gray-50 transition"
              >
                <td class="px-4 py-3 text-xs md:text-sm whitespace-nowrap">
                  {{ produk.nama_product }}
                </td>
                <td class="px-4 py-3 text-xs md:text-sm whitespace-nowrap">
                  Rp {{ Number(produk.harga).toLocaleString('id-ID') }}
                </td>
                <td class="px-4 py-3 text-xs md:text-sm whitespace-nowrap">
                  {{ produk.stock }}
                </td>
                <td class="px-4 py-3 text-xs md:text-sm whitespace-nowrap">
                  <span
                    class="px-2 py-1 rounded-full text-xs font-medium"
                    :class="produk.status_produk === 'Aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'"
                  >
                    {{ produk.status_produk }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <div class="flex flex-wrap gap-2">
                    <button
                      @click="openDetail(produk)"
                      class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      Detail
                    </button>
                    <router-link
                      :to="`/edit-produk/${produk.id}`"
                      class="px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </router-link>
                    <button
                      @click="deleteProduct(produk.id)"
                      class="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- PAGINATION -->
          <div
            v-if="product.length"
            class="flex flex-wrap justify-center items-center gap-2 mt-4 mb-4"
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
      </template>

      <!-- ================= EMPTY ================= -->
      <template v-else>
        <div class="text-center py-20 text-gray-400">
          Belum ada produk
        </div>
      </template>

      <!-- ================= MODAL DETAIL ================= -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      >
        <div
          class="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <!-- Modal Header -->
          <div class="p-4 border-b flex justify-between items-center bg-gray-50">
            <h2 class="text-lg md:text-xl font-bold text-gray-800 navbar-font">
              Detail Produk
            </h2>
            <button
              @click="closeDetail"
              class="text-gray-500 hover:text-red-500 transition"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div
            class="p-6 overflow-y-auto flex-1"
            v-if="selectedProduct"
          >
            <div class="flex flex-col md:flex-row gap-6">
              <div class="w-full md:w-1/3">
                <img
                  :src="selectedProduct.foto_cover"
                  class="w-full aspect-square object-cover rounded-lg shadow-sm border"
                  alt="Foto Produk"
                />
              </div>

              <div class="w-full md:w-2/3 space-y-4">
                <div>
                  <h3 class="text-xs text-gray-500 uppercase">Nama Produk</h3>
                  <p class="text-base md:text-lg font-medium text-gray-900">
                    {{ selectedProduct.nama_product }}
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <h3 class="text-xs text-gray-500 uppercase">Harga</h3>
                    <p class="text-sm md:text-base">
                      Rp {{ Number(selectedProduct.harga).toLocaleString('id-ID') }}
                    </p>
                  </div>
                  <div>
                    <h3 class="text-xs text-gray-500 uppercase">Stok</h3>
                    <p class="text-sm md:text-base">
                      {{ selectedProduct.stock }}
                    </p>
                  </div>
                  <div>
                    <h3 class="text-xs text-gray-500 uppercase">Status</h3>
                    <span
                      class="px-2 py-1 rounded-full text-xs font-medium"
                      :class="selectedProduct.status_produk === 'Aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'"
                    >
                      {{ selectedProduct.status_produk }}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="text-xs text-gray-500 uppercase mb-1">Deskripsi</h3>
                  <div class="bg-gray-50 p-3 rounded border text-sm text-gray-700 whitespace-pre-wrap">
                    {{ selectedProduct.deskripsi || '-' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t bg-gray-50 flex justify-end">
            <button
              @click="closeDetail"
              class="px-5 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition"
            >
              Tutup
            </button>
          </div>
        </div>
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
const user = ref({});
const isLoading = ref(true);
const currentPage = ref(1);
const lastPage = ref(1);
const searchQuery = ref(''); 

// Modal State
const isModalOpen = ref(false);
const selectedProduct = ref(null);

const openDetail = (produk) => {
  selectedProduct.value = produk;
  isModalOpen.value = true;
};

const closeDetail = () => {
  isModalOpen.value = false;
  selectedProduct.value = null;
};

const deleteProduct = async (id) => {
  const konfirmasi = await showConfirm('Yakin ingin menghapus Produk ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/product/${id}`);
    product.value = product.value.filter(p => p.id !== id);
    showSuccess('Produk berhasil dihapus.');
    await getProduct();
  } catch (error) {
    console.error('Gagal menghapus produk:', error);
    showError(error.response?.data?.message || 'Terjadi kesalahan saat menghapus produk.');
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
    const response = await api.get('/product/myproducts', {
      params: { myproducts: true, page }
    });

    if (response.data.data && Array.isArray(response.data.data.data)) {
      product.value = response.data.data.data;
      currentPage.value = response.data.data.current_page;
      lastPage.value = response.data.data.last_page;
    } else {
      product.value = [];
      console.warn("Tidak ada produk:", response.data.message || "No Data");
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    product.value = [];
  } finally {
    isLoading.value = false;
  }
};

const searchProduct = async (page = 1) => {
  isLoading.value = true;
  try {
    const response = await api.get('/product/myproducts', {
      params: { myproducts: true, page, nama_product: searchQuery.value }
    });

    if (response.data.data && Array.isArray(response.data.data.data)) {
      product.value = response.data.data.data;
      currentPage.value = response.data.data.current_page;
      lastPage.value = response.data.data.last_page;
    } else {
      product.value = [];
      console.warn("Tidak ada produk:", response.data.message || "No Data");
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    product.value = [];
  } finally {
    isLoading.value = false;
  }
};

const changePage = async (page) => {
  if (page < 1 || page > lastPage.value) return;

  if (searchQuery.value) {
    await searchProduct(page); 
  } else {
    await getProduct(page);
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

th,
td {
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

  