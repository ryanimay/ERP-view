<template>
    <div id="backbtn" @click="goBack">
        <img id="backicon" src="@/assets/icon/svg/resetPwd/back.svg">
    </div>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();//獲取全局組件
const goBack = () => {
    proxy.$router.back();
};
</script>

<style scoped>
#backbtn {
  margin-right: auto;
  cursor: pointer;
}

#backbtn:hover {
  opacity: 0.5;
}

#backicon {
  padding-top: 50%;
  padding-left: 25%;
  width: 90%;
}
</style>