<template>
  <sellerside>

    <div class="p-6 overflow-x-auto">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manage Produk</h1>

        <div class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img
            :src="user?.foto_profil || 'https://via.placeholder.com/100'"
            class="w-10 h-10 bg-gray-300 rounded-full"
          />
        </div>
      </div>

      <!-- BUTTON -->
      <router-link
        class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 mb-5 ml-2"
        to="/create-produk"
      >
        <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"></span>
        <span class="relative text-sm font-medium text-[#7D0A0A] group-hover:text-white">
          Tambah Produk
        </span>
      </router-link>

      <router-link
        class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 mb-5 ml-2"
        to="/manage-foto-product"
      >
        <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"></span>
        <span class="relative text-sm font-medium text-[#7D0A0A] group-hover:text-white">
          Manage Foto
        </span>
      </router-link>


      <!-- ================= LOADING ================= -->
      <template v-if="isLoading">
        <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
          <table class="min-w-full table-fixed">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-4 py-2">Nama</th>
                <th class="px-4 py-2">Deskripsi</th>
                <th class="px-4 py-2">Harga</th>
                <th class="px-4 py-2">Stok</th>
                <th class="px-4 py-2">Foto</th>
                <th class="px-4 py-2">Status</th>
                <th class="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="n in 6" :key="n" class="border-t">
                <td class="px-4 py-3">
                  <Skeleton width="120px" height="14px"/>
                </td>

                <td class="px-4 py-3">
                  <Skeleton width="180px" height="14px"/>
                </td>

                <td class="px-4 py-3">
                  <Skeleton width="60px" height="14px"/>
                </td>

                <td class="px-4 py-3">
                  <Skeleton width="40px" height="14px"/>
                </td>

                <td class="px-4 py-3">
                  <Skeleton width="64px" height="64px"/>
                </td>

                <td class="px-4 py-3">
                  <Skeleton width="80px" height="14px"/>
                </td>

                <td class="px-4 py-3 flex gap-2">
                  <Skeleton width="60px" height="30px"/>
                  <Skeleton width="60px" height="30px"/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- ================= DATA ================= -->
      <template v-else-if="product.length">
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
              <tr v-for="produk in product" :key="produk.id">
                <td class="px-4 py-2 text-sm">{{ produk.nama_product }}</td>

                <td class="px-4 py-2 text-sm truncate max-w-[200px]">
                  {{ produk.deskripsi }}
                </td>

                <td class="px-4 py-2 text-sm">{{ produk.harga }}</td>

                <td class="px-4 py-2 text-sm">{{ produk.stock }}</td>

                <td class="px-4 py-2">
                  <img
                    :src="produk.foto_cover"
                    class="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td class="px-4 py-2 text-sm">
                  {{ produk.status_produk }}
                </td>

                <td class="px-4 py-2">

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
      </template>



      <!-- ================= EMPTY ================= -->
      <template v-else>
        <div class="text-center py-20 text-gray-400">
          Belum ada produk
        </div>
      </template>
    </div>
  </sellerside>
</template>
  
<script setup>
import sellerside from '@/components/navbar/seller-side.vue';
import { ref, onMounted } from 'vue';
import api from "@/plugins/axios";
import Skeleton from '@/components/Skeleton.vue';

const product = ref([]);
const user = ref({});
const isLoading = ref(true);

const deleteProduct = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus Produk ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/product/${id}`);
    product.value = product.value.filter(p => p.id !== id);
    alert('Produk berhasil dihapus.');
    await getProduct();
  } catch (error) {
    console.error('Gagal menghapus produk:', error);
    alert(error.response?.data?.message || 'Terjadi kesalahan saat menghapus produk.');
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

const getProduct = async () => {
  try {
    const response = await api.get('/product/myproducts', {
      params: { myproducts: true }
    });

    console.log("Response:", response.data);

    // kalau ada field data dan isinya array
    if (response.data.data && Array.isArray(response.data.data.data)) {
      product.value = response.data.data.data;
      console.log("Produk:", product.value);
    } else {
      // fallback kalau kosong
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

  