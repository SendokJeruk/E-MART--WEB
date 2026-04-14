<template>
  <Navbar />
  <div class="p-4 min-h-screen bg-gray-50 pb-32">
    <h1 class="navbar-font text-xl flex items-center gap-2 mb-4">
      <span class="block w-1 h-6 bg-[#BF3131] rounded-sm"></span>
      Keranjang
    </h1>

    <!-- Skeleton -->
    <template v-if="isLoading">
      <div
        v-for="n in 3"
        :key="n"
        class="bg-white rounded-xl border border-gray-200 p-4 mb-3"
      >
        <div class="grid grid-cols-[auto_auto_1fr] gap-3">
          <Skeleton width="16px" height="16px" class="mt-1" />
          <Skeleton width="80px" height="80px" class="rounded-lg" />
          <div class="space-y-2">
            <Skeleton width="75%" height="16px" />
            <Skeleton width="50%" height="12px" />
            <Skeleton width="100%" height="12px" />
            <Skeleton width="33%" height="16px" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="cart?.cart_detail?.length">
      <!-- Pilih semua -->
      <div class="flex items-center gap-2 mb-3 px-1">
        <input
          type="checkbox"
          id="select-all"
          :checked="allSelected"
          :indeterminate="someSelected && !allSelected"
          @change="toggleAll($event.target.checked)"
          class="w-4 h-4 accent-[#BF3131] cursor-pointer"
        />
        <label for="select-all" class="inter-font text-sm text-gray-500 cursor-pointer">
          Pilih semua ({{ cart.cart_detail.length }} produk)
        </label>
      </div>

      <!-- List produk -->
      <div class="space-y-3">
        <div
          v-for="item in cart.cart_detail"
          :key="item.id"
          class="bg-white rounded-xl border border-gray-200 p-4"
        >
          <div class="grid grid-cols-[auto_auto_1fr] gap-3 items-start">
            <!-- Checkbox -->
            <input
              type="checkbox"
              :checked="selectedIds.includes(item.id)"
              @change="toggleItem(item.id)"
              class="mt-1 w-4 h-4 accent-[#BF3131] cursor-pointer"
            />

            <!-- Foto -->
            <img
              :src="item.product?.foto_cover || 'https://placehold.co/80'"
              alt="Produk"
              class="w-20 h-20 object-cover rounded-lg border border-gray-100 flex-shrink-0"
            />

            <!-- Info -->
            <div class="min-w-0">
              <h2 class="navbar-font text-sm text-gray-900 leading-snug truncate">
                {{ item.product?.nama_product || 'Produk tidak ditemukan' }}
              </h2>
              <p class="inter-font text-xs text-gray-400 mt-0.5">
                Toko: {{ item.product?.user?.toko?.nama_toko }}
              </p>
              <p class="inter-font text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {{ item.product?.deskripsi || 'Deskripsi tidak tersedia' }}
              </p>

              <!-- Harga -->
              <div class="mt-2 space-y-0.5">
                <p class="inter-font text-xs text-gray-400">
                  Harga satuan:
                  <span class="font-medium text-gray-800">
                    Rp {{ formatRupiah(item.product?.harga) }}
                  </span>
                </p>
                <p class="inter-font text-sm font-semibold text-[#BF3131]">
                  Subtotal: Rp {{ formatRupiah(item.harga) }}
                </p>
              </div>

              <!-- Footer: qty + hapus -->
              <div class="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
                <!-- Qty -->
                <div class="flex items-center gap-1.5">
                  <button
                    @click="decrementQuantity(item)"
                    class="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-base font-semibold transition-colors"
                  >−</button>

                  <input
                    type="number"
                    min="1"
                    :max="item.product?.stok"
                    v-model.number="item.jumlah"
                    @input="onQuantityChange(item)"
                    class="inter-font w-11 h-7 text-center text-sm font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#BF3131]"
                  />

                  <button
                    @click="incrementQuantity(item)"
                    class="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-base font-semibold transition-colors"
                  >+</button>
                </div>

                <!-- Hapus -->
                <button
                  @click="deleteProductcart(item.id)"
                  class="inter-font px-3 py-1.5 text-xs font-medium text-[#BF3131] border border-[#BF3131] rounded-md hover:bg-[#BF3131] hover:text-white transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
        <span class="text-4xl opacity-30">🛒</span>
        <p class="inter-font text-sm">Keranjang masih kosong...</p>
      </div>
    </template>
  </div>

  <!-- Checkout bar -->
  <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-4 shadow-sm z-10">
    <div>
      <p class="inter-font text-xs text-gray-400 mb-0.5">Total dipilih</p>
      <p class="navbar-font text-base text-gray-900">
        Rp {{ formatRupiah(selectedTotal) }}
      </p>
    </div>
    <button
      class="inter-font bg-[#BF3131] hover:bg-[#a32727] text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
      @click="checkoutSelected"
    >
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
let notificationTimeout = null

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value)
}

// Hitung total harga dari item yang dicentang
const selectedTotal = computed(() => {
  if (!cart.value?.cart_detail) return 0
  return cart.value.cart_detail
    .filter(item => selectedIds.value.includes(item.id))
    .reduce((sum, item) => sum + (item.harga || 0), 0)
})

// Cek apakah semua item tercentang
const allSelected = computed(() => {
  if (!cart.value?.cart_detail?.length) return false
  return cart.value.cart_detail.every(item => selectedIds.value.includes(item.id))
})

// Cek apakah sebagian item tercentang (untuk indeterminate)
const someSelected = computed(() => {
  if (!cart.value?.cart_detail?.length) return false
  return cart.value.cart_detail.some(item => selectedIds.value.includes(item.id))
})

// Toggle satu item
const toggleItem = (id) => {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(idx, 1)
  }
}

// Toggle semua item
const toggleAll = (checked) => {
  if (!cart.value?.cart_detail) return
  if (checked) {
    selectedIds.value = cart.value.cart_detail.map(item => item.id)
  } else {
    selectedIds.value = []
  }
}

const getCart = async () => {
  try {
    const response = await api.get('/cart')
    const data = response.data.data

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

const onQuantityChange = (item) => {
  if (item.jumlah < 1) item.jumlah = 1

  if (item.product?.stok && item.jumlah > item.product.stok) {
    item.jumlah = item.product.stok
    showError(`Jumlah melebihi stok! Maksimal hanya ${item.product.stok}`)
  }

  clearTimeout(updateTimeout)
  updateTimeout = setTimeout(() => {
    updateCartItem(item, item.jumlah)
  }, 800)
}

const updateCartItem = async (item, newJumlah) => {
  try {
    await api.put(`/detailcart/${item.id}`, {
      jumlah: newJumlah,
      product_id: item.product_id,
    })
    await getCart()

    clearTimeout(notificationTimeout)
    notificationTimeout = setTimeout(() => {
      showSuccess('Jumlah produk diperbarui')
    }, 1000)

  } catch (error) {
    showError('Gagal memperbarui jumlah produk')
    console.error(error)
  }
}

const incrementQuantity = (item) => {
  if (item.product?.stok && item.jumlah >= item.product.stok) {
    item.jumlah = item.product.stok
    showError(`Jumlah melebihi stok! Maksimal hanya ${item.product.stok}`)
    return
  }
  item.jumlah++
  updateCartItem(item, item.jumlah)
}

const decrementQuantity = (item) => {
  if (item.jumlah > 1) {
    item.jumlah--
    updateCartItem(item, item.jumlah)
  }
}

const deleteProductcart = async (cartDetailId) => {
  try {
    const confirmed = await showConfirm('Yakin ingin menghapus item ini dari keranjang?')
    if (!confirmed) return

    await api.delete(`/detailcart/${cartDetailId}`)
    await getCart()
    showSuccess('Produk berhasil dihapus dari keranjang')
  } catch (error) {
    showError('Gagal menghapus produk dari keranjang')
    console.error(error)
  }
}

const checkoutSelected = async () => {
  if (selectedIds.value.length === 0) {
    showError('Pilih minimal satu produk untuk checkout')
    return
  }

  try {
    const confirmed = await showConfirm('Yakin ingin checkout produk terpilih?')
    if (!confirmed) return

    const response = await api.post('/checkout/products', {
      cart_detail_ids: selectedIds.value
    })

    showSuccess('Checkout berhasil!')
    router.push('/checkout/' + response.data.data.kode_transaksi)
  } catch (error) {
    showError('Checkout gagal, coba lagi.')
    console.error(error)
  }
}

onMounted(async () => {
  await getCart()
})
</script>