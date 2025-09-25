<template>
  <Navbar />

  <div class="p-4 bg-[#FFF5F5] min-h-screen">
    <h1 class="text-xl font-bold navbar-font mb-4 text-black">| List Transaksi</h1>

    <div v-if="transaksiList.length" class="space-y-4">
      <div
        v-for="trx in transaksiList"
        :key="trx.id"
        class="bg-white rounded-lg shadow p-4 border"
      >
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
            <button
              @click="deleteProductscheckout(trx.kode_transaksi)"
              class="text-red-500 text-xs"
            >
              Hapus Transaksi
            </button>
          </div>
        </div>

        <div class="border-t pt-3 mt-3 text-sm flex justify-between font-semibold">
          <span>Total Harga</span>
          <span class="text-[#7D0A0A]">Rp {{ formatRupiah(trx.total_harga) }}</span>
        </div>

        <div class="mt-4">
        <router-link
          :to="{ name: 'checkout', params: { kode: trx.kode_transaksi } }"
          class="block w-full text-center py-2 bg-[#BF3131] text-white rounded-md hover:bg-[#a32727] transition"
        >
          Lanjut ke Checkout
        </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-20">
      Tidak ada transaksi yang belum selesai.
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/plugins/axios';

const route = useRoute();
const transaksiList = ref([]);

const getTransaksi = async () => {
  try {
    const response = await api.get('/transaction');
    const allData = response.data?.data?.data ?? []; 

    transaksiList.value = allData.filter(trx => trx.status !== 'success');
  } catch (error) {
    console.error('Gagal mengambil data transaksi:', error);
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
