<template>
  <adminside>
    <div class="p-6 overflow-x-auto">
      <h1 class="text-2xl font-bold mb-4">Settings</h1>

      <!-- Tombol Add Setting -->
      <!-- <button
        @click="showModal = true"
        class="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Add Setting
      </button> -->

      <!-- Table Settings -->
      <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300">
        <table class="min-w-full table-auto divide-y divide-gray-200">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Value</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">

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

            <template v-else>
              <tr v-for="item in settings" :key="item.id">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.name }}</td>

                <td class="px-6 py-4 text-sm text-gray-700">
                  <input
                    v-if="editing[item.id]"
                    v-model="item.value"
                    type="text"
                    class="border rounded px-2 py-1 w-full"
                  />
                  <span v-else>
                    {{ shown[item.id] ? item.value : maskValue(item.value) }}
                  </span>
                </td>

                <td class="px-6 py-4 text-sm space-x-2">
                  <template v-if="editing[item.id]">
                    <button
                      @click="saveEdit(item)"
                      class="px-3 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                    >
                      Save
                    </button>
                    <button
                      @click="cancelEdit(item.id)"
                      class="px-3 py-1 text-xs bg-gray-300 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </template>

                  <template v-else>
                    <button
                      @click="toggleShow(item.id)"
                      class="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded-md transition"
                    >
                      {{ shown[item.id] ? "Hide" : "Show" }}
                    </button>

                    <button
                      @click="enableEdit(item.id)"
                      class="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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

    <!-- Modal Add Setting
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white rounded-lg w-96 p-6 relative">
        <h2 class="text-lg font-bold mb-4">Add New Setting</h2>
        <label class="block mb-2">Name</label>
        <input v-model="newSetting.name" type="text" class="border rounded px-2 py-1 w-full mb-4" />

        <label class="block mb-2">Value</label>
        <input v-model="newSetting.value" type="text" class="border rounded px-2 py-1 w-full mb-4" />

        <div class="flex justify-end space-x-2">
          <button @click="showModal = false" class="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 transition">Cancel</button>
          <button @click="addSetting" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">Add</button>
        </div>
      </div>
    </div> -->
  </adminside>
</template>

<script setup>
import adminside from '@/components/navbar/admin-side.vue';
import Skeleton from '@/components/Skeleton.vue';
import api from '@/plugins/axios';
import { ref, onMounted } from 'vue';

const settings = ref([]);
const shown = ref({});
const editing = ref({});
const originalValues = ref({});
const isLoading = ref(true);

const showModal = ref(false);
const newSetting = ref({ name: '', value: '' });

const maskValue = (val) => {
  if (!val) return "";
  return "•".repeat(Math.min(val.length, 8)); 
};

const toggleShow = (id) => {
  shown.value[id] = !shown.value[id];
};

const enableEdit = (id) => {
  editing.value[id] = true;
  originalValues.value[id] = settings.value.find(s => s.id === id).value;
};

const cancelEdit = (id) => {
  const item = settings.value.find(s => s.id === id);
  item.value = originalValues.value[id];
  editing.value[id] = false;
};

const saveEdit = async (item) => {
  try {
    // payload harus sesuai nama field yang ada di $settings
    const payload = {
      [item.name]: item.value   // contoh: { MIDTRANS_SERVER_KEY: "xxx" }
    };

    await api.post('/setting', payload);
    editing.value[item.id] = false;
  } catch (error) {
    console.error("Error updating setting:", error);
  }
};


// const addSetting = async () => {
//   if (!newSetting.value.name || !newSetting.value.value) return;

//   try {
//     await api.post('/setting', {
//       name: newSetting.value.name,
//       value: newSetting.value.value
//     });

//     await getSettings();

//     showModal.value = false;
//     newSetting.value = { name: '', value: '' };
//   } catch (error) {
//     console.error("Error adding setting:", error);
//   }
// };

const getSettings = async () => {
  try {
    const response = await api.get('/setting');
    settings.value = response.data.data;

    response.data.data.forEach(item => {
      shown.value[item.id] = false;
      editing.value[item.id] = false;
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getSettings();
});
</script>
