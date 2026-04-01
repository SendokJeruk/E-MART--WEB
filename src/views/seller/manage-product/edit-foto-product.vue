<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl font-bold mb-4">Form Upload Foto dan Hubungkan ke Produk</h2>
        <form @submit.prevent="submitForm">
          
          <div class="mb-4">
            <label for="product_id" class="block mb-1">Pilih Produk</label>
            <select
              id="product_id"
              v-model="form.product_id"
              class="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Produk --</option>
              <option
                v-for="product in ProductSeller"
                :key="product.id"
                :value="product.id"
              >
                {{ product.nama_product }}
              </option>
            </select>
          </div>
  
          <div class="mb-4">
            <label for="foto" class="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer">
              <div class="flex items-center justify-center gap-4">
                <span class="font-medium">Upload Foto Produk</span>
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
              <input
                id="foto"
                name="foto"
                type="file"
                @change="handleFileUpload"
                class="sr-only" 
                required
              />
            </label>
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
import { ref, onMounted } from 'vue'
  import api from '@/plugins/axios'
  import sellerside from '@/components/navbar/seller-side.vue'
  import { showError, showSuccess } from '@/utils/alert'

  const user = ref({})
  const ProductSeller = ref([]);

  const form = ref({
    foto: null,
    product_id: '',
  })

  const selectedFileName = ref('')
  
  const products = ref([]) 
  
  const handleFileUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.value.foto = file
    selectedFileName.value = file.name
  }
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
  
  const getProduct = async () => {
  try {
    const response = await api.get('/product');
    if (Array.isArray(response.data.data.data)) {
      products.value = response.data.data.data;
      ProductSeller.value = products.value.filter(p => p.user_id === user.value.id);
    } else {
      console.error("Data Produk tidak berupa array:", response.data.data.data);
    }
  } catch (error) {
    console.error('Error fetching product:', error);
  }
};

// const fetchFoto = async () => {
//     try{
//         const response = await api.get(`/foto?id=${route.params.id}`);
//         const foto = response.data.data.data[0];
//         form.value.product_id = .product_id
//     }
// }

</script>

<style>

</style>