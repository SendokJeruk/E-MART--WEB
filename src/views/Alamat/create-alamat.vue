<template>
  <Navbar />
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Alamat</h2>
    
    <form @submit.prevent="tambahAlamat" class="space-y-5 bg-white p-6 rounded-xl shadow-md">
      
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Label Alamat</label>
        <input type="text" v-model="form.label" disabled class="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700" />
      </div>

      <div>
        <label class="block mb-1 font-semibold text-gray-700">Provinsi</label>
        <select v-model="form.province_name" @change="getKota" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none">
          <option value="" disabled selected>Pilih Provinsi</option>
          <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
        </select>
      </div>

      <div v-if="cities.length">
        <label class="block mb-1 font-semibold text-gray-700">Kota/Kabupaten</label>
        <select v-model="form.city_name" @change="getKecamatan" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none">
          <option value="" disabled selected>Pilih Kota</option>
          <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
        </select>
      </div>

      <div v-if="districts.length">
        <label class="block mb-1 font-semibold text-gray-700">Kecamatan</label>
        <select v-model="form.district_name" @change="getKelurahan" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none">
          <option value="" disabled selected>Pilih Kecamatan</option>
          <option v-for="district in districts" :key="district.id" :value="district.name">{{ district.name }}</option>
        </select>
      </div>

      <div v-if="subdistricts.length">
        <label class="block mb-1 font-semibold text-gray-700">Kelurahan</label>
        <select v-model="form.subdistrict_name" class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none">
          <option value="" disabled selected>Pilih Kelurahan</option>
          <option v-for="sub in subdistricts" :key="sub.id" :value="sub.name">{{ sub.name }}</option>
        </select>
      </div>

      <div class="flex justify-between items-center">
        <button type="button" @click="cariKodeDomestik" class="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-4 py-2 rounded-lg shadow">
          Cari Kode Domestik
        </button>

        <div v-if="form.kode_domestik" class="text-green-700 font-semibold">
          Kode Domestik: {{ form.kode_domestik }}
        </div>
      </div>

      <div v-if="searchResults.length" class="border rounded p-3 max-h-48 overflow-auto mt-3 bg-gray-50">
        <p class="mb-2 font-semibold">Pilih alamat yang sesuai:</p>
        <ul>
          <li
            v-for="item in searchResults"
            :key="item.id"
            class="cursor-pointer p-2 hover:bg-gray-200 rounded"
            @click="pilihAlamat(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>

      <div>
        <label class="block mb-1 font-semibold text-gray-700">Detail Alamat</label>
        <textarea v-model="form.detail_alamat" placeholder="Masukkan detail alamat lengkap..." class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"></textarea>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="bg-red-600 hover:bg-red-700 transition text-white font-semibold px-6 py-2 rounded-lg shadow">
          Simpan
        </button>
      </div>

      <div v-if="successMessage" class="text-green-600 font-medium">{{ successMessage }}</div>
      <div v-if="errorMessages" class="text-red-600 space-y-1">
        <div v-for="(msg, key) in errorMessages" :key="key">{{ msg }}</div>
      </div>
    </form>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref, watch, onMounted } from 'vue';
import api from "@/plugins/axios";

const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const subdistricts = ref([]);

const form = ref({
  kode_domestik: '',
  label: '',
  province_name: '',
  city_name: '',
  district_name: '',
  subdistrict_name: '',
  zip_code: '',
  detail_alamat: ''
});

const errorMessages = ref(null);
const successMessage = ref(null);

const searchResults = ref([]);

watch(
  () => [
    form.value.subdistrict_name,
    form.value.district_name,
    form.value.city_name,
    form.value.province_name,
    form.value.zip_code
  ],
  () => {
    const { subdistrict_name, district_name, city_name, province_name, zip_code } = form.value;
    const parts = [subdistrict_name, district_name, city_name, province_name, zip_code].filter(Boolean);
    form.value.label = parts.join(', ');
    form.value.kode_domestik = '';  
    searchResults.value = [];       
  }
);

const tambahAlamat = async () => {
  try {
    errorMessages.value = null;
    successMessage.value = null;

    const response = await api.post('/alamat', form.value);
    successMessage.value = response.data.message;
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errorMessages.value = error.response.data.errors;
    } else {
      errorMessages.value = { general: 'Terjadi kesalahan server' };
    }
  }
};


const dapat_Alamat = async () => {
  try {
    const response = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json');
    if (!response.ok) throw new Error('Gagal load provinsi');
    provinces.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const getKota = async () => {
  const selectedProvince = provinces.value.find(p => p.name === form.value.province_name);
  if (selectedProvince) {
    try {
      const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/regencies/${selectedProvince.id}.json`);
      if (!response.ok) throw new Error('Gagal load kota');
      cities.value = await response.json();
      districts.value = [];
      subdistricts.value = [];
      form.value.city_name = '';
      form.value.district_name = '';
      form.value.subdistrict_name = '';
    } catch (error) {
      console.error(error);
    }
  }
};

const getKecamatan = async () => {
  const selectedCity = cities.value.find(c => c.name === form.value.city_name);
  if (selectedCity) {
    try {
      const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/districts/${selectedCity.id}.json`);
      if (!response.ok) throw new Error('Gagal load kecamatan');
      districts.value = await response.json();
      subdistricts.value = [];
      form.value.district_name = '';
      form.value.subdistrict_name = '';
    } catch (error) {
      console.error(error);
    }
  }
};

const getKelurahan = async () => {
  const selectedDistrict = districts.value.find(d => d.name === form.value.district_name);
  if (selectedDistrict) {
    try {
      const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/villages/${selectedDistrict.id}.json`);
      if (!response.ok) throw new Error('Gagal load kelurahan');
      subdistricts.value = await response.json();
      form.value.subdistrict_name = '';
    } catch (error) {
      console.error(error);
    }
  }
};

const cariKodeDomestik = async () => {
  if (!form.value.label) {
    errorMessages.value = { general: 'Lengkapi alamat sebelum mencari kode domestik.' };
    return;
  }
  errorMessages.value = null;
  successMessage.value = null;
  try {
    const searchQuery = encodeURIComponent(form.value.label);
    const response = await api.get(`/rajaongkir/domestic?search=${searchQuery}`);
    const results = response.data.data || [];

    if (results.length === 0) {
      errorMessages.value = { general: 'Kode domestik tidak ditemukan untuk alamat ini.' };
      form.value.kode_domestik = '';
      searchResults.value = [];
    } else if (results.length === 1) {
      form.value.kode_domestik = results[0].id;
      searchResults.value = [];
    } else {
      searchResults.value = results;
      form.value.kode_domestik = '';
    }
  } catch (err) {
    console.error(err);
    errorMessages.value = { general: 'Gagal mengambil kode domestik.' };
    form.value.kode_domestik = '';
    searchResults.value = [];
  }
};

// User pilih alamat dari hasil pencarian
const pilihAlamat = (item) => {
  form.value.kode_domestik = item.kode_domestik || item.id;
  form.value.label = item.label;
  form.value.zip_code = item.zip_code || ''; 
  searchResults.value = [];
};



onMounted(() => {
  dapat_Alamat();
});
</script>

<style>
/* styling tambahan jika diperlukan */
</style>
