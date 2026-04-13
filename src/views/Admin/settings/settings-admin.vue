<template>
  <adminside>
    <!-- Halaman Pengaturan Admin: Tempat mengatur variabel sistem secara langsung -->
    <div class="p-6 overflow-x-auto">
      <h1 class="text-2xl navbar-font mb-4">Settings</h1>

      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-auto divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm navbar-font">Name</th>
              <th class="px-6 py-3 text-left text-sm navbar-font">Value</th>
              <th class="px-6 py-3 text-left text-sm navbar-font">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <!-- Tampilan Loading -->
            <template v-if="isLoading">
              <tr v-for="n in 3" :key="n">
                <td class="px-6 py-4"><Skeleton height="14px" width="70%"/></td>
                <td class="px-6 py-4"><Skeleton height="14px" width="90%"/></td>
                <td class="px-6 py-4"><Skeleton height="30px" width="60px"/></td>
              </tr>
            </template>

            <!-- DAFTAR PENGATURAN -->
            <template v-else>
              <tr v-for="item in settings" :key="item.id">
                <td class="px-6 py-4 text-sm font-medium inter-font">{{ item.name }}</td>
                <td class="px-6 py-4 text-sm">
                  <!-- Input muncul jika sedang dalam mode edit -->
                  <input v-if="editing[item.id]" v-model="item.value" type="text" class="border rounded px-2 py-1 w-full inter-font" />
                  <!-- Nilai disembunyikan (sensor) jika tidak sedang diedit atau ditampilkan -->
                  <span v-else>{{ shown[item.id] ? item.value : '••••••••' }}</span>
                </td>

                <td class="px-6 py-4 space-x-2">
                  <!-- Tombol saat mode edit aktif -->
                  <template v-if="editing[item.id]">
                    <button @click="saveEdit(item)" class="px-3 py-1 text-xs bg-green-500 text-white rounded">Simpan</button>
                    <button @click="cancelEdit(item.id)" class="px-3 py-1 text-xs bg-gray-300 rounded">Batal</button>
                  </template>
                  <!-- Tombol saat mode normal -->
                  <template v-else>
                    <button @click="shown[item.id] = !shown[item.id]" class="px-3 py-1 text-xs bg-gray-200 rounded">
                      {{ shown[item.id] ? "Hide" : "Show" }}
                    </button>
                    <button @click="enableEdit(item.id)" class="px-3 py-1 text-xs bg-blue-500 text-white rounded">Edit</button>
                  </template>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </adminside>
</template>

<script setup>
import adminside from '@/components/navbar/admin-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/plugins/axios'
import { showConfirm, showError, showSuccess } from '@/utils/alert'
import { ref, onMounted } from 'vue'

const settings = ref([])
const shown = ref({})
const editing = ref({})
const originalValues = ref({})
const isLoading = ref(true)

/**
 * Mengambil semua data pengaturan dari API.
 */
const getSettings = async () => {
  try {
    const res = await api.get('/setting')
    settings.value = res.data.data
  } finally { isLoading.value = false }
}

const enableEdit = (id) => {
  editing.value[id] = true
  // Simpan nilai lama untuk berjaga-jaga jika user klik 'Batal'
  originalValues.value[id] = settings.value.find(s => s.id === id).value
}

const cancelEdit = (id) => {
  settings.value.find(s => s.id === id).value = originalValues.value[id]
  editing.value[id] = false
}

/**
 * Menyimpan perubahan nilai pengaturan ke database.
 */
const saveEdit = async (item) => {
  if (!await showConfirm('Simpan perubahan pengaturan ini?')) return
  try {
    await api.post('/setting', { [item.name]: item.value })
    editing.value[item.id] = false; showSuccess('Berhasil diperbarui')
  } catch (e) { showError('Gagal memperbarui') }
}

onMounted(() => { getSettings() })
</script>
