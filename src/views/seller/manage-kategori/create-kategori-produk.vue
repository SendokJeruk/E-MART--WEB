<template>
  <sellerside>
    <!-- Halaman Hubungkan Kategori: Penjual memilih kategori yang tepat untuk produk mereka -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Form Kategori Produk</h2>
      <form @submit.prevent="submitForm">
        
        <!-- Dropdown Pilih Produk Milik Seller -->
        <div class="mb-4">
          <label class="block mb-1 navbar-font">Pilih Produk</label>
          <select v-model="form.product_id" class="w-full border px-3 py-2 rounded inter-font" required>
            <option disabled value="">-- Pilih Produk Anda --</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.nama_product }}</option>
          </select>
        </div>

        <!-- Dropdown Pilih Kategori Sistem -->
        <div class="mb-4">
          <label class="block mb-1 navbar-font">Pilih Kategori</label>
          <select v-model="form.category_id" class="w-full border px-3 py-2 rounded inter-font" required>
            <option disabled value="">-- Pilih Kategori --</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.nama_category }}</option>
          </select>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
          Simpan Relasi
        </button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import sellerside from '@/components/navbar/seller-side.vue'
import { useRouter } from 'vue-router'
import { showError, showSuccess } from '@/utils/alert'

const router = useRouter()
const products = ref([])
const categories = ref([])
const form = ref({ product_id: '', category_id: '' })

/**
 * Mengambil list produk milik seller dan list kategori sistem.
 */
const loadInitialData = async () => {
  try {
    const resProd = await api.get('/product/myproducts', { params: { myproducts: true } });
    products.value = resProd.data.data.data || [];
    const resCat = await api.get('/category');
    categories.value = resCat.data.data.data || resCat.data.data || [];
  } catch (e) {}
}

const submitForm = async () => {
  try {
    await api.post('/category-product', form.value)
    showSuccess('Berhasil dihubungkan!'); router.push('/manage-kategori-produk')
  } catch (error) { showError('Gagal menyimpan. Pastikan data benar.'); }
}

onMounted(() => { loadInitialData() })
</script>
