<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" v-loading.fullscreen.lock="fullLoading">

    </el-main>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
const fullLoading = ref(false);
</script>