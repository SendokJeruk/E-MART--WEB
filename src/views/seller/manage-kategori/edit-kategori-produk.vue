<template>
  <sellerside>
    <!-- Halaman Edit Kategori Produk: Mengubah kategori yang sudah terhubung dengan produk -->
    <div class="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 class="text-xl font-bold mb-4">Edit Kategori Produk</h2>

      <form @submit.prevent="submitForm">
        <!-- Pilihan Produk -->
        <div class="mb-4">
          <label class="block mb-1 font-medium">Nama Produk</label>
          <input :value="selectedProductName" class="w-full border p-2 bg-gray-100" disabled />
        </div>

        <!-- Dropdown Pilih Kategori Baru -->
        <div class="mb-4">
          <label class="block mb-1 font-medium">Pilih Kategori Baru</label>
          <select v-model="form.category_id" class="w-full border p-2" required>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nama_category }}</option>
          </select>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded w-full font-bold">Update Kategori</button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import Sellerside from '@/components/navbar/seller-side.vue'
import api from '@/plugins/axios'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { showError, showSuccess } from '@/utils/alert'

const route = useRoute()
const router = useRouter()
const categories = ref([])
const selectedProductName = ref('')
const form = ref({ product_id: '', category_id: '' })

/**
 * Mengambil data awal (Kategori & Produk) saat halaman dimuat.
 */
const loadData = async () => {
  const resCat = await api.get('/category');
  categories.value = resCat.data.data.data || [];
  
  // Ambil detail hubungan kategori-produk yang sedang diedit
  const resPivot = await api.get(`/category-product?id=${route.params.id}`);
  const data = resPivot.data.data.data[0];
  if (data) {
    selectedProductName.value = data.product.nama_product;
    form.value = { product_id: data.product_id, category_id: data.category_id };
  }
}

const submitForm = async () => {
  try {
    await api.put(`/category-product/${route.params.id}`, form.value);
    showSuccess('Berhasil diperbarui!'); router.push('/manage-kategori-produk');
  } catch (e) { showError('Gagal memperbarui kategori'); }
}

onMounted(() => { loadData() })
</script>
