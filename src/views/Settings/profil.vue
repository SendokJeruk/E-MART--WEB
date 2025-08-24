<template>
  <Navbar />

  <div class="w-full px-4 sm:px-6 md:px-0 flex justify-center mt-6">
    <div class="w-full max-w-sm bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center">
      <img
        :src="user?.foto_profil || 'https://placehold.co/100'"
        alt="Foto Profil"
        class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mb-3"
      />
      <h2 class="text-xl sm:text-2xl font-bold mb-4 text-center">
        {{ user?.name || 'UserName' }}
      </h2>

      <div class="w-full bg-gray-100 rounded-lg p-4 sm:p-5 text-sm sm:text-base text-gray-800 space-y-2">
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';

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
    const response = await api.get('/toko');
    const alltoko = response.data.data.data;
    tokoseller.value = alltoko.filter((t) => t.user_id === user.value.id);
  } catch (error) {
    console.error('Error fetching toko:', error);
  }
};

const logout = async () => {
  const confirmed = window.confirm('Are you sure you want to log out?');
  if (!confirmed) return;

  try {
    await api.post('/auth/logout');
    alert('Logged out successfully!');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout failed, please try again.');
  }
};

onMounted(() => {
  getProfile();
});
</script>
