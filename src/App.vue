<template>
  <loader />
  <router-view />
</template>


<script>
import loader from './Loader.vue';
export default {
  components: {
    loader
  }
};
</script>
