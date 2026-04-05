<template>
  <Navbar />

  <div class="p-4 bg-[#FFF5F5] min-h-screen">
    <h1 class="text-xl font-bold navbar-font mb-4 text-black">| List Transaksi</h1>

    <div v-if="isLoading" class="space-y-4">

      <div
        v-for="n in 3"
        :key="n"
        class="bg-white rounded-lg shadow p-4 border"
      >
        <!-- Skeleton Header Transaksi -->
        <div class="flex justify-between items-center border-b pb-2 mb-3">
          <Skeleton width="120px" height="16px" />
          <Skeleton width="90px" height="16px" />
        </div>

        <div class="space-y-3">

          <div
            v-for="i in 2"
            :key="i"
            class="flex items-center gap-4"
          >

            <!-- gambar -->
            <Skeleton width="64px" height="64px" />

            <!-- text -->
            <div class="flex-1 space-y-2">
              <Skeleton height="16px" width="60%" />
              <Skeleton height="12px" width="40%" />
              <Skeleton height="12px" width="50%" />
            </div>

          </div>
        </div>

        <div class="border-t pt-3 mt-3 flex justify-between items-center">
          <Skeleton width="80px" height="16px" />
          <Skeleton width="130px" height="24px" />
        </div>

        <div class="mt-4">
          <Skeleton width="100%" height="44px" />
        </div>
      </div>

    </div>

    <div v-if="transaksiList.length" class="space-y-4">
      <div
        v-for="trx in transaksiList"
        :key="trx.id"
        class="bg-white rounded-lg shadow p-4 border"
      >
        <!-- Header Transaksi -->
        <div class="flex justify-between items-center border-b pb-2 mb-3">
          <span class="text-xs font-semibold text-gray-500">Kode Transaksi : {{ trx.kode_transaksi }}</span>
          <button
            @click="deleteProductscheckout(trx.kode_transaksi)"
            class="text-red-500 text-xs hover:text-red-700 font-medium"
          >
            Batalkan Transaksi
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in trx.detail_transaction"
            :key="item.id"
            class="flex items-center gap-4"
          >
            <img
              :src="item.product?.foto_cover"
              alt="Produk"
              class="w-16 h-16 object-cover rounded border"
            />
            <div class="flex-1">
              <p class="font-medium">{{ item.product?.nama_product }}</p>
              <p class="text-xs text-gray-500">Jumlah: {{ item.jumlah }}</p>
              <p class="text-xs text-gray-500">Harga: Rp {{ formatRupiah(item.harga) }}</p>
            </div>
          </div>
        </div>

        <div class="border-t pt-3 mt-3 text-sm flex justify-between items-center font-semibold">
          <span class="text-gray-600">Total Harga</span>
          <span class="text-[#7D0A0A] text-lg">Rp {{ formatRupiah(trx.total_harga) }}</span>
        </div>

        <div class="mt-4">
        <router-link
          :to="{ name: 'checkout', params: { kode: trx.kode_transaksi } }"
          class="block w-full text-center py-2.5 bg-[#BF3131] text-white rounded-md hover:bg-[#a32727] transition font-medium"
        >
          Lanjut ke Checkout
        </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-20">
      Tidak ada transaksi yang belum selesai.
    </div>

    <!-- PAGINATION -->
    <div v-if="pagination.last_page > 1" class="flex justify-center mt-6 space-x-2">
      <button
        @click="changePage(pagination.current_page - 1)"
        :disabled="pagination.current_page === 1"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <button
        v-for="page in pagination.last_page"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-4 py-2 rounded',
          page === pagination.current_page
            ? 'bg-[#7D0A0A] text-white'
            : 'bg-gray-200 text-gray-700'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(pagination.current_page + 1)"
        :disabled="pagination.current_page === pagination.last_page"
        class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>

  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/plugins/axios';
import Skeleton from '@/components/Skeleton.vue';

const route = useRoute();
const transaksiList = ref([]);
const isLoading = ref(true);

const pagination = ref({
  current_page: 1,
  last_page: 1,
});

const getTransaksi = async (page = 1) => {
  try {
    isLoading.value = true;
    const response = await api.get('/transaction?uncompleted',{
      params: { page }
    });
    console.log(response)
    const allData = response.data?.data?.data ?? []; 
    console.log('Data transaksi:', allData);
    transaksiList.value = allData;

    pagination.value.current_page = response.data?.data?.current_page || 1;
    pagination.value.last_page = response.data?.data?.last_page || 1;

  } catch (error) {
    console.error('Gagal mengambil data transaksi:', error);
  } finally {
    isLoading.value = false;
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.last_page) {
    getTransaksi(page);
  }
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value).replace("Rp", "").trim();
};

const deleteProductscheckout = async (kodeTransaksi) => {
  if (!confirm('Yakin ingin menghapus transaksi ini?')) return;
  try {
    await api.delete(`/transaction/${kodeTransaksi}`);
    await getTransaksi();
  } catch (error) {
    console.error('Gagal menghapus transaksi:', error);
  }
};

onMounted(() => {
  getTransaksi();
});
</script>
