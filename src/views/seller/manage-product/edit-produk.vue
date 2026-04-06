<template>
  <Sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded overflow-x-hidden">
      <!-- Penampakan form pas lagi nunggu data produk lama ditarik -->
      <template v-if="isLoading">
        <h2 class="text-xl font-bold mb-4">Form Update Produk</h2>
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

      <!-- Form asli buat ngubah detail barang dagangan kamu -->
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
            <label class="block mb-1">Harga (Angka aja)</label>
            <input
              v-model="form.harga"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Stok Barang</label>
            <input
              v-model="form.stock"
              type="number"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Berat (Gram)</label>
            <input
              v-model="form.berat"
              type="number"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Status Pajang</label>
            <select
              v-model="form.status"
              class="w-full border px-3 py-2 rounded"
            >
              <option value="">Pilih status</option>
              <option value="draft">Draft (Simpen)</option>
              <option value="publish">Publish (Jual)</option>
            </select>
          </div>

          <!-- Input milih foto sampul baru kalo mau diganti -->
          <div class="mb-4">
            <label
              for="foto_cover"
              class="block rounded border border-gray-300 p-4 cursor-pointer"
            >
              <div class="flex items-center justify-center gap-4">

                <span class="font-medium">Ganti Foto Sampul</span>

                <!-- Nama file baru yang kepilih -->
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
            Update Produk
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

// State form buat nampung data barang yang lagi diedit
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

// Pas seller milih file foto baru
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFileName.value = file.name;
    form.value.foto_cover = file;  
  }
};

// Fungsi tarik data barang lama berdasarkan ID dari URL
const fetchProduct = async () => {
  try {
    const response = await api.get(`/product?id=${route.params.id}`);
    const product = response.data.data.data[0];
    // Masukin data lamanya ke form biar seller gak ngetik ulang
    form.value.nama_product = product.nama_product;
    form.value.deskripsi = product.deskripsi;
    form.value.harga = product.harga;
    form.value.stock = product.stock;
    form.value.berat = product.berat;
    form.value.status = product.status_produk;
    selectedFileName.value = product.foto_cover || 'Gak ada foto';
  } catch (error) {
    console.error('Gagal ambil info barang:', error);
    showError('Yah, gagal narik data barangnya nih.');
  } finally {
    isLoading.value = false;
  }
};

// Fungsi utama buat ngirim update-an barang ke server
const submitForm = async () => {
  try {
    const formData = new FormData();

    formData.append('nama_product', form.value.nama_product);
    formData.append('deskripsi', form.value.deskripsi);
    formData.append('harga', form.value.harga);
    formData.append('stock', form.value.stock);
    formData.append('berat', form.value.berat);
    formData.append('status_produk', form.value.status);
    
    // Foto cuma dikirim kalo seller emang milih file baru
    if (form.value.foto_cover instanceof File) {
      formData.append('foto_cover', form.value.foto_cover);  
    }

    // Pake trik _method=PUT karena kirim file lewat FormData
    formData.append('_method', 'PUT');

    await api.post(`/product/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    showSuccess('Sip! Barang kamu udah diupdate.');
    // Balikin ke halaman kelola barang
    router.push('/manage-produk');  
  } catch (error) {
    // Kalo error, kasih tau apa yang salah
    const errors = error.response?.data?.errors;
    let errorMessage = error.response?.data?.message || 'Gagal update barangnya.';

    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }

    showError(errorMessage);
  }
};

// Pas halaman kebuka, langsung sikat tarik datanya
onMounted(() => {
  fetchProduct()  
})
</script>

<style>

</style>