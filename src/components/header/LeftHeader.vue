<template>
  <HeaderContainer style="flex: none; width: 15%;">
    <template v-slot:slot1>
      <span id="headerleft">
        <router-link id='logoa' :to="{ name: 'home' }">
          <img id='logo' src="@/assets/icon/svg/loginPage/LOGO.svg">
        </router-link>
        <font-awesome-icon icon="circle-user" id="userIcon"/>
      </span>
    </template>
    <template v-slot:slot2>
      <div id='headerbody'>
        <p>
          Web Introduction0
        </p>
        <p>
          Web Introduction00
        </p>
        <p>
          Web Introduction000
        </p>
        <p>
          Web Introduction0000
        </p>
        <p>
          Web Introduction00000
        </p>
      </div>
    </template>
  </HeaderContainer>
</template>
<script setup>
</script>
<style>
#header {
  flex: 1 0 50%;
  display: flex;
  background-color: #848484;
  flex-direction: column;
  height: 100vh;
  transition: background-color 0.5s ease;
  overflow: hidden;
}

#userIcon {
  color: white;
  height: 30px; 
  flex: 1;
  margin-left: auto;
}

#headerbody {
  flex: 1 0 10%;
  margin: 0 10%;
  text-align: left;
  font-size: 20px;
}

#logo {
  width: 100%;
  margin-right: auto;
}

#logoa {
  display: flex;
  flex: 3;
  align-items: center;
}

#headerleft {
  margin: 10%;
  display: flex;
  align-items: center;
}
</style>