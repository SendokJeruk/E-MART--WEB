<template>
  <Navbar />
  <!-- Halaman Keranjang: Daftar produk yang dipilih user sebelum checkout -->
  <div class="p-4 min-h-screen bg-gray-50 pb-32">
    <h1 class="navbar-font text-xl flex items-center gap-2 mb-4">
      <span class="block w-1 h-6 bg-[#BF3131] rounded-sm"></span>
      Keranjang
    </h1>

    <!-- SKELETON: Animasi loading -->
    <template v-if="isLoading">
      <div v-for="n in 3" :key="n" class="bg-white rounded-xl border border-gray-200 p-4 mb-3 animate-pulse">
        <div class="grid grid-cols-[auto_auto_1fr] gap-3">
          <div class="w-4 h-4 bg-gray-200 rounded mt-1"></div>
          <div class="w-20 h-20 bg-gray-200 rounded-lg"></div>
          <div class="space-y-2"><div class="h-4 bg-gray-200 rounded w-3/4"></div><div class="h-3 bg-gray-200 rounded w-1/2"></div></div>
        </div>
      </div>
    </template>

    <template v-else-if="cart?.cart_detail?.length">
      <!-- Opsi Pilih Semua Produk -->
      <div class="flex items-center gap-2 mb-3 px-1">
        <input type="checkbox" id="select-all" :checked="allSelected" @change="toggleAll($event.target.checked)" class="w-4 h-4 accent-[#BF3131] cursor-pointer" />
        <label for="select-all" class="inter-font text-sm text-gray-500 cursor-pointer">
          Pilih semua ({{ cart.cart_detail.length }} produk)
        </label>
      </div>

      <!-- DAFTAR ITEM PRODUK DI KERANJANG -->
      <div class="space-y-3">
        <div v-for="item in cart.cart_detail" :key="item.id" class="bg-white rounded-xl border border-gray-200 p-4">
          <div class="grid grid-cols-[auto_auto_1fr] gap-3 items-start">
            <!-- Centang per produk -->
            <input type="checkbox" :checked="selectedIds.includes(item.id)" @change="toggleItem(item.id)" class="mt-1 w-4 h-4 accent-[#BF3131] cursor-pointer" />

            <!-- Gambar Produk -->
            <img :src="item.product?.foto_cover || 'https://placehold.co/80'" class="w-20 h-20 object-cover rounded-lg border border-gray-100 flex-shrink-0" />

            <!-- Informasi Produk -->
            <div class="min-w-0">
              <h2 class="navbar-font text-sm text-gray-900 leading-snug truncate">{{ item.product?.nama_product }}</h2>
              <p class="inter-font text-xs text-gray-400 mt-0.5">Toko: {{ item.product?.user?.toko?.nama_toko }}</p>
              
              <div class="mt-2">
                <p class="inter-font text-xs text-gray-400">Harga satuan: <span class="font-medium text-gray-800">Rp {{ formatRupiah(item.product?.harga) }}</span></p>
                <p class="inter-font text-sm font-semibold text-[#BF3131]">Subtotal: Rp {{ formatRupiah(item.harga) }}</p>
              </div>

              <!-- Pengatur Jumlah (Quantity) -->
              <div class="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
                <div class="flex items-center gap-1.5">
                  <button @click="decrementQuantity(item)" class="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-md">−</button>
                  <input type="number" min="1" v-model.number="item.jumlah" @input="onQuantityChange(item)" class="inter-font w-11 h-7 text-center text-sm border border-gray-300 rounded-md" />
                  <button @click="incrementQuantity(item)" class="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-md">+</button>
                </div>
                <!-- Tombol Hapus item dari keranjang -->
                <button @click="deleteProductcart(item.id)" class="inter-font px-3 py-1.5 text-xs font-medium text-[#BF3131] border border-[#BF3131] rounded-md">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
        <span class="text-4xl opacity-30">🛒</span><p class="inter-font text-sm">Keranjang masih kosong...</p>
      </div>
    </template>
  </div>

  <!-- BAR PEMBAYARAN (FIXED DI BAWAH) -->
  <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4 shadow-sm z-10">
    <div>
      <p class="inter-font text-xs text-gray-400 mb-0.5">Total dipilih</p>
      <p class="navbar-font text-base text-gray-900">Rp {{ formatRupiah(selectedTotal) }}</p>
    </div>
    <!-- Tombol untuk lanjut ke halaman Checkout -->
    <button class="inter-font bg-[#BF3131] hover:bg-[#a32727] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors" @click="checkoutSelected">
      Checkout
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'
import router from '@/router'
import { showSuccess, showError, showConfirm } from '@/utils/alert'
import Skeleton from '@/components/Skeleton.vue'

const cart = ref(null)
const selectedIds = ref([])
const isLoading = ref(true)
let updateTimeout = null

const formatRupiah = (value) => new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(value)

// Menghitung total harga hanya untuk produk yang dicentang user
const selectedTotal = computed(() => {
  if (!cart.value?.cart_detail) return 0
  return cart.value.cart_detail.filter(item => selectedIds.value.includes(item.id)).reduce((sum, item) => sum + (item.harga || 0), 0)
})

const allSelected = computed(() => cart.value?.cart_detail?.length && cart.value.cart_detail.every(item => selectedIds.value.includes(item.id)))

const toggleItem = (id) => {
  const idx = selectedIds.value.indexOf(id)
  idx === -1 ? selectedIds.value.push(id) : selectedIds.value.splice(idx, 1)
}

const toggleAll = (checked) => {
  selectedIds.value = checked ? cart.value.cart_detail.map(item => item.id) : []
}

// Mengambil data keranjang dari server
const getCart = async () => {
  try {
    const response = await api.get('/cart')
    cart.value = response.data.data[0] || response.data.data || { cart_detail: [] }
  } catch (error) { showError('Gagal mengambil data keranjang') }
  finally { isLoading.value = false }
}

/**
 * Fungsi untuk mengubah jumlah produk di keranjang.
 * Menggunakan debounce agar tidak setiap ketikan mengirim request ke server.
 */
const updateCartItem = async (item, newJumlah) => {
  try {
    await api.put(`/detailcart/${item.id}`, { jumlah: newJumlah, product_id: item.product_id })
    await getCart() // Refresh data untuk mendapatkan subtotal terbaru
  } catch (error) { showError('Gagal memperbarui jumlah produk') }
}

const incrementQuantity = (item) => {
  if (item.jumlah >= item.product.stock) return showError('Stok tidak mencukupi')
  item.jumlah++; updateCartItem(item, item.jumlah)
}

const decrementQuantity = (item) => {
  if (item.jumlah > 1) { item.jumlah--; updateCartItem(item, item.jumlah) }
}

const deleteProductcart = async (cartDetailId) => {
  const confirmed = await showConfirm('Hapus produk ini dari keranjang?')
  if (!confirmed) return
  try {
    await api.delete(`/detailcart/${cartDetailId}`)
    await getCart(); showSuccess('Berhasil dihapus')
  } catch (error) { showError('Gagal menghapus produk') }
}

/**
 * Fungsi Checkout: Mengirim daftar produk yang dicentang ke server
 * dan membuat transaksi baru.
 */
const checkoutSelected = async () => {
  if (selectedIds.value.length === 0) return showError('Pilih minimal satu produk')
  try {
    const response = await api.post('/checkout/products', { cart_detail_ids: selectedIds.value })
    showSuccess('Checkout berhasil!')
    router.push('/checkout/' + response.data.data.kode_transaksi)
  } catch (error) { showError('Checkout gagal') }
}

onMounted(() => { getCart() })
</script>
