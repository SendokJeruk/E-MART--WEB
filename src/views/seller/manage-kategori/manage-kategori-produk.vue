<template>
  <sellerside>
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 class="text-2xl md:text-3xl navbar-font text-gray-800">
          Manage Kategori Produk
        </h1>
      </div>

      <!-- BUTTON TAMBAH KATEGORI -->
      <div class="flex flex-wrap gap-3 mb-5">
        <router-link
          to="/create-kategori-produk"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg focus:ring-2 focus:ring-[#BF3131] focus:outline-none"
        >
          <span
            class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all duration-200 group-hover:h-full"
          ></span>
          <span
            class="relative text-sm navbar-font text-[#7D0A0A] transition-colors group-hover:text-white"
          >
            Tambah Kategori Produk
          </span>
        </router-link>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-[600px] w-full table-auto divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs md:text-sm navbar-font text-gray-700 whitespace-nowrap">
                Produk
              </th>
              <th class="px-4 py-3 text-left text-xs md:text-sm navbar-font text-gray-700 whitespace-nowrap">
                Kategori
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="produk in groupedProducts"
              :key="produk.id"
              class="hover:bg-gray-50 transition"
            >
              <!-- NAMA PRODUK -->
              <td class="px-4 py-3 text-xs md:text-sm text-gray-900 inter-font whitespace-nowrap">
                {{ produk.nama }}
              </td>

              <!-- KATEGORI -->
              <td class="px-4 py-3 text-xs md:text-sm text-gray-900 inter-font">
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="kategori in produk.categories"
                    :key="kategori.id"
                    class="px-2 py-1 bg-gray-200 text-xs md:text-sm rounded flex items-center gap-1"
                  >
                    {{ kategori.nama }}
                    <button
                      @click="deleteCategoryProduct(kategori.pivotId)"
                      class="text-red-600 hover:text-red-800 text-xs ml-1"
                      aria-label="Hapus kategori"
                    >
                      ✕
                    </button>
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- PAGINATION -->
        <div
          class="flex flex-wrap justify-center items-center gap-2 mt-4 mb-4 px-2"
        >
          <!-- Previous -->
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 text-xs md:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <!-- Page Numbers -->
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

          <!-- Next -->
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
import sellerside from '@/components/navbar/seller-side.vue';
import { ref, onMounted, computed } from 'vue';
import api from "@/plugins/axios";
import { showError, showSuccess, showConfirm } from '@/utils/alert';

const user = ref({});
const allCategoryProducts = ref([]);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// ambil profile
const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  }
};

// ambil seluruh data pivot untuk digroup di frontend
const getCategoryProduct = async () => {
  try {
    let page = 1;
    let totalPages = 1;
    let allData = [];
    
    do {
      const response = await api.get(`/category-product?page=${page}`);
      allData = allData.concat(response.data.data.data);
      totalPages = response.data.data.last_page || 1;
      page++;
    } while (page <= totalPages);
    
    allCategoryProducts.value = allData;
  } catch (error) {
    console.error('Error fetching category product:', error);
  }
};

// transform → group by product (seluruh data)
const groupedProductsAll = computed(() => {
  const map = {};
  allCategoryProducts.value.forEach(item => {
    // Pastikan item.product ada
    if (!item.product) return;
    
    const p = item.product;
    if (!map[p.id]) {
      map[p.id] = {
        id: p.id,
        nama: p.nama_product,
        categories: []
      };
    }
    map[p.id].categories.push({
      id: item.category?.id,
      nama: item.category?.nama_category,
      pivotId: item.id
    });
  });
  return Object.values(map);
});

// Hitung last page berdasarkan data yang sudah di-group
const lastPage = computed(() => {
  return Math.ceil(groupedProductsAll.value.length / itemsPerPage) || 1;
});

// Data untuk page saat ini
const groupedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return groupedProductsAll.value.slice(start, start + itemsPerPage);
});

const deleteCategoryProduct = async (id) => {
  const konfirmasi = await showConfirm('Yakin ingin menghapus kategori ini dari produk ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/category-product/${id}`);
    await getCategoryProduct(); // refresh seluruh data
    
    // Sesuaikan currentPage jika data kosong di halaman terakhir
    if (currentPage.value > lastPage.value) {
      currentPage.value = lastPage.value;
    }
    showSuccess('Kategori berhasil dihapus.');
  } catch (error) {
    console.error('Gagal menghapus kategori dari produk:', error);
    showError(error.response?.data?.message || 'Terjadi kesalahan.');
  }
};

// ganti page
const changePage = (page) => {
  if (page < 1 || page > lastPage.value) return;
  currentPage.value = page;
};

onMounted(async () => {
  await getProfile();
  await getCategoryProduct();
});
</script>