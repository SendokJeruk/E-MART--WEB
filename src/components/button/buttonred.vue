<template>
  <!-- Tombol berwarna merah -->
  <a
    @click.prevent="handleClick"
    href="#"
    class="inline-block rounded-md border border-[#7D0A0A] bg-[#7D0A0A] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-transparent hover:text-[#7D0A0A] transition"
  >
    {{ label }}
  </a>
</template>

<script setup>
/**
 * Komponen Tombol Merah.
 * Bisa digunakan untuk navigasi (pindah halaman) atau memicu aksi (klik).
 */
import { useRouter } from 'vue-router'

// Properti: label (teks), to (tujuan halaman opsional)
const props = defineProps({
  label: String,
  to: [String, Object]
})

// Event 'click' untuk memberitahu komponen induk jika tombol ditekan tanpa navigasi
const emit = defineEmits(['click'])

const router = useRouter()

const handleClick = () => {
  if (props.to) {
    // Jika ada properti 'to', maka pindah halaman
    router.push(props.to)
  } else {
    // Jika tidak ada, jalankan fungsi klik yang dikirim dari luar
    emit('click') 
  }
}
</script>
