<template>
  <sellerside>
    <div class="max-w-md mx-auto p-4 bg-white shadow rounded">
        <h2 class="text-xl font-bold mb-4">Form Edit Toko</h2>
        <form @submit.prevent="submitForm">
            <div class="mb-4">
                <label for="nama_toko" class="block mb-1">Nama Toko</label>
                <input 
                type="text"
                id="nama_toko"
                v-model="form.nama_toko"
                class="w-full border px-3 py-2 rounded"
                />
            </div>

            <div class="mb-4">
                <label for="deskripsi" class="block mb-1">Deskripsi</label>
                <input 
                type="text"
                id="deskripsi"
                v-model="form.deskripsi"
                class="w-full border px-3 py-2 rounded"
                />
            </div>

            <div class="mb-4">
                <label for="no_telp" class="block mb-1">No Telepon</label>
                <input 
                type="text"
                id="no_telp"
                v-model="form.no_telp"
                class="w-full border px-3 py-2 rounded"
                />
            </div>

            <button
          type="submit"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
        </form>
    </div>
  </sellerside>
</template>

<script setup>
import Sellerside from '@/components/navbar/seller-side.vue';
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()

const form = ref({
    user_id: '',
    nama_toko: '',
    deskripsi: '',
    no_telp: ''
})

const fetchToko =  async() => {
    try {
        const response = await api.get(`/toko?id=${route.params.id}`)
        const toko = response.data.data.data[0];
        form.value.user_id = toko.user_id
        form.value.nama_toko = toko.nama_toko
        form.value.deskripsi = toko.deskripsi
        form.value.no_telp = toko.no_telp
    } catch (error) {
    console.error('Gagal mengambil data produk:', error);
    alert('Gagal mengambil data produk.');
    }
}

const submitForm = async () => {
    try {
        const formData = new FormData();

        formData.append('user_id', form.value.user_id);
        formData.append('nama_toko', form.value.nama_toko);
        formData.append('deskripsi', form.value.deskripsi);
        formData.append('no_telp', form.value.no_telp);

        formData.append('_method', 'PUT');  

        await api.post(`/toko/${route.params.id}`, formData, {
            headers: {
                "Content-Type" : "multipart/form-data",
            }
        })

        alert('Toko Berhasil Diedit!');
        router.push('/managetoko');
    } catch (error) {
    console.error('Gagal submit form:', error);
    alert(error.response?.data?.message || 'Gagal mengubah Toko.');
  }
}

onMounted(() => {
    fetchToko()
})
</script>

<style>

</style>