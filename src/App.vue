<template>
  <el-container v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <router-view name="header"/>
    <router-view name="body"/>
  </el-container>
</template>

<script setup>
import { ref } from 'vue';
import { ElContainer } from 'element-plus';
const loading = ref(true);

setTimeout(() => {
  loading.value = false;
}, 2000);
</script>

<style>
</style>
