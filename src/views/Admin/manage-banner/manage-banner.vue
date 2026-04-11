<template>
  <AdminSide>
    <div class="p-4 md:p-6 bg-[#F9FAFB] min-h-screen">

      <!-- HEADER -->
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 class="text-xl sm:text-2xl md:text-3xl navbar-font text-gray-800">
          Manage Banner
        </h1>
      </div>

      <!-- BUTTON TAMBAH BANNER -->
      <div class="mb-6">
        <button
          @click="openCreate"
          class="group relative inline-block overflow-hidden border border-[#7D0A0A] px-5 py-2 rounded-lg focus:ring-2 focus:ring-[#BF3131] focus:outline-none"
        >
          <span class="absolute inset-x-0 bottom-0 h-[2px] bg-[#7D0A0A] transition-all duration-200 group-hover:h-full"></span>
          <span class="relative text-xs sm:text-sm font-medium text-[#7D0A0A] group-hover:text-white navbar-font">
            Tambah Banner
          </span>
        </button>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table class="min-w-[500px] w-full table-auto text-xs sm:text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left navbar-font text-gray-700 whitespace-nowrap">
                Section
              </th>
              <th class="px-4 py-3 text-center navbar-font text-gray-700 whitespace-nowrap">
                Gambar
              </th>
              <th class="px-4 py-3 text-center navbar-font text-gray-700 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>

          <!-- LOADING -->
          <tbody v-if="isLoading" class="divide-y divide-gray-200">
            <tr v-for="n in 5" :key="n">
              <td class="px-4 py-3">
                <Skeleton width="80px" />
              </td>
              <td class="px-4 py-3 text-center">
                <Skeleton width="100px" height="60px" />
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap justify-center gap-2">
                  <Skeleton width="60px" height="30px" />
                  <Skeleton width="60px" height="30px" />
                </div>
              </td>
            </tr>
          </tbody>

          <!-- DATA -->
          <tbody v-else-if="banners.length > 0" class="divide-y divide-gray-200">
            <tr
              v-for="banner in banners"
              :key="banner.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-4 py-3 inter-font text-gray-900 whitespace-nowrap">
                {{ banner.section }}
              </td>

              <td class="px-4 py-3 text-center">
                <img
                  :src="banner.image"
                  class="w-20 h-14 sm:w-24 sm:h-16 object-cover rounded mx-auto"
                  alt="Banner"
                />
              </td>

              <td class="px-4 py-3">
                <div class="flex flex-wrap justify-center gap-2">
                  <button
                    @click="openEdit(banner)"
                    class="px-3 py-1 text-xs sm:text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded navbar-font transition"
                  >
                    Edit
                  </button>

                  <button
                    @click="deleteBanner(banner.id)"
                    class="px-3 py-1 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded navbar-font transition"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- EMPTY STATE -->
          <tbody v-else>
            <tr>
              <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                Tidak ada data banner
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div
        v-if="pagination.last_page > 1"
        class="flex flex-wrap justify-center items-center gap-2 mt-6"
      >
        <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="px-3 py-1 text-xs sm:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          v-for="page in pagination.last_page"
          :key="page"
          @click="changePage(page)"
          :class="[
            'px-3 py-1 text-xs sm:text-sm rounded',
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
          class="px-3 py-1 text-xs sm:text-sm bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <!-- MODAL -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-4 sm:p-6"
        >
          <h2 class="text-lg sm:text-xl font-bold mb-4 navbar-font text-gray-800">
            {{ isEdit ? 'Edit Banner' : 'Tambah Banner' }}
          </h2>

          <!-- SECTION -->
          <div class="mb-4">
            <label class="block text-xs sm:text-sm mb-1 navbar-font">
              Section
            </label>
            <select
              v-model="form.section"
              class="w-full border px-3 py-2 rounded text-xs sm:text-sm inter-font focus:ring-2 focus:ring-[#7D0A0A] outline-none"
            >
              <option disabled value="">Pilih Section</option>
              <option value="login">Login</option>
              <option value="dashboard">Dashboard</option>
            </select>
          </div>

          <!-- FILE -->
          <div class="mb-4">
            <label class="block text-xs sm:text-sm mb-1 navbar-font">
              Upload Gambar
            </label>
            <input
              type="file"
              @change="handleFile"
              class="w-full border px-3 py-2 rounded text-xs sm:text-sm"
            />
          </div>

          <!-- PREVIEW -->
          <div v-if="form.preview" class="mb-4">
            <img
              :src="form.preview"
              class="w-full h-40 object-cover rounded"
              alt="Preview"
            />
          </div>

          <!-- ACTION -->
          <div class="flex flex-col sm:flex-row justify-end gap-2">
            <button
              @click="closeModal"
              class="w-full sm:w-auto px-4 py-2 border rounded navbar-font hover:bg-gray-100 transition"
            >
              Batal
            </button>

            <button
              @click="isEdit ? updateBanner() : submitForm()"
              class="w-full sm:w-auto px-4 py-2 bg-[#7D0A0A] text-white rounded navbar-font hover:bg-[#BF3131] transition"
            >
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
  console.log("TEST SUBMIT")
  if (!form.value.section || !form.value.file) {
    return showError('Semua field harus diisi!')
  }

  try {
    const formData = new FormData()
    formData.append('section', form.value.section)
    formData.append('image', form.value.file)
    console.log(form.value.file)

    const res = await api.post('/content', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    banners.value.unshift(res.data.data)

    showSuccess('Banner berhasil ditambahkan!')
    closeModal()
  } catch (err) {
    const errors = err.response?.data?.errors;
    let errorMessage = err.response?.data?.message || 'Gagal menambahkan banner.';
    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }
    showError(errorMessage);
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
    console.log(form.value.file)

    const formData = new FormData()
    formData.append('section', form.value.section)

    if (form.value.file) {
      formData.append('image', form.value.file)
    }

    const res = await api.post(`/content/${selectedId.value}?_method=PUT`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res.data?.data) {
      const index = banners.value.findIndex(b => b.id === selectedId.value)
      if (index !== -1) {
        banners.value[index] = res.data.data
      }
      showSuccess('Banner berhasil diupdate!')
      closeModal()
    } else {
      throw new Error('Data tidak ditemukan dalam respon')
    }
  } catch (err) {
    console.error(err)
    const errors = err.response?.data?.errors;
    let errorMessage = err.response?.data?.message || 'Gagal update banner.';

    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }

    showError(errorMessage);
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
})
</script>