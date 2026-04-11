<template>
  <Navbar />

  <!-- Loading State -->
  <div v-if="isLoading" class="max-w-5xl mx-auto px-4 py-6">
    <div class="flex flex-col lg:grid lg:grid-cols-2 gap-6">
      <div class="space-y-3">
        <Skeleton width="100%" height="360px" class="rounded-xl" />
        <div class="flex gap-2">
          <Skeleton v-for="n in 4" :key="n" width="64px" height="64px" class="rounded-lg" />
        </div>
      </div>
      <div class="space-y-4">
        <Skeleton width="70%" height="24px" />
        <Skeleton width="45%" height="16px" />
        <Skeleton width="35%" height="28px" />
        <Skeleton width="100%" height="44px" />
        <Skeleton width="100%" height="80px" />
      </div>
    </div>
  </div>

  <!-- Product Detail -->
  <div v-else-if="produk" class="max-w-5xl mx-auto pb-24 lg:pb-8">

    <!-- Gambar Produk -->
    <div class="lg:grid lg:grid-cols-2 lg:gap-10 lg:px-4 lg:py-8">

      <div class="space-y-3">
        <!-- Gambar Utama -->
        <div class="w-full aspect-square bg-gray-50 lg:rounded-xl overflow-hidden border-b lg:border border-gray-100">
          <img
            :src="produk.selectedImage"
            alt="Foto produk"
            class="w-full h-full object-contain"
            @error="(e) => e.target.src = 'https://placehold.co/800x800?text=Gambar+Tidak+Tersedia'"
          />
        </div>

        <!-- Thumbnail -->
        <div
          v-if="produk.foto && produk.foto.length"
          class="flex gap-2 px-4 lg:px-0 overflow-x-auto pb-1"
        >
          <button
            class="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg border-2 overflow-hidden transition-all"
            :class="produk.selectedImage === produk.foto_cover ? 'border-[#7D0A0A]' : 'border-gray-200 hover:border-gray-400'"
            @click="changeMainImage(produk.foto_cover)"
          >
            <img
              :src="produk.foto_cover"
              alt="Cover"
              class="w-full h-full object-cover"
              @error="(e) => e.target.src = 'https://placehold.co/200x200?text=?'"
            />
          </button>

          <button
            v-for="(foto, index) in produk.foto"
            :key="index"
            class="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg border-2 overflow-hidden transition-all"
            :class="produk.selectedImage === foto.foto ? 'border-[#7D0A0A]' : 'border-gray-200 hover:border-gray-400'"
            @click="changeMainImage(foto.foto)"
          >
            <img
              :src="foto.foto"
              alt="Foto tambahan"
              class="w-full h-full object-cover"
              @error="(e) => e.target.src = 'https://placehold.co/200x200?text=?'"
            />
          </button>
        </div>
      </div>

      <!-- Detail Produk -->
      <div class="px-4 pt-4 lg:px-0 lg:pt-0 flex flex-col gap-5">

        <!-- Nama, Toko, Harga -->
        <div>
          <router-link
            :to="{ name: 'toko', query: { nama_toko: produk.user.toko.nama_toko } }"
            class="inline-flex items-center gap-1 text-xs text-[#7D0A0A] hover:underline mb-2 navbar-font"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {{ produk.user.toko.nama_toko }}
          </router-link>

          <h1 class="text-xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2 navbar-font">
            {{ produk.nama_product }}
          </h1>

          <p class="text-2xl font-bold text-[#7D0A0A] navbar-font">
            Rp {{ formatRupiah(produk.harga) }}
          </p>
        </div>

        <!-- Stok -->
        <div class="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-800 text-xs font-medium px-3 py-1.5 rounded-full border border-yellow-200 w-fit inter-font">
          <span class="w-2 h-2 rounded-full bg-yellow-500 inline-block"></span>
          Stok tersedia: {{ produk.stock }}
        </div>

        <!-- Quantity + Tombol -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                class="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100 text-xl font-light transition"
                @click="decreaseQuantity"
              >−</button>
              <input
                type="number"
                min="1"
                :max="produk.stock"
                v-model="produk.quantity"
                class="w-14 h-10 text-center text-sm font-medium border-x border-gray-200 focus:outline-none inter-font"
              />
              <button
                class="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-700 hover:bg-gray-100 text-xl font-light transition disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="produk.quantity >= produk.stock"
                @click="increaseQuantity"
              >+</button>
            </div>
            <span class="text-xs text-gray-400 inter-font">Maks. {{ produk.stock }} pcs</span>
          </div>

          <!-- Tombol Beli & Keranjang (desktop) -->
          <div class="hidden lg:flex gap-3">
            <form @submit.prevent="formTransaction" class="flex-1">
              <button
                type="submit"
                class="w-full bg-[#7D0A0A] text-white py-3 rounded-xl hover:bg-red-900 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed inter-font"
                :disabled="isFetching"
              >
                <span v-if="isFetching">Memproses...</span>
                <span v-else>Beli Sekarang</span>
              </button>
            </form>

            <button
              class="flex-1 border-2 border-[#7D0A0A] text-[#7D0A0A] py-3 rounded-xl hover:bg-red-50 transition font-medium inter-font"
              @click="handleAddToCart"
            >
              + Keranjang
            </button>
          </div>
        </div>

        <!-- Deskripsi -->
        <div class="border-t border-gray-100 pt-4">
          <h2 class="text-base font-semibold text-gray-800 mb-2 navbar-font">Deskripsi Produk</h2>
          <p class="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed inter-font">
            <span v-if="produk.deskripsi.length <= 150">
              {{ produk.deskripsi }}
            </span>
            <span v-else>
              <span v-if="!readMore">
                {{ produk.deskripsi.slice(0, 150) }}...
                <button @click="readMore = true" class="text-[#7D0A0A] underline ml-1 font-medium">
                  Baca selengkapnya
                </button>
              </span>
              <span v-else>
                {{ produk.deskripsi }}
                <button @click="readMore = false" class="text-[#7D0A0A] underline ml-1 font-medium">
                  Tutup
                </button>
              </span>
            </span>
          </p>
        </div>

        <!-- Rating Link -->
        <button
          class="flex items-center gap-1.5 text-sm text-[#7D0A0A] hover:text-red-900 font-medium inter-font"
          @click="openModal"
        >
          Lihat Rating & Review
        </button>

      </div>
    </div>

    <!-- Produk Lain -->
    <div class="mt-4 lg:mt-8 border-t-8 border-gray-100 lg:border-0">
      <div class="px-4 pt-4 pb-2">
        <h2 class="text-base font-semibold text-gray-800 navbar-font">Produk Lainnya</h2>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 px-4 pb-4">
        <template v-if="isLoading">
          <div v-for="n in 6" :key="n">
            <Skeleton height="120px" class="rounded-lg" />
            <Skeleton class="mt-2" height="14px" width="80%" />
            <Skeleton class="mt-1" height="14px" width="50%" />
          </div>
        </template>
        <template v-else>
          <Product
            v-for="product in products"
            :key="product.id"
            :product="product"
            :namaToko="getNamaToko(product)"
            @click="goToProduct(product.id)"
            class="cursor-pointer"
          />
        </template>
      </div>
    </div>

  </div>

  <!-- Bottom Bar Mobile (Fixed) -->
  <div v-if="produk && !isLoading" class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex gap-3 lg:hidden z-40">
    <button
      class="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-xl text-[#7D0A0A] hover:bg-red-50 transition flex-shrink-0"
      @click="handleAddToCart"
      aria-label="Tambah ke keranjang"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.66a2 2 0 001.98-1.71l1.67-9.28H6"/>
      </svg>
    </button>

    <form @submit.prevent="formTransaction" class="flex-1">
      <button
        type="submit"
        class="w-full h-12 bg-[#7D0A0A] text-white rounded-xl font-medium hover:bg-red-900 transition disabled:opacity-50 disabled:cursor-not-allowed inter-font"
        :disabled="isFetching"
      >
        <span v-if="isFetching">Memproses...</span>
        <span v-else>Beli Sekarang</span>
      </button>
    </form>
  </div>

  <!-- Modal Rating -->
  <transition name="fade-scale">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50 px-0 lg:px-4"
      @click.self="showModal = false"
    >
      <div class="bg-white w-full lg:max-w-lg rounded-t-2xl lg:rounded-2xl shadow-xl max-h-[85vh] flex flex-col">
        <!-- Header Modal -->
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-[#7D0A0A] navbar-font">Rating & Review</h2>
          <button class="text-gray-400 hover:text-gray-600 text-xl" @click="showModal = false">✕</button>
        </div>

        <!-- Isi Modal -->
        <div class="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <template v-if="ratings.length">
            <div
              v-for="(rating, index) in ratings"
              :key="index"
              class="border border-gray-100 rounded-xl p-4 space-y-2"
            >
              <div class="flex items-center gap-2">
                <div class="flex">
                  <span
                    v-for="n in 5"
                    :key="n"
                    class="text-sm"
                    :class="n <= rating.bintang ? 'text-yellow-400' : 'text-gray-200'"
                  >★</span>
                </div>
                <span class="text-xs font-medium text-yellow-700">{{ rating.bintang }}/5</span>
              </div>
              <p class="text-sm text-gray-700 inter-font">{{ rating.komentar }}</p>
              <p class="text-xs text-gray-400 inter-font">oleh {{ rating.user }}</p>

              <div v-if="rating.foto && rating.foto.length" class="grid grid-cols-3 gap-2 mt-2">
                <img
                  v-for="(foto, fIndex) in rating.foto"
                  :key="fIndex"
                  :src="foto"
                  class="w-full aspect-square object-cover rounded-lg border border-gray-100 cursor-pointer hover:opacity-90 transition"
                  alt="Foto review"
                  @click="openImage(foto)"
                />
              </div>
            </div>
          </template>
          <div v-else class="text-center py-10 text-gray-400 inter-font">Belum ada review.</div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Modal Preview Foto -->
  <transition name="fade-scale">
    <div
      v-if="selectedImage"
      class="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
      @click="closeImage"
    >
      <img
        :src="selectedImage"
        class="max-h-full max-w-full rounded-xl object-contain"
        alt="Preview foto"
      />
    </div>
  </transition>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import Product from '@/components/card/product.vue';
import { ref, onMounted, watch } from 'vue';
import { showError,showSuccess } from '@/utils/alert';
import { useRoute, useRouter } from 'vue-router';
import api from '@/plugins/axios';
import Skeleton from '@/components/Skeleton.vue';

const route = useRoute();
const router = useRouter();

const produk = ref(null);
const products = ref([]);
const readMore = ref(false);
const showModal = ref(false);
const ratings = ref([]);
const rating = ref([]);
const selectedImage = ref(null);
const isLoading = ref(true);
const isFetching = ref(false);

const kodeTransaksi = ref(route.params.kode || '');

watch(
  () => route.params.id,
  async (newId) => {
    if (!newId) return;
    produk.value = null;      // reset data lama
    readMore.value = false;   // reset readMore
    await getProductById();   // fetch produk baru
    await getRatings(newId);  // fetch rating baru
  }
);

watch(
  () => produk.value?.quantity,
  (newVal) => {
    if (!produk.value) return;

    if (newVal > produk.value.stock) {
      produk.value.quantity = produk.value.stock;
    }

    if (newVal < 1) {
      produk.value.quantity = 1;
    }
  }
); //? ANE NAMBAH INI BUAT BIAR DOUBLE SAFETY STOCK

const getNamaToko = (product) => {
  return product.user?.toko?.nama_toko || 'Nama Seller'
}

const fetchProducts = async () => {
  try {
    const response = await api.get('/product', { 
      params: { status: 'publish' } 
    });

    if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
      products.value = response.data.data.data.sort(() => Math.random() - 0.5);
    }

  } catch (error) {
    console.error('Error fetching products:', error);
    showError('Gagal mengambil produk');
  } finally {
    isLoading.value = false;
  }
};

const goToProduct = (id) => {
  router.push({ name: 'Produk', params: { id } });
};

const getProductById = async () => {
  const id = parseInt(route.params.id);
  let page = 1;
  let found = null;

  try {
    while (true) {
      const response = await api.get(`/product?page=${page}`);
      const products = response.data.data.data;

      found = products.find((p) => p.id === id);
      if (found) {
        produk.value = { ...found, selectedImage: found.foto_cover, quantity: 1 };
        break;
      }

      if (products.length < 10) break;
      page++;
    }
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    showError('Produk tidak ditemukan atau gagal diambil');
  }
};

const getRatings = async (productId) => {
  try {
    const response = await api.get(`/rating?product_id=${productId}`);
    if (Array.isArray(response.data.data)) {
      ratings.value = response.data.data.map((item) => ({
        bintang: item.rating,
        komentar: item.deskripsi,
        user: item.user.name, // kalau backend sudah return nama user, pakai item.user.nama
        foto: item.foto_review ? [item.foto_review] : []
      }));
    } else {
      ratings.value = [];
    }
  } catch (error) {
    console.error('Gagal mengambil rating:', error);
    showError('Gagal mengambil rating produk');
    ratings.value = [];
  }
};

const changeMainImage = (imageUrl) => {
  if (produk.value) produk.value.selectedImage = imageUrl;
};

const formatRupiah = (value) =>
  new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(value);

const increaseQuantity = () => { if (produk.value) produk.value.quantity++; };
const decreaseQuantity = () => { if (produk.value && produk.value.quantity > 1) produk.value.quantity--; };

const formTransaction = async () => {
  try {
    isFetching.value = true
    const payload = {
      status: 'pending',
      tanggal_transaksi: null,
      kode_transaksi: null,
      total_harga: produk.value.harga * produk.value.quantity,
      produk_id: produk.value.id,
      quantity: produk.value.quantity
    };

    if (produk.value.stock < produk.value.quantity) {
      showError('Stock Produk Tidak Cukup');
      return
    }

    const response = await api.post('/transaction', payload);
    await formDetailTransaction(response.data.data.id);

    showSuccess('Transaksi berhasil dibuat!');
    isFetching.value = false
    router.push(`/list-transaksi`);

    
  } catch (error) {
    console.error('Gagal transaksi:', error);
    if (error.response.status == 401) {
      showError("Silahkan Login Terlebih Dahulu");
      router.push(`/login`);
      return
    }
    showError('Gagal melakukan transaksi');
  }
};

const formDetailTransaction = async (transactionId) => {
  try {
    const payload = { transaction_id: transactionId, product_id: produk.value.id, jumlah: produk.value.quantity };
    await api.post('/detail-transaction', payload);
  } catch (error) {
    console.error('Gagal detail transaksi:', error);
  }
};

const addToCart = async (payload) => {
  try {
    const response = await api.post('/detailcart', payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      return { success: false, message: error.response.data.message, errors: error.response.data.errors || null };
    } else {
      return { success: false, message: 'Terjadi kesalahan pada jaringan atau server.' };
    }
  }
};

const handleAddToCart = async () => {
  if (!produk.value) return;
  const payload = { product_id: produk.value.id, jumlah: produk.value.quantity };
  const result = await addToCart(payload);
  if (result.success === false) {
    if (result.message == "Unauthenticated" ) {
      showError("Silahkan Login Terlebih Dahulu");
      router.push(`/login`);
      return
    }
    showError("Terjadi Kesalahan");
  } else {
    showSuccess('Produk berhasil ditambahkan ke keranjang!');
  }
};

// Modal actions
const openModal = () => { showModal.value = true; getRatings(produk.value?.id); };
const closeModal = () => { showModal.value = false; };
const openImage = (url) => { selectedImage.value = url; };
const closeImage = () => { selectedImage.value = null; };

onMounted( async () => { 
    await getProductById(); 
    await fetchProducts();
    await getRatings();
  }
);
</script>

<style>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
</style>
