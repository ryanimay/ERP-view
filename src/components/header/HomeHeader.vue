<template>
    <el-aside id="homeHeaderContainer">
        <el-container id="container">
            <el-header id="headerHeight">
                <el-row id="logoFrame">
                    <el-col :span="9">
                        <router-link @click="changeActive('home')" :to="{ name: 'home' }">
                            <img :src="logo" id="logo" alt="" />
                        </router-link>
                    </el-col>
                    <el-col :span="15" class="centerFrame">
                        <h3>
                            <router-link @click="changeActive('home')" :to="{ name: 'home' }" class="homeBtn">
                                CompanyName
                            </router-link>
                        </h3>
                    </el-col>
                </el-row>
            </el-header>
            <el-main>
                <el-menu active-text-color="#fff" background-color="#16415c" class="el-menu"
                    :default-active="defaultActive" text-color="#fff" :router="true">
                    <template v-for="(menu, index) in list" :key="index">
                        <el-sub-menu :index="menu.id.toString()" v-if="menu.child">
                            <template #title>
                                <el-icon>
                                    <component :is="menu.icon" />
                                </el-icon>
                                <span>{{ menu.name }}</span>
                            </template>
                            <el-menu-item v-for="child in menu.child" :index="child.path"
                                :key="child.id.toString()" @click="changeActive(child.path)" :style="{backgroundColor: defaultActive === child.path ? activeColor : normalColor}">
                                <el-icon>
                                    <component :is="child.icon" />
                                </el-icon>
                                <span>{{ child.name }}</span>
                            </el-menu-item>
                        </el-sub-menu>
                    </template>
                </el-menu>
            </el-main>
            <el-footer>
                <el-row>
                    <el-col :span="8">
                        <el-badge :value="5" :max="10">
                            <el-button type="info" icon="Bell" circle class="btnFrame"/>
                        </el-badge>
                    </el-col>
                    <el-col :span="8">
                        <el-button type="primary" icon="Avatar" circle class="btnFrame"/>
                    </el-col>
                    <el-col :span="8">
                    </el-col>
                </el-row>
            </el-footer>
        </el-container>
    </el-aside>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted } from 'vue';
import icon from '@/assets/icon/icons8-logo.svg';
import userStore from '@/config/store/user';
const list = ref([]);
const defaultActive = ref('home');
const activeColor = '#0f2b3d';
const normalColor = '#12354b';
const logo = icon;
const param = ref({
    roleIds:''
});
onMounted(async () => {
    list.value = await getMenu();
});
async function getMenu() {
    const user = userStore();
    param.value.roleIds = user.roleId.join(',');
    const response = await request.pMenu(param.value);
    return handleResponse(response);
}
function handleResponse(response) {
    if (response && response.data.code === 200) {
        return response.data.data;
    } else {
        return [];
    }
}
function changeActive(routerName){
    defaultActive.value = routerName;
}
</script>

<style scoped>
#homeHeaderContainer{
    background-color: #16415c;
}
.centerFrame {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

#logoFrame {
    margin: 10px 0 10px 0;
}
@font-face {
    font-family: logo;
    src: url('@/assets/font/MelaroundRegular-OGGOo.otf') format('opentype');
}
.homeBtn{
    text-decoration: blink;
    color: white;
    font-family: logo, sans-serif;
}
#logo{
    width: 93.75px;
}
.el-menu{
    border-right:none;
}
.is-opened, .el-menu-item{
    background-color: #12354b;
}
.el-menu-item:hover{
    background-color: #0f2b3d;
}
.el-header, .el-main{
    padding: 0;
}
#container{
    height: 100%;
}
#headerHeight{
    height: 117.75px;
}
.btnFrame{
    height: 45px;
    width: 45px;
    font-size: 30px;
    transition: all 0.15s ease;
}
.btnFrame:hover{
    height: 48px;
    width: 48px;
    font-size: 32px;
    box-shadow: 1px 1px rgb(53, 53, 53);
}
</style>