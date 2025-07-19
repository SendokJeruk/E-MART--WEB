<template>
    <adminside>
      <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl font-bold mb-4">Form Edit User</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="name" class="block mb-1">Name</label>
            <input
              id="name"
              name="name"
              v-model="form.name"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
  
          <div class="mb-4">
            <label for="email" class="block mb-1">Email</label>
            <input
              id="email"
              name="email"
              v-model="form.email"
              type="email"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
  
          <div class="mb-4">
            <label for="password" class="block mb-1">Password</label>
            <input
              id="password"
              name="password"
              v-model="form.password"
              type="password"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
  
          <div class="mb-4">
            <label for="no_telp" class="block mb-1">No. Telepon</label>
            <input
              id="no_telp"
              name="no_telp"
              v-model="form.no_telp"
              type="text"
              class="w-full border px-3 py-2 rounded"
            />
          </div>
  
          <div class="mb-4">
            <label for="role_id" class="block mb-1">Role</label>
            <select
              id="role_id"
              name="role_id"
              v-model="form.role_id"
              class="w-full border px-3 py-2 rounded text-black bg-white"
            >
              <option disabled value="">Pilih Role</option>
              <option
                v-for="role in roleIds"
                :key="role.id"
                :value="role.id"
                class="text-black"
              >
                {{ role.name }}
              </option>
            </select>
          </div>
  
          <div class="mb-4">
          <label for="foto_profil" class="block rounded border border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6 cursor-pointer">
            <div class="flex items-center justify-center gap-4">
              <span class="font-medium">Upload Foto Profil</span>
              <div v-if="selectedFileName" class="text-sm text-gray-500">
                {{ selectedFileName }}
              </div>

          
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                />
              </svg>
            </div>
            <input
              id="foto_profil"
              name="foto_profil"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              class="sr-only"
            />
          </label>
        </div>
  
          <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </adminside>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import adminside from '@/components/navbar/adminside.vue'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  no_telp: '',
  role_id: '',
  foto_profil: null,
})

const isLoading = ref(true)

const selectedFileName = ref(null);

const roleIds = ref([])

const fetchRoles = async () => {
  try {
    const response = await api.get('/role')
    roleIds.value = response.data.data.map(role => ({
      id: role.id,
      name: role.nama_role,
    }))
  } catch (error) {
    console.error('Gagal mengambil data role:', error)
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFileName.value = file.name;
    form.value.foto_profil = file; 
  }
};

const fetchUser = async () => {
  try {
    const response = await api.get(`/manage-user?id=${route.params.id}`);
    const user = response.data.data.data[0];
    form.value.name = user.name;
    form.value.email = user.email;
    form.value.password = user.password;
    form.value.no_telp = user.no_telp;
    form.value.role_id = user.role_id;
  } catch (error) {
    console.error('Gagal mengambil data user:', error);
    alert('Gagal mengambil data user.');
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  try {
    const formData = new FormData();

    if (form.value.name) formData.append('name', form.value.name);
    if (form.value.email) formData.append('email', form.value.email);
    if (form.value.password) formData.append('password', form.value.password);
    if (form.value.no_telp) formData.append('no_telp', form.value.no_telp);
    if (form.value.role_id) formData.append('role_id', form.value.role_id);
    if (form.value.foto_profil) formData.append('foto_profil', form.value.foto_profil);

    formData.append('_method', 'PUT');

    await api.post(`/manage-user/${route.params.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('User berhasil diperbarui!');
    router.push('/manageuser');
  } catch (error) {
    console.error('Gagal submit form:', error);
    alert(error.response?.data?.message || 'Gagal mengubah User.');
  }
};

onMounted(() => {
  fetchRoles()
  fetchUser()
})
</script>