<template>
  <span id="headerleft">
    <router-link id='logoa' :to="{name:'home'}">
      <img id='logo' src="@/assets/icon/svg/loginPage/LOGO.svg">
    </router-link>
  </span>
</template>

<style scoped>
  #logo {
    width: 250px;
  }
  #logoa {
    margin: 10% 10%;
    display: block;
  }
  
  #headerleft {
    display: flex;
    flex: 33%;
  }
</style>