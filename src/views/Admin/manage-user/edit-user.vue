<template>
  <adminside>
    <!-- Halaman Edit User: Admin mengubah informasi pengguna yang sudah terdaftar -->
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 class="text-xl navabr-font mb-4">Form Edit User</h2>
      
      <!-- Skeleton Loading: Menunggu data user ditarik dari server -->
      <div v-if="isLoading" class="space-y-4">
        <Skeleton height="40px" v-for="n in 5" :key="n" />
      </div>

      <form v-else @submit.prevent="submitForm">
        <div class="mb-4">
          <label for="name" class="block mb-1 navbar-font">Name</label>
          <input id="name" v-model="form.name" type="text" class="w-full border px-3 py-2 rounded inter-font" />
        </div>

        <div class="mb-4">
          <label for="email" class="block mb-1 navbar-font">Email</label>
          <input id="email" v-model="form.email" type="email" class="w-full border px-3 py-2 rounded inter-font" />
        </div>

        <!-- Input Password: Hanya diisi jika admin ingin mereset password user tersebut -->
        <div class="mb-4">
          <label for="password" class="block mb-1 navbar-font">Password (Kosongkan jika tidak diubah)</label>
          <input id="password" v-model="form.password" type="password" class="w-full border px-3 py-2 rounded inter-font" />
        </div>

        <div class="mb-4">
          <label for="no_telp" class="block mb-1 navbar-font">No. Telepon</label>
          <input id="no_telp" v-model="form.no_telp" type="text" class="w-full border px-3 py-2 rounded inter-font" />
        </div>

        <div class="mb-4">
          <label for="role_id" class="block mb-1 navbar-font">Role</label>
          <select id="role_id" v-model="form.role_id" class="w-full border px-3 py-2 rounded text-black bg-white inter-font">
            <option v-for="role in roleIds" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </div>

        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 navbar-font">
          Simpan Perubahan
        </button>
      </form>
    </div>
  </adminside>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'
import adminside from '@/components/navbar/admin-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import { showError, showSuccess } from '@/utils/alert'

const route = useRoute()
const router = useRouter()
const isLoading = ref(true)
const form = ref({ name: '', email: '', password: '', no_telp: '', role_id: '', foto_profil: null })
const roleIds = ref([])

/**
 * Mengambil data awal (Daftar Role & Data User yang akan diedit).
 */
const fetchData = async () => {
  try {
    const resRole = await api.get('/role')
    roleIds.value = resRole.data.data.map(r => ({ id: r.id, name: r.nama_role }))
    
    const resUser = await api.get(`/manage-user?id=${route.params.id}`);
    const u = resUser.data.data.data[0];
    form.value.name = u.name; form.value.email = u.email; form.value.no_telp = u.no_telp; form.value.role_id = u.role_id;
  } catch (error) { console.error(error) }
  finally { isLoading.value = false }
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    Object.keys(form.value).forEach(key => { if(form.value[key]) formData.append(key, form.value[key]); });
    formData.append('_method', 'PUT'); // Metode Update Laravel

    await api.post(`/manage-user/${route.params.id}`, formData);
    showSuccess('User berhasil diperbarui!'); router.push('/manage-user');
  } catch (error) { showError('Gagal memperbarui data user.') }
};

onMounted(() => { fetchData() })
</script>
