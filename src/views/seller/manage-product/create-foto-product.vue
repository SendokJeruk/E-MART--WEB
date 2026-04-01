<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Form Upload Foto dan Hubungkan ke Produk</h2>
      
      <form @submit.prevent="submitForm">

        <!-- Dropdown search -->
        <div class="mb-4 relative">
          <label class="block mb-1">Cari Produk</label>
          <input
            type="text"
            v-model="search"
            @input="getProduct(search)"
            @focus="showDropdown = true"
            @blur="hideDropdown"
            placeholder="Cari produk..."
            class="w-full border px-3 py-2 rounded"
          />

          <!-- Dropdown list -->
          <ul
            v-show="showDropdown && ProductSeller.length"
            class="absolute z-10 w-full bg-white border rounded mt-1 max-h-60 overflow-y-auto shadow"
          >
            <li
              v-for="product in ProductSeller"
              :key="product.id"
              @mousedown.prevent="selectProduct(product)"
              class="px-3 py-2 hover:bg-blue-100 cursor-pointer"
            >
              {{ product.nama_product }}
            </li>
          </ul>
        </div>

        <!-- Hidden select binding -->
        <select v-model="form.product_id" class="hidden" required>
          <option v-for="product in ProductSeller" :key="product.id" :value="product.id">{{ product.nama_product }}</option>
        </select>

        <!-- Upload foto -->
        <div class="mb-4">
          <label for="foto" class="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer">
            <div class="flex items-center justify-center gap-4">
              <span class="font-medium">Upload Foto Produk</span>
              <div v-if="selectedFileName" class="text-sm text-gray-500">
                {{ selectedFileName }}
              </div>
            </div>
            <input id="foto" type="file" @change="handleFileUpload" class="sr-only" required />
          </label>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit
        </button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import { showError, showSuccess } from '@/utils/alert'

const user = ref({})
const ProductSeller = ref([])
const search = ref('')
const showDropdown = ref(false)

const form = ref({
  foto: null,
  product_id: '',
})
const selectedFileName = ref('')

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.foto = file
    selectedFileName.value = file.name
  }
}

// Fungsi untuk menampilkan dropdown saat blur
const hideDropdown = () => {
  // beri delay supaya klik list tidak hilang
  setTimeout(() => showDropdown.value = false, 100)
}

// Saat user pilih item
const selectProduct = (product) => {
  search.value = product.nama_product
  form.value.product_id = product.id
  showDropdown.value = false
}

const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
    await getProduct()
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

const getProduct = async (keyword = '') => {
  try {
    const response = await api.get('/product/myproducts', {
      params: { nama_product: keyword }
    })
    ProductSeller.value = Array.isArray(response.data.data.data) ? response.data.data.data : []
  } catch (error) {
    console.error('Error fetching product:', error)
    ProductSeller.value = []
  }
}

const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('foto', form.value.foto)

    const uploadFoto = await api.post('/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const fotoId = uploadFoto.data.data.id

    await api.post('/foto-product', {
      foto_id: fotoId,
      product_id: form.value.product_id
    })

    showSuccess('Foto dan relasi produk berhasil dibuat!')

    form.value.foto = null
    form.value.product_id = ''
    search.value = ''
    selectedFileName.value = ''
  } catch (error) {
    console.error('Gagal submit form:', error)
    showError(error.response?.data?.message || 'Gagal menambahkan data.')
  }
}

onMounted(() => {
  getProfile()
})
</script>