<template>
  <sellerside>
    <div class="max-w-md mx-auto p-6 bg-white shadow rounded">
      <!-- Judul halaman edit relasi kategori barang -->
      <h2 class="text-xl font-bold mb-4">Form Edit Kategori Produk</h2>

      <form @submit.prevent="submitForm">
        <!-- Input milih produk dagangan punya seller -->
        <div class="mb-4 relative">
          <label class="block mb-1 font-medium">Pilih Produk</label>
          <!-- Tombol dropdown palsu buat pamer nama produk yang dipilih -->
          <div
            class="border px-3 py-2 rounded cursor-pointer bg-white"
            @click="toggleDropdown('product')"
          >
            {{ selectedProductName || 'Cari & pilih produk kamu...' }}
          </div>
          <!-- Area daftar produk yang nongol pas diklik -->
          <div
            v-if="openDropdown === 'product'"
            class="absolute z-10 w-full bg-white border rounded mt-1 shadow"
          >
            <input
              type="text"
              v-model="searchProduct"
              placeholder="Ketik buat nyari..."
              class="w-full px-3 py-2 border-b focus:outline-none"
            />
            <ul class="max-h-40 overflow-y-auto">
              <li
                v-for="p in filteredProducts"
                :key="p.id"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                @click="selectProduct(p)"
              >
                {{ p.nama_product }}
              </li>
              <li v-if="filteredProducts.length === 0" class="px-3 py-2 text-gray-500">
                Gak ada produknya nih
              </li>
            </ul>
          </div>
        </div>

        <!-- Input milih kategori buat dipasang ke barang tadi -->
        <div class="mb-4 relative">
          <label class="block mb-1 font-medium">Pilih Kategori</label>
          <div
            class="border px-3 py-2 rounded cursor-pointer bg-white"
            @click="toggleDropdown('category')"
          >
            {{ selectedCategoryName || 'Cari & pilih kategori baru...' }}
          </div>
          <div
            v-if="openDropdown === 'category'"
            class="absolute z-10 w-full bg-white border rounded mt-1 shadow"
          >
            <input
              type="text"
              v-model="searchCategory"
              placeholder="Cari kategorinya..."
              class="w-full px-3 py-2 border-b focus:outline-none"
            />
            <ul class="max-h-40 overflow-y-auto">
              <li
                v-for="c in filteredCategories"
                :key="c.id"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                @click="selectCategory(c)"
              >
                {{ c.nama_category }}
              </li>
              <li v-if="filteredCategories.length === 0" class="px-3 py-2 text-gray-500">
                Kategori-nya gak nemu
              </li>
            </ul>
          </div>
        </div>

        <!-- Tombol buat update perubahan datanya -->
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Update Sekarang
        </button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import Sellerside from '@/components/navbar/seller-side.vue'
import api from '@/plugins/axios'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { showError, showSuccess } from '@/utils/alert'

// Siapin state buat nampung data list ama pilihan seller
const ProductSeller = ref([])
const categories = ref([])
const form = ref({
  product_id: '',
  category_id: ''
})

const router = useRouter()
const route = useRoute()

// Urusan status buka-tutup dropdown ama kata kunci cari
const openDropdown = ref(null)
const searchProduct = ref('')
const searchCategory = ref('')
const selectedProductName = ref('')
const selectedCategoryName = ref('')

// Fungsi buat gonta-ganti dropdown mana yang mau dipantau
const toggleDropdown = (type) => {
  openDropdown.value = openDropdown.value === type ? null : type
}

// Pas seller milih barang dagangannya
const selectProduct = (product) => {
  form.value.product_id = product.id
  selectedProductName.value = product.nama_product
  openDropdown.value = null
  searchProduct.value = ''
}


// Pas seller milih kategorinya
const selectCategory = (category) => {
  form.value.category_id = category.id
  selectedCategoryName.value = category.nama_category
  openDropdown.value = null
  searchCategory.value = ''
}

// List buat nampung hasil saringan pencarian
const filteredProducts = ref([])
const filteredCategories = ref([])

// Fungsi tarik daftar produk milik si seller ini doang
const getProducts = async (search = '') => {
  try {
    const res = await api.get('/product/myproducts', {
      params: { myproducts: true, nama_product: search }
    })
    ProductSeller.value = res.data.data.data || []
    filteredProducts.value = ProductSeller.value
  } catch (err) {
    console.error('Gagal ambil produk kamu nih:', err)
  }
}

// Fungsi tarik semua daftar kategori yang ada
const getCategories = async (search = '') => {
  try {
    const res = await api.get('/category', {
      params: { nama_category: search }
    })

    // Cek respon datanya biar gak error pas dibaca
    let cats = []
    if (Array.isArray(res.data.data)) {
      cats = res.data.data
    } else if (res.data.data?.data) {
      cats = res.data.data.data
    }
    categories.value = cats
    filteredCategories.value = cats
  } catch (err) {
    console.error('Gagal ambil daftar kategori:', err)
    categories.value = []
    filteredCategories.value = []
  }
}

// Pantau kotak pencarian produk, pake timer biar gak boros request (debounce)
let productTimeout
watch(searchProduct, (newVal) => {
  clearTimeout(productTimeout)
  productTimeout = setTimeout(() => {
    getProducts(newVal)
  }, 300)
})

// Pantau kotak pencarian kategori
let categoryTimeout
watch(searchCategory, (newVal) => {
  clearTimeout(categoryTimeout)
  categoryTimeout = setTimeout(() => {
    getCategories(newVal)
  }, 300)
})


// Fungsi utama buat ngirim data update ke server
const submitForm = async () => {
  // Pastiin dua-duanya udah kepilih biar gak ditolak server
  if (!form.value.product_id || !form.value.category_id) {
    showError('Pilih produk ama kategorinya dulu ya!')
    return
  }
  try {
    await api.put(`/category-product/${route.params.id}`, {
      product_id: form.value.product_id,
      category_id: form.value.category_id
    })
    showSuccess('Relasi kategori produk udah diupdate, sip!')
  } catch (err) {
    console.error('Gagal update relasi-nya:', err)
    showError(err.response?.data?.message || 'Yah, gagal update nih.')
  }
}


// Pas halaman dibuka, langsung sikat ambil datanya
onMounted(() => {
  getProducts()
  getCategories()
})
</script>
