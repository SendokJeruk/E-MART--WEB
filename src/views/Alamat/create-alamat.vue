<template>
  <Navbar />
  <!-- Halaman Tambah Alamat: Terintegrasi dengan API Wilayah Indonesia dan RajaOngkir -->
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Alamat Baru</h2>
    
    <form @submit.prevent="tambahAlamat" class="space-y-5 bg-white p-6 rounded-xl shadow-md">
      
      <!-- DROPDOWN WILAYAH (BERTINGKAT) -->
      <!-- Pilih Provinsi -->
      <div>
        <label class="block mb-1 font-semibold">Provinsi</label>
        <select v-model="form.province_name" @change="getKota" class="w-full border rounded-lg px-4 py-2">
          <option value="" disabled selected>Pilih Provinsi</option>
          <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
        </select>
      </div>

      <!-- Pilih Kota (Muncul setelah provinsi dipilih) -->
      <div v-if="cities.length">
        <label class="block mb-1 font-semibold">Kota/Kabupaten</label>
        <select v-model="form.city_name" @change="getKecamatan" class="w-full border rounded-lg px-4 py-2">
          <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
        </select>
      </div>

      <!-- Informasi Kode Domestik (Penting untuk cek ongkir) -->
      <div v-if="form.kode_domestik" class="text-green-700 font-bold">
        Kode Wilayah Ditemukan: {{ form.kode_domestik }}
      </div>

      <!-- Input Nama Penerima -->
      <div>
        <label class="block mb-1 font-semibold">Nama Penerima</label>
        <input type="text" v-model="form.nama_penerima" placeholder="Contoh: Budi" class="w-full border rounded-lg px-4 py-2" required />
      </div>

      <!-- Input Detail Alamat Lengkap -->
      <div>
        <label class="block mb-1 font-semibold">Alamat Lengkap</label>
        <textarea v-model="form.detail_alamat" placeholder="Jalan, RT/RW, No Rumah..." class="w-full border rounded-lg px-4 py-2" required></textarea>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-red-600 text-white px-6 py-2 rounded-lg font-bold">Simpan Alamat</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import api from "@/plugins/axios";
import { showSuccess, showError } from '@/utils/alert';
import { useRouter } from 'vue-router';

const router = useRouter();
const provinces = ref([]);
const cities = ref([]);
const form = ref({ nama_penerima: '', province_name: '', city_name: '', district_name: '', subdistrict_name: '', detail_alamat: '', kode_domestik: '' });

/**
 * Mengambil data provinsi dari API Publik Wilayah Indonesia.
 */
const loadProvinces = async () => {
  const res = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json');
  provinces.value = await res.json();
};

/**
 * Mengambil data kota berdasarkan provinsi yang dipilih.
 */
const getKota = async () => {
  const provId = provinces.value.find(p => p.name === form.value.province_name)?.id;
  const res = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/regencies/${provId}.json`);
  cities.value = await res.json();
};

/**
 * Menyimpan data alamat ke database backend.
 */
const tambahAlamat = async () => {
  try {
    await api.post('/alamat', form.value);
    showSuccess('Alamat disimpan!'); router.push('/alamat');
  } catch (e) { showError('Gagal menyimpan alamat'); }
};

onMounted(() => { loadProvinces(); });
</script>
