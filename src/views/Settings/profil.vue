<template>
  <Navbar />

  <div class="w-full px-4 sm:px-6 md:px-0 flex justify-center mt-6">

    <!-- SKELETON PROFILE -->
    <div
      v-if="isLoading"
      class="w-full max-w-sm bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center"
    >
      <!-- Avatar -->
      <Skeleton type="circle" size="100px" />

      <!-- Username -->
      <div class="mt-3">
        <Skeleton width="120px" height="20px" />
      </div>

      <!-- Info Box -->
      <div class="w-full bg-gray-100 rounded-lg p-4 mt-4 space-y-3">

        <div class="flex justify-between">
          <Skeleton width="90px" height="16px" />
          <Skeleton width="120px" height="16px" />
        </div>

        <div class="flex justify-between">
          <Skeleton width="60px" height="16px" />
          <Skeleton width="160px" height="16px" />
        </div>

        <div class="flex justify-between">
          <Skeleton width="90px" height="16px" />
          <Skeleton width="130px" height="16px" />
        </div>

      </div>

      <!-- Buttons -->
      <Skeleton width="100%" height="40px" class="mt-4" />
      <Skeleton width="100%" height="40px" class="mt-3" />
      <Skeleton width="100%" height="40px" class="mt-3" />
    </div>


    <!-- PROFILE ASLI -->
    <div
      v-else
      class="w-full max-w-sm bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center"
    >
      <img
        :src="user?.foto_profil || 'https://placehold.co/100'"
        alt="Foto Profil"
        class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mb-3"
      />

      <h2 class="text-xl sm:text-2xl font-bold mb-4 text-center">
        {{ user?.name || 'UserName' }}
      </h2>

      <div
        class="w-full bg-gray-100 rounded-lg p-4 sm:p-5 text-sm sm:text-base text-gray-800 space-y-2"
      >
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold">Full Name</span>
          <span class="text-right">{{ user?.name }}</span>
        </div>

        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold">Email</span>
          <span class="text-right break-all">{{ user?.email }}</span>
        </div>

        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold">No Telepon</span>
          <span class="text-right break-all">{{ user?.no_telp }}</span>
        </div>
      </div>

      <div class="w-full h-0.5 bg-red-600 my-4"></div>

      <button
        @click="logout"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#7D0A0A] text-center block mt-3"
      >
        Log Out
      </button>

      <router-link
        :to="`/edit-profil/${user?.id}`"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#7D0A0A] text-center block mt-3"
      >
        Edit Profil
      </router-link>

      <router-link
        v-if="userRole === 'seller'"
        :to="tokoseller.length > 0 ? '/seller' : '/create-toko'"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#7D0A0A] text-center block mt-3"
      >
        {{ tokoseller.length > 0 ? 'Seller Dashboard' : 'Buat Toko' }}
      </router-link>

      <router-link
        v-if="userRole === 'buyer'"
        to="/pengajuan-seller"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-green-600 text-center block mt-3"
      >
        Jadi Seller
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import Skeleton from "@/components/Skeleton.vue"
import api from '@/plugins/axios';
import { showConfirm } from '@/utils/alert';

const user = ref(null);
const userRole = ref('');
const isLoading = ref(false);
const tokoseller = ref([]);

const getProfile = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/profile');
    user.value = response.data.data;
    userRole.value = response.data.data.nama_role;

    if (userRole.value === 'seller') {
      await getToko();
    }
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  } finally {
    isLoading.value = false;
  }
};

const getToko = async () => {
  try {
    const response = await api.get('/toko?self');
    const alltoko = response.data.data.data;
    tokoseller.value = alltoko.filter((t) => t.user_id === user.value.id);
  } catch (error) {
    console.error('Error fetching toko:', error);
  }
};

const logout = async () => {
  const confirmed = await showConfirm("Anda Yakin Mau Logout ?")
  if (!confirmed) return;

  try {
    await api.post('/auth/logout');
    showSuccess("Logout Berhasil");
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    showError('Gagal Untuk Logout.');
  }
};

onMounted(() => {
  getProfile();
});
</script>
