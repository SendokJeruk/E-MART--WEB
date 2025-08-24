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
      class="rounded-xl border border-[#EAD196] bg-[#EEEEEE] p-5 shadow-md space-y-2"
    >
      <p class="text-lg font-semibold oswald-font text-[#7D0A0A]">
        {{ alamat.label }}
      </p>
      <p class="text-sm inter-font text-gray-700">
        {{ alamat.detail_alamat }}<br />
        {{ alamat.subdistrict_name }}, {{ alamat.district_name }}<br />
        {{ alamat.city_name }}, {{ alamat.province_name }} - {{ alamat.zip_code }}
      </p>
      <p class="text-xs text-[#BF3131] font-semibold inter-font">
        Kode Domestik: {{ alamat.kode_domestik }}
      </p>
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

const alamatUser = ref([]);

const getAlamatUser = async () => {
  try {
    const response = await api.get('/alamat');
    alamatUser.value = response.data.data.data;
  } catch (error) {
    console.error('Error fetching alamat user:', error);
  }
};

onMounted(() => {
  getAlamatUser();
});
</script>

<style scoped>
/* Pastikan font class sudah dimuat dari font.css yang kamu buat sebelumnya */
</style>
