<template>
  <Navbar />
  <div class="flex flex-col items-center justify-center min-h-screen bg-[#FFF5F5] p-6">
    <!-- Icon Success -->
    <div class="bg-green-500 rounded-full p-4 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 5 11.586a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Kotak Putih -->
    <div class="bg-white rounded-lg shadow-md w-full max-w-lg p-6 text-center">
      <!-- Judul -->
      <h1 class="text-xl font-bold text-gray-800 mb-1">Pembayaran Berhasil</h1>
      <p class="text-lg font-semibold text-gray-700 mb-6">Rp {{ formatRupiah(total) }}</p>

      <!-- Detail Transaksi -->
      <table class="w-full text-sm text-left border">
        <tr>
          <td class="border px-4 py-2 font-medium">Barang</td>
          <td class="border px-4 py-2">{{ detail?.product?.nama_product || '-' }}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2 font-medium">Toko</td>
          <td class="border px-4 py-2">{{ detail?.product?.user?.toko?.nama_toko || '-' }}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2 font-medium">Metode Pembayaran</td>
          <td class="border px-4 py-2">{{ transaksi?.metode || '-' }}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2 font-medium">Waktu Pembayaran</td>
          <td class="border px-4 py-2">{{ transaksi?.updated_at || '-' }}</td>
        </tr>
        <tr>
          <td class="border px-4 py-2 font-medium">No Transaksi</td>
          <td class="border px-4 py-2">{{ transaksi?.kode_transaksi || '-' }}</td>
        </tr>
      </table>

      <!-- Tombol kembali -->
      <button 
        @click="router.push('/dashboard')" 
        class="mt-6 px-6 py-2 bg-[#7D0A0A] text-white rounded-lg hover:bg-[#a32727]">
        Kembali
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Navbar from "@/components/navbar/navbar.vue";
import api from "@/plugins/axios";

const router = useRouter();
const route = useRoute();

const transaksi = ref({});
const detail = ref({});
const total = ref(0);

const getDetailTransaksi = async () => {
  try {
    const kode = route.params.kode; // kode transaksi dikirim via route
    const res = await api.get(`/transaction`);
    const list = res.data.data.data;
    const trx = list.find(t => t.kode_transaksi === kode);

    if (trx) {
      transaksi.value = trx;
      detail.value = trx.detail_transaction[0]; // ambil item pertama
      total.value = trx.total;
    }
  } catch (e) {
    console.error(e);
  }
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(value).replace("Rp","").trim();
};

onMounted(() => {
  getDetailTransaksi();
});
</script>
