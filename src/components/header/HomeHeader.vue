<template>
    <el-aside id="homeHeaderContainer"  v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
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
                        <el-popover placement="top-start" :width="200" trigger="click" popper-style="border: 2px solid #606266">
                            <template #reference>
                                <el-badge :value="5" :max="10">
                                    <el-button type="info" icon="Bell" circle class="btnFrame"/>
                                </el-badge>
                            </template>
                        </el-popover>
                    </el-col>
                    <el-col :span="8">
                        <el-popover placement="top-start" :width="260" trigger="click" popper-style="border: 2px solid #12354b">
                            <template #reference>
                                <el-button type="primary" icon="Avatar" circle class="btnFrame"/>
                            </template>
                            <el-descriptions title="User Info" :column="1">
                                <el-descriptions-item label="Username:">{{user.username}}</el-descriptions-item>
                                <el-descriptions-item label="Email:">{{user.email}}</el-descriptions-item>
                                <el-descriptions-item label="Department:">{{user.departmentName}}</el-descriptions-item>
                                <el-descriptions-item label="Sign:">
                                    <el-tag :type="signType" >{{ signText }}</el-tag>
                                </el-descriptions-item>
                            </el-descriptions>
                            <el-row>
                                <el-col :span="24">
                                    <el-button type="primary" plain @click="editDialog = true" class="fullWidth ">
                                        Edit
                                    </el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-button type="danger" plain @click="logout" class="fullWidth margin-top">
                                        Logout
                                    </el-button>
                                </el-col>
                            </el-row>
                        </el-popover>
                    </el-col>
                    <el-col :span="8">
                        <el-button :type="signType" icon="Checked" circle class="btnFrame" @click="sign"/>
                    </el-col>
                </el-row>
            </el-footer>
        </el-container>

        <!--編輯用戶彈窗-->
        <el-dialog v-model="editDialog" title="Edit User" width="350" :before-close="handleClose">
            <el-form :model="userForm" label-position="right">
                <el-form-item label="Username:">
                    <span>{{ user.username }}</span>
                </el-form-item>
                <el-form-item label="Email:">
                    <el-input v-model="userForm.email" />
                </el-form-item>
                <el-form-item label="Department:">
                    <span>{{ user.departmentName }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">Cancel</el-button>
                    <el-button type="primary" @click="editUser">Submit</el-button>
                </div>
            </template>
        </el-dialog>
    </el-aside>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue';
import icon from '@/assets/icon/icons8-logo.svg';
import userStore from '@/config/store/user';
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance();
const loading = ref(false);
const list = ref([]);
const defaultActive = ref('home');
const activeColor = '#0f2b3d';
const normalColor = '#12354b';
const logo = icon;
const editDialog = ref(false);
const user = userStore();
const userForm = reactive({
    id:user.id,
    email:user.email
})
const signText = computed(() => {
    switch (user.attendStatus) {
        case 1:
            return 'No Punch';
        case 2:
            return 'Punch';
        case 3:
            return 'Clock out';
        default:
            return '';
    }
});
const signType = computed(() => {
    switch (user.attendStatus) {
        case 1:
            return 'danger';
        case 2:
            return 'success';
        case 3:
            return 'warning';
        default:
            return '';
    }
});
const param = ref({
    roleIds:''
});
onMounted(async () => {
    list.value = await getMenu();
});
async function getMenu() {
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
async function logout(){
    const response = await user.logout();
    if (response && response.data.code == 200) {
        proxy.$router.push({ 
            name: 'login', 
            query: {
                message: 'Logout success',
                type: 'success'
            } 
        });
    }
}
async function editUser(){
    loading.value = true;
    const response = await request.update(userForm);
    handleEditResponse(response);
    loading.value = false;
}
function handleEditResponse(response){
    if (response.data.code != 200) {
        proxy.$msg.error(response.data.data);
    } else {
        proxy.$msg.success('Success');
        user.update(response.data.data);
        editDialog.value = false
    }
}
const handleClose = () => {
  ElMessageBox.confirm('Are you sure to close edit page?')
    .then(() => {
        editDialog.value = false
    })
    .catch((e) => {
      console.log(e);
    });
};
async function sign(){
    if(user.attendStatus == '1'){
        const response = await request.signIn();
        handleSignResponse(response, 2);
    }else if((user.attendStatus == '2')){
        const response = await request.signOut();
        handleSignResponse(response, 3);
    }else if((user.attendStatus == '3')){
        proxy.$msg.warn('ヽ(✿ﾟ▽ﾟ)ノ下班下班~~~');
    }else{
        proxy.$msg.error('Somethings wrong');
    }
}

function handleSignResponse(response, status) {
    if (response.data.code != 200) {
        proxy.$msg.error(response.data.data);
    } else {
        proxy.$msg.success('Success');
        user.updateAttendStatus(status);
    }
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
.fullWidth{
    width: 100%
}
.margin-top{
    margin-top: 5px;
}
</style>