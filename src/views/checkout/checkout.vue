<template>
  <Navbar />

  <div class="p-4 space-y-4 min-h-screen">

    <!-- Judul -->
    <h1 class="text-xl font-bold navbar-font mb-4">| Checkout</h1>

    <!-- ================= LOADING ================= -->
    <template v-if="isLoading">

      <!-- skeleton alamat -->
      <div class="bg-white rounded-lg shadow p-4 space-y-3">
        <Skeleton width="150px" height="18px"/>
        <Skeleton width="100%" height="40px"/>
      </div>

      <!-- skeleton toko -->
      <div
        v-for="n in 2"
        :key="n"
        class="bg-white rounded-lg shadow p-4 space-y-4"
      >

        <Skeleton width="120px" height="18px"/>

        <div
          v-for="i in 2"
          :key="i"
          class="flex items-center gap-4"
        >
          <Skeleton width="80px" height="80px"/>

          <div class="flex-1 space-y-2">
            <Skeleton width="70%" height="16px"/>
            <Skeleton width="40%" height="14px"/>
          </div>

          <Skeleton width="30px" height="14px"/>
        </div>

        <Skeleton width="100%" height="40px"/>

      </div>

      <!-- skeleton rincian -->
      <div class="bg-white rounded-lg shadow p-4 space-y-2">
        <Skeleton width="150px" height="18px"/>
        <Skeleton width="100%" height="14px"/>
        <Skeleton width="100%" height="14px"/>
        <Skeleton width="100%" height="14px"/>
      </div>

      <!-- skeleton button -->
      <Skeleton width="100%" height="45px"/>

    </template>


    <!-- ================= CHECKOUT DATA ================= -->
    <template v-else-if="checkout.length">

      <!-- Pilihan Alamat -->
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-3 navbar-font">Alamat Pengiriman</h3>

        <select
          v-model="selectedAlamat"
          class="border rounded p-2 w-full text-sm inter-font"
          @change="handleAlamatChange"
        >
          <option disabled value="">Pilih Alamat</option>

          <option
            v-for="alamat in alamatList"
            :key="alamat.id"
            :value="alamat.id"
          >
            {{ alamat.label }}
          </option>

          <option value="create">+ Tambah Alamat Baru</option>
        </select>
      </div>


      <!-- Checkout per toko -->
      <div class="space-y-5">

        <div
          v-for="toko in checkout"
          :key="toko.toko_id"
          class="bg-white rounded-lg shadow p-4 space-y-4"
        >

          <h2 class="font-semibold text-gray-800 navbar-font">
            {{ toko.nama_toko }}
          </h2>


          <!-- Produk -->
          <div
            v-for="item in toko.items"
            :key="item.product_id"
            class="flex items-center gap-4 border-b pb-3 last:border-0"
          >

            <img
              :src="item.foto_cover || ''"
              class="w-20 h-20 object-cover rounded border"
              @error="(e) => e.target.src = 'https://placehold.co/400x400?text=Image+Not+Found'"
            />

            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-800 navbar-font">
                {{ item.nama_product || 'Produk tidak ditemukan' }}
              </h3>

              <p class="text-sm font-bold text-red-600 mt-1 navbar-font">
                Rp {{ formatRupiah(item.harga) }}
              </p>
            </div>

            <div class="flex flex-col items-end gap-2">
              <span class="text-sm navbar-font">x{{ item.jumlah }}</span>

              <button
                @click="deleteProductscheckout(item.detail_transaction_id, toko.toko_id)"
                class="text-red-500 text-xs"
              >
                ✕
              </button>
            </div>

          </div>


          <!-- Kurir -->
          <div>
            <h3 class="font-semibold mb-2 text-sm navbar-font">Pilih Kurir</h3>

            <select
              v-model="toko.items[0].selectedKurir"
              @change="postRajaOngkir(toko)"
              class="border rounded p-2 w-full text-sm inter-font"
            >
              <option disabled value="">-- Pilih Kurir --</option>

              <option
                v-for="kurir in kurirList"
                :key="kurir.kode"
                :value="kurir.kode"
              >
                {{ kurir.nama }}
              </option>
            </select>
          </div>


          <!-- Service -->
          <div
            v-if="toko.items[0].ongkirList?.length"
            class="mt-2"
          >

            <h3 class="font-semibold mb-1 text-sm">
              Pilih Layanan
            </h3>

            <select
              v-model="toko.items[0].selectedService"
              @change="updateSelectedOngkir(toko)"
              class="border rounded p-2 w-full text-sm"
            >

              <option disabled value="">
                -- Pilih Layanan --
              </option>

              <option
                v-for="ongkir in toko.items[0].ongkirList"
                :key="ongkir.service"
                :value="ongkir.service"
              >
                {{ ongkir.service }}
                - Rp {{ formatRupiah(ongkir.cost) }}
                ({{ ongkir.etd }})
              </option>

            </select>

          </div>

        </div>


        <!-- Rincian Pembayaran -->
        <div class="bg-white rounded-lg shadow p-4">

          <h3 class="font-semibold mb-3 navbar-font text-[#7D0A0A]">
            Rincian Pembayaran
          </h3>

          <div class="text-sm space-y-1">

            <div
              v-for="toko in checkout"
              :key="toko.toko_id"
            >

              <div
                v-for="item in toko.items"
                :key="item.product_id"
                class="flex justify-between navbar-font"
              >

                <span>{{ item.nama_product }}</span>

                <span>
                  Rp {{ formatRupiah(item.harga * item.jumlah) }}
                </span>

              </div>

            </div>


            <div class="flex justify-between text-gray-500 navbar-font">
              <span>Total Ongkir</span>
              <span>Rp {{ formatRupiah(totalOngkir) }}</span>
            </div>

            <hr class="my-2">

            <div class="flex justify-between font-bold navbar-font">
              <span>Total</span>

              <span class="text-[#7D0A0A]">
                Rp {{ formatRupiah(totalHarga) }}
              </span>
            </div>

          </div>

        </div>


        <!-- Button -->
        <div class="bg-white rounded-lg shadow p-4">

          <button
            @click="checkoutCart"
            :disabled="!canCheckout"
            class="w-full py-3 bg-[#BF3131] text-white rounded-md text-sm font-semibold
            hover:bg-[#a32727] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Bayar Sekarang
          </button>

        </div>

      </div>

    </template>


    <!-- ================= EMPTY ================= -->
    <template v-else>

      <div class="text-center py-20 text-gray-400">
        Checkout masih kosong...
      </div>

    </template>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';
import Skeleton from '@/components/Skeleton.vue';

const router = useRouter();
const route = useRoute();

//Skeleton loading
const isLoading = ref(true);

// Data utama
const checkout = ref([]);                 // Data checkout per toko
const kodeTransaksi = ref(route.params.kode || ""); // Kode transaksi dari URL
const alamatList = ref([]);               // Daftar alamat user
const selectedAlamat = ref("");           // Alamat yang dipilih user

// Daftar kurir yang tersedia
const kurirList = [
  { kode: 'jne', nama: 'Jalur Nugraha Ekakurir (JNE)' },
  { kode: 'pos', nama: 'POS Indonesia (POS)' },
  { kode: 'sicepat', nama: 'SiCepat Express (SICEPAT)' },
  { kode: 'lion', nama: 'Lion Parcel (LION)' },
  { kode: 'ninja', nama: 'Ninja Xpress (NINJA)' },
  { kode: 'jnt', nama: 'J&T Express (J&T)' },
  { kode: 'anteraja', nama: 'AnterAja (ANTERAJA)' }
];

// Validasi tombol checkout aktif/tidak
const canCheckout = computed(() => {
  if (!selectedAlamat.value || selectedAlamat.value === 'create') return false;
  return checkout.value.every(toko => toko.items[0].selectedKurir && toko.items[0].selectedService);
});

// Format angka ke Rupiah
const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
    .format(value).replace("Rp","").trim();
};

// Hitung total ongkir semua toko
const totalOngkir = computed(() => {
  return checkout.value.reduce((sum, toko) => sum + (toko.biayaPengiriman || 0), 0);
});


// Hitung total harga produk + ongkir
const totalHarga = computed(() => {
  const totalProduk = checkout.value.reduce((sum, toko) => {
    return sum + toko.items.reduce((s, item) => s + (item.harga * item.jumlah), 0);
  }, 0);
  return totalProduk + totalOngkir.value;
});

// Ambil daftar alamat user dari API
const getAlamat = async () => {
  try {
    const response = await api.get('/alamat');
    alamatList.value = response.data.data.data;
  } catch (error) {
    console.error(error);
  }
};

// Ambil data detail checkout berdasarkan kode transaksi
const getCheckout = async () => {
  if (!kodeTransaksi.value) return;

  try {
    const response = await api.get(`/transaction/get-transaction-detail/${kodeTransaksi.value}`);
    const data = response.data.data;
    checkout.value = Object.values(data).map(toko => ({
      ...toko,
      items: toko.items.map(item => ({
        ...item,
        detail_transaction_id: item.detail_transaction_id,
        biayaPengiriman: 0,    // default ongkir 0
        selectedKurir: '',     // belum pilih kurir
        selectedService: '',   // belum pilih layanan kurir
        ongkirList: []         // daftar ongkir kosong
      }))
    }));

    console.log("Data checkout:", checkout.value);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const deleteProductscheckout = async (detailId, toko_id) => {
  if (!confirm('Yakin ingin menghapus produk ini?')) return;

  try {
    // Cari toko yang sesuai
    const toko = checkout.value.find(t => t.toko_id === toko_id);
    if (!toko) return;

    if (toko.items.length === 1) {
      // Kalau tinggal 1 produk → hapus transaksi
      await api.delete(`/transaction/${kodeTransaksi.value}`);
      checkout.value = []; // kosongkan checkout
      alert('Produk terakhir dihapus, transaksi dibatalkan.');
    } else {
      // Kalau masih banyak → hapus detail produk
      await api.delete(`/detail-transaction/${detailId}`);
      await getCheckout(); // refresh data checkout
    }

  } catch (error) {
    console.error(error);
  }
};

// Request ongkir ke API RajaOngkir
const postRajaOngkir = async (toko) => {
  const origin = toko.kode_domestik;
  const destination = alamatList.value.find(a => a.id === selectedAlamat.value)?.kode_domestik;
  const courier = toko.items[0].selectedKurir;
  const weight = toko.items.reduce((sum, i) => sum + (i.totalberat || 0), 0);

  if (!origin || !destination || !courier || weight <= 0) return;

  // Payload dikirim ke backend
  const payload = { 
    origin, 
    destination, 
    weight, 
    courier, 
    price: 'lowest' // isi default supaya validasi backend lewat
  };

  try {
    const response = await api.post('/rajaongkir/cost', payload);
    const results = response.data.data || [];

    // Simpan hasil ongkir ke setiap produk di toko
    toko.items.forEach(item => {
      item.ongkirList = results;
      item.selectedService = '';
      item.biayaPengiriman = 0;
    });
  } catch (error) {
    console.error("Error postRajaOngkir:", error);
  }
};

// Update ongkir saat user pilih layanan kurir
const updateSelectedOngkir = (toko) => {
  const selected = toko.items[0].ongkirList.find(
    o => o.service === toko.items[0].selectedService
  );
  if (selected) {
    toko.biayaPengiriman = selected.cost; // simpan sekali per toko
  }

  // Update ongkir di transaksi
  api.put(`/transaction/${kodeTransaksi.value}`, { total_ongkir: totalOngkir.value })
    .catch(err => console.error("Gagal update ongkir:", err));

  // 🔹 Tambahkan ini untuk cek payload kurir langsung
  const kurirPayload = checkout.value.map(t => ({
    toko_id: t.toko_id,
    kurir: t.items[0].selectedKurir,
    ongkir: t.biayaPengiriman,
    alamat_id: selectedAlamat.value
  }));
  console.log("Kurir payload terbaru:", kurirPayload);
};



// Load script Midtrans Snap
const loadMidtransScript = () => {
  if (!document.getElementById('midtrans-script')) {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.id = 'midtrans-script';
    script.setAttribute('data-client-key', 'SB-Mid-client-TDzXniOUPJF6QYHv');
    document.body.appendChild(script);
  }
};

// Checkout dan panggil Midtrans Snap
const checkoutCart = async () => {
  if (!kodeTransaksi.value) return;
  try {
    // 🔹 Ambil payload kurir per toko
    const dataOngkir = checkout.value.map(t => ({
      toko_id: t.toko_id,
      kurir: t.items[0].selectedKurir,
      ongkir: t.biayaPengiriman
    }));

    // 🔹 Kirim ongkir total + detail ongkir per toko
    const payload = { 
      ongkir: totalOngkir.value, 
      total: totalHarga.value,
      data_ongkir: dataOngkir,
      alamat_id: selectedAlamat.value
    };

    console.log("Payload checkout dikirim:", payload);

    const res = await api.post(`/transaction/payment/${kodeTransaksi.value}`, payload);
    const snapToken = res.data.data.snap_token;

    if (!window.snap) return;

    // 🔹 Panggil Midtrans Snap popup
    window.snap.pay(snapToken, {
      onSuccess: async result => {
        try {
          // Jika pembayaran sukses
          // await api.post(`/pengiriman/${kodeTransaksi.value}`, payload)
          // ini dimatiin karna ga buat shipment (udah di backend )
          window.location.href = "/transaksi-selesai";
        } catch (err) {
          console.error('Gagal buat shipment:', err);
          alert('Pembayaran sukses tapi gagal membuat data pengiriman.');
        }
      },
      onPending: () => { window.location.href = "/list-transaksi"; },
      onError: () => { window.location.href = "/list-transaksi"; },
      onClose: () => { alert("Popup ditutup sebelum pembayaran selesai."); }
    });
  } catch (error) {
    console.error(error);
  }
};


// Handler untuk pilihan alamat baru
const handleAlamatChange = () => {
  if (selectedAlamat.value === "create") router.push("/create-alamat");
};


// Lifecycle hook saat komponen mount
onMounted(async () => {
  loadMidtransScript(); // load Midtrans Snap
  await getAlamat();    // ambil daftar alamat
  await getCheckout();  // ambil data checkout
});
</script>
