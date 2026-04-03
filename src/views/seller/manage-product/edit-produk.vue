<template>
  <Sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded overflow-x-hidden">
      <!-- LOADING -->
      <template v-if="isLoading">
        <h2 class="text-xl font-bold mb-4">Form Tambah Produk</h2>
        <div class="space-y-4">
          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="40px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="80px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="40px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="40px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="40px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="40px"/>
          </div>

          <Skeleton height="60px"/>
          <Skeleton width="120px" height="40px"/>
        </div>
      </template>

      <!-- FORM -->
      <template v-else>
        <h2 class="text-xl font-bold mb-4">Form Update Produk</h2>
        <form @submit.prevent="submitForm">

          <div class="mb-4">
            <label class="block mb-1">Nama Produk</label>
            <input
              v-model="form.nama_product"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Deskripsi</label>
            <textarea
              v-model="form.deskripsi"
              class="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Harga</label>
            <input
              v-model="form.harga"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Stok</label>
            <input
              v-model="form.stock"
              type="number"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Berat</label>
            <input
              v-model="form.berat"
              type="number"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Status Produk</label>
            <select
              v-model="form.status"
              class="w-full border px-3 py-2 rounded"
            >
              <option value="">Pilih status</option>
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
            </select>
          </div>

          <div class="mb-4">
            <label
              for="foto_cover"
              class="block rounded border border-gray-300 p-4 cursor-pointer"
            >
              <div class="flex items-center justify-center gap-4">

                <span class="font-medium">Upload Foto Produk</span>

                <div v-if="selectedFileName" class="text-sm text-gray-500 truncate w-full max-w-xs">
                  {{ selectedFileName }}
                </div>
              </div>
              <input
                id="foto_cover"
                @change="handleFileUpload"
                type="file"
                accept="image/*"
                class="sr-only"
              />
            </label>
          </div>

          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>

        </form>
      </template>
    </div>
  </Sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Sellerside from '@/components/navbar/seller-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import { showError, showSuccess } from '@/utils/alert'

const route = useRoute()
const router = useRouter()

const form = ref({
  nama_product: '',
  deskripsi: '',
  harga: '',
  stock: '',
  berat: '',
  status: '',
  foto_cover: null,  
})

const isLoading = ref(true)
const selectedFileName = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFileName.value = file.name;
    form.value.foto_cover = file;  
  }
};

const fetchProduct = async () => {
  try {
    const response = await api.get(`/product?id=${route.params.id}`);
    const product = response.data.data.data[0];
    form.value.nama_product = product.nama_product;
    form.value.deskripsi = product.deskripsi;
    form.value.harga = product.harga;
    form.value.stock = product.stock;
    form.value.berat = product.berat;
    form.value.status = product.status_produk;
    selectedFileName.value = product.foto_cover || 'Tidak ada file';
  } catch (error) {
    console.error('Gagal mengambil data produk:', error);
    showError('Gagal mengambil data produk.');
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();

    formData.append('nama_product', form.value.nama_product);
    formData.append('deskripsi', form.value.deskripsi);
    formData.append('harga', form.value.harga);
    formData.append('stock', form.value.stock);
    formData.append('berat', form.value.berat);
    formData.append('status_produk', form.value.status);
    if (form.value.foto_cover) {
      formData.append('foto_cover', form.value.foto_cover);  
    }


    await api.put(`/product/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    showSuccess('Produk berhasil diperbarui!');
    router.push('/manage-produk');  
  } catch (error) {
    const errors = error.response?.data?.errors;
    let errorMessage = error.response?.data?.message || 'Gagal menambahkan produk.';

    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }

    showError(errorMessage);
  }
};

onMounted(() => {
  fetchProduct()  
})
</script>

<style>

</style>