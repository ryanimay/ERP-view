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
import config from '@/config/RouterPath';
import { ref, onMounted, getCurrentInstance } from 'vue';
import icon from '@/assets/icon/icons8-logo.svg';
const { proxy } = getCurrentInstance();
const list = ref([]);
const defaultActive = ref('home');
const activeColor = '#0f2b3d';
const normalColor = '#12354b';
const logo = icon;
onMounted(async () => {
    list.value = await getMenu();
});
async function getMenu() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await proxy.$axios.get(config.api.menu.pMenu.path, { params: { roleIds: user.roleId.join(',') } });
        if (response.data.code === 200) {
            return handleResponse(response);
        } else {
            return [];
        }
    } catch (error) {
        proxy.$msg.error('Unknown Error');
        console.error('API request failed:', error);
        return [];
    }
}
function handleResponse(response) {
    return response.data.data;
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