<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Edit Foto Produk</h2>
      
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
              <span class="font-medium">Upload Foto Produk Baru</span>
              <div v-if="selectedFileName" class="text-sm text-gray-500">
                {{ selectedFileName }}
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                />
              </svg>
            </div>
            <input id="foto" type="file" @change="handleFileUpload" class="sr-only" />
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
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import { showError, showSuccess } from '@/utils/alert'

const route = useRoute()
const router = useRouter()

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
    if (form.value.foto) {
        formData.append('foto', form.value.foto)
    }
    formData.append('_method', 'PUT')

    await api.post(`/foto/${route.params.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (form.value.product_id) {
        try {
            await api.put(`/foto-product/${route.params.id}`, {
                product_id: form.value.product_id
            })
        } catch(e) {
            console.warn('Gagal update relasi produk', e)
        }
    }

    showSuccess('Data berhasil diubah!')
    router.push('/manage-foto-product')
  } catch (error) {
    console.error('Gagal submit form:', error);
    const errors = error.response?.data?.errors;
    let errorMessage = error.response?.data?.message || 'Gagal mengubah data.';
    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }
    showError(errorMessage);
  }
}

onMounted(() => {
  getProfile()
})
</script>

<style>
</style>