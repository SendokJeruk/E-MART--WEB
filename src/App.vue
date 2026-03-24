<template>
  <router-view :key="$route.fullPath" />
</template>


<script>
import dashboard from './views/dashboard.vue';
export default {
  components: {
    dashboard
  }
};
</script>
