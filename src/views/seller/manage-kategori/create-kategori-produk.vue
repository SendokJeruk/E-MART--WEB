<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Form Tambah Kategori Produk</h2>
      <form @submit.prevent="submitForm">
        <!-- Produk Searchable -->
        <div class="mb-4 relative">
          <label for="product_search" class="block mb-1 navbar-font">Pilih Produk</label>
          <input
            type="text"
            id="product_search"
            v-model="productSearch"
            @input="filterProducts"
            placeholder="Cari Produk..."
            class="w-full border px-3 py-2 rounded inter-font"
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
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer inter-font"
            >
              {{ product.nama_product }}
            </li>
          </ul>
        </div>

        <!-- Kategori Searchable -->
        <div class="mb-4 relative">
          <label for="category_search" class="block mb-1 navbar-font">Pilih Kategori</label>
          <input
            type="text"
            id="category_search"
            v-model="categorySearch"
            @input="filterCategories"
            placeholder="Cari Kategori..."
            class="w-full border px-3 py-2 rounded inter-font"
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
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer inter-font"
            >
              {{ category.nama_category }}
            </li>
          </ul>
        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 navbar-font"
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

// Form params: pakai product_id & category_id
const form = ref({
  product_id: '',
  category_id: ''
})

// Search & filtered lists
const productSearch = ref('')
const categorySearch = ref('')
const filteredProducts = ref([])
const filteredCategories = ref([])
const showProductDropdown = ref(false)
const showCategoryDropdown = ref(false)

// GET Products & Categories
const getProduct = async (search = '') => {
  try {
    const response = await api.get('/product/myproducts', {
      params: { nama_product: search }
    })
    ProductSeller.value = response.data.data.data || []
    filteredProducts.value = ProductSeller.value
  } catch (error) {
    console.error(error)
  }
}

const getCategories = async (search = '') => {
  try {
    const response = await api.get('/category', {
      params: { nama_category: search }
    })
    categories.value = response.data.data.data || []
    filteredCategories.value = categories.value
  } catch (error) {
    console.error(error)
  }
}

let productTimeout;
const filterProducts = () => {
  showProductDropdown.value = true
  form.value.product_id = ''
  clearTimeout(productTimeout);
  productTimeout = setTimeout(() => {
    getProduct(productSearch.value);
  }, 300);
}

let categoryTimeout;
const filterCategories = () => {
  showCategoryDropdown.value = true
  form.value.category_id = ''
  clearTimeout(categoryTimeout);
  categoryTimeout = setTimeout(() => {
    getCategories(categorySearch.value);
  }, 300);
}

const selectProduct = (product) => {
  form.value.product_id = product.id
  productSearch.value = product.nama_product
  showProductDropdown.value = false
}

const selectCategory = (category) => {
  form.value.category_id = category.id
  categorySearch.value = category.nama_category
  showCategoryDropdown.value = false
}

// Submit
const submitForm = async () => {
  try {
    console.log('Data dikirim:', form.value)
    const response = await api.post('/category-product', form.value)
    showSuccess('Category Produk Berhasil Ditambahkan!')
    form.value = { product_id: '', category_id: '' }
    productSearch.value = ''
    categorySearch.value = ''
    router.push('/manage-kategori-produk')
  } catch (error) {
    const errors = error.response?.data?.errors;
    let errorMessage = error.response?.data?.message || 'Gagal menambahkan produk.';

    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }

    showError(errorMessage);
  }
}

onMounted(async () => {
  await getProduct()
  await getCategories()
})
</script>