<template>
  <el-container id="mainContainer">
    <router-view v-slot="{ Component }" name="header">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="Component"/>
        </keep-alive>
      </transition>
    </router-view>
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
  margin-top: 52px;
  width: 100%;
}
</style>
