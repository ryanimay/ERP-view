<template>
  <el-container id="mainContainer">
    <router-view name="header" />
    <router-view v-slot="{ Component }" name="body">
      <transition name="fade" mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </el-container>
</template>

<script setup>
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

#mainContainer{
  height: 100%;
}

#homeHeaderContainer{
  width: 250px;
  height: 100%;
}

.homeBodyContainer{
  height: 100%;
  width: 100%;
}
</style>
