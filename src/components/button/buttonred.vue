<template>
  <!-- Tombol merah berani, bisa buat navigasi atau sekedar trigger klik doang -->
  <a
    @click.prevent="handleClick"
    href="#"
    class="inline-block rounded-md border border-[#7D0A0A] bg-[#7D0A0A] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-transparent hover:text-[#7D0A0A] transition"
  >
    {{ label }}
  </a>
</template>

<script setup>
import { useRouter } from 'vue-router'

// Nerima label ama tujuan (to) yang bisa berupa string atau object route
const props = defineProps({
  label: String,
  to: [String, Object]
})

// Ngasih tau ke komponen induk kalo ada aksi klik
const emit = defineEmits(['click'])

const router = useRouter()

// Fungsi buat nanganin klik: kalo ada tujuan ya pindah halaman, kalo gak ya emit event aja
const handleClick = () => {
  if (props.to) {
    router.push(props.to)
  } else {
    emit('click') 
  }
}
</script>
