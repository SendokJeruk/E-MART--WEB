<template>
  <Navbar />
  <div class="p-4 space-y-4 bg-[#FFF5F5] min-h-screen">
    <h1 class="text-xl font-bold text-[#7D0A0A] mb-4">Checkout</h1>

    <div v-if="checkout.length" class="space-y-3">
      <div
        v-for="item in checkout"
        :key="item.id"
        class="bg-white rounded-lg shadow flex p-3 items-center"
      >
        <img
          :src="item.product?.foto_cover"
          alt="Produk"
          class="w-16 h-16 object-cover rounded mr-3 border"
        />
        <div class="flex-1">
          <h2 class="text-sm font-semibold text-gray-800">
            {{ item.product?.nama_product || 'Produk tidak ditemukan' }}
          </h2>
          <p class="text-xs text-gray-500 mt-1">Toko: {{ item.product?.user?.toko?.nama_toko || 'Default Store' }}</p>
          <div class="flex justify-between items-center mt-2">
            <p class="text-sm font-bold text-red-600">
              Rp {{ formatRupiah(item.harga) }}
            </p>
            <div class="flex items-center space-x-2">
              <button
                @click="decrementQuantity(item)"
                class="px-2 py-0.5 bg-gray-200 rounded text-sm"
              >
                −
              </button>
              <span class="text-sm">{{ item.jumlah }}</span>
              <button
                @click="incrementQuantity(item)"
                class="px-2 py-0.5 bg-gray-200 rounded text-sm"
              >
                ＋
              </button>
            </div>
          </div>
        </div>
        <button
          @click="deleteProductcart(item.id)"
          class="text-red-500 text-xs ml-2"
        >
          ✕
        </button>
      </div>

      <div class="text-right mt-4 border-t pt-4">
        <p class="text-sm text-gray-700">Total:</p>
        <p class="text-lg font-bold text-[#7D0A0A]">Rp {{ formatRupiah(totalHarga) }}</p>
        <button 
          @click="checkoutCart"
          class="mt-3 w-full py-2 bg-[#BF3131] text-white rounded-md hover:bg-[#a32727] text-sm font-semibold"
        >
          Checkout
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
import Navbar from '@/components/navbar/navbar.vue';
import api from '@/plugins/axios';

const checkout = ref([]);
const kodeTransaksi = ref(null); 

const getCheckout = async () => {
  try {
    const response = await api.get('/detail-transaction');
    checkout.value = response.data.data.data;
  } catch (error) {
    console.error('Gagal fetch transaksi:', error.response?.data || error.message);
  }
};

const getKodeTransaksi = async () => {
  try {
    const res = await api.get('/transaction');
    const transaksiList = res.data.data.data; 

    if (!transaksiList.length) {
      console.warn("Belum ada transaksi.");
      return;
    }

    const latest = transaksiList[transaksiList.length - 1];
    kodeTransaksi.value = latest?.kode_transaksi;
  } catch (error) {
    console.error('Gagal mengambil kode transaksi:', error);
  }
};

const getAlamat = async () => {
  try {

  } catch (error) {
    
  }
}

const totalHarga = computed(() => {
  return checkout.value.reduce((total, item) => {
    return total + (Number(item.harga) * Number(item.jumlah));
  }, 0);
});

const formatRupiah = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value).replace("Rp", "").trim();
};

const incrementQuantity = (item) => {
  item.jumlah++;
};
const decrementQuantity = (item) => {
  if (item.jumlah > 1) item.jumlah--;
};

const deleteProductcart = async (id) => {
  const konfirmasi = confirm('Yakin ingin menghapus Produk ini?');
  if (!konfirmasi) return;

  try {
    await api.delete(`/detail-transaction/${id}`);
    alert('Produk berhasil dihapus Dari Checkout.');
    await getCheckout(); 
  } catch (error) {
    console.error('Gagal menghapus produk:', error);
    alert(error.response?.data?.message || 'Terjadi kesalahan saat menghapus produk.');
  }
};

const loadMidtransScript = () => {
  if (!document.getElementById('midtrans-script')) {
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.id = 'midtrans-script';
    script.setAttribute('data-client-key', 'YOUR_MIDTRANS_CLIENT_KEY');
    script.async = true;
    document.body.appendChild(script);
  }
};

const checkoutCart = async () => {
  if (!kodeTransaksi.value) {
    alert("Kode transaksi tidak ditemukan.");
    return;
  }

  try {
    const res = await api.post(`/transaction/payment/${kodeTransaksi.value}`, {
      
    });

    const snapToken = res.data.data.snap_token;

    if (!window.snap) {
      alert("Midtrans Snap.js belum siap, coba refresh halaman.");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: function(result) {
        alert("Pembayaran berhasil!");
        console.log(result);
      },
      onPending: function(result) {
        alert("Menunggu pembayaran...");
        console.log(result);
      },
      onError: function(result) {
        alert("Pembayaran gagal!");
        console.log(result);
      },
      onClose: function() {
        alert("Popup ditutup sebelum pembayaran selesai.");
      }
    });
  } catch (error) {
    console.error("Gagal memulai pembayaran:", error);
    alert("Gagal memulai pembayaran.");
  }
};

onMounted(() => {
  loadMidtransScript();
  getCheckout();
  getKodeTransaksi();
});
</script>