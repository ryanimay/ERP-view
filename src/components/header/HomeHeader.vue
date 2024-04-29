<template>
    <el-aside id="homeHeaderContainer">
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
        <el-row>
            <el-col :span="24">
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
            </el-col>
        </el-row>
    </el-aside>
</template>

<script setup>
import request from '@/api/request.js';
import { ref, onMounted } from 'vue';
import icon from '@/assets/icon/icons8-logo.svg';
const list = ref([]);
const defaultActive = ref('home');
const activeColor = '#0f2b3d';
const normalColor = '#12354b';
const logo = icon;
onMounted(async () => {
    list.value = await getMenu();
});
async function getMenu() {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await request.pMenu({ params: { roleIds: user.roleId.join(',') } });
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
</style>