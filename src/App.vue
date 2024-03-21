<template>
  <el-container v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <router-view name="header" />
    <router-view v-slot="{ Component }" name="body">
      <transition name="fade" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
const loading = ref(true);
setTimeout(() => {
  loading.value = false;
}, 1000);
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
