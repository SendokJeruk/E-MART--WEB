<template>
  <sellerside>
    <div class="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Form Edit Kategori Produk</h2>

      <form @submit.prevent="submitForm">
        <!-- Dropdown Produk -->
        <div class="mb-4 relative">
          <label class="block mb-1 font-medium">Pilih Produk</label>
          <div
            class="border px-3 py-2 rounded cursor-pointer bg-white"
            @click="toggleDropdown('product')"
          >
            {{ selectedProductName || 'Cari & pilih produk...' }}
          </div>
          <div
            v-if="openDropdown === 'product'"
            class="absolute z-10 w-full bg-white border rounded mt-1 shadow"
          >
            <input
              type="text"
              v-model="searchProduct"
              placeholder="Cari produk..."
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
                Tidak ada produk
              </li>
            </ul>
          </div>
        </div>

        <!-- Dropdown Kategori -->
        <div class="mb-4 relative">
          <label class="block mb-1 font-medium">Pilih Kategori</label>
          <div
            class="border px-3 py-2 rounded cursor-pointer bg-white"
            @click="toggleDropdown('category')"
          >
            {{ selectedCategoryName || 'Cari & pilih kategori...' }}
          </div>
          <div
            v-if="openDropdown === 'category'"
            class="absolute z-10 w-full bg-white border rounded mt-1 shadow"
          >
            <input
              type="text"
              v-model="searchCategory"
              placeholder="Cari kategori..."
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
                Tidak ada kategori
              </li>
            </ul>
          </div>
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Update
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

// State
const ProductSeller = ref([])
const categories = ref([])
const form = ref({
  product_id: '',
  category_id: ''
})

const router = useRouter()
const route = useRoute()

// Dropdown state
const openDropdown = ref(null)
const searchProduct = ref('')
const searchCategory = ref('')
const selectedProductName = ref('')
const selectedCategoryName = ref('')

// Toggle dropdown
const toggleDropdown = (type) => {
  openDropdown.value = openDropdown.value === type ? null : type
}

const selectProduct = (product) => {
  form.value.product_id = product.id
  selectedProductName.value = product.nama_product
  openDropdown.value = null
  searchProduct.value = ''
}


// Select category
const selectCategory = (category) => {
  form.value.category_id = category.id
  selectedCategoryName.value = category.nama_category
  openDropdown.value = null
  searchCategory.value = ''
}

// Filtered list
const filteredProducts = ref([])
const filteredCategories = ref([])

// Ambil data produk seller
const getProducts = async (search = '') => {
  try {
    const res = await api.get('/product/myproducts', {
      params: { myproducts: true, nama_product: search }
    })
    ProductSeller.value = res.data.data.data || []
    filteredProducts.value = ProductSeller.value
  } catch (err) {
    console.error('Gagal ambil produk:', err)
  }
}

// Ambil data kategori
const getCategories = async (search = '') => {
  try {
    const res = await api.get('/category', {
      params: { nama_category: search }
    })

    // cek apakah res.data.data array atau object
    let cats = []
    if (Array.isArray(res.data.data)) {
      cats = res.data.data
    } else if (res.data.data?.data) {
      cats = res.data.data.data
    }
    categories.value = cats
    filteredCategories.value = cats
  } catch (err) {
    console.error('Gagal ambil kategori:', err)
    categories.value = []
    filteredCategories.value = []
  }
}

let productTimeout
watch(searchProduct, (newVal) => {
  clearTimeout(productTimeout)
  productTimeout = setTimeout(() => {
    getProducts(newVal)
  }, 300)
})

let categoryTimeout
watch(searchCategory, (newVal) => {
  clearTimeout(categoryTimeout)
  categoryTimeout = setTimeout(() => {
    getCategories(newVal)
  }, 300)
})


const submitForm = async () => {
  if (!form.value.product_id || !form.value.category_id) {
    showError('Harap pilih produk dan kategori terlebih dahulu!')
    return
  }
  try {
    await api.put(`/category-product/${route.params.id}`, {
      product_id: form.value.product_id,
      category_id: form.value.category_id
    })
    showSuccess('Kategori produk berhasil diperbarui!')
  } catch (err) {
    console.error('Gagal update kategori produk:', err)
    showError(err.response?.data?.message || 'Gagal update kategori produk')
  }
}


onMounted(() => {
  getProducts()
  getCategories()
})
</script>
