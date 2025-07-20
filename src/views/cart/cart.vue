<template>
    <Navbar />
  <div class="p-4 space-y-4 bg-[#FFF5F5] min-h-screen">
    <h1 class="text-xl font-bold text-[#7D0A0A] mb-4">Keranjang</h1>

    <div v-if="cart && cart.cart_detail.length" class="space-y-3">
      <div
        v-for="item in cart.cart_detail"
        :key="item.id"
        class="bg-white rounded-lg shadow flex p-3 items-center"
      >
        <img
          :src="item.product?.foto_cover || 'https://via.placeholder.com/100'"
          alt="Produk"
          class="w-16 h-16 object-cover rounded mr-3 border"
        />
        <div class="flex-1">
          <h2 class="text-sm font-semibold text-gray-800">
            {{ item.product?.nama_product || 'Produk tidak ditemukan' }}
          </h2>
          <p class="text-xs text-gray-500 mt-1">Toko: {{ item.product?.nama_toko || 'Default Store' }}</p>
          <div class="flex justify-between items-center mt-2">
            <p class="text-sm font-bold text-red-600">
              Rp {{ formatRupiah(item.harga) }}
            </p>
            <div class="flex items-center space-x-2">
              <div class="flex items-center space-x-2">
                    <button
                        @click="decrementQuantity(item)"
                        class="px-2 py-0.5 bg-gray-200 rounded text-sm"
                    >
                        −
                    </button>
                    <span class="text-sm">{{ item.jumlah }}</span>
                    <button
                        @click="incrementQuantity(item)"
                        class="px-2 py-0.5 bg-gray-200 rounded text-sm"
                    >
                        ＋
                    </button>
                </div>
            </div>
          </div>
        </div>
        <button
          @click="deleteProductcart(item.id)"
          class="text-red-500 text-xs ml-2"
        >
          ✕
        </button>
      </div>

      <div class="text-right mt-4 border-t pt-4">
        <p class="text-sm text-gray-700">Total:</p>
        <p class="text-lg font-bold text-[#7D0A0A]">Rp {{ formatRupiah(cart.total_harga) }}</p>
        <button 
        @click="checkoutCart"
        class="mt-3 w-full py-2 bg-[#BF3131] text-white rounded-md hover:bg-[#a32727] text-sm font-semibold">
          Checkout
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

const cart = ref(null)
const allProducts = ref([])

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(value)
}

const getAllProducts = async () => {
  try {
    const response = await api.get('/product')
    allProducts.value = response.data.data.data
  } catch (error) {
    console.error('Gagal mengambil semua produk:', error)
  }
}

const getCart = async () => {
  try {
    const response = await api.get('/cart')
    if (response.data.data.length > 0) {
      const cartData = response.data.data[0]

      for (const item of cartData.cart_detail) {
        const found = allProducts.value.find(p => p.id === item.product_id)
        item.product = found || null
      }

      cart.value = cartData
    }
  } catch (error) {
    console.error('Gagal mengambil data keranjang:', error)
  }
}

const updateCartItem = async (item, newJumlah) => {
  if (newJumlah < 1) return 

  try {
    await api.put(`/detailcart/${item.id}`, {
      jumlah: newJumlah,
      product_id: item.product_id,
    })
    await getCart()
  } catch (error) {
    console.error('Gagal memperbarui jumlah produk:', error)
  }
}

const incrementQuantity = (item) => {
  updateCartItem(item, item.jumlah + 1)
}

const decrementQuantity = (item) => {
  updateCartItem(item, item.jumlah - 1)
}

const checkoutCart = async () => {
  try {
    const confirmed = confirm('Yakin ingin melakukan checkout?')
    if (!confirmed) return

    await api.post('/checkout') 
    alert('Checkout berhasil!')
    cart.value = null 
    router.push('/checkout')
  } catch (error) {
    console.error('Gagal checkout:', error)
    alert('Checkout gagal, coba lagi.')
  }
}

const deleteProductcart = async (cartDetailId) => {
  try {
    const confirmed = confirm('Yakin ingin menghapus item ini dari keranjang?')
    if (!confirmed) return

    await api.delete(`/cart-detail/${cartDetailId}`)
    await getCart()
  } catch (error) {
    console.error('Gagal menghapus item cart:', error)
  }
}

onMounted(async () => {
  await getAllProducts()
  await getCart()
})
</script>

<style scoped>
@media (min-width: 768px) {
  /* Supaya card tetap sempit di desktop */
  .container {
    max-width: 480px;
    margin: 0 auto;
  }
}
</style>
