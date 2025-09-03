<template>
  <Navbar />

  <div class="max-w-6xl mx-auto px-4 py-8" v-if="produk">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div class="space-y-4">
        <div class="w-full aspect-square bg-white border rounded-xl shadow-sm flex items-center justify-center overflow-hidden">
          <img
            :src="produk.selectedImage"
            alt="Produk"
            class="w-full h-full object-contain"
          />
        </div>

        <div v-if="produk.foto && produk.foto.length" class="flex gap-3 flex-wrap">
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

      <div class="flex flex-col space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-[#7D0A0A] mb-1">{{ produk.nama_product }}</h1>
          <router-link 
            :to="{ name: 'toko', params: { nama_toko: produk.user.toko.nama_toko } }" 
            class="text-sm text-[#7D0A0A] mb-2 hover:underline cursor-pointer"
          >
            {{ produk.user.toko.nama_toko }}
          </router-link>
          <p class="text-2xl font-bold text-[#7D0A0A]">Rp {{ formatRupiah(produk.harga) }}</p>
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
            <button class="text-xl font-bold" @click="decreaseQuantity">-</button>
            <input type="number" min="1" v-model="produk.quantity" class="text-lg font-semibold border rounded px-2 py-1 w-20"/>            <button class="text-xl font-bold" @click="increaseQuantity">+</button>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-[#7D0A0A] mb-2">Deskripsi Produk</h2>
          <p class="text-gray-700 text-sm whitespace-pre-wrap">
            <span v-if="!readMore">
              {{ produk.deskripsi.slice(0, 100) }}...
              <br />
              <button @click="readMore = true" class="text-[#7D0A0A] underline mt-2">Baca selengkapnya</button>
            </span>
            <span v-else>
              {{ produk.deskripsi }}
              <br />
              <button @click="readMore = false" class="text-[#7D0A0A] underline mt-2">Tutup</button>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4">
  <product
      v-for="product in products"
      :key="product.id"
      :product="product"
    />
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import product from '@/components/card/product.vue'
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from "@/plugins/axios";

const route = useRoute();
const router = useRouter();

const produk = ref(null);
const products = ref([]);
const readMore = ref(false);
const kodeTransaksi = ref(route.params.kode || "");

const fetchProducts = async () => {
  try {
    const response = await api.get("/product", {
      params: {
        status: 'publish'
      }
    })

    if (response.data && response.data.data && Array.isArray(response.data.data.data)) {
      products.value = response.data.data.data.sort(() => Math.random() - 0.5)
    } else {
      console.error("Expected an array but got:", typeof response.data.data)
    }
  } catch (error) {
    console.error("Error fetching products:", error)
  }
}

const getProductById = async () => {
  const id = parseInt(route.params.id);
  let page = 1;
  let found = null;

  try {
    while (true) {
      const response = await api.get(`/product?page=${page}`);
      const products = response.data.data.data;

      found = products.find(p => p.id === id);
      if (found) {
        produk.value = {
          ...found,
          selectedImage: found.foto_cover,
          quantity: 1
        };
        break;
      }

      if (products.length < 10) {
        console.error('Produk tidak ditemukan di semua halaman');
        break;
      }

      page++; 
    }
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
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
    minimumFractionDigits: 0,
  }).format(value)
}

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
    
    console.log('Item berhasil ditambahkan:');
    return response.data; 
  } catch (error) {
    if (error.response) {
      console.error('Gagal menambahkan item:', error.response.data);
      return {
        success: false,
        message: error.response.data.message,
        errors: error.response.data.errors || null,
      };
    } else {
      console.error('Terjadi kesalahan:', error.message);
      return {
        success: false,
        message: 'Terjadi kesalahan pada jaringan atau server.',
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
    alert("Produk berhasil ditambahkan ke keranjang!");
  }
};


onMounted(() => {
  getProductById();
  fetchProducts();
});
</script>
