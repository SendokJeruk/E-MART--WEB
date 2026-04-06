<template>
  <Navbar />
  <div class="p-4 min-h-screen bg-[#FFFFFF]">
    <h1 class="text-2xl font-bold navbar-font mb-4">| Keranjang</h1>

    <!-- Tampilan pas lagi loading narik data keranjang, biar gak sepi -->
    <template v-if="isLoading">
      <div v-for="n in 3" :key="n" class="flex items-center bg-white rounded-2xl shadow-md p-4 border border-gray-200 animate-pulse space-x-4">
        <Skeleton width="24px" height="24px" />
        <Skeleton width="80px" height="80px" />
        <div class="flex-1 space-y-2">
          <Skeleton width="60%" height="20px"/>
          <Skeleton width="40%" height="16px"/>
          <Skeleton width="80%" height="14px"/>
          <Skeleton width="50%" height="16px"/>
        </div>
        <Skeleton width="60px" height="30px" />
        <div class="flex space-x-2">
          <Skeleton width="28px" height="28px"/>
          <Skeleton width="40px" height="28px"/>
          <Skeleton width="28px" height="28px"/>
        </div>
      </div>
    </template>

    <!-- Kalo ada barang di keranjang, kita tampilin list-nya -->
    <template v-else-if="cart?.cart_detail?.length">
      <div class="space-y-4">
        <div
          v-for="item in cart.cart_detail"
          :key="item.id"
          class="flex items-center bg-white rounded-2xl shadow-md p-4 border border-gray-200"
        >
          <!-- Checkbox buat milih barang mana yang mau dibayar -->
          <input
            type="checkbox"
            v-model="selectedIds"
            :value="item.id"
            class="mr-3 w-5 h-5 text-[#BF3131] border-gray-300 rounded"
          />

          <!-- Foto produknya -->
          <img
            :src="item.product?.foto_cover || 'https://placehold.co/100'"
            alt="Produk"
            class="w-20 h-20 object-cover rounded-lg border border-gray-200 mr-4"
          />

          <!-- Info detail produk di keranjang -->
          <div class="flex-1">
            <h2 class="font-bold text-lg text-black leading-tight">
              {{ item.product?.nama_product || 'Produk tidak ditemukan' }}
            </h2>

            <p class="text-sm text-gray-500">
              Toko : {{ item.product?.user?.toko?.nama_toko }}
            </p>

            <p class="text-sm text-gray-600 mt-1">
              {{ item.product?.deskripsi || 'Deskripsi tidak tersedia' }}
            </p>

            <div class="mt-2 space-y-0.5">
              <p class="text-xs text-gray-500">
                Harga satuan:
                <span class="font-semibold text-black">
                  Rp {{ formatRupiah(item.product?.harga) }}
                </span>
              </p>
              <p class="text-sm font-bold text-[#BF3131]">
                Subtotal: Rp {{ formatRupiah(item.harga) }}
              </p>
            </div>
          </div>

          <!-- Tombol buat buang barang dari keranjang -->
          <button
            @click="deleteProductcart(item.id)"
            class="bg-[#BF3131] hover:bg-[#a32727] text-white px-3 py-1 rounded-md text-sm ml-4"
          >
            Delete
          </button>

          <!-- Pengatur jumlah barang (quantity) -->
          <div class="flex items-center space-x-2 ml-4">
            <button
              @click="decrementQuantity(item)"
              class="w-7 h-7 flex items-center justify-center bg-gray-200 rounded text-lg font-bold"
            >−</button>

            <input
              type="number"
              min="1"
              :max="item.product?.stok"
              v-model.number="item.jumlah"
              @input="onQuantityChange(item)"
              class="w-12 h-8 text-center border border-gray-300 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#BF3131]"
            />

            <button
              @click="incrementQuantity(item)"
              class="w-7 h-7 flex items-center justify-center bg-gray-200 rounded text-lg font-bold"
            >＋</button>
          </div>
        </div>

        <!-- Bar bagian bawah buat nampilin total harga ama tombol checkout -->
        <div
          class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 px-4 py-3 flex justify-end items-center space-x-4 shadow-md"
        >
          <div class="flex items-center pr-4 border-r border-gray-300">
            <span class="font-bold text-lg">
              Total : Rp {{ formatRupiah(selectedTotal) }}
            </span>
          </div>

          <button
            class="bg-[#BF3131] hover:bg-[#a32727] text-white px-6 py-2 rounded-md font-semibold"
            @click="checkoutSelected"
          >
            Checkout
          </button>
        </div>
      </div>
      
    </template>

    <!-- Kalo keranjangnya kosong melompong -->
    <template v-else>
      <div class="text-center py-20 text-gray-400">
        Keranjang masih kosong...
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'
import router from '@/router'
import { showSuccess, showError, showConfirm } from '@/utils/alert'
import Skeleton from '@/components/Skeleton.vue'

// State buat data keranjang ama barang yang dipilih
const cart = ref(null)
const selectedIds = ref([])
const isLoading = ref(true)
let updateTimeout = null

// Fungsi biar angka harga keliatan rapi pake format Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value)
}

// Ngitung total harga cuma dari barang-barang yang dicentang user
const selectedTotal = computed(() => {
  if (!cart.value?.cart_detail) return 0
  return cart.value.cart_detail
    .filter(item => selectedIds.value.includes(item.id))
    .reduce((sum, item) => sum + (item.harga || 0), 0)
})

// Fungsi buat narik data keranjang dari server
const getCart = async () => {
  try {
    const response = await api.get('/cart')
    const data = response.data.data

    // Nanganin kalo respon datanya beda-beda (array atau object)
    if (Array.isArray(data)) {
      cart.value = data[0] || { cart_detail: [], total_harga: 0 }
    } else {
      cart.value = data || { cart_detail: [], total_harga: 0 }
    }
  } catch (error) {
    showError('Gagal mengambil data keranjang')
    console.error(error)
  } finally {
    isLoading.value = false
  } 
}

// Pas user ngetik manual jumlah barangnya
const onQuantityChange = (item) => {
  if (item.jumlah < 1) item.jumlah = 1

  // Jangan ampe ngelebihi stok yang ada di toko
  if (item.product?.stok && item.jumlah > item.product.stok) {
    item.jumlah = item.product.stok
    showError(`Jumlah melebihi stok! Maksimal cuma ${item.product.stok}`)
  }

  // Pake timeout biar gak keseringan nembak API pas lagi ngetik
  clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    updateCartItem(item, item.jumlah)
  }, 800)
}

// Fungsi buat ngabarin server kalo jumlah barang di keranjang berubah
const updateCartItem = async (item, newJumlah) => {
  try {
    await api.put(`/detailcart/${item.id}`, {
      jumlah: newJumlah,
      product_id: item.product_id,
    })
    // Tarik ulang data keranjang biar harganya update
    await getCart()
    showSuccess('Jumlah produk diperbarui')
  } catch (error) {
    showError('Gagal memperbarui jumlah produk')
    console.error(error)
  }
}

// Tombol plus buat nambah jumlah barang
const incrementQuantity = (item) => {
  if (item.product?.stok && item.jumlah >= item.product.stok) {
    item.jumlah = item.product.stok
    showError(`Jumlah melebihi stok! Maksimal cuma ${item.product.stok}`)
    return
  }

  item.jumlah++
  updateCartItem(item, item.jumlah)
}

// Tombol minus buat ngurangin jumlah barang
const decrementQuantity = (item) => {
  if (item.jumlah > 1) {
    item.jumlah--
    updateCartItem(item, item.jumlah)
  }
}

// Fungsi buat ngehapus barang dari keranjang belanja
const deleteProductcart = async (cartDetailId) => {
  try {
    const confirmed = await showConfirm('Yakin mau hapus barang ini dari keranjang?')
    if (!confirmed) return

    await api.delete(`/detailcart/${cartDetailId}`)
    await getCart()
    showSuccess('Produk berhasil dihapus')
  } catch (error) {
    showError('Gagal menghapus produk')
    console.error(error)
  }
}

// Fungsi buat proses barang-barang yang udah dipilih ke tahap checkout
const checkoutSelected = async () => {
  if (selectedIds.value.length === 0) {
    showError('Pilih minimal satu produk dulu buat dicheckout')
    return
  }

  try {
    const confirmed = await showConfirm('Yakin mau checkout barang-barang ini?')
    if (!confirmed) return

    // Kirim list ID barang yang mau dibayar
    const response = await api.post('/checkout/products', {
      cart_detail_ids: selectedIds.value
    })

    showSuccess('Checkout berhasil!')
    // Cus ke halaman checkout pake kode transaksi yang dikasih server
    router.push('/checkout/' + response.data.data.kode_transaksi)
  } catch (error) {
    showError('Checkout gagal, coba lagi ntar ya.')
    console.error(error)
  }
}

// Pas halaman kebuka, langsung tarik data keranjangnya
onMounted(async () => {
  await getCart()
})
</script>
