<template>
  <Navbar />
  <!-- Halaman Transaksi: Menampilkan daftar order yang sudah dibuat tapi belum dibayar -->
  <div class="p-4 min-h-screen">
    <h1 class="text-xl font-bold navbar-font mb-4 text-black">| Transaksi Menunggu Pembayaran</h1>

    <div v-if="isLoading" class="space-y-4"><Skeleton width="100%" height="150px" v-for="n in 2" :key="n"/></div>

    <div v-else-if="transaksiList.length" class="space-y-4">
      <div v-for="trx in transaksiList" :key="trx.id" class="bg-white rounded-lg shadow p-4 border">
        <!-- HEADER TRANSAKSI -->
        <div class="flex justify-between border-b pb-2 mb-3">
          <span class="text-xs font-bold text-gray-500 uppercase">Kode: {{ trx.kode_transaksi }}</span>
          <button @click="cancelOrder(trx.kode_transaksi)" class="text-red-500 text-xs font-bold">Batalkan</button>
        </div>

        <!-- LIST PRODUK DALAM SATU KODE TRANSAKSI -->
        <div v-for="item in trx.detail_transaction" :key="item.id" class="flex items-center gap-4 mb-3">
          <img :src="item.product?.foto_cover" class="w-16 h-16 object-cover rounded border" />
          <div class="flex-1">
            <p class="font-medium text-sm">{{ item.product?.nama_product }}</p>
            <p class="text-xs text-gray-500">{{ item.jumlah }} x Rp {{ formatRupiah(item.harga) }}</p>
          </div>
        </div>

        <div class="border-t pt-3 flex justify-between items-center">
          <span class="text-sm font-bold">Total: <span class="text-[#7D0A0A]">Rp {{ formatRupiah(trx.total_harga) }}</span></span>
          <!-- Tombol untuk melanjutkan ke proses pilih kurir & bayar -->
          <router-link :to="`/checkout/${trx.kode_transaksi}`" class="bg-[#BF3131] text-white px-4 py-2 rounded text-sm">Lanjut Bayar</router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-400">Tidak ada transaksi tertunda.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import Navbar from '@/components/navbar/navbar.vue';
import Skeleton from '@/components/Skeleton.vue';

const transaksiList = ref([]);
const isLoading = ref(true);

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v);

/**
 * Mengambil daftar transaksi yang statusnya belum selesai (uncompleted).
 */
const getTransaksi = async () => {
  try {
    const res = await api.get('/transaction?uncompleted');
    transaksiList.value = res.data?.data?.data || [];
  } finally { isLoading.value = false; }
};

const cancelOrder = async (kode) => {
  if (confirm('Yakin ingin membatalkan pesanan ini?')) {
    await api.delete(`/transaction/${kode}`); getTransaksi();
  }
};

onMounted(() => { getTransaksi(); });
</script>
