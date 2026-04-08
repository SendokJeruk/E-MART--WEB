<template>
  <adminside>
    <div class="p-6 overflow-x-auto">
      <h1 class="text-2xl navbar-font mb-4">Settings</h1>

      <!-- TABLE SETTINGS -->
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

            <!-- Skeleton loading -->
            <template v-if="isLoading">
              <tr v-for="n in 5" :key="n">
                <td class="px-6 py-4"><Skeleton height="14px" width="70%"/></td>
                <td class="px-6 py-4"><Skeleton height="14px" width="90%"/></td>
                <td class="px-6 py-4 flex gap-2">
                  <Skeleton height="30px" width="60px"/>
                  <Skeleton height="30px" width="60px"/>
                </td>
              </tr>
            </template>

            <!-- Data -->
            <template v-else>
              <tr v-for="item in settings" :key="item.id">

                <!-- NAME -->
                <td class="px-6 py-4 text-sm font-medium inter-font">
                  {{ item.name }}
                </td>

                <!-- VALUE -->
                <td class="px-6 py-4 text-sm">
                  <input
                    v-if="editing[item.id]"
                    v-model="item.value"
                    type="text"
                    class="border rounded px-2 py-1 w-full inter-font"
                  />

                  <span v-else>
                    {{ shown[item.id] ? item.value : maskValue(item.value) }}
                  </span>
                </td>

                <!-- ACTION -->
                <td class="px-6 py-4 space-x-2">

                  <!-- MODE EDIT -->
                  <template v-if="editing[item.id]">
                    <button
                      @click="saveEdit(item)"
                      class="px-3 py-1 text-xs bg-green-500 text-white rounded navbar-font"
                    >
                      Save
                    </button>

                    <button
                      @click="cancelEdit(item.id)"
                      class="px-3 py-1 text-xs bg-gray-300 rounded navbar-font"
                    >
                      Cancel
                    </button>
                  </template>

                  <!-- MODE NORMAL -->
                  <template v-else>
                    <button
                      @click="toggleShow(item.id)"
                      class="px-3 py-1 text-xs bg-gray-200 rounded navbar-font"
                    >
                      {{ shown[item.id] ? "Hide" : "Show" }}
                    </button>

                    <button
                      @click="enableEdit(item.id)"
                      class="px-3 py-1 text-xs bg-blue-500 text-white rounded navbar-font"
                    >
                      Edit
                    </button>
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
/*
  Komponen Settings:
  - Menampilkan daftar setting
  - Show / hide value
  - Edit value
  - Konfirmasi sebelum save
  - Notifikasi success / error
*/

import adminside from '@/components/navbar/admin-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/plugins/axios'
import { showConfirm, showError, showSuccess } from '@/utils/alert'
import { ref, onMounted } from 'vue'

/*
  STATE
*/
const settings = ref([])
const shown = ref({})
const editing = ref({})
const originalValues = ref({})
const isLoading = ref(true)

/*
  Mask value (untuk sembunyikan data sensitif)
*/
const maskValue = (val) => {
  if (!val) return ""
  return "•".repeat(Math.min(val.length, 8))
}

/*
  Toggle show/hide value
*/
const toggleShow = (id) => {
  shown.value[id] = !shown.value[id]
}

/*
  Enable edit mode
*/
const enableEdit = (id) => {
  editing.value[id] = true

  /* simpan nilai awal untuk cancel */
  const item = settings.value.find(s => s.id === id)
  originalValues.value[id] = item.value
}

/*
  Cancel edit:
  - kembalikan nilai lama
*/
const cancelEdit = (id) => {
  const item = settings.value.find(s => s.id === id)
  item.value = originalValues.value[id]
  editing.value[id] = false
}

/*
  Save edit:
  - pakai confirm
  - kirim ke backend
  - tampilkan success / error
*/
const saveEdit = async (item) => {

  /* konfirmasi sebelum save */
  const confirm = await showConfirm('Yakin ingin mengubah setting ini?')
  if (!confirm) return

  try {
    const payload = {
      [item.name]: item.value
    }

    await api.post('/setting', payload)

    editing.value[item.id] = false

    /* notifikasi sukses */
    showSuccess('Setting berhasil diupdate')

  } catch (error) {
    console.error("Error updating setting:", error);
    const errors = error.response?.data?.errors;
    let errorMessage = error.response?.data?.message || 'Gagal mengupdate setting.';
    if (errors) {
      const allErrors = Object.values(errors).flat().join('\n');
      errorMessage = allErrors;
    }
    showError(errorMessage);
  }
}

/*
  Ambil data setting dari backend
*/
const getSettings = async () => {
  try {
    isLoading.value = true

    const response = await api.get('/setting')
    settings.value = response.data.data

    /* inisialisasi state */
    settings.value.forEach(item => {
      shown.value[item.id] = false
      editing.value[item.id] = false
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    showError('Gagal mengambil data setting')
  } finally {
    isLoading.value = false
  }
}

/*
  Lifecycle
*/
onMounted(() => {
  getSettings()
})
</script>