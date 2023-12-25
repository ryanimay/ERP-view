<template>
  <HeaderContainer style="flex: none; width: 15%; ">
    <template v-slot:slot1>
      <span id="headerL">
        <router-link id='logoL' :to="{ name: 'home' }">
          <img id='logo' src="@/assets/icon/svg/loginPage/LOGO.svg">
        </router-link>
        <font-awesome-icon icon="circle-user" id="userIcon" @click="clickUser" />
      </span>
    </template>
    <template v-slot:slot2>
      <el-collapse accordion id="headerB">
        <el-collapse-item title="用戶管理">
          <p><font-awesome-icon icon="users" /> 用戶列表</p>
        </el-collapse-item>
        <el-collapse-item title="權限管理">
          <p><font-awesome-icon icon="receipt" /> 權限列表</p>
        </el-collapse-item>
      </el-collapse>
    </template>
  </HeaderContainer>
  <div v-if="showUserMenu" id="showUserMenu">
    <div>
      <div style="color: #ffffff;">Username: {{ user.username }}</div>
      <div style="color: #ffffff;">RoleId: {{ user.roleId }}</div>
    </div>
    <div style="display: flex; ">
      <div class="userbtn" >Userinfo</div>
      <div class="userbtn" @click="logout">Logout</div>
    </div>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue';
import { ElCollapse, ElCollapseItem } from 'element-plus';
const { proxy } = getCurrentInstance();
let showUserMenu = ref(false);
const clickUser = () => {
  showUserMenu.value = !showUserMenu.value;
}

const user = ref(JSON.parse(localStorage.getItem('user')));

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('token');
  proxy.$router.push({
      name: "login"
    });
}
</script>
<style>
.userbtn{
  flex: 1; 
  border-radius: 3px; 
  background-color: rgb(80, 80, 80);
  color: #ffffff;
  margin: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 30px;
}

.userbtn:hover{
  background-color: #707070;
}

.el-collapse-item__content p {
  font-size: 15px;
  background-color: #777777;
  padding: 3%;
  margin: 0;
  color: #292929;
  font-weight: bold;
}

.el-collapse-item__content p:hover {
  background-color: #707070;
}

.el-collapse-item__arrow .is-active svg {
  transform: rotateZ(270deg);
  position: absolute;
  top: 50%;
  right: 20px;
  margin-top: -7px;
  transition: transform .3s, -webkit-transform .3s;
  width: 12px;
}

.el-collapse-item__arrow svg {
  transform: rotateZ(90deg);
  position: absolute;
  top: 50%;
  right: 20px;
  margin-top: -7px;
  transition: transform .3s, -webkit-transform .3s;
  width: 12px;
}

.el-collapse-item {
  height: 56px;
  border-top: 1px solid #5f5f5f;
  border-bottom: 1px solid #5f5f5f;
  border-left: 0px;
  border-right: 0px;
  cursor: pointer;
}

.el-collapse-item.is-active {
  height: auto;
  /* 展開時高度自動擴展 */
}

.el-collapse-item__header {
  display: flex;
  width: 100%;
  align-items: center;
  height: 56px;
  position: relative;
  background-color: #848484;
  border: 0px;
  cursor: pointer;
}

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
  margin-left: 10%;
  cursor: pointer;
}

#userIcon:hover {
  color: rgb(224, 224, 224);
}

#headerB {
  flex: 1 0 10%;
  width: 100%;
  text-align: left;
  font-size: 20px;
  margin: 0;
}

#logo {
  width: 100%;
  margin-right: auto;
}

#logoL {
  display: flex;
  flex: 3;
  align-items: center;
}

#headerL {
  margin: 10%;
  display: flex;
  align-items: center;
  position: relative;
}

#showUserMenu {
  background-color: rgb(0, 0, 0);
  position: absolute;
  border-radius: 5px;
  top: 6.6%;
  left: 12%;
  width: 11%;
  text-align: left;
  padding: 5px;
}
</style>