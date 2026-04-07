<template>
  <Navbar />

  <div class="mt-10 px-6 space-y-6">
    <h2 class="text-2xl navbar-font text-[#7D0A0A]">Daftar Alamat Anda</h2>

    <div
      v-if="alamatUser.length === 0"
      class="text-gray-600 inter-font"
    >
      Belum ada alamat yang ditambahkan.
    </div>

    <div
      v-for="alamat in alamatUser"
      :key="alamat.id"
      class="rounded-xl border border-[#EAD196] bg-[#EEEEEE] p-5 shadow-md space-y-2 flex flex-col justify-between"
    >
      <div>
        <p class="text-lg font-semibold oswald-font text-[#7D0A0A]">
          {{ alamat?.label || '' }}
        </p>
        <p class="text-sm inter-font text-gray-700">
          {{ alamat.detail_alamat }}<br />
          {{ alamat.subdistrict_name }}, {{ alamat.district_name }}<br />
          {{ alamat.city_name }}, {{ alamat.province_name }} - {{ alamat.zip_code }}
        </p>
        <p class="text-xs text-[#BF3131] font-semibold inter-font mt-2">
          Kode Domestik: {{ alamat.kode_domestik }}
        </p>
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <router-link
          :to="`/edit-alamat/${alamat.id}`"
          class="px-4 py-1.5 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
        >
          Edit
        </router-link>
        <button
          @click="deleteAlamat(alamat.id)"
          class="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Hapus
        </button>
      </div>
    </div>

    <div class="pt-4">
      <router-link
        to="/create-alamat"
        class="group relative inline-block focus:outline-none"
      >
        <span class="absolute inset-0 border-2 border-[#BF3131] rounded-full"></span>
        <span
          class="block rounded-full bg-[#BF3131] px-8 py-3 text-sm font-bold text-white transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1"
        >
          Tambah Alamat
        </span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';
import { showConfirm, showSuccess, showError } from '@/utils/alert';

const alamatUser = ref([]);

const getAlamatUser = async () => {
  try {
    const response = await api.get('/alamat');
    alamatUser.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching alamat user:', error);
  }
};

const deleteAlamat = async (id) => {
  const confirmed = await showConfirm('Yakin ingin menghapus alamat ini?');
  if (!confirmed) return;

  try {
    await api.delete(`/alamat/${id}`);
    alamatUser.value = alamatUser.value.filter(a => a.id !== id);
    showSuccess('Alamat berhasil dihapus.');
  } catch (error) {
    console.error('Gagal menghapus alamat:', error);
    showError('Gagal menghapus alamat.');
  }
};

onMounted(() => {
  getAlamatUser();
});
</script>

