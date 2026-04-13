<template>
  <sellerside>
    <!-- Halaman Buka Toko: Syarat utama bagi seller agar bisa mulai berjualan barang -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Daftarkan Toko Anda</h2>
      
      <form @submit.prevent="submitForm">
        <!-- Input Nama Toko, Deskripsi, dan Kontak -->
        <div class="mb-4"><label class="block mb-1">Nama Toko</label><input v-model="form.nama_toko" type="text" class="w-full border p-2" placeholder="Contoh: Toko Berkah" required /></div>
        <div class="mb-4"><label class="block mb-1">Deskripsi Singkat</label><input v-model="form.deskripsi" type="text" class="w-full border p-2" placeholder="Toko kami menjual..." required /></div>
        <div class="mb-4"><label class="block mb-1">Nomor Telepon Toko</label><input v-model="form.no_telp" type="text" class="w-full border p-2" required /></div>

        <!-- DROPDOWN WILAYAH TOKO (Penting untuk Lokasi Pengiriman/Origin RajaOngkir) -->
        <div class="mb-4">
          <label class="block mb-1">Provinsi Lokasi Toko</label>
          <select v-model="form.province_name" @change="getKota" class="w-full border p-2" required>
            <option value="" disabled>Pilih Provinsi</option>
            <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
          </select>
        </div>

        <div v-if="cities.length" class="mb-4">
          <label class="block mb-1">Kota/Kabupaten</label>
          <select v-model="form.city_name" class="w-full border p-2" required>
            <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
          </select>
        </div>

        <!-- Detail Alamat Fisik Toko -->
        <div class="mb-4"><label class="block mb-1">Alamat Lengkap Toko</label><textarea v-model="form.detail_alamat" class="w-full border p-2" rows="2" required></textarea></div>

        <button type="submit" class="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Buka Toko Sekarang</button>
      </form>
    </div>
  </sellerside>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Sellerside from '@/components/navbar/seller-side.vue';
import api from '@/plugins/axios';
import { showSuccess, showError } from '@/utils/alert';
import { useRouter } from 'vue-router';

const router = useRouter();
const provinces = ref([]);
const cities = ref([]);
const form = ref({ nama_toko: '', deskripsi: '', no_telp: '', province_name: '', city_name: '', detail_alamat: '', kode_domestik: '1' });

/**
 * Mengambil data wilayah untuk menentukan titik pengiriman barang (Shipping Origin).
 */
const loadWilayah = async () => {
  const res = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json');
  provinces.value = await res.json();
};

const getKota = async () => {
  const provId = provinces.value.find(p => p.name === form.value.province_name)?.id;
  const res = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/regencies/${provId}.json`);
  cities.value = await res.json();
};

const submitForm = async () => {
  try {
    await api.post('/toko', form.value);
    showSuccess('Toko Anda resmi dibuka!'); router.push('/manage-toko');
  } catch (e) { showError('Gagal membuka toko. Periksa kembali inputan Anda.'); }
};

onMounted(() => { loadWilayah(); });
</script>
