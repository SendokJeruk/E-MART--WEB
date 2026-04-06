<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Form Upload Foto Produk</h2>
      
      <form @submit.prevent="submitForm">

        <!-- Kolom cari produk buat ditempelin foto baru -->
        <div class="mb-4 relative">
          <label class="block mb-1">Cari Produk Kamu</label>
          <input
            type="text"
            v-model="search"
            @input="getProduct(search)"
            @focus="showDropdown = true"
            @blur="hideDropdown"
            placeholder="Ketik nama produk..."
            class="w-full border px-3 py-2 rounded"
          />

          <!-- Daftar saran produk yang muncul pas lagi ngetik -->
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

        <!-- Hidden select buat nangkep ID produk-nya -->
        <select v-model="form.product_id" class="hidden" required>
          <option v-for="product in ProductSeller" :key="product.id" :value="product.id">{{ product.nama_product }}</option>
        </select>

        <!-- Kotak buat milih file foto produk tambahan -->
        <div class="mb-4">
          <label for="foto" class="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer">
            <div class="flex items-center justify-center gap-4">
              <span class="font-medium">Pilih Foto Produk</span>
              <div v-if="selectedFileName" class="text-sm text-gray-500">
                {{ selectedFileName }}
              </div>
            </div>
            <input id="foto" type="file" @change="handleFileUpload" class="sr-only" required />
          </label>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Upload Sekarang
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

// Pas seller milih file foto
const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    form.value.foto = file
    selectedFileName.value = file.name
  }
}

// Nutup dropdown saringan produk kalo udah gak fokus
const hideDropdown = () => {
  setTimeout(() => showDropdown.value = false, 100)
}

// Pas seller ngeklik salah satu produk di daftar
const selectProduct = (product) => {
  search.value = product.nama_product
  form.value.product_id = product.id
  showDropdown.value = false
}

// Tarik data profil seller pas halaman kebuka
const getProfile = async () => {
  try {
    const response = await api.get('/profile')
    user.value = response.data.data
    await getProduct()
  } catch (error) {
    console.error('Gagal mengambil profil:', error)
  }
}

// Fungsi nyari produk berdasarkan nama
const getProduct = async (keyword = '') => {
  try {
    const response = await api.get('/product/myproducts', {
      params: { nama_product: keyword }
    })
    ProductSeller.value = Array.isArray(response.data.data.data) ? response.data.data.data : []
  } catch (error) {
    console.error('Gagal ambil data produk:', error)
    ProductSeller.value = []
  }
}

// Fungsi utama buat nge-upload foto terus disambungin ke produk
const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('foto', form.value.foto)

    // Langkah 1: Upload dulu mentahan fotonya
    const uploadFoto = await api.post('/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    const fotoId = uploadFoto.data.data.id

    // Langkah 2: Hubungin ID foto tadi ke ID produk pilihan
    await api.post('/foto-product', {
      foto_id: fotoId,
      product_id: form.value.product_id
    })

    showSuccess('Mantap! Fotonya udah nempel ama produknya.')

    // Bersihin form biar bisa upload foto lagi
    form.value.foto = null
    form.value.product_id = ''
    search.value = ''
    selectedFileName.value = ''
  } catch (error) {
    console.error('Gagal upload fotonya nih:', error)
    showError(error.response?.data?.message || 'Aduh, gagal nyimpen fotonya.')
  }
}

onMounted(() => {
  getProfile()
})
</script>