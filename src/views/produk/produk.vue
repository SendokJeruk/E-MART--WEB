<template>
  <Navbar />

  <!-- HALAMAN DETAIL PRODUK: Menampilkan informasi lengkap, foto, dan tombol beli -->
  <div v-if="isLoading" class="max-w-5xl mx-auto px-4 py-6">
    <!-- Tampilan Loading (Skeleton) -->
    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-6">
      <div class="space-y-3"><Skeleton width="100%" height="360px" /></div>
      <div class="space-y-4"><Skeleton width="70%" height="24px" /><Skeleton width="100%" height="80px" /></div>
    </div>
  </div>

  <div v-else-if="produk" class="max-w-5xl mx-auto pb-24 lg:pb-8">
    <div class="lg:grid lg:grid-cols-2 lg:gap-10 lg:px-4 lg:py-8">
      
      <!-- BAGIAN KIRI: FOTO PRODUK -->
      <div class="space-y-3">
        <!-- Gambar Utama -->
        <div class="w-full aspect-square bg-gray-50 overflow-hidden border-b">
          <img :src="produk.selectedImage" class="w-full h-full object-contain" />
        </div>
        <!-- Koleksi Foto Kecil (Thumbnails) -->
        <div v-if="produk.foto?.length" class="flex gap-2 px-4 overflow-x-auto pb-1">
          <button v-for="(f, i) in [produk.foto_cover, ...produk.foto.map(x=>x.foto)]" :key="i" @click="produk.selectedImage = f" class="w-16 h-16 rounded-lg border-2 overflow-hidden">
            <img :src="f" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- BAGIAN KANAN: INFO PRODUK & AKSI -->
      <div class="px-4 pt-4 lg:pt-0 flex flex-col gap-5">
        <div>
          <router-link :to="{ name: 'toko', query: { nama_toko: produk.user.toko.nama_toko } }" class="text-xs text-[#7D0A0A] navbar-font">
            {{ produk.user.toko.nama_toko }}
          </router-link>
          <h1 class="text-xl lg:text-3xl font-bold text-gray-900 navbar-font">{{ produk.nama_product }}</h1>
          <p class="text-2xl font-bold text-[#7D0A0A] navbar-font">Rp {{ formatRupiah(produk.harga) }}</p>
        </div>

        <div class="text-sm text-gray-600 inter-font">Stok tersedia: {{ produk.stock }}</div>

        <!-- PENGATUR JUMLAH & TOMBOL -->
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <div class="flex items-center border rounded-lg overflow-hidden">
              <button @click="produk.quantity > 1 && produk.quantity--" class="w-10 h-10 bg-gray-50">−</button>
              <input type="number" v-model.number="produk.quantity" class="w-14 text-center border-x" />
              <button @click="produk.quantity < produk.stock && produk.quantity++" class="w-10 h-10 bg-gray-50">+</button>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="handleAddToCart" class="flex-1 border-2 border-[#7D0A0A] text-[#7D0A0A] py-3 rounded-xl font-medium">
              + Keranjang
            </button>
            <button @click="formTransaction" class="flex-1 bg-[#7D0A0A] text-white py-3 rounded-xl font-medium">
              Beli Sekarang
            </button>
          </div>
        </div>

        <!-- DESKRIPSI -->
        <div class="border-t pt-4">
          <h2 class="text-base font-semibold mb-2 navbar-font">Deskripsi Produk</h2>
          <p class="text-sm text-gray-600 whitespace-pre-wrap inter-font">{{ produk.deskripsi }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/plugins/axios';
import Navbar from '@/components/navbar/navbar.vue';
import Skeleton from '@/components/Skeleton.vue';
import { showSuccess, showError } from '@/utils/alert';

const route = useRoute();
const router = useRouter();
const produk = ref(null);
const isLoading = ref(true);

const formatRupiah = (v) => new Intl.NumberFormat('id-ID').format(v);

/**
 * Mengambil data detail produk berdasarkan ID dari URL.
 */
const getProductById = async () => {
  try {
    const res = await api.get(`/product?id=${route.params.id}`);
    const data = res.data.data.data[0];
    if (data) {
      produk.value = { ...data, selectedImage: data.foto_cover, quantity: 1 };
    }
  } finally { isLoading.value = false; }
};

/**
 * Menambahkan produk ke keranjang belanja.
 */
const handleAddToCart = async () => {
  try {
    await api.post('/detailcart', { product_id: produk.value.id, jumlah: produk.value.quantity });
    showSuccess('Berhasil ditambah ke keranjang!');
  } catch (e) {
    if (e.response?.status === 401) { showError('Silakan login terlebih dahulu'); router.push('/login'); }
  }
};

/**
 * Langsung memulai transaksi (Beli Sekarang).
 */
const formTransaction = async () => {
  try {
    const res = await api.post('/transaction', { total_harga: produk.value.harga * produk.value.quantity });
    await api.post('/detail-transaction', { transaction_id: res.data.data.id, product_id: produk.value.id, jumlah: produk.value.quantity });
    router.push('/list-transaksi');
  } catch (e) { showError('Gagal memproses transaksi'); }
};

onMounted(() => { getProductById(); });
</script>
