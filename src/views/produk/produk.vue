<template>
  <Navbar />

  <div class="max-w-6xl mx-auto px-4 py-8" v-if="produk">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <!-- Gambar Produk -->
      <div class="space-y-4">
        <div
          class="w-full aspect-square bg-white border rounded-xl shadow-sm flex items-center justify-center overflow-hidden"
        >
          <img
            :src="produk.selectedImage"
            alt="Produk"
            class="w-full h-full object-contain"
          />
        </div>

        <div
          v-if="produk.foto && produk.foto.length"
          class="flex gap-3 flex-wrap"
        >
          <img
            :src="produk.foto_cover"
            alt="Cover"
            class="w-20 aspect-square object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
            @click="changeMainImage(produk.foto_cover)"
          />

          <img
            v-for="(foto, index) in produk.foto"
            :key="index"
            :src="foto.foto"
            alt="Foto Tambahan"
            class="w-20 aspect-square object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
            @click="changeMainImage(foto.foto)"
          />
        </div>
      </div>

      <!-- Detail Produk -->
      <div class="flex flex-col space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-[#7D0A0A] mb-1">
            {{ produk.nama_product }}
          </h1>
          <router-link
            :to="{
              name: 'toko',
              params: { nama_toko: produk.user.toko.nama_toko }
            }"
            class="text-sm text-[#7D0A0A] mb-2 hover:underline cursor-pointer"
          >
            {{ produk.user.toko.nama_toko }}
          </router-link>
          <p class="text-2xl font-bold text-[#7D0A0A]">
            Rp {{ formatRupiah(produk.harga) }}
          </p>
        </div>

        <div class="text-sm text-yellow-700 font-medium">
          Stok tersedia: {{ produk.stock }}
        </div>

        <div class="flex items-center flex-wrap gap-4">
          <form @submit.prevent="formTransaction">
            <button
              class="bg-[#7D0A0A] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
            >
              Beli Sekarang
            </button>
          </form>

          <button
            class="bg-[#7D0A0A] text-white px-6 py-2 rounded-lg hover:bg-red-800 transition"
            @click="handleAddToCart"
          >
            + Keranjang
          </button>

          <div class="flex items-center gap-2 rounded-lg px-3 py-1">
            <button class="text-xl font-bold" @click="decreaseQuantity">
              -
            </button>
            <input
              type="number"
              min="1"
              v-model="produk.quantity"
              class="text-lg font-semibold border rounded px-2 py-1 w-20"
            />
            <button class="text-xl font-bold" @click="increaseQuantity">
              +
            </button>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-[#7D0A0A] mb-2">
            Deskripsi Produk
          </h2>
          <p class="text-gray-700 text-sm whitespace-pre-wrap">
            <span v-if="!readMore">
              {{ produk.deskripsi.slice(0, 100) }}...
              <br />
              <button
                @click="readMore = true"
                class="text-[#7D0A0A] underline mt-2"
              >
                Baca selengkapnya
              </button>
            </span>
            <span v-else>
              {{ produk.deskripsi }}
              <br />
              <button
                @click="readMore = false"
                class="text-[#7D0A0A] underline mt-2"
              >
                Tutup
              </button>
            </span>
          </p>
        </div>

        <!-- Tombol Rating -->
        <div>
          <button
            class="text-sm text-[#7D0A0A] underline hover:text-red-800"
            @click="openModal"
          >
            Lihat Rating & Review
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Produk Lain -->
  <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">
    <product v-for="product in products" :key="product.id" :product="product" />
  </div>

  <!-- Modal Rating -->
  <transition name="fade-scale">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6 relative transform transition-all"
      >
        <h2 class="text-xl font-bold text-[#7D0A0A] mb-4">
          Rating & Review
        </h2>

        <div v-if="ratings.length" class="space-y-4 max-h-96 overflow-y-auto">
          <div
            v-for="(rating, index) in ratings"
            :key="index"
            class="border rounded-lg p-3 hover:bg-gray-50 transition"
          >
            <p class="font-semibold text-yellow-600">★ {{ rating.bintang }}/5</p>
            <p class="text-gray-700 text-sm">{{ rating.komentar }}</p>
            <p class="text-xs text-gray-500">oleh {{ rating.user }}</p>
          </div>
        </div>
        <div v-else class="text-gray-500">Belum ada rating.</div>

        <!-- Tombol Close -->
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          @click="closeModal"
        >
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import product from '@/components/card/product.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/plugins/axios';

const route = useRoute();
const router = useRouter();

const produk = ref(null);
const products = ref([]);
const readMore = ref(false);
const showModal = ref(false);
const ratings = ref([]);

const kodeTransaksi = ref(route.params.kode || '');

const fetchProducts = async () => {
  try {
    const response = await api.get('/product', {
      params: {
        status: 'publish'
      }
    });

    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data.data)
    ) {
      products.value = response.data.data.data.sort(
        () => Math.random() - 0.5
      );
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
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
        produk.value = {
          ...found,
          selectedImage: found.foto_cover,
          quantity: 1
        };
        break;
      }

      if (products.length < 10) {
        break;
      }

      page++;
    }
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
  }
};

const getRating = async (productId) => {
  try {
    // dummy 10 data
    ratings.value = [
      { bintang: 5, komentar: 'Kualitas bagus banget!', user: 'Andi' },
      { bintang: 4, komentar: 'Nyaman dipakai, tapi agak sempit.', user: 'Budi' },
      { bintang: 3, komentar: 'Lumayan lah untuk harga segini.', user: 'Citra' },
      { bintang: 5, komentar: 'Barang sesuai deskripsi!', user: 'Dewi' },
      { bintang: 4, komentar: 'Pengiriman cepat 👍', user: 'Eka' },
      { bintang: 2, komentar: 'Kurang sesuai ekspektasi', user: 'Fajar' },
      { bintang: 5, komentar: 'Top seller, mantap!', user: 'Gita' },
      { bintang: 3, komentar: 'Biasa aja sih', user: 'Hari' },
      { bintang: 5, komentar: 'Recommended seller 💯', user: 'Indra' },
      { bintang: 4, komentar: 'Bagus, tapi packaging kurang rapi', user: 'Joko' }
    ];
  } catch (error) {
    console.error('Gagal mengambil rating:', error);
    ratings.value = [];
  }
};

const changeMainImage = (imageUrl) => {
  if (produk.value) {
    produk.value.selectedImage = imageUrl;
  }
};

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0
  }).format(value);
};

const increaseQuantity = () => {
  if (produk.value) {
    produk.value.quantity++;
  }
};

const decreaseQuantity = () => {
  if (produk.value && produk.value.quantity > 1) {
    produk.value.quantity--;
  }
};

const formTransaction = async () => {
  try {
    const payload = {
      status: 'pending',
      tanggal_transaksi: null,
      kode_transaksi: null,
      total_harga: produk.value.harga * produk.value.quantity,
      produk_id: produk.value.id,
      quantity: produk.value.quantity
    };

    const response = await api.post('/transaction', payload);
    await formDetailTransaction(response.data.data.id);
    router.push(`/list-transaksi`);
  } catch (error) {
    console.error('Gagal transaksi:', error);
  }
};

const formDetailTransaction = async (transactionId) => {
  try {
    const payload = {
      transaction_id: transactionId,
      product_id: produk.value.id,
      jumlah: produk.value.quantity
    };
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
      return {
        success: false,
        message: error.response.data.message,
        errors: error.response.data.errors || null
      };
    } else {
      return {
        success: false,
        message: 'Terjadi kesalahan pada jaringan atau server.'
      };
    }
  }
};

const handleAddToCart = async () => {
  if (!produk.value) return;

  const payload = {
    product_id: produk.value.id,
    jumlah: produk.value.quantity
  };

  const result = await addToCart(payload);

  if (result.success === false) {
    alert(result.message);
  } else {
    alert('Produk berhasil ditambahkan ke keranjang!');
  }
};

// Animasi buka modal
const openModal = () => {
  showModal.value = true;
  getRating(produk.value?.id);
};

// Animasi tutup modal
const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  getProductById();
  fetchProducts();
});
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
</style>
