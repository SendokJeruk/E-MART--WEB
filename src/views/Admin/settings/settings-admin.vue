<template>
  <adminside>
    <div class="p-6 overflow-x-auto">
      <h1 class="text-2xl font-bold mb-4">Settings</h1>

      <!-- Tabel buat nampilin semua settingan aplikasi kita -->
      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-auto divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Value</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">

            <!-- Skeleton tabel pas lagi loading narik settingan -->
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

            <!-- Ini data settingan aslinya -->
            <template v-else>
              <tr v-for="item in settings" :key="item.id">

                <!-- Nama settingannya (key) -->
                <td class="px-6 py-4 text-sm font-medium">
                  {{ item.name }}
                </td>

                <!-- Nilai settingannya, bisa disembunyiin atau diedit -->
                <td class="px-6 py-4 text-sm">
                  <!-- Kalo lagi mode edit, nongol inputan -->
                  <input
                    v-if="editing[item.id]"
                    v-model="item.value"
                    type="text"
                    class="border rounded px-2 py-1 w-full"
                  />

                  <!-- Kalo lagi biasa, nongol teks-nya (atau disensor titik-titik) -->
                  <span v-else>
                    {{ shown[item.id] ? item.value : maskValue(item.value) }}
                  </span>
                </td>

                <!-- Tombol-tombol aksi -->
                <td class="px-6 py-4 space-x-2">

                  <!-- Tombol pas lagi dalam mode Edit -->
                  <template v-if="editing[item.id]">
                    <button
                      @click="saveEdit(item)"
                      class="px-3 py-1 text-xs bg-green-500 text-white rounded"
                    >
                      Save
                    </button>

                    <button
                      @click="cancelEdit(item.id)"
                      class="px-3 py-1 text-xs bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                  </template>

                  <!-- Tombol pas lagi dalam mode Lihat (Normal) -->
                  <template v-else>
                    <button
                      @click="toggleShow(item.id)"
                      class="px-3 py-1 text-xs bg-gray-200 rounded"
                    >
                      {{ shown[item.id] ? "Hide" : "Show" }}
                    </button>

                    <button
                      @click="enableEdit(item.id)"
                      class="px-3 py-1 text-xs bg-blue-500 text-white rounded"
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
import adminside from '@/components/navbar/admin-side.vue'
import Skeleton from '@/components/Skeleton.vue'
import api from '@/plugins/axios'
import { showConfirm, showError, showSuccess } from '@/utils/alert'
import { ref, onMounted } from 'vue'

// Siapin state buat nampung settingan ama status tampilannya
const settings = ref([])
const shown = ref({}) // Buat nyatet settingan mana yang lagi di-unmask
const editing = ref({}) // Buat nyatet settingan mana yang lagi diedit
const originalValues = ref({}) // Buat backup kalo admin batal edit
const isLoading = ref(true)

// Fungsi buat nyensor data sensitif pake titik-titik biar aman
const maskValue = (val) => {
  if (!val) return ""
  return "•".repeat(Math.min(val.length, 8))
}

// Saklar buat buka tutup sensor teks
const toggleShow = (id) => {
  shown.value[id] = !shown.value[id]
}

// Fungsi buat nyalain mode edit buat baris tertentu
const enableEdit = (id) => {
  editing.value[id] = true

  /* Simpen dulu nilai aslinya, sapa tau admin khilaf terus mau cancel */
  const item = settings.value.find(s => s.id === id)
  originalValues.value[id] = item.value
}

// Fungsi buat batalin edit ama balikin ke nilai awal
const cancelEdit = (id) => {
  const item = settings.value.find(s => s.id === id)
  item.value = originalValues.value[id]
  editing.value[id] = false
}

// Fungsi buat nyimpen perubahan settingan ke database
const saveEdit = async (item) => {

  /* Nanya dulu beneran yakin mau diubah apa kagak */
  const confirm = await showConfirm('Yakin ingin mengubah setting ini?')
  if (!confirm) return

  try {
    // Bikin payload pake nama settingannya sebagai key
    const payload = {
      [item.name]: item.value
    }

    await api.post('/setting', payload)

    // Matiin mode editnya
    editing.value[item.id] = false

    showSuccess('Setting berhasil diupdate')

  } catch (error) {
    console.error("Error updating setting:", error)
    showError('Gagal mengupdate setting')
  }
}

// Tarik semua data settingan dari server
const getSettings = async () => {
  try {
    isLoading.value = true

    const response = await api.get('/setting')
    settings.value = response.data.data

    /* Inisialisasi status sensor ama mode edit buat semua baris */
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

// Pas halaman dibuka, langsung sikat datanya
onMounted(() => {
  getSettings()
})
</script>