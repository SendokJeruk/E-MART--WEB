<template>
  <Navbar />

  <div class="w-full px-4 sm:px-6 md:px-0 flex justify-center mt-6">
    <div class="w-full max-w-sm bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center">
      <img
        :src="user?.foto_profil || 'https://via.placeholder.com/100'"
        alt="Foto Profil"
        class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mb-3"
      />
      <h2 class="text-xl sm:text-2xl font-bold mb-4 text-center">{{ user?.name || 'UserName' }}</h2>

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
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold">Role</span>
          <span class="text-right break-all">{{ user?.nama_role }}</span>
        </div>
      </div>

      <div class="w-full h-0.5 bg-red-600 my-4"></div>

    <button @click="logout"
        class="w-full bg-gray-100 font-semibold py-2 rounded-lg transition hover:bg-red-100"
        style="color: #7D0A0A"
    >
        Log Out
    </button>
    <router-link
        :to="`/edit-profil/${user?.id}`"
        class="w-full bg-gray-100 font-semibold py-2 rounded-lg transition hover:bg-yellow-100 text-center block mt-3"
        style="color: #FFD700"
        >
        Edit Profil
    </router-link>
    <router-link
        :to="`/alamat`"
        class="w-full bg-gray-100 text-blue-500 font-semibold py-2 rounded-lg transition hover:bg-yellow-100 text-center block mt-3"
    >
        Alamat
    </router-link>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';

const user = ref(null);
const isLoading = ref(false);

const getProfile = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/profile');
    user.value = response.data.data;
  } catch (error) {
    console.error('Gagal mengambil profil:', error);
  } finally {
    isLoading.value = false;
  }
};

const logout = async () => {
  const confirmed = window.confirm("Are you sure you want to log out?")
  if (!confirmed) return

  try {
    await api.post('/auth/logout')
    isLoggedIn.value = false
    userName.value = ''
    userRole.value = ''
    showSidebar.value = false
    dropdownVisible.value = false 
    alert('Logged out successfully!')
  } catch (error) {
    console.error('Logout failed:', error)
    alert('Logout failed, please try again.')
  }
}

onMounted(() => {
  getProfile();
});
</script>

<style scoped>

</style>
