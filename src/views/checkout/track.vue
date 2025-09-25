<template>
  <Navbar />

  <div class="bg-gray-50 min-h-screen py-6">
    <div class="max-w-4xl mx-auto px-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold text-black">Pesanan</h1>
      </div>

      <!-- Produk -->
      <div
        v-if="pengiriman?.detail_shipments?.length > 0"
        class="bg-white rounded-xl shadow p-4 flex items-center gap-4 mb-6"
      >
        <!-- Gambar Produk -->
        <img
          :src="pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.foto_cover"
          alt="produk"
          class="w-20 h-20 rounded-lg object-cover"
        />

        <!-- Detail Produk -->
        <div class="flex-1">
          <h3 class="text-lg font-semibold">
            {{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.nama_product }}
          </h3>
          <p class="text-gray-500 text-sm">
            Toko : {{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.product?.user?.toko?.nama_toko ?? '-' }}
          </p>
          <p class="text-red-600 font-bold">
            Rp.{{ pengiriman?.detail_shipments?.[0]?.detail_transaction?.harga }}
          </p>
        </div>

        <!-- Info Ekspedisi -->
        <div class="text-right text-sm">
          <p>
            <span class="font-semibold">Nomor Ekspedisi :</span>
            {{ pengiriman?.kode_resi ?? 'Belum tersedia' }} 📦
          </p>
          <p>
            <span class="font-semibold">Kurir :</span>
            {{ pengiriman?.kurir ?? 'Belum dipilih' }}
          </p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="flex justify-between items-center mb-6" v-if="pengiriman">
        <div class="flex-1 relative">
          <div class="absolute top-2 left-0 right-0 h-1 bg-gray-300"></div>
          <div
            class="absolute top-2 left-0 h-1 bg-red-600"
            :style="{ width: progressWidth }"
          ></div>

          <div class="flex justify-between relative z-10">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              :class="stepClass(1)"
            >
              1
            </div>
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              :class="stepClass(2)"
            >
              2
            </div>
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              :class="stepClass(3)"
            >
              3
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between text-sm font-medium mb-6" v-if="pengiriman">
        <span :class="stepTextClass(1)">Paket Sedang di kirim ke drop point</span>
        <span :class="stepTextClass(2)">Paket Sedang di kirim kurir ke alamat tujuan</span>
        <span :class="stepTextClass(3)">Pesanan Sampai</span>
      </div>

      <!-- Timeline -->
      <div class="bg-white rounded-xl shadow p-4 space-y-4" v-if="pengiriman">
        <!-- Item Aktif -->
        <div class="flex items-start gap-3">
          <div class="w-3 h-3 rounded-full bg-red-600 mt-1"></div>
          <div>
            <p class="text-sm font-medium">
              {{ formatDate(pengiriman.created_at) }}
            </p>
            <p class="text-red-600 font-semibold">
              {{ pengiriman.status_pengiriman }}
            </p>
            <button v-if="pengiriman.bukti_pengiriman" class="text-blue-600 text-sm">
              Lihat Bukti Pengiriman
            </button>
          </div>
          <p class="text-xs text-gray-500 ml-auto">
            Plat | {{ pengiriman.plat_nomor ?? 'Belum tersedia' }}
          </p>
        </div>

        <!-- Item Inaktif -->
        <div
          v-for="(item, index) in timeline"
          :key="index"
          class="flex items-start gap-3 text-gray-400"
        >
          <div class="w-3 h-3 rounded-full bg-gray-300 mt-1"></div>
          <div>
            <p class="text-sm font-medium">5 Jun – 11.21</p>
            <p>{{ item }}</p>
          </div>
          <p class="text-xs ml-auto">Plat | {{ pengiriman?.plat_nomor ?? '-' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const pengiriman = ref(null);
const timeline = ref(["Menuju drop point", "Dikirim ke tujuan", "Pesanan selesai"]);

const idShipment = route.params.id;

const getShipment = async () => {
  try {
    const response = await api.get(`/pengiriman/${idShipment}`);
    const data = response.data.data;
    pengiriman.value = data; // ✅ assign ke ref
    console.log('Data pengiriman detail:', data);
  } catch (error) {
    console.error("Gagal mengambil data pengiriman:", error);
  }
};

// === Helpers ===
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Progress Bar Step
const currentStep = computed(() => {
  if (!pengiriman.value) return 1;
  switch (pengiriman.value.status_pengiriman) {
    case "dibuat": return 1;
    case "dikirim": return 2;
    case "sampai": return 3;
    default: return 1;
  }
});

const progressWidth = computed(() => {
  return `${(currentStep.value - 1) / 2 * 100}%`;
});

const stepClass = (step) => {
  return step <= currentStep.value
    ? "bg-red-600 text-white"
    : "bg-gray-300 text-black";
};

const stepTextClass = (step) => {
  return step <= currentStep.value ? "text-red-600" : "text-gray-400";
};

onMounted(() => {
  getShipment();
});
</script>
