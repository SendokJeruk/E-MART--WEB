<template>
  <Navbar />
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Alamat</h2>
    
    <form @submit.prevent="tambahAlamat" class="space-y-5 bg-white p-6 rounded-xl shadow-md">
      
      <!-- Label Alamat -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Label Alamat</label>
        <input 
          type="text" 
          v-model="form.label" 
          disabled 
          class="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700" 
        />
      </div>

      <!-- Provinsi -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Provinsi</label>
        <select 
          v-model="form.province_name" 
          @change="getKota" 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          <option value="" disabled selected>Pilih Provinsi</option>
          <option v-for="prov in provinces" :key="prov.id" :value="prov.name">{{ prov.name }}</option>
        </select>
      </div>

      <!-- Kota -->
      <div v-if="cities.length">
        <label class="block mb-1 font-semibold text-gray-700">Kota/Kabupaten</label>
        <select 
          v-model="form.city_name" 
          @change="getKecamatan" 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          <option value="" disabled selected>Pilih Kota</option>
          <option v-for="city in cities" :key="city.id" :value="city.name">{{ city.name }}</option>
        </select>
      </div>

      <!-- Kecamatan -->
      <div v-if="districts.length">
        <label class="block mb-1 font-semibold text-gray-700">Kecamatan</label>
        <select 
          v-model="form.district_name" 
          @change="getKelurahan" 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          <option value="" disabled selected>Pilih Kecamatan</option>
          <option v-for="district in districts" :key="district.id" :value="district.name">{{ district.name }}</option>
        </select>
      </div>

      <!-- Kelurahan -->
      <div v-if="subdistricts.length">
        <label class="block mb-1 font-semibold text-gray-700">Kelurahan</label>
        <select 
          v-model="form.subdistrict_name" 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          <option value="" disabled selected>Pilih Kelurahan</option>
          <option v-for="sub in subdistricts" :key="sub.id" :value="sub.name">{{ sub.name }}</option>
        </select>
      </div>

      <!-- Kode Domestik & Zip -->
      <div class="flex justify-between items-center">
        <div v-if="showKodeDomestik" class="text-green-700 font-semibold">
          Kode Domestik: {{ form.kode_domestik }} <br />
          Zip Code: {{ form.zip_code }}
        </div>
      </div>

      <!-- Dropdown jika multiple searchResults -->
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

      <!-- Detail Alamat -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Detail Alamat</label>
        <textarea 
          v-model="form.detail_alamat" 
          placeholder="Masukkan detail alamat lengkap..." 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        ></textarea>
      </div>

      <!-- Submit -->
      <div class="flex justify-end">
        <button type="submit" class="bg-red-600 hover:bg-red-700 transition text-white font-semibold px-6 py-2 rounded-lg shadow">
          Simpan
        </button>
      </div>

      <!-- Pesan -->
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
import { showSuccess, showError } from '@/utils/alert';

const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const subdistricts = ref([]);
const showKodeDomestik = ref(false);
const successMessage = ref('');
const errorMessages = ref([]);

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

const searchResults = ref([]);

watch(() => form.value.subdistrict_name, (newVal) => {
  if (!newVal) return;
  const { subdistrict_name, district_name, city_name, province_name } = form.value;
  const parts = [subdistrict_name, district_name, city_name, province_name].filter(Boolean);
  form.value.label = parts.join(', ');

  cariKodeDomestik();
});

// Tambah alamat
const tambahAlamat = async () => {
  try {
    const response = await api.post('/alamat', form.value);
    successMessage.value = response.data.message || 'Alamat berhasil disimpan';
    showSuccess(successMessage.value);
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const messages = Object.values(error.response.data.errors).flat();
      errorMessages.value = messages;
      showError(messages.join('\n'));
    } else {
      showError('Terjadi kesalahan server');
    }
  }
};

// Ambil provinsi
const dapat_Alamat = async () => {
  try {
    const response = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json');
    if (!response.ok) throw new Error('Gagal load provinsi');
    provinces.value = await response.json();
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
};

// Ambil kota
const getKota = async () => {
  const selectedProvince = provinces.value.find(p => p.name === form.value.province_name);
  if (!selectedProvince) {
    cities.value = districts.value = subdistricts.value = [];
    return;
  }
  try {
    const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/regencies/${selectedProvince.id}.json`);
    if (!response.ok) throw new Error('Gagal load kota');
    cities.value = await response.json();
    districts.value = subdistricts.value = [];
    form.value.city_name = form.value.district_name = form.value.subdistrict_name = '';
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
};

// Ambil kecamatan
const getKecamatan = async () => {
  const selectedCity = cities.value.find(c => c.name === form.value.city_name);
  if (!selectedCity) return;
  try {
    const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/districts/${selectedCity.id}.json`);
    if (!response.ok) throw new Error('Gagal load kecamatan');
    districts.value = await response.json();
    subdistricts.value = [];
    form.value.district_name = form.value.subdistrict_name = '';
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
};

// Ambil kelurahan
const getKelurahan = async () => {
  const selectedDistrict = districts.value.find(d => d.name === form.value.district_name);
  if (!selectedDistrict) return;
  try {
    const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/villages/${selectedDistrict.id}.json`);
    if (!response.ok) throw new Error('Gagal load kelurahan');
    subdistricts.value = await response.json();
    form.value.subdistrict_name = '';
  } catch (error) {
    console.error(error);
    showError(error.message);
  }
};

// Cari kode domestik otomatis
const cariKodeDomestik = async () => {
  if (!form.value.label) return;
  try {
    const searchQuery = encodeURIComponent(form.value.label);
    const response = await api.get(`/rajaongkir/domestic?search=${searchQuery}`);
    const results = response.data.data || [];

    if (results.length === 0) {
      form.value.kode_domestik = '';
      form.value.zip_code = '';
      searchResults.value = [];
    } else {
      form.value.kode_domestik = results[0].id;
      form.value.zip_code = results[0].zip_code || '';
      searchResults.value = results.length > 1 ? results : [];
      showKodeDomestik.value = true;
    }
  } catch (err) {
    console.error(err);
    form.value.kode_domestik = '';
    form.value.zip_code = '';
    searchResults.value = [];
  }
};

// Pilih alamat manual jika multiple searchResults
const pilihAlamat = (item) => {
  form.value.kode_domestik = item.id;
  form.value.zip_code = item.zip_code || '';
  form.value.label = item.label;
  searchResults.value = [];
  showKodeDomestik.value = true;
  showSuccess('Alamat berhasil dipilih');
};

// Load awal
onMounted(() => {
  dapat_Alamat();
});
</script>
