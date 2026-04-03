<template>
  <AdminSide>
    <div class="p-6">

      <!-- HEADER -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Manage Banner</h1>

        <!-- PROFILE -->
        <div v-if="isProfileLoading" class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <Skeleton type="circle" size="40px" />
          <div class="flex-1 space-y-2">
            <Skeleton height="14px" width="70%" />
            <Skeleton height="12px" width="90%" />
          </div>
        </div>

        <div v-else class="bg-white shadow rounded-lg px-4 py-2 flex items-center gap-3 w-60">
          <div class="flex-1">
            <p class="text-sm font-bold">{{ user.name }}</p>
            <p class="text-xs text-gray-600">{{ user.email }}</p>
          </div>
          <img :src="user?.foto_profil || 'https://placehold.co/100'" class="w-10 h-10 rounded-full" />
        </div>
      </div>

      <!-- BUTTON -->
      <button @click="openCreate"
        class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-8 py-3 mb-6">
        <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all group-hover:h-full"></span>
        <span class="relative text-sm font-medium text-[#7D0A0A] group-hover:text-white">
          Tambah Banner
        </span>
      </button>

      <!-- TABLE -->
      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-fixed">

          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2">Section</th>
              <th class="px-4 py-2">Gambar</th>
              <th class="px-4 py-2">Action</th>
            </tr>
          </thead>

          <!-- LOADING -->
          <tbody v-if="isLoading">
            <tr v-for="n in 5" :key="n" class="border-t">
              <td class="px-4 py-3">
                <Skeleton width="80px" />
              </td>
              <td class="px-4 py-3">
                <Skeleton width="100px" height="60px" />
              </td>
              <td class="px-4 py-3 flex gap-2">
                <Skeleton width="60px" height="30px" />
                <Skeleton width="60px" height="30px" />
              </td>
            </tr>
          </tbody>

          <!-- DATA -->
          <tbody v-else-if="banners.length > 0">
            <tr v-for="banner in banners" :key="banner.id" class="border-t">
              <td class="px-4 py-2 text-center">{{ banner.section }}</td>

              <td class="px-4 py-2 flex justify-center">
                <img :src="banner.image" class="w-24 h-16 object-cover rounded" />
              </td>

              <td class="px-4 py-2">
                <div class="flex justify-center gap-2">
                  <button @click="openEdit(banner)"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded">
                    Edit
                  </button>

                  <button @click="deleteBanner(banner.id)"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                Tidak ada data banner
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <div
        v-if="pagination.last_page > 1"
        class="flex justify-center mt-6 space-x-2"
      >
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          v-for="page in pagination.last_page"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-4 py-2 rounded',
            page === pagination.current_page
              ? 'bg-[#7D0A0A] text-white'
              : 'bg-gray-200 text-gray-700'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <!-- MODAL -->
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white w-[400px] rounded-lg shadow-lg p-6">

          <h2 class="text-xl font-bold mb-4">
            {{ isEdit ? 'Edit Banner' : 'Tambah Banner' }}
          </h2>

          <!-- SECTION -->
          <div class="mb-4">
            <label class="block text-sm mb-1">Section</label>
              <select 
                v-model="form.section" 
                class="w-full border px-2 py-1 rounded text-sm"
              >
                <option disabled value="">Pilih Section</option>
                <option value="login">Login</option>
                <option value="dashboard">Dashboard</option>
              </select>          
          </div>

          <!-- FILE -->
          <div class="mb-4">
            <label class="block text-sm mb-1">Upload Gambar</label>
            <input type="file" @change="handleFile" class="w-full border px-3 py-2 rounded" />
          </div>

          <!-- PREVIEW -->
          <div v-if="form.preview" class="mb-4">
            <img :src="form.preview" class="w-full h-40 object-cover rounded" />
          </div>

          <!-- ACTION -->
          <div class="flex justify-end gap-2">
            <button @click="closeModal" class="px-4 py-2 border rounded">Batal</button>

            <button @click="isEdit ? updateBanner() : submitForm()" class="px-4 py-2 bg-[#7D0A0A] text-white rounded">
              Simpan
            </button>
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
const user = ref({})

const isLoading = ref(true)
const isProfileLoading = ref(true)
const pagination = ref({
  current_page: 1,
  last_page: 1,
});

const showModal = ref(false)
const isEdit = ref(false)
const selectedId = ref(null)

const form = ref({
  section: '',
  file: null,
  preview: ''
})

/* ================= FILE ================= */
const handleFile = (e) => {
  const file = e.target.files[0]
  if (!file) return

  form.value.file = file
  form.value.preview = URL.createObjectURL(file)
}

/* ================= CREATE ================= */
const submitForm = async () => {
  if (!form.value.section || !form.value.file) {
    return showError('Semua field harus diisi!')
  }

  try {
    const formData = new FormData()
    formData.append('section', form.value.section)
    formData.append('image', form.value.file)

    const res = await api.post('/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    banners.value.unshift(res.data.data)

    showSuccess('Banner berhasil ditambahkan!')
    closeModal()
  } catch (err) {
    showError(err.response?.data?.message || 'Gagal')
  }
}

/* ================= EDIT ================= */
const openEdit = (banner) => {
  isEdit.value = true
  selectedId.value = banner.id

  form.value.section = banner.section
  form.value.preview = banner.image
  form.value.file = null

  showModal.value = true
}

const updateBanner = async () => {
  try {
    const formData = new FormData()
    formData.append('section', form.value.section)

    if (form.value.file) {
      formData.append('image', form.value.file)
    }

    const res = await api.post(`/content/${selectedId.value}?_method=PUT`, formData)

    const index = banners.value.findIndex(b => b.id === selectedId.value)
    banners.value[index] = res.data.data

    showSuccess('Banner berhasil diupdate!')
    closeModal()
  } catch (err) {
    showError(err.response?.data?.message || 'Gagal update')
  }
}

/* ================= DELETE ================= */
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

/* ================= FETCH ================= */
// Fix : sebelumnya kalo data di banner kosong bakalan gagal mengambil data (soalnya gagal map karna undefined)
const getBanners = async (page = 1) => {
  isLoading.value = true;
  try {
    const res = await api.get('/content/all', {
      params: { page }
    });

    const result = res.data?.data || {};
    
    banners.value = Array.isArray(result.data) ? result.data : [];
    
    pagination.value = {
      current_page: result.current_page || 1,
      last_page: result.last_page || 1
    };
  } catch (error) {
    console.error(error);
    if (error.response?.status !== 404) {
      showError('Gagal ambil data');
    }
    banners.value = [];
  } finally {
    isLoading.value = false;
  }
};

const changePage = async (page) => {
  if (page < 1 || page > pagination.value.last_page) return;

  await getBanners(page);
};

const getProfile = async () => {
  try {
    const res = await api.get('/profile')
    user.value = res.data.data
  } finally {
    isProfileLoading.value = false
  }
}

/* ================= MODAL ================= */
const openCreate = () => {
  isEdit.value = false
  selectedId.value = null
  form.value = { section: '', file: null, preview: '' }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

/* ================= INIT ================= */
onMounted(() => {
  getBanners()
  getProfile()
})
</script>