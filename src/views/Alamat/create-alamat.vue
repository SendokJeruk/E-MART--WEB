<template>
  <Navbar />
  <!-- Form buat nambahin alamat baru, isinya agak panjang soalnya alamat di Indo ribet -->
  <div class="max-w-2xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Tambah Alamat</h2>
    
    <form @submit.prevent="tambahAlamat" class="space-y-5 bg-white p-6 rounded-xl shadow-md">
      
      <!-- Label Alamat, otomatis keisi dari gabungan wilayah -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Label Alamat</label>
        <input 
          type="text" 
          v-model="form.label" 
          disabled 
          class="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-700" 
        />
      </div>

      <!-- Pilih Provinsi dulu -->
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

      <!-- Kalo udah milih provinsi, baru nongol pilihan Kota -->
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

      <!-- Lanjut pilih Kecamatan -->
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

      <!-- Terakhir pilih Kelurahan -->
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

      <!-- Info Kode Domestik ama Kode Pos yang didapet dari RajaOngkir -->
      <div class="flex justify-between items-center">
        <div v-if="showKodeDomestik" class="text-green-700 font-semibold">
          Kode Domestik: {{ form.kode_domestik }} <br />
          Zip Code: {{ form.zip_code }}
        </div>
      </div>

      <!-- Kalo hasil pencarian alamatnya banyak, user disuruh pilih salah satu -->
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

      <!-- Nama orang yang bakal nerima paket -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Nama Penerima</label>
        <input 
          type="text" 
          v-model="form.nama_penerima" 
          placeholder="Masukkan nama penerima" 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        />
      </div>

      <!-- Tulis detail alamat sejelas-jelasnya biar kurir gak nyasar -->
      <div>
        <label class="block mb-1 font-semibold text-gray-700">Detail Alamat</label>
        <textarea 
          v-model="form.detail_alamat" 
          placeholder="Masukkan detail alamat lengkap..." 
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
        ></textarea>
      </div>

      <!-- Tombol simpen alamatnya -->
      <div class="flex justify-end">
        <button type="submit" class="bg-red-600 hover:bg-red-700 transition text-white font-semibold px-6 py-2 rounded-lg shadow">
          Simpan
        </button>
      </div>

      <!-- Slot buat nampilin pesan sukses atau error -->
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
import { useRouter } from 'vue-router';

const router = useRouter();

// State buat nampung data wilayah
const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const subdistricts = ref([]);
const showKodeDomestik = ref(false);
const successMessage = ref('');
const errorMessages = ref([]);

// Objek form buat dikirim ke server
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

// Ngawasin kalo kelurahan diganti, kita update label alamatnya
watch(() => form.value.subdistrict_name, (newVal) => {
  if (!newVal) return;
  const { subdistrict_name, district_name, city_name, province_name } = form.value;
  const parts = [subdistrict_name, district_name, city_name, province_name].filter(Boolean);
  form.value.label = parts.join(', ');

  // Sekalian cari kode domestik ke API RajaOngkir
  cariKodeDomestik();
});

// Fungsi buat nyimpen alamat baru ke database
const tambahAlamat = async () => {
  try {
    const response = await api.post('/alamat', form.value);
    successMessage.value = response.data.message || 'Alamat berhasil disimpan';
    showSuccess(successMessage.value);

    // Kasih jeda sedetik biar user sempet baca pesan suksesnya
    setTimeout(() => {
      router.back(); // Balik ke halaman sebelumnya
    }, 1000);

  } catch (error) {
    // Kalo ada error validasi (422), kita bongkar pesan errornya
    if (error.response && error.response.status === 422) {
      const messages = Object.values(error.response.data.errors).flat();
      errorMessages.value = messages;
      showError(messages.join('\n'));
    } else {
      showError('Terjadi kesalahan server');
    }
  }
};


// Tarik daftar provinsi dari API publik Wilaijah
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

// Tarik daftar kota berdasarkan provinsi yang dipilih
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

// Tarik daftar kecamatan berdasarkan kota yang dipilih
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

// Tarik daftar kelurahan berdasarkan kecamatan yang dipilih
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

// Cari kode domestik otomatis ke backend kita yang nyambung ke RajaOngkir
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
      // Ambil hasil pertama, tapi simpen semua kalo ternyata ada banyak pilihan
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

// Pas user milih salah satu alamat dari list saran (kalo sarannya banyak)
const pilihAlamat = (item) => {
  form.value.kode_domestik = item.id;
  form.value.zip_code = item.zip_code || '';
  form.value.label = item.label;
  searchResults.value = [];
  showKodeDomestik.value = true;
  showSuccess('Alamat berhasil dipilih');
};

// Pas halaman kebuka, tarik daftar provinsi
onMounted(() => {
  dapat_Alamat();
});
</script>
