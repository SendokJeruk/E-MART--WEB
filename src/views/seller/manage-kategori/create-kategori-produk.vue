<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Form Tambah Kategori Produk</h2>
      <!-- Form buat nyambungin barang dagangan ama kategori yang udah ada -->
      <form @submit.prevent="submitForm">
        
        <!-- Kolom milih produk pake fitur pencarian biar gampang -->
        <div class="mb-4 relative">
          <label for="product_search" class="block mb-1">Pilih Produk</label>
          <input
            type="text"
            id="product_search"
            v-model="productSearch"
            @input="filterProducts"
            placeholder="Ketik nama produk kamu..."
            class="w-full border px-3 py-2 rounded"
            autocomplete="off"
            required
          />
          <!-- Daftar saran produk yang nongol pas lagi ngetik -->
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

        <!-- Kolom milih kategori, sama kayak produk ada fitur nyarinya juga -->
        <div class="mb-4 relative">
          <label for="category_search" class="block mb-1">Pilih Kategori</label>
          <input
            type="text"
            id="category_search"
            v-model="categorySearch"
            @input="filterCategories"
            placeholder="Cari kategori yang cocok..."
            class="w-full border px-3 py-2 rounded"
            autocomplete="off"
            required
          />
          <!-- Daftar saran kategori buat dipilih -->
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
          Hubungkan Sekarang
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

// State buat nyimpen data mentah ama hasil filter
const ProductSeller = ref([])
const categories = ref([])

// Objek form yang bakal dikirim ke server
const form = ref({
  product: '',
  category: ''
})

const productSearch = ref('')
const categorySearch = ref('')
const filteredProducts = ref([])
const filteredCategories = ref([])
const showProductDropdown = ref(false)
const showCategoryDropdown = ref(false)

// Fungsi tarik daftar produk milik si seller sendiri
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

// Tarik semua daftar kategori umum dari database
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

// Timer buat nunggu user selese ngetik sebelum nembak API produk (debounce)
let productTimeout;
const filterProducts = () => {
  showProductDropdown.value = true
  clearTimeout(productTimeout);
  productTimeout = setTimeout(() => {
    getProduct(productSearch.value);
  }, 300);
}

// Timer buat nunggu user selese ngetik sebelum nembak API kategori
let categoryTimeout;
const filterCategories = () => {
  showCategoryDropdown.value = true
  clearTimeout(categoryTimeout);
  categoryTimeout = setTimeout(() => {
    getCategories(categorySearch.value);
  }, 300);
}

// Pas user milih produk dari dropdown
const selectProduct = (product) => {
  form.value.product = product.nama_product
  productSearch.value = product.nama_product
  showProductDropdown.value = false
}

// Pas user milih kategori dari dropdown
const selectCategory = (category) => {
  form.value.category = category.nama_category
  categorySearch.value = category.nama_category
  showCategoryDropdown.value = false
}

// Fungsi utama buat ngirim relasi produk-kategori ke server
const submitForm = async () => {
  try {
    console.log('Kirim data:', form.value)
    const response = await api.post('/category-product', form.value)
    showSuccess('Beres! Produk kamu udah ada kategorinya sekarang.')
    // Reset inputan biar bersih lagi
    form.value = { product: '', category: '' }
    productSearch.value = ''
    categorySearch.value = ''
    // Balikin seller ke halaman daftar kategori produk
    router.push('/manage-kategori-produk')
  } catch (error) {
    console.error(error.response?.data)
    showError(error.response?.data?.message || 'Yah, gagal nyambungin kategorinya.')
  }
}

// Pas halaman baru dibuka, tarik data awal
onMounted(async () => {
  await getProduct()
  await getCategories()
})
</script>