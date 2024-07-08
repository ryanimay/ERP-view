<template>
    <el-main class="homeBodyContainer" v-loading.lock="loading" >
        
    </el-main>
</template>

<script setup>
import { ref } from 'vue';

const loading = ref(false);
</script>