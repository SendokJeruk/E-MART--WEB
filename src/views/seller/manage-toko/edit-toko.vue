<template>
  <sellerside>
    <!-- Halaman Edit Toko: Tempat seller mengubah informasi publik toko mereka -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Edit Informasi Toko</h2>

      <!-- Skeleton: Animasi saat data toko sedang dimuat -->
      <div v-if="isLoading" class="space-y-4"><Skeleton height="40px" v-for="n in 3" :key="n" /></div>

      <form v-else @submit.prevent="submitForm">
        <!-- Input Nama Toko, Deskripsi, dan No Telepon -->
        <div class="mb-4"><label class="block mb-1">Nama Toko</label><input v-model="form.nama_toko" type="text" class="w-full border p-2" required /></div>
        <div class="mb-4"><label class="block mb-1">Tentang Toko</label><textarea v-model="form.deskripsi" class="w-full border p-2" rows="3"></textarea></div>
        <div class="mb-4"><label class="block mb-1">Nomor Telepon Toko</label><input v-model="form.no_telp" type="text" class="w-full border p-2" required /></div>

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Simpan Perubahan Toko</button>
      </form>
    </div>
  </sellerside>
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
const isLoading = ref(true)
const form = ref({ nama_toko: '', deskripsi: '', no_telp: '' })

/**
 * Mengambil data detail toko yang saat ini terdaftar.
 */
const fetchToko = async () => {
  try {
    const res = await api.get(`/toko?id=${route.params.id}`);
    const t = res.data.data.data[0];
    form.value = { nama_toko: t.nama_toko, deskripsi: t.deskripsi, no_telp: t.no_telp };
  } finally { isLoading.value = false; }
};

const submitForm = async () => {
  try {
    await api.put(`/toko/${route.params.id}`, form.value);
    showSuccess('Toko diperbarui!'); router.push('/manage-toko');
  } catch (e) { showError('Gagal memperbarui data toko.'); }
};

onMounted(() => { fetchToko() })
</script>
