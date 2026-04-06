<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <!-- Judul halaman buat nambahin toko baru -->
      <h2 class="text-xl font-bold mb-4">Form Bikin Toko</h2>
      
      <form @submit.prevent="submitForm">
        <!-- Input nama toko keren kamu -->
        <div class="mb-4">
          <label for="nama_toko" class="block mb-1">Nama Toko</label>
          <input
            type="text"
            id="nama_toko"
            v-model="form.nama_toko"
            class="w-full border px-3 py-2 rounded"
            placeholder="Tulis nama toko kamu..."
            required
          />
        </div>

        <!-- Kolom buat nulis deskripsi toko biar pembeli percaya -->
        <div class="mb-4">
          <label for="deskripsi" class="block mb-1">Deskripsi Toko</label>
          <input
            type="text"
            id="deskripsi"
            v-model="form.deskripsi"
            class="w-full border px-3 py-2 rounded"
            placeholder="Jualan apa aja nih?"
            required
          />
        </div>

        <!-- Nomor telepon toko yang bisa dihubungin -->
        <div class="mb-4">
          <label for="no_telp" class="block mb-1">No. Telepon Toko</label>
          <input
            type="text"
            id="no_telp"
            v-model="form.no_telp"
            class="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <!-- Urusan alamat toko (Provinsi ampe Kelurahan) -->
        <div class="mb-4">
          <label for="province_name" class="block mb-1">Provinsi</label>
          <select
            id="province_name"
            v-model="form.province_name"
            @change="getKota"
            class="w-full border px-3 py-2 rounded"
            required
          >
            <option value="" disabled selected>Pilih Provinsi</option>
            <option v-for="prov in provinces" :key="prov.id" :value="prov.name">
              {{ prov.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="city_name" class="block mb-1">Kota / Kabupaten</label>
          <select
            id="city_name"
            v-model="form.city_name"
            @change="getKecamatan"
            class="w-full border px-3 py-2 rounded"
            required
          >
            <option value="" disabled selected>Pilih Kota</option>
            <option v-for="city in cities" :key="city.id" :value="city.name">
              {{ city.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="district_name" class="block mb-1">Kecamatan</label>
          <select
            id="district_name"
            v-model="form.district_name"
            @change="getKelurahan"
            class="w-full border px-3 py-2 rounded"
            required
          >
            <option value="" disabled selected>Pilih Kecamatan</option>
            <option v-for="district in districts" :key="district.id" :value="district.name">
              {{ district.name }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label for="subdistrict_name" class="block mb-1">Kelurahan</label>
          <select
            id="subdistrict_name"
            v-model="form.subdistrict_name"
            class="w-full border px-3 py-2 rounded"
            required
          >
            <option value="" disabled selected>Pilih Kelurahan</option>
            <option v-for="sub in subdistricts" :key="sub.id" :value="sub.name">
              {{ sub.name }}
            </option>
          </select>
        </div>

        <!-- Tulis alamat lengkap toko biar kurir jemputnya gampang -->
        <div class="mb-4">
          <label for="detail_alamat" class="block mb-1">Alamat Lengkap (Jalan, No Rumah, dsb)</label>
          <textarea
            id="detail_alamat"
            v-model="form.detail_alamat"
            class="w-full border px-3 py-2 rounded"
            rows="2"
            required
          ></textarea>
        </div>

        <!-- Info kode domestik buat urusan ongkir RajaOngkir -->
        <div class="mb-4 flex items-center space-x-2">
          <span class="text-sm text-gray-700" v-if="form.kode_domestik">
            Kode Area: {{ form.kode_domestik }}
          </span>
        </div>

        <!-- Kalo nemu banyak saran alamat, suruh seller pilih salah satu -->
        <div v-if="searchResults.length" class="border rounded p-3 max-h-48 overflow-auto mt-3 bg-gray-50">
          <p class="mb-2 font-semibold">Alamat mana nih yang pas?</p>
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

        <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Bikin Toko Sekarang
        </button>
      </form>
    </div>
  </sellerside>
</template>

  <script setup>
import { ref, onMounted, watch } from 'vue';
import Sellerside from '@/components/navbar/seller-side.vue';
import api from '@/plugins/axios';
import { showSuccess,showError } from '@/utils/alert';
import { useRouter } from 'vue-router';

const router = useRouter();
const provinces = ref([]);
const cities = ref([]);
const districts = ref([]);
const subdistricts = ref([]);
const searchResults = ref([]);
const showKodeDomestik = ref(false);

// Objek form buat data toko ama alamatnya
const form = ref({
  user_id: '',
  nama_toko: '',
  deskripsi: '',
  no_telp: '',
  kode_domestik: '',
  label: '',
  province_name: '',
  city_name: '',
  district_name: '',
  subdistrict_name: '',
  zip_code: '',
  detail_alamat: ''
});

// Ngawasin perubahan wilayah buat nyusun label alamat lengkap
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
    searchResults.value = [];
  }
);

const user = ref({});

// Ambil profil seller buat tau siapa pemilik tokonya
const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    user.value = response.data.data;
    form.value.user_id = user.value.id;
  } catch (error) {
    console.error('Aduh, gagal ambil profil:', error);
  }
};

// Fungsi buat ngirim data toko baru ke database
const submitForm = async () => {
  try {
    const response = await api.post('/toko', form.value);
    showSuccess('Selamat! Toko kamu udah aktif sekarang.');
    // Balikin ke halaman manage toko
    router.push('/manage-toko');
  } catch (error) {
    if (error.response) {
      showError(`Gagal bikin toko: ${error.response.data.message}`);
    } else {
      showError('Yah, ada kendala pas mau bikin toko.');
    }
  }
};

// Tarik data wilayah satu-satu (Provinsi -> Kota -> dst)
const dapat_Alamat = async () => {
  try {
    const response = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json');
    if (!response.ok) throw new Error('Gagal load provinsi-nya');
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
      if (!response.ok) throw new Error('Gagal load daftar kota');
      cities.value = await response.json();
      // Reset sisa wilayah di bawahnya
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
      if (!response.ok) throw new Error('Gagal load daftar kecamatan');
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
      if (!response.ok) throw new Error('Gagal load daftar kelurahan');
      subdistricts.value = await response.json();
      form.value.subdistrict_name = '';

      // Kalo kelurahan udah kepilih, cari kode domestiknya otomatis
      watch(
        () => form.value.subdistrict_name,
        (newVal) => {
          if (newVal) {
            setTimeout(() => {
              cariKodeDomestik();
            }, 1000);
          }
        }
      );

    } catch (error) {
      console.error(error);
    }
  }
};

// Fungsi buat nyari ID area (kode domestik) lewat RajaOngkir
const cariKodeDomestik = async () => {
  if (!form.value.label) return;

  try {
    const searchQuery = encodeURIComponent(form.value.label);
    const response = await api.get(`/rajaongkir/domestic?search=${searchQuery}`);
    const results = response.data.data || [];

    if (results.length === 0) {
      form.value.kode_domestik = '';
      searchResults.value = [];
    } else if (results.length === 1) {
      // Kalo cuma nemu satu yang pas, langsung comot aja
      form.value.kode_domestik = results[0].id; 
      form.value.zip_code = results[0].zip_code || '';
      searchResults.value = [];
    } else {
      // Kalo nemu banyak, kash liat pilihannya
      searchResults.value = results;
      form.value.kode_domestik = '';
    }
  } catch (err) {
    console.error('Gagal ambil kode area:', err);
    form.value.kode_domestik = '';
    searchResults.value = [];
  }
};

// Pas seller ngeklik salah satu pilihan alamat dari list
const pilihAlamat = (item) => {
  form.value.kode_domestik = item.kode_domestik || item.id;
  form.value.label = item.label;
  form.value.zip_code = item.zip_code || '';

  searchResults.value = [];
  showSuccess('Alamat udah kepilih, mantap!');

  showKodeDomestik.value = false;
  setTimeout(() => {
    showKodeDomestik.value = true;
  }, 1000);
};


// Pas halaman dibuka, langsung sikat ambil profil ama data wilayah
onMounted(() => {
  getProfile();
  dapat_Alamat();
});
</script>

  