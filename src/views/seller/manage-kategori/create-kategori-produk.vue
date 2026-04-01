<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Form Tambah Kategori Produk</h2>
      <form @submit.prevent="submitForm">
        <!-- Produk Searchable -->
        <div class="mb-4 relative">
          <label for="product_search" class="block mb-1">Pilih Produk</label>
          <input
            type="text"
            id="product_search"
            v-model="productSearch"
            @input="filterProducts"
            placeholder="Cari Produk..."
            class="w-full border px-3 py-2 rounded"
            autocomplete="off"
            required
          />
          <ul
            v-if="filteredProducts.length > 0 && showProductDropdown"
            class="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-40 overflow-auto"
          >
            <li
              v-for="product in filteredProducts"
              :key="product.id"
              @click="selectProduct(product)"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ product.nama_product }}
            </li>
          </ul>
        </div>

        <!-- Kategori Searchable -->
        <div class="mb-4 relative">
          <label for="category_search" class="block mb-1">Pilih Kategori</label>
          <input
            type="text"
            id="category_search"
            v-model="categorySearch"
            @input="filterCategories"
            placeholder="Cari Kategori..."
            class="w-full border px-3 py-2 rounded"
            autocomplete="off"
            required
          />
          <ul
            v-if="filteredCategories.length > 0 && showCategoryDropdown"
            class="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-40 overflow-auto"
          >
            <li
              v-for="category in filteredCategories"
              :key="category.id"
              @click="selectCategory(category)"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ category.nama_category }}
            </li>
          </ul>
        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import Sellerside from '@/components/navbar/seller-side.vue'
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'
import { showError, showSuccess } from '@/utils/alert'

const router = useRouter()

const ProductSeller = ref([])
const categories = ref([])

// Form params: pakai nama_product & nama_category
const form = ref({
  product: '',
  category: ''
})

// Search & filtered lists
const productSearch = ref('')
const categorySearch = ref('')
const filteredProducts = ref([])
const filteredCategories = ref([])
const showProductDropdown = ref(false)
const showCategoryDropdown = ref(false)

// GET Products & Categories
const getProduct = async () => {
  try {
    const response = await api.get('/product/myproducts')
    ProductSeller.value = response.data.data.data || []
    filteredProducts.value = ProductSeller.value
  } catch (error) {
    console.error(error)
  }
}

const getCategories = async () => {
  try {
    const response = await api.get('/category')
    categories.value = response.data.data.data || []
    filteredCategories.value = categories.value
  } catch (error) {
    console.error(error)
  }
}

const filterProducts = () => {
  showProductDropdown.value = true
  filteredProducts.value = ProductSeller.value.filter(p =>
    p.nama_product.toLowerCase().includes(productSearch.value.toLowerCase())
  )
}

const filterCategories = () => {
  showCategoryDropdown.value = true
  filteredCategories.value = categories.value.filter(c =>
    c.nama_category.toLowerCase().includes(categorySearch.value.toLowerCase())
  )
}

const selectProduct = (product) => {
  form.value.product = product.nama_product
  productSearch.value = product.nama_product
  showProductDropdown.value = false
}

const selectCategory = (category) => {
  form.value.category = category.nama_category
  categorySearch.value = category.nama_category
  showCategoryDropdown.value = false
}

// Submit
const submitForm = async () => {
  try {
    console.log('Data dikirim:', form.value)
    const response = await api.post('/category-product', form.value)
    showSuccess('Category Produk Berhasil Ditambahkan!')
    form.value = { product: '', category: '' }
    productSearch.value = ''
    categorySearch.value = ''
    router.push('/manage-kategori-produk')
  } catch (error) {
    console.error(error.response?.data)
    showError(error.response?.data?.message || 'Gagal menambahkan produk')
  }
}

onMounted(async () => {
  await getProduct()
  await getCategories()
})
</script>