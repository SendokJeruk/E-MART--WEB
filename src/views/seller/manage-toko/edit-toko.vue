<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">

      <!-- Skeleton pas lagi narik data toko lama dari database -->
      <template v-if="isLoading">
        <h2 class="text-xl font-bold mb-4">Form Edit Toko</h2>

        <div class="space-y-4">
          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="38px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="38px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="38px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="38px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="38px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="38px"/>
          </div>

          <div>
            <Skeleton width="120px" height="14px" class="mb-2"/>
            <Skeleton height="60px"/>
          </div>

          <Skeleton width="140px" height="40px"/>
        </div>
      </template>

      <!-- Form asli buat ngubah info toko ama alamat-nya -->
      <template v-else>
        <h2 class="text-xl font-bold mb-4">Form Edit Toko</h2>

        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="nama_toko" class="block mb-1">Nama Toko</label>
            <input
              id="nama_toko"
              v-model="form.nama_toko"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label for="deskripsi" class="block mb-1">Deskripsi</label>
            <input
              id="deskripsi"
              v-model="form.deskripsi"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label for="no_telp" class="block mb-1">No Telepon</label>
            <input
              id="no_telp"
              v-model="form.no_telp"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <!-- Urusan ganti alamat toko kalo pindah tempat -->
          <div class="mb-4">
            <label class="block mb-1">Provinsi</label>
            <select
              v-model="form.province_id"
              @change="getKota"
              class="w-full border px-3 py-2 rounded"
            >
              <option disabled value="">Pilih Provinsi Baru</option>
              <option v-for="prov in provinces" :key="prov.id" :value="prov.id">
                {{ prov.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Kota / Kabupaten</label>
            <select
              v-model="form.city_name"
              @change="getKecamatan"
              class="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>Pilih Kota Baru</option>
              <option v-for="city in cities" :key="city.id" :value="city.name">
                {{ city.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Kecamatan</label>
            <select
              v-model="form.district_name"
              @change="getKelurahan"
              class="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>Pilih Kecamatan Baru</option>
              <option v-for="district in districts" :key="district.id" :value="district.name">
                {{ district.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="block mb-1">Kelurahan</label>
            <select
              v-model="form.subdistrict_name"
              class="w-full border px-3 py-2 rounded"
            >
              <option value="" disabled>Pilih Kelurahan Baru</option>
              <option v-for="sub in subdistricts" :key="sub.id" :value="sub.name">
                {{ sub.name }}
              </option>
            </select>
          </div>

          <!-- Saran alamat dari RajaOngkir kalo butuh kode domestik baru -->
          <div v-if="searchResults.length" class="border rounded p-3 max-h-48 overflow-auto mt-3 bg-gray-50">
            <p class="mb-2 font-semibold">Alamat yang ini bukan?</p>

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

          <div class="mb-4">
            <label class="block mb-1">Kode Pos</label>
            <input
              v-model="form.zip_code"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>

          <div class="mb-4">
            <label class="block mb-1">Detail Alamat</label>
            <textarea
              v-model="form.detail_alamat"
              rows="2"
              class="w-full border px-3 py-2 rounded"
            ></textarea>
          </div>

          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Simpan Perubahan
          </button>
        </form>
      </template>

    </div>
  </sellerside>
</template>

<script setup>
import Sellerside from '@/components/navbar/seller-side.vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Skeleton from '@/components/Skeleton.vue'
import { showError,showSuccess } from '@/utils/alert'

const route = useRoute()
const router = useRouter()

// State buat nampung data wilayah ama list saran
const provinces = ref([])
const cities = ref([])
const districts = ref([])
const subdistricts = ref([])
const searchResults = ref([])
const isLoading = ref(true)

// Objek form buat nampung data yang diedit
const form = ref({
  user_id: '',
  nama_toko: '',
  deskripsi: '',
  no_telp: '',
  kode_domestik: '',
  label: '',
  province_id: '',
  province_name: '',
  city_name: '',
  district_name: '',
  subdistrict_name: '',
  zip_code: '',
  detail_alamat: ''
})

// Pantau wilayah buat nyusun label alamat otomatis
watch(
  () => [
    form.value.subdistrict_name,
    form.value.district_name,
    form.value.city_name,
    form.value.province_name,
    form.value.zip_code
  ],
  async () => {
    const { subdistrict_name, district_name, city_name, province_name, zip_code } = form.value

    const parts = [subdistrict_name, district_name, city_name, province_name, zip_code].filter(Boolean)
    form.value.label = parts.join(', ')

    form.value.kode_domestik = ''
    searchResults.value = []

    // Kalo udah lengkap, langsung gas cari kode area RajaOngkir
    if (subdistrict_name && district_name && city_name && province_name && zip_code) {
      await cariKodeDomestik()
    }
  }
)

// Sinkronin ID provinsi ama namanya
watch(() => form.value.province_id, (newId) => {
  const selected = provinces.value.find(p => p.id === newId)
  if (selected) {
    form.value.province_name = selected.name
  }
})

// Fungsi tarik info toko lama biar nongol di form
const fetchToko = async () => {
  try {
    const response = await api.get(`/toko?id=${route.params.id}`)
    isLoading.value = false
    const toko = response.data.data.data[0]

    form.value.user_id = toko.user_id
    form.value.nama_toko = toko.nama_toko
    form.value.deskripsi = toko.deskripsi
    form.value.no_telp = toko.no_telp

    if (toko.alamat_toko) {
      form.value.alamat_toko_id = toko.alamat_toko.id
      form.value.kode_domestik = toko.alamat_toko.kode_domestik
      form.value.label = toko.alamat_toko.label

      // Cari ID provinsinya biar dropdown-nya langsung kepilih
      const selectedProvince = provinces.value.find(
        prov => prov.name.trim().toLowerCase() === toko.alamat_toko.province_name.trim().toLowerCase()
      )

      if (selectedProvince) {
        form.value.province_id = selectedProvince.id
        form.value.province_name = selectedProvince.name
        await getKota()
      }

      form.value.city_name = toko.alamat_toko.city_name
      await getKecamatan()
      form.value.district_name = toko.alamat_toko.district_name
      await getKelurahan()
      form.value.subdistrict_name = toko.alamat_toko.subdistrict_name
      form.value.zip_code = toko.alamat_toko.zip_code
      form.value.detail_alamat = toko.alamat_toko.detail_alamat
    }
  } catch (error) {
    console.error('Gagal ambil data toko:', error)
    showError('Yah, gagal narik data toko kamu nih.')
  }
}

// Fungsi utama buat ngirim data update toko ama alamatnya ke server
const submitForm = async () => {
  try {
    // 1. Update data dasar toko
    const tokoForm = new FormData()
    tokoForm.append('user_id', form.value.user_id)
    tokoForm.append('nama_toko', form.value.nama_toko)
    tokoForm.append('deskripsi', form.value.deskripsi)
    tokoForm.append('no_telp', form.value.no_telp)
    tokoForm.append('_method', 'PUT')

    await api.post(`/toko/${route.params.id}`, tokoForm)

    // 2. Update alamat tokonya
    const alamatForm = new FormData()
    alamatForm.append('province_name', form.value.province_name)
    alamatForm.append('city_name', form.value.city_name)
    alamatForm.append('district_name', form.value.district_name)
    alamatForm.append('subdistrict_name', form.value.subdistrict_name)
    alamatForm.append('zip_code', form.value.zip_code)
    alamatForm.append('detail_alamat', form.value.detail_alamat)
    alamatForm.append('label', form.value.label)
    alamatForm.append('kode_domestik', form.value.kode_domestik)
    alamatForm.append('_method', 'PUT')

    await api.post(`/toko/alamat/${route.params.id}`, alamatForm)

    showSuccess('Beres! Toko ama alamat kamu udah diperbarui.');
    router.push('/manage-toko');
  } catch (error) {
    console.error('Gagal update-nya nih:', error)
    showError(error.response?.data?.message || 'Aduh, ada masalah pas mau update.');
  }
}

// Tarik data wilayah publik
const dapat_Alamat = async () => {
  try {
    const response = await fetch('https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/provinces.json')
    if (!response.ok) throw new Error('Gagal load provinsi')
    provinces.value = await response.json()
  } catch (error) {
    console.error(error)
  }
}

const getKota = async () => {
  if (form.value.province_id) {
    try {
      const response = await fetch(
        `https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/regencies/${form.value.province_id}.json`
      )
      if (!response.ok) throw new Error('Gagal load daftar kota')
      cities.value = await response.json()
      // Kosongin sisa wilayah di bawahnya
      districts.value = []
      subdistricts.value = []
      form.value.city_name = ''
      form.value.district_name = ''
      form.value.subdistrict_name = ''
    } catch (error) {
      console.error(error)
    }
  }
}

const getKecamatan = async () => {
  const selectedCity = cities.value.find(c => c.name === form.value.city_name)
  if (selectedCity) {
    try {
      const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/districts/${selectedCity.id}.json`)
      if (!response.ok) throw new Error('Gagal load daftar kecamatan')
      districts.value = await response.json()
      subdistricts.value = []
      form.value.district_name = ''
      form.value.subdistrict_name = ''
    } catch (error) {
      console.error(error)
    }
  }
}

const getKelurahan = async () => {
  const selectedDistrict = districts.value.find(d => d.name === form.value.district_name)
  if (selectedDistrict) {
    try {
      const response = await fetch(`https://sendokjeruk.github.io/wilaijah-repoeblik-indonesia/api/villages/${selectedDistrict.id}.json`)
      if (!response.ok) throw new Error('Gagal load daftar kelurahan')
      subdistricts.value = await response.json()
      form.value.subdistrict_name = ''
    } catch (error) {
      console.error(error)
    }
  }
}

// Cari ID area ke backend kita (RajaOngkir)
const cariKodeDomestik = async () => {
  if (!form.value.label) return;
  try {
    const searchQuery = encodeURIComponent(form.value.label)
    const response = await api.get(`/rajaongkir/domestic?search=${searchQuery}`)
    const results = response.data.data || []

    if (results.length === 0) {
      form.value.kode_domestik = ''
      searchResults.value = []
    } else if (results.length === 1) {
      form.value.kode_domestik = results[0].id
      searchResults.value = []
    } else {
      // Kalo sarannya banyak, biar seller yang pilih sendiri
      searchResults.value = results
      form.value.kode_domestik = ''
    }
  } catch (err) {
    console.error('Gagal cari kode area:', err)
    form.value.kode_domestik = ''
    searchResults.value = []
  }
}

// Pas seller milih saran alamat dari list
const pilihAlamat = (item) => {
  form.value.kode_domestik = item.id
  form.value.zip_code = item.zip_code || ''
  form.value.label = item.label
  searchResults.value = []
}

// Pas halaman dibuka, tarik data wilayah ama data toko
onMounted(async () => {
  await dapat_Alamat()
  await fetchToko()
})
</script>
