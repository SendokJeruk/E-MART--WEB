<template>
  <Navbar />
  <div class="p-4 space-y-4 bg-[#FFF5F5] min-h-screen">
    <h1 class="text-xl font-bold navbar-font mb-4">| Checkout</h1>

    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="font-semibold mb-3">Alamat Pengiriman</h3>
      <select v-model="selectedAlamat" class="border rounded p-2 w-full text-sm" @change="handleAlamatChange">
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


    <div v-if="checkout.length" class="space-y-5">
      <div
        v-for="(group, kode) in groupedCheckout"
        :key="kode"
        class="bg-white rounded-lg shadow p-4 space-y-4"
      >
        <h2 class="font-semibold text-gray-800">
          {{ group.items[0]?.product?.user?.toko?.nama_toko || 'Nama Toko' }}
        </h2>

        <div
          v-for="item in group.items"
          :key="item.id"
          class="flex items-center gap-4 border-b pb-3 last:border-0"
        >
          <img
            :src="item.product?.foto_cover"
            alt="Produk"
            class="w-20 h-20 object-cover rounded border"
          />

          <div class="flex-1">
            <h3 class="text-base font-semibold text-gray-800">
              {{ item.product?.nama_product || 'Produk tidak ditemukan' }}
            </h3>
            <p class="text-sm font-bold text-red-600 mt-1">
              Rp {{ formatRupiah(item.harga) }}
            </p>
          </div>

          <div class="flex flex-col items-end gap-2">
            <span class="text-sm">x{{ item.jumlah }}</span>
            <button
              @click="deleteProductscheckout(item.id, item.transaction_id)"
              class="text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Pilih Kurir per toko -->
        <div>
          <h3 class="font-semibold mb-2 text-sm">Pilih Kurir</h3>
          <select 
            v-model="group.items[0].selectedKurir" 
            @change="postRajaOngkir(group)" 
            class="border rounded p-2 w-full text-sm"
          >
            <option disabled value="">-- Pilih Kurir --</option>
            <option v-for="kurir in kurirList" :key="kurir.kode" :value="kurir.kode">
              {{ kurir.nama }}
            </option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="font-semibold mb-3">Rincian Pembayaran</h3>
        <div class="text-sm space-y-1">
          <div
            class="flex justify-between"
            v-for="item in checkout"
            :key="item.id"
          >
            <span>{{ item.product?.nama_product }}</span>
            <span>Rp {{ formatRupiah(item.harga * item.jumlah) }}</span>
          </div>

          <div class="flex justify-between text-gray-500">
            <span>Total Ongkir</span>
            <span>Rp {{ formatRupiah(totalOngkir) }}</span>
          </div>
          <div class="flex justify-between text-gray-500">
            <span>Biaya Admin</span>
            <span>Rp 0</span>
          </div>
          <hr class="my-2" />
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span class="text-[#7D0A0A]">Rp {{ formatRupiah(totalHarga) }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-4">
        <button
          @click="checkoutCart"
          class="w-full py-3 bg-[#BF3131] text-white rounded-md hover:bg-[#a32727] text-sm font-semibold"
        >
          Bayar Sekarang
        </button>
      </div>
    </div>

    <div v-else class="text-center py-20 text-gray-400">
      Checkout masih kosong...
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { useRoute,useRouter } from 'vue-router'; 
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';

const router = useRouter()
const route = useRoute();
const checkout = ref([]); 
const kodeTransaksi = ref(route.params.kode || ""); 
const alamatList = ref([]); 
const selectedAlamat = ref(""); 
const kodeDomestikList = ref([]); 
const biayaPengiriman = ref(0);

const kurirList = [
  { kode: 'jne', nama: 'Jalur Nugraha Ekakurir (JNE)' },
  { kode: 'pos', nama: 'POS Indonesia (POS)' },
  { kode: 'sicepat', nama: 'SiCepat Express (SICEPAT)' },
  { kode: 'lion', nama: 'Lion Parcel (LION)' },
  { kode: 'ninja', nama: 'Ninja Xpress (NINJA)' },
  { kode: 'jnt', nama: 'J&T Express (J&T)' },
  { kode: 'anteraja', nama: 'AnterAja (ANTERAJA)' }
];

const groupedCheckout = computed(() => {
  const groups = {};
  checkout.value.forEach(item => {
    const kode = item.product?.user?.toko?.alamat_toko?.kode_domestik || "default";

    if (!groups[kode]) {
      groups[kode] = {
        items: [],
        totalWeight: 0,
        subtotal: 0,
        kode_transaksi: item.transaction?.kode_transaksi || item.kode_transaksi || kodeTransaksi.value
      };
    }

    groups[kode].items.push(item);
    groups[kode].totalWeight += Number(item.product?.berat || 0) * Number(item.jumlah || 0);
    groups[kode].subtotal += Number(item.harga) * Number(item.jumlah);
  });
  return groups;
});

const getCheckout = async () => {
  if (!kodeTransaksi.value) return;
  try {
    const response = await api.get('/transaction');
    const allData = response.data.data.data;
    const trx = allData.find(t => t.kode_transaksi === kodeTransaksi.value);
    checkout.value = trx ? trx.detail_transaction : [];
  } catch (error) {
    console.error(error);
  }
};

const getAlamat = async () => {
  try {
    const response = await api.get('/alamat');
    alamatList.value = response.data.data.data;
    kodeDomestikList.value = alamatList.value
      .map(alamat => alamat.kode_domestik)
      .filter(kode => kode);
  } catch (error) {
    console.error(error);
  }
};

const getAlamatToko = async () => {
  try {
    const response = await api.get('/transaction');
    const transaksi = response.data.data.data;
    kodeDomestikList.value = [];
    transaksi.forEach(trx => {
      trx.detail_transaction.forEach(item => {
        const kodeDomestik = item.product?.user?.toko?.alamat_toko?.kode_domestik;
        if (kodeDomestik) kodeDomestikList.value.push(kodeDomestik);
      });
    });
  } catch (error) {
    console.error(error);
  }
};

const totalOngkir = computed(() => {
  return checkout.value.reduce((sum, item) => sum + (item.biayaPengiriman || 0), 0);
});

const totalHarga = computed(() => {
  return checkout.value.reduce((sum, item) => sum + (item.harga * item.jumlah), 0) + totalOngkir.value;
});

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
    .format(value).replace("Rp","").trim();
};

const deleteProductscheckout = async (id) => {
  if (!confirm('Yakin ingin menghapus Produk ini?')) return;
  try {
    if (checkout.value.length <= 1) {
      await api.delete(`/transaction/${kodeTransaksi.value}`);
    } else {
      await api.delete(`/detail-transaction/${id}`);
    }
    await getCheckout();
  } catch (error) {
    console.error(error);
  }
};

const loadMidtransScript = () => {
  if (!document.getElementById('midtrans-script')) {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.id = 'midtrans-script';
    script.setAttribute('data-client-key', 'SB-Mid-client-TDzXniOUPJF6QYHv');
    document.body.appendChild(script);
  }
};

const checkoutCart = async () => {
  if (!kodeTransaksi.value) return;
  try {
    const payload = {
      ongkir: totalOngkir.value,
      total: totalHarga.value  
    };

    const res = await api.post(`/transaction/payment/${kodeTransaksi.value}`, payload);
    const snapToken = res.data.data.snap_token;

    if (!window.snap) return;
    window.snap.pay(snapToken, {
      onSuccess: result => { 
        console.log("Pembayaran berhasil!", result); 
        window.location.href = "/transaksi-selesai";
      },
      onPending: result => { 
        console.log("Menunggu pembayaran...", result); 
        window.location.href = "/list-transaksi";
      },
      onError: result => { 
        console.log("Pembayaran gagal!", result); 
        window.location.href = "/list-transaksi";
      },
      onClose: () => { 
        alert("Popup ditutup sebelum pembayaran selesai."); 
      }
    });
  } catch (error) {
    console.error(error);
  }
};

const handleAlamatChange = () => {
  if (selectedAlamat.value === "create") {
    router.push("/create-alamat")
  }
}

const postRajaOngkir = async (group) => {
  console.log("=== postRajaOngkir start ===");

  const origin = group.items[0]?.product?.user?.toko?.alamat_toko?.kode_domestik;
  const destination = alamatList.value.find(a => a.id === selectedAlamat.value)?.kode_domestik;
  const courier = group.items[0]?.selectedKurir;
  const weight = group.totalWeight;

  if (!origin || !destination || !courier || weight <= 0) {
    console.warn("Data ongkir tidak lengkap, proses dihentikan");
    return;
  }

  const payload = { origin, destination, weight, courier, price: 'lowest' };
  try {
    const response = await api.post('/rajaongkir/cost', payload);
    const results = response.data.data || [];
    if (!results.length) return;

    let lowest = results[0];
    results.forEach(s => { if (s.cost < lowest.cost) lowest = s; });

    group.items.forEach(item => {
      item.ongkirList = [lowest];
      item.selectedService = lowest.service;
      item.biayaPengiriman = lowest.cost;
    });

    // update total ongkir global (akumulasi semua toko)
    const updateRes = await api.put(`/transaction/${group.kode_transaksi}`, { total_ongkir: totalOngkir.value });
    console.log("Update backend berhasil:", updateRes.data);
  } catch (error) {
    console.error("Error postRajaOngkir:", error);
  }
};

onMounted(async () => {
  loadMidtransScript();
  await getAlamat();
  await getAlamatToko();
  if (kodeTransaksi.value) {
    await getCheckout();
  } else {
    const res = await api.get('/transaction');
    const transaksiList = res.data.data.data;
    if (transaksiList.length) {
      kodeTransaksi.value = transaksiList[transaksiList.length - 1]?.kode_transaksi;
      await getCheckout();
    }
  }
});
</script>