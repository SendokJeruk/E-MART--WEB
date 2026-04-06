<template>
  <Navbar />

  <div class="w-full px-4 sm:px-6 md:px-0 flex justify-center mt-6">

    <!-- Tampilan skeleton pas data profil kamu lagi ditarik dari server -->
    <div
      v-if="isLoading"
      class="w-full max-sm bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center"
    >
      <!-- Avatar bulat kosong -->
      <Skeleton type="circle" size="100px" />

      <!-- Baris nama kosong -->
      <div class="mt-3">
        <Skeleton width="120px" height="20px" />
      </div>

      <!-- Kotak info detail kosong -->
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

      <!-- Deretan tombol skeleton -->
      <Skeleton width="100%" height="40px" class="mt-4" />
      <Skeleton width="100%" height="40px" class="mt-3" />
      <Skeleton width="100%" height="40px" class="mt-3" />
    </div>


    <!-- Ini tampilan asli kartu profil kamu kalo udah nongol datanya -->
    <div
      v-else
      class="w-full max-w-sm bg-white rounded-xl shadow p-4 sm:p-6 flex flex-col items-center"
    >
      <!-- Foto profil kamu, kalo gak ada ya pake placeholder -->
      <img
        :src="user?.foto_profil || 'https://placehold.co/100'"
        alt="Foto Profil"
        class="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border mb-3"
      />

      <!-- Nama lengkap kamu yang keren -->
      <h2 class="text-xl sm:text-2xl font-bold mb-4 text-center">
        {{ user?.name || 'User Kece' }}
      </h2>

      <!-- Info detail: Nama, Email, ama No Telp -->
      <div
        class="w-full bg-gray-100 rounded-lg p-4 sm:p-5 text-sm sm:text-base text-gray-800 space-y-2"
      >
        <div class="flex justify-between border-b pb-1">
          <span class="font-semibold">Nama Lengkap</span>
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

      <!-- Garis pembatas warna merah E-MART -->
      <div class="w-full h-0.5 bg-red-600 my-4"></div>

      <!-- Tombol buat keluar dari aplikasi (Logout) -->
      <button
        @click="logout"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#7D0A0A] text-center block mt-3"
      >
        Keluar Akun
      </button>

      <!-- Tombol buat masuk ke halaman edit profil -->
      <router-link
        :to="`/edit-profil/${user?.id}`"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#7D0A0A] text-center block mt-3"
      >
        Edit Profil
      </router-link>

      <!-- Tombol khusus buat Seller (dashboard atau bikin toko) -->
      <router-link
        v-if="userRole === 'seller'"
        :to="tokoseller.length > 0 ? '/seller' : '/create-toko'"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-[#7D0A0A] text-center block mt-3"
      >
        {{ tokoseller.length > 0 ? 'Dashboard Seller' : 'Buka Toko Sekarang' }}
      </router-link>

      <!-- Tombol khusus buat Buyer yang pengen naik pangkat jadi Seller -->
      <router-link
        v-if="userRole === 'buyer'"
        to="/pengajuan-seller"
        class="w-full bg-[#7D0A0A] text-white font-semibold py-2 rounded-lg transition duration-300 hover:bg-white hover:text-green-600 text-center block mt-3"
      >
        Daftar Jadi Seller
      </router-link>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/navbar/navbar.vue';
import Skeleton from "@/components/Skeleton.vue"
import api from '@/plugins/axios';
import { showConfirm, showSuccess, showError } from '@/utils/alert';

const user = ref(null);
const userRole = ref('');
const isLoading = ref(false);
const tokoseller = ref([]);

// Ambil profil user buat dipajang di halaman
const getProfile = async () => {
  try {
    isLoading.value = true;
    const response = await api.get('/profile');
    user.value = response.data.data;
    userRole.value = response.data.data.nama_role;

    // Kalo rolenya seller, sekalian cek tokonya udah ada belom
    if (userRole.value === 'seller') {
      await getToko();
    }
  } catch (error) {
    console.error('Gagal mengambil profil kamu nih:', error);
  } finally {
    isLoading.value = false;
  }
};

// Cek data toko punya user ini
const getToko = async () => {
  try {
    const response = await api.get('/toko?self');
    const alltoko = response.data.data.data;
    tokoseller.value = alltoko.filter((t) => t.user_id === user.value.id);
  } catch (error) {
    console.error('Gagal ambil data toko kamu:', error);
  }
};

// Fungsi buat kabur (Logout) dari aplikasi
const logout = async () => {
  const confirmed = await showConfirm("Beneran mau keluar nih? Nanti kangen lho.")
  if (!confirmed) return;

  try {
    await api.post('/auth/logout');
    showSuccess("Logout Berhasil, dadah!");
    // Hapus sisa-sisa kenangan (token) terus balik ke login
    localStorage.removeItem("token");
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
    showError('Yah, gagal logout nih. Cobain lagi ya.');
  }
};

// Pas halaman dibuka, langsung gas ambil datanya
onMounted(() => {
  getProfile();
});
</script>
