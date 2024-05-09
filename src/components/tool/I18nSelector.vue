<template>
    <el-select v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)"
        v-model="locale"
        :placeholder="locale.value"
        size="small"
        style="width: 100px"
        @change="changeLocale"
        >
        <el-option
            v-for="item in allLocale"
            :label="item.label"
            :value="item.value"
            :key="item.value"
        />
    </el-select>
</template>

<script setup>
import { ref } from 'vue';
import allLocale from '@/i18n/all.json';
import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const loading = ref(false);

function changeLocale(){
    loading.value = true;
    localStorage.setItem('lang', locale.value);
    setTimeout(() => {
        loading.value = false;
    }, 1000);
}
</script>