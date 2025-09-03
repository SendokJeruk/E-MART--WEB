<template>
  <Navbar />
  <div class="p-4 min-h-screen bg-[#FFFFFF]">
    <h1 class="text-2xl font-bold navbar-font mb-4">| Keranjang</h1>

    <div v-if="cart?.cart_detail?.length" class="space-y-4">
      <div
        v-for="item in cart.cart_detail"
        :key="item.id"
        class="flex items-center bg-white rounded-2xl shadow-md p-4 border border-gray-200"
      >
        <img
          :src="item.product?.foto_cover || 'https://via.placeholder.com/100'"
          alt="Produk"
          class="w-20 h-20 object-cover rounded-lg border border-gray-200 mr-4"
        />

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

        <button
          @click="deleteProductcart(item.id)"
          class="bg-[#BF3131] hover:bg-[#a32727] text-white px-3 py-1 rounded-md text-sm ml-4"
        >
          Delete
        </button>

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

      <div
        class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 px-4 py-3 flex justify-end items-center space-x-4 shadow-md"
      >
        <div class="flex items-center pr-4 border-r border-gray-300">
          <span class="font-bold text-lg">
            Total : Rp {{ formatRupiah(cart.total_harga) }}
          </span>
        </div>

        <button
          class="bg-[#BF3131] hover:bg-[#a32727] text-white px-6 py-2 rounded-md font-semibold"
          @click="checkoutCart"
        >
          Checkout
        </button>

        <button class="bg-gray-200 px-4 py-2 rounded-md text-sm">
          Voucher <span class="font-bold">0</span>
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-400">
      Keranjang masih kosong...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import Navbar from '@/components/navbar/navbar.vue'
import router from '@/router'
import { showSuccess, showError, showConfirm } from '@/utils/alert' 

const cart = ref(null)
let updateTimeout = null 

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value)
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
    showSuccess('Jumlah produk diperbarui')
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

const checkoutCart = async () => {
  try {
    const confirmed = await showConfirm('Yakin ingin melakukan checkout?')
    if (!confirmed) return

    const response = await api.post('/checkout')
    console.log(response)
    showSuccess('Checkout berhasil!')
    cart.value = null
    router.push('/checkout/'+response.data.data.kode_transaksi)
  } catch (error) {
    showError('Checkout gagal, coba lagi.')
    console.error(error)
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

onMounted(async () => {
  await getCart()
})
</script>
