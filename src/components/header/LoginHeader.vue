<template>
    <div id="header-container">
        <div class="selector">
            <component :is="i18nSelector"/>
        </div>
    </div>
</template>

<script setup>
import i18nSelector from '@/components/tool/I18nSelector.vue';
</script>

<style scoped>
#header-container{
    width: 100%;
    height: 100vh;
    background-image:url('@/assets/index-background.jpg');
    background-size: cover;
}
.selector{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1%;
}
</style>