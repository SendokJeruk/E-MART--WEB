<template>
  <AdminSide>
    <!-- Halaman Manajemen Banner: Tempat admin mengatur gambar promo yang tampil di login atau dashboard -->
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 class="text-xl sm:text-2xl md:text-3xl navbar-font text-gray-800">Manage Banner</h1>
      </div>

      <!-- Tombol untuk membuka formulir tambah banner -->
      <div class="mb-6">
        <button @click="openCreate" class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg focus:ring-2 focus:ring-[#BF3131] focus:outline-none">
          <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all duration-200 group-hover:h-full"></span>
          <span class="relative text-xs sm:text-sm font-medium text-[#7D0A0A] group-hover:text-white navbar-font">Tambah Banner</span>
        </button>
      </div>

      <!-- Tabel Daftar Banner -->
      <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-[500px] w-full table-auto text-xs sm:text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left navbar-font text-gray-700">Section</th>
              <th class="px-4 py-3 text-center navbar-font text-gray-700">Gambar</th>
              <th class="px-4 py-3 text-center navbar-font text-gray-700">Action</th>
            </tr>
          </thead>

          <tbody v-if="isLoading" class="divide-y divide-gray-200">
            <tr v-for="n in 5" :key="n">
              <td class="px-4 py-3"><Skeleton width="80px" /></td>
              <td class="px-4 py-3 text-center"><Skeleton width="100px" height="60px" /></td>
              <td class="px-4 py-3"><div class="flex flex-wrap justify-center gap-2"><Skeleton width="60px" height="30px" /><Skeleton width="60px" height="30px" /></div></td>
            </tr>
          </tbody>

          <tbody v-else-if="banners.length > 0" class="divide-y divide-gray-200">
            <tr v-for="banner in banners" :key="banner.id" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3 inter-font text-gray-900">{{ banner.section }}</td>
              <td class="px-4 py-3 text-center">
                <img :src="banner.image" class="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded mx-auto" alt="Banner" />
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap justify-center gap-2">
                  <button @click="openEdit(banner)" class="px-3 py-1 text-xs sm:text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded navbar-font transition">Edit</button>
                  <button @click="deleteBanner(banner.id)" class="px-3 py-1 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded navbar-font transition">Hapus</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Formulir Pop-up (Modal) Tambah/Edit Banner -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-4 sm:p-6">
          <h2 class="text-lg sm:text-xl font-bold mb-4 navbar-font text-gray-800">{{ isEdit ? 'Edit Banner' : 'Tambah Banner' }}</h2>

          <!-- Pilihan Lokasi Tampil (Section) -->
          <div class="mb-4">
            <label class="block text-xs sm:text-sm mb-1 navbar-font">Section</label>
            <select v-model="form.section" class="w-full border px-3 py-2 rounded text-xs sm:text-sm inter-font focus:ring-2 focus:ring-[#7D0A0A] outline-none">
              <option disabled value="">Pilih Section</option>
              <option value="login">Login</option>
              <option value="dashboard">Dashboard</option>
            </select>
          </div>

          <!-- Input File Gambar -->
          <div class="mb-4">
            <label class="block text-xs sm:text-sm mb-1 navbar-font">Upload Gambar</label>
            <input type="file" @change="handleFile" class="w-full border px-3 py-2 rounded text-xs sm:text-sm" />
          </div>

          <!-- Preview Gambar sebelum disimpan -->
          <div v-if="form.preview" class="mb-4">
            <img :src="form.preview" class="w-full h-40 object-cover rounded" alt="Preview" />
          </div>

          <div class="flex flex-col sm:flex-row justify-end gap-2">
            <button @click="closeModal" class="w-full sm:w-auto px-4 py-2 border rounded navbar-font hover:bg-gray-100 transition">Batal</button>
            <button @click="isEdit ? updateBanner() : submitForm()" class="w-full sm:w-auto px-4 py-2 bg-[#7D0A0A] text-white rounded navbar-font hover:bg-[#BF3131] transition">Simpan</button>
          </div>
        </div>
      </div>
    </div>
  </AdminSide>
</template>

<script setup>
import AdminSide from '@/components/navbar/admin-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/plugins/axios'
import { showSuccess, showError, showConfirm } from '@/utils/alert'
import { ref, onMounted } from 'vue'

const banners = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const isEdit = ref(false)
const selectedId = ref(null)
const form = ref({ section: '', file: null, preview: '' })

// Mengambil file gambar dari input dan membuat preview-nya
const handleFile = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.file = file
  form.value.preview = URL.createObjectURL(file)
}

/**
 * Menyimpan data banner baru ke server.
 */
const submitForm = async () => {
  if (!form.value.section || !form.value.file) {
    return showError('Semua field harus diisi!')
  }
  try {
    const formData = new FormData()
    formData.append('section', form.value.section)
    formData.append('image', form.value.file)
    const res = await api.post('/content', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    banners.value.unshift(res.data.data)
    showSuccess('Banner berhasil ditambahkan!')
    closeModal()
  } catch (err) {
    showError('Gagal menambahkan banner.')
  }
}

/**
 * Mengupdate data banner yang sudah ada.
 */
const updateBanner = async () => {
  try {
    const formData = new FormData()
    formData.append('section', form.value.section)
    if (form.value.file) formData.append('image', form.value.file)
    const res = await api.post(`/content/${selectedId.value}?_method=PUT`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    const index = banners.value.findIndex(b => b.id === selectedId.value)
    if (index !== -1) banners.value[index] = res.data.data
    showSuccess('Banner berhasil diupdate!')
    closeModal()
  } catch (err) {
    showError('Gagal update banner.')
  }
}

const deleteBanner = async (id) => {
  const confirm = await showConfirm('Yakin hapus banner?')
  if (!confirm) return
  try {
    await api.delete(`/content/${id}`)
    banners.value = banners.value.filter(b => b.id !== id)
    showSuccess('Berhasil dihapus')
  } catch {
    showError('Gagal hapus')
  }
}

const getBanners = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/content/all')
    banners.value = res.data?.data?.data || []
  } catch (error) {
    banners.value = []
  } finally {
    isLoading.value = false
  }
}

const openCreate = () => {
  isEdit.value = false
  form.value = { section: '', file: null, preview: '' }
  showModal.value = true
}

const openEdit = (banner) => {
  isEdit.value = true
  selectedId.value = banner.id
  form.value.section = banner.section
  form.value.preview = banner.image
  showModal.value = true
}

const closeModal = () => { showModal.value = false }

onMounted(() => { getBanners() })
</script>
