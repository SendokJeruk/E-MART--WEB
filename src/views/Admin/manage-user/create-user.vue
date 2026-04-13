<template>
  <adminside>
    <!-- Halaman Tambah User oleh Admin: Memungkinkan pembuatan akun baru dengan role tertentu -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navbar-font mb-4">Form Tambah User</h2>
      <form @submit.prevent="submitForm">
        <!-- Input Nama Lengkap -->
        <div class="mb-4">
          <label for="name" class="block mb-1 navbar-font">Name</label>
          <input id="name" v-model="form.name" type="text" class="w-full border px-3 py-2 rounded inter-font" required />
        </div>

        <!-- Input Email Aktif -->
        <div class="mb-4">
          <label for="email" class="block mb-1 navbar-font">Email</label>
          <input id="email" v-model="form.email" type="email" class="w-full border px-3 py-2 rounded inter-font" required />
        </div>

        <!-- Input Kata Sandi -->
        <div class="mb-4">
          <label for="password" class="block mb-1 navbar-font">Password</label>
          <input id="password" v-model="form.password" type="password" class="w-full border px-3 py-2 rounded inter-font" required />
        </div>

        <!-- Input Nomor Telepon/WA -->
        <div class="mb-4">
          <label for="no_telp" class="block mb-1 navbar-font">No. Telepon</label>
          <input id="no_telp" v-model="form.no_telp" type="text" class="w-full border px-3 py-2 rounded inter-font" required />
        </div>

        <!-- Pilih Peran Pengguna (Admin/Seller/Buyer) -->
        <div class="mb-4">
          <label for="role_id" class="block mb-1 navbar-font">Role</label>
          <select id="role_id" v-model="form.role_id" class="w-full border px-3 py-2 rounded text-black bg-white inter-font" required>
            <option disabled value="">Pilih Role</option>
            <option v-for="role in roleIds" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>

        <!-- Unggah Foto Profil Pengguna -->
        <div class="mb-4">
          <label for="foto_profil" class="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm cursor-pointer">
            <div class="flex items-center justify-center gap-4">
              <span class="navbar-font">Upload Foto Profil</span>
              <div v-if="selectedFileName" class="text-sm text-gray-500">{{ selectedFileName }}</div>
            </div>
            <input id="foto_profil" type="file" accept="image/*" @change="handleFileUpload" class="sr-only" />
          </label>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 navbar-font">
          Simpan User
        </button>
      </form>
    </div>
  </adminside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
import adminside from '@/components/navbar/admin-side.vue'
import { useRouter } from 'vue-router'
import { showSuccess, showError } from '@/utils/alert'

const router = useRouter()
const form = ref({ name: '', email: '', password: '', no_telp: '', role_id: '', foto_profil: null })
const selectedFileName = ref('')
const roleIds = ref([])

/**
 * Mengambil daftar Role dari server untuk ditampilkan di pilihan Dropdown.
 */
const fetchRoles = async () => {
  try {
    const response = await api.get('/role')
    roleIds.value = response.data.data.map(role => ({ id: role.id, name: role.nama_role }))
  } catch (error) { console.error('Gagal mengambil data role:', error) }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.foto_profil = file
    selectedFileName.value = file.name
  }
}

/**
 * Mengirimkan data user baru beserta file fotonya ke server.
 */
const submitForm = async () => {
  try {
    const formData = new FormData()
    formData.append('name', form.value.name); formData.append('email', form.value.email)
    formData.append('password', form.value.password); formData.append('no_telp', form.value.no_telp)
    formData.append('role_id', form.value.role_id)
    if (form.value.foto_profil) formData.append('foto_profil', form.value.foto_profil)

    await api.post('/manage-user', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    showSuccess('User berhasil ditambahkan!'); router.push('/manage-user') 
  } catch (error) { showError('Gagal menambahkan user. Cek kembali kelengkapan data.') }
}

onMounted(fetchRoles)
</script>
