<template>
    <el-aside id="homeHeaderContainer">
        <el-row id="logoFrame">
            <el-col :span="9">
                <router-link :to="{ name: 'home' }">
                    <img :src="logo" id="logo" alt="" />
                </router-link>
            </el-col>
            <el-col :span="15" class="centerFrame">
                <h3>
                    <router-link :to="{ name: 'home' }" class="homeBtn">
                        CompanyName
                    </router-link>
                </h3>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-menu active-text-color="#ffd04b" background-color="#16415c" class="el-menu"
                    default-active="2" text-color="#fff">
                    <template v-for="(menu, index) in list" :key="index">
                        <el-sub-menu :index="menu.key" v-if="menu.key != 'all' && menu.items.length > 0">
                            <template #title>
                                <el-icon>
                                    <component :is="menu.icon" />
                                </el-icon>
                                <span>{{ menu.key }}</span>
                            </template>
                            <el-menu-item v-for="item in menu.items" :index="item.id.toString()"
                                :key="item.id.toString()" @click="menuClick(item)">
                                {{ item.name }}
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
const logo = icon;
onMounted(async () => {
    list.value = await routerList();
});
async function routerList() {
    try {
        const response = await proxy.$axios.get(config.api.router.list.path);
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
    console.log(response);
    return [
        {
            key: "all",
            icon: "document",
            items: [
                { id: 1, name: "home" },
                { id: 2, name: "login" },
                { id: 3, name: "forgetPassword" },
                { id: 4, name: "updatePassword" },
                { id: 5, name: "updateEmail" },
            ]
        },
        {
            key: "client",
            icon: "setting",
            items: [
                { id: 6, name: "client" }
            ]
        }
    ];
}
function menuClick(item) {
    console.log('Clicked on menu item:', item);
}
</script>

<style scoped>
#homeHeaderContainer{
    /* #1c4e6e */
    background-color: #1c4e6e;
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
</style>