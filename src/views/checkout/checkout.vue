<template>
  <Navbar />
  <!-- Halaman Checkout: Tempat user memilih alamat, kurir, dan melakukan pembayaran -->
  <div class="p-4 space-y-4 min-h-screen">
    <h1 class="text-xl font-bold navbar-font mb-4">| Checkout</h1>

    <!-- LOADING: Tampilan saat memuat rincian pesanan -->
    <template v-if="isLoading">
      <div class="bg-white rounded-lg shadow p-4 space-y-3"><Skeleton width="150px" height="18px"/><Skeleton width="100%" height="40px"/></div>
      <div class="bg-white rounded-lg shadow p-4 space-y-4"><Skeleton width="120px" height="18px"/><Skeleton width="100%" height="80px"/></div>
    </template>

    <!-- DATA CHECKOUT -->
    <template v-else-if="checkout.length">
      <!-- BAGIAN 1: PEMILIHAN ALAMAT -->
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-3 navbar-font">Alamat Pengiriman</h3>
        <select v-model="selectedAlamat" class="border rounded p-2 w-full text-sm inter-font" @change="handleAlamatChange">
          <option disabled value="">Pilih Alamat</option>
          <option v-for="alamat in alamatList" :key="alamat.id" :value="alamat.id">{{ alamat.label }}</option>
          <option value="create">+ Tambah Alamat Baru</option>
        </select>
      </div>

      <!-- BAGIAN 2: RINCIAN PRODUK PER TOKO -->
      <div class="space-y-5">
        <div v-for="toko in checkout" :key="toko.toko_id" class="bg-white rounded-lg shadow p-4 space-y-4">
          <h2 class="font-semibold text-gray-800 navbar-font">{{ toko.nama_toko }}</h2>

          <!-- Daftar produk dari toko ini -->
          <div v-for="item in toko.items" :key="item.product_id" class="flex items-center gap-4 border-b pb-3 last:border-0">
            <img :src="item.foto_cover" class="w-20 h-20 object-cover rounded border" />
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-800 navbar-font">{{ item.nama_product }}</h3>
              <p class="text-sm font-bold text-red-600 mt-1">Rp {{ formatRupiah(item.harga) }}</p>
            </div>
            <span class="text-sm">x{{ item.jumlah }}</span>
          </div>

          <!-- PILIH KURIR & LAYANAN (Integrasi RajaOngkir) -->
          <div class="space-y-3">
            <div>
              <h3 class="font-semibold mb-2 text-sm">Pilih Kurir</h3>
              <select v-model="toko.items[0].selectedKurir" @change="postRajaOngkir(toko)" class="border rounded p-2 w-full text-sm">
                <option disabled value="">-- Pilih Kurir --</option>
                <option v-for="kurir in kurirList" :key="kurir.kode" :value="kurir.kode">{{ kurir.nama }}</option>
              </select>
            </div>

            <!-- Muncul setelah kurir dipilih: Pilihan layanan (Reguler, YES, dll) -->
            <div v-if="toko.items[0].ongkirList?.length">
              <h3 class="font-semibold mb-1 text-sm">Pilih Layanan</h3>
              <select v-model="toko.items[0].selectedService" @change="updateSelectedOngkir(toko)" class="border rounded p-2 w-full text-sm">
                <option disabled value="">-- Pilih Layanan --</option>
                <option v-for="ongkir in toko.items[0].ongkirList" :key="ongkir.service" :value="ongkir.service">
                  {{ ongkir.service }} - Rp {{ formatRupiah(ongkir.cost) }} ({{ ongkir.etd }} hari)
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- BAGIAN 3: RINGKASAN PEMBAYARAN -->
        <div class="bg-white rounded-lg shadow p-4">
          <h3 class="font-semibold mb-3 navbar-font text-[#7D0A0A]">Rincian Pembayaran</h3>
          <div class="text-sm space-y-1">
            <div class="flex justify-between text-gray-500"><span>Total Ongkos Kirim</span><span>Rp {{ formatRupiah(totalOngkir) }}</span></div>
            <hr class="my-2">
            <div class="flex justify-between font-bold text-lg"><span>Total Bayar</span><span class="text-[#7D0A0A]">Rp {{ formatRupiah(totalHarga) }}</span></div>
          </div>
        </div>

        <!-- TOMBOL BAYAR (Midtrans) -->
        <div class="bg-white rounded-lg shadow p-4">
          <button @click="checkoutCart" :disabled="!canCheckout" class="w-full py-3 bg-[#BF3131] text-white rounded-md font-semibold disabled:opacity-50">
            Bayar Sekarang
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';
import Skeleton from '@/components/Skeleton.vue';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const checkout = ref([]);                 
const kodeTransaksi = ref(route.params.kode || ""); 
const alamatList = ref([]);               
const selectedAlamat = ref("");           

const kurirList = [
  { kode: 'jne', nama: 'JNE' }, { kode: 'pos', nama: 'POS Indonesia' }, { kode: 'jnt', nama: 'J&T' }
];

// Tombol bayar aktif jika alamat, kurir, dan layanan sudah dipilih semua
const canCheckout = computed(() => {
  if (!selectedAlamat.value) return false;
  return checkout.value.every(toko => toko.items[0].selectedKurir && toko.items[0].selectedService);
});

const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(value)

const totalOngkir = computed(() => checkout.value.reduce((sum, toko) => sum + (toko.biayaPengiriman || 0), 0));
const totalHarga = computed(() => {
  const totalProduk = checkout.value.reduce((sum, toko) => sum + toko.items.reduce((s, item) => s + (item.harga * item.jumlah), 0), 0);
  return totalProduk + totalOngkir.value;
});

const getAlamat = async () => {
  try { const res = await api.get('/alamat'); alamatList.value = res.data.data.data; } catch (e) {}
};

/**
 * Mengambil data barang yang akan dibayar berdasarkan kode transaksi.
 */
const getCheckout = async () => {
  try {
    const res = await api.get(`/transaction/get-transaction-detail/${kodeTransaksi.value}`);
    checkout.value = Object.values(res.data.data).map(toko => ({
      ...toko, items: toko.items.map(item => ({ ...item, biayaPengiriman: 0, selectedKurir: '', selectedService: '', ongkirList: [] }))
    }));
  } finally { isLoading.value = false }
};

/**
 * Fungsi Hitung Ongkir: Mengirim alamat asal (toko) dan tujuan (user) ke RajaOngkir.
 */
const postRajaOngkir = async (toko) => {
  const destination = alamatList.value.find(a => a.id === selectedAlamat.value)?.kode_domestik;
  const payload = { origin: toko.kode_domestik, destination, weight: toko.items.reduce((s, i) => s + (i.totalberat || 0), 0), courier: toko.items[0].selectedKurir, price: 'lowest' };
  try {
    const res = await api.post('/rajaongkir/cost', payload);
    toko.items[0].ongkirList = res.data.data || [];
  } catch (e) {}
};

const updateSelectedOngkir = (toko) => {
  const selected = toko.items[0].ongkirList.find(o => o.service === toko.items[0].selectedService);
  if (selected) { toko.biayaPengiriman = selected.cost; }
};

/**
 * Fungsi Pembayaran: Memanggil Midtrans Snap untuk memunculkan kotak pembayaran (Virtual Account, QRIS, dll).
 */
const checkoutCart = async () => {
  const payload = { 
    ongkir: totalOngkir.value, total: totalHarga.value, alamat_id: selectedAlamat.value,
    data_ongkir: checkout.value.map(t => ({ toko_id: t.toko_id, kurir: t.items[0].selectedKurir, ongkir: t.biayaPengiriman }))
  };
  try {
    const res = await api.post(`/transaction/payment/${kodeTransaksi.value}`, payload);
    window.snap.pay(res.data.data.snap_token, {
      onSuccess: () => { window.location.href = "/transaksi-selesai" },
      onPending: () => { window.location.href = "/list-transaksi" }
    });
  } catch (e) {}
};

onMounted(() => {
  getAlamat(); getCheckout();
  // Load script Midtrans secara dinamis
  if (!document.getElementById('midtrans-script')) {
    const s = document.createElement('script'); s.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    s.id = 'midtrans-script'; s.setAttribute('data-client-key', 'SB-Mid-client-TDzXniOUPJF6QYHv');
    document.body.appendChild(s);
  }
});
</script>
