<template>
  <Navbar />
  <!-- Halaman Edit Alamat: User dapat memperbarui detail alamat pengiriman yang sudah ada -->
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit Alamat Pengiriman</h2>
    
    <div v-if="isLoading" class="text-center py-10"><p class="text-gray-500">Memuat data...</p></div>

    <form v-else @submit.prevent="updateAlamat" class="space-y-5 bg-white p-6 rounded-xl shadow-md">
      <!-- Input Nama Penerima -->
      <div><label class="block mb-1 font-semibold">Nama Penerima</label><input v-model="form.nama_penerima" type="text" class="w-full border rounded-lg px-4 py-2" required /></div>

      <!-- Dropdown Provinsi & Kota (Masih bisa diubah) -->
      <div>
        <label class="block mb-1 font-semibold">Provinsi</label>
        <select v-model="form.province_name" @change="getKota" class="w-full border rounded-lg px-4 py-2">
          <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
        </select>
      </div>

      <!-- Detail Alamat (Jalan, No Rumah) -->
      <div><label class="block mb-1 font-semibold">Detail Alamat Lengkap</label><textarea v-model="form.detail_alamat" class="w-full border rounded-lg px-4 py-2" required></textarea></div>

      <div class="flex justify-end gap-3">
        <router-link to="/alamat" class="bg-gray-300 px-6 py-2 rounded-lg">Batal</router-link>
        <button type="submit" class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold">Simpan Perubahan</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import api from "@/plugins/axios";
import { showSuccess, showError } from '@/utils/alert';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isLoading = ref(true);
const provinces = ref([]);
const cities = ref([]);
const form = ref({ nama_penerima: '', province_name: '', city_name: '', detail_alamat: '' });

/**
 * Mengambil data alamat lama berdasarkan ID yang dikirim melalui URL.
 */
const fetchAlamatData = async () => {
  try {
    const res = await api.get(`/alamat`);
    const data = res.data.data.data.find(a => a.id == route.params.id);
    if (data) { form.value = { ...data }; await loadProvinces(); }
  } finally { isLoading.value = false; }
};

const loadProvinces = async () => {
  const res = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json');
  provinces.value = await res.json();
};

/**
 * Mengirim perintah Update ke server.
 */
const updateAlamat = async () => {
  try {
    await api.put(`/alamat/${route.params.id}`, form.value);
    showSuccess('Alamat diperbarui!'); router.push('/alamat');
  } catch (e) { showError('Gagal memperbarui alamat'); }
};

onMounted(() => { fetchAlamatData(); });
</script>
