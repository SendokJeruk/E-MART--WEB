<template>
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

const props = defineProps({
  label: String,
  to: [String, Object]
})

const emit = defineEmits(['click'])

const router = useRouter()

const handleClick = () => {
  if (props.to) {
    router.push(props.to)
  } else {
    emit('click') 
  }
}
</script>
