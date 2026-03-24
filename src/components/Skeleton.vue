<template>
  <div
    class="skeleton"
    :class="type"
    :style="style"
  ></div>
</template>

<script setup>

const props = defineProps({
  type: {
    type: String,
    default: "box"
  },
  width: String,
  height: String,
  size: String
})

const style = {
  width: props.size || props.width,
  height: props.size || props.height
}

</script>

<style>

.skeleton{
  background: linear-gradient(
    90deg,
    #e5e5e5 25%,
    #f5f5f5 50%,
    #e5e5e5 75%
  );
  background-size:200% 100%;
  animation:loading 1.2s infinite;
}

.box{
  border-radius:8px;
}

.circle{
  border-radius:50%;
}

@keyframes loading{
  0%{background-position:200%}
  100%{background-position:-200%}
}

</style>