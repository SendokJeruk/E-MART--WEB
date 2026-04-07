<template>
  <Navbar />
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Edit Alamat</h2>
    
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-gray-500">Memuat data alamat...</p>
    </div>

    <form v-else @submit.prevent="updateAlamat" class="space-y-5 bg-white p-6 rounded-xl shadow-md">
      
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Label Alamat</label>
        <input 
          type="text" 
          v-model="form.label" 
          disabled 
          class="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700" 
        />
      </div>

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

      <div class="flex justify-between items-center">
        <div v-if="showKodeDomestik" class="text-green-700 font-semibold">
          Kode Domestik: {{ form.kode_domestik }} <br />
          Zip Code: {{ form.zip_code }}
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
        <label class="block mb-1 font-semibold text-gray-700">Nama Penerima</label>
        <input 
          type="text" 
          v-model="form.nama_penerima" 
          placeholder="Masukkan nama penerima" 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>

      <div>
        <label class="block mb-1 font-semibold text-gray-700">Detail Alamat</label>
        <textarea 
          v-model="form.detail_alamat" 
          placeholder="Masukkan detail alamat lengkap..." 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        ></textarea>
      </div>

      <div class="flex justify-end gap-3">
        <router-link to="/alamat" class="bg-gray-300 hover:bg-gray-400 transition text-gray-800 font-semibold px-6 py-2 rounded-lg shadow">
          Batal
        </router-link>
        <button type="submit" class="bg-red-600 hover:bg-red-700 transition text-white font-semibold px-6 py-2 rounded-lg shadow">
          Perbarui
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref, watch, onMounted } from 'vue';
import api from "@/plugins/axios";
import { showSuccess, showError } from '@/utils/alert';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const subdistricts = ref([]);
const showKodeDomestik = ref(false);
const isLoading = ref(true);

const form = ref({
  nama_penerima: '',
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
let isInitialLoad = true;

watch(() => form.value.subdistrict_name, (newVal) => {
  if (!newVal || isInitialLoad) return;
  const { subdistrict_name, district_name, city_name, province_name } = form.value;
  const parts = [subdistrict_name, district_name, city_name, province_name].filter(Boolean);
  form.value.label = parts.join(', ');

  cariKodeDomestik();
});

const fetchAlamatData = async () => {
  try {
    const response = await api.get(`/alamat`);
    const alamatList = response.data.data.data;
    const alamat = alamatList.find(a => a.id == route.params.id);

    if (alamat) {
      form.value = { ...alamat };
      
      // Load hierarchical dropdowns
      await dapat_Alamat(); // loads provinces
      const selectedProv = provinces.value.find(p => p.name === alamat.province_name);
      if (selectedProv) {
        await loadCitiesForProvince(selectedProv.id);
        const selectedCity = cities.value.find(c => c.name === alamat.city_name);
        if (selectedCity) {
          await loadDistrictsForCity(selectedCity.id);
          const selectedDist = districts.value.find(d => d.name === alamat.district_name);
          if (selectedDist) {
            await loadVillagesForDistrict(selectedDist.id);
          }
        }
      }
      
      showKodeDomestik.value = true;
    } else {
      showError('Data alamat tidak ditemukan');
      router.push('/alamat');
    }
  } catch (error) {
    console.error(error);
    showError('Gagal memuat data alamat');
  } finally {
    isInitialLoad = false;
    isLoading.value = false;
  }
};

const updateAlamat = async () => {
  try {
    await api.put(`/alamat/${route.params.id}`, form.value);
    showSuccess('Alamat berhasil diperbarui');
    setTimeout(() => {
      router.push('/alamat');
    }, 1000);
  } catch (error) {
    if (error.response && error.response.status === 422) {
      const messages = Object.values(error.response.data.errors).flat();
      showError(messages.join('\n'));
    } else {
      showError('Terjadi kesalahan server');
    }
  }
};

const dapat_Alamat = async () => {
  try {
    const response = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json');
    provinces.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const loadCitiesForProvince = async (provId) => {
  try {
    const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/regencies/${provId}.json`);
    cities.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const getKota = async () => {
  isInitialLoad = false;
  const selectedProvince = provinces.value.find(p => p.name === form.value.province_name);
  if (!selectedProvince) {
    cities.value = districts.value = subdistricts.value = [];
    return;
  }
  await loadCitiesForProvince(selectedProvince.id);
  districts.value = subdistricts.value = [];
  form.value.city_name = form.value.district_name = form.value.subdistrict_name = '';
};

const loadDistrictsForCity = async (cityId) => {
  try {
    const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/districts/${cityId}.json`);
    districts.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const getKecamatan = async () => {
  isInitialLoad = false;
  const selectedCity = cities.value.find(c => c.name === form.value.city_name);
  if (!selectedCity) return;
  await loadDistrictsForCity(selectedCity.id);
  subdistricts.value = [];
  form.value.district_name = form.value.subdistrict_name = '';
};

const loadVillagesForDistrict = async (distId) => {
  try {
    const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/villages/${distId}.json`);
    subdistricts.value = await response.json();
  } catch (error) {
    console.error(error);
  }
};

const getKelurahan = async () => {
  isInitialLoad = false;
  const selectedDistrict = districts.value.find(d => d.name === form.value.district_name);
  if (!selectedDistrict) return;
  await loadVillagesForDistrict(selectedDistrict.id);
  form.value.subdistrict_name = '';
};

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
      showKodeDomestik.value = false;
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
    showKodeDomestik.value = false;
  }
};

const pilihAlamat = (item) => {
  form.value.kode_domestik = item.id;
  form.value.zip_code = item.zip_code || '';
  form.value.label = item.label;
  searchResults.value = [];
  showKodeDomestik.value = true;
  showSuccess('Alamat berhasil dipilih');
};

onMounted(() => {
  fetchAlamatData();
});
</script>