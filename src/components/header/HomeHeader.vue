<template>
    <el-aside v-loading.fullscreen.lock="loading"
        element-loading-background="rgba(0, 0, 0, 0.5)">
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
                                <span>{{ $t(menu.name) }}</span>
                            </template>
                            <el-menu-item v-for="child in menu.child" :index="child.path" :key="child.id.toString()"
                                @click="changeActive(child.path)"
                                :style="{ backgroundColor: defaultActive === child.path ? activeColor : normalColor }">
                                <el-icon>
                                    <component :is="child.icon" />
                                </el-icon>
                                <span>{{ $t(child.name) }}</span>
                            </el-menu-item>
                        </el-sub-menu>
                    </template>
                </el-menu>
            </el-main>
        </el-container>

        <!--編輯用戶彈窗-->
        <el-dialog v-model="editDialog" :title="$t('homeHeader.editUser')" width="350" :before-close="handleClose">
            <el-form :model="userForm" label-position="right" @submit.prevent>
                <el-form-item :label="$t('homeHeader.username')">
                    <span>{{ user.username }}</span>
                </el-form-item>
                <el-form-item :label="$t('homeHeader.email')">
                    <el-input v-model="userForm.email" @keyup.enter="editUser" />
                </el-form-item>
                <el-form-item :label="$t('homeHeader.department')">
                    <span>{{ user.departmentName }}</span>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">{{ $t('homeHeader.cancel') }}</el-button>
                    <el-button type="primary" @click="editUser">{{ $t('homeHeader.submit') }}</el-button>
                </div>
            </template>
        </el-dialog>
        <div id="titleFrame">
            <span id="titleLeft">
                <el-icon :size="20">
                    <Compass />
                </el-icon>
                <span id="navigation">
                    <el-breadcrumb separator-icon="ArrowRight">
                        <el-breadcrumb-item v-for="(name, index) in navigation" :key="index" :to="getNavigationRoute(name)">{{ $t('router.' + name.replace(":", "")) }}</el-breadcrumb-item>
                    </el-breadcrumb>
                </span>
            </span>
            <div id="titleRight">
                <span class="marginR">
                    <component :is="i18nSelector" />
                </span>
                <span>
                    <el-popover placement="top-start" :width="200" trigger="click"
                        popper-style="padding: 0;" popper-class="notificationPop">
                        <template #reference>
                            <el-badge :value="checkNotificationSize()" :max="10" :show-zero="false" :offset="[-10, 40]">
                                <el-button type="info" icon="Bell" class="btnFrame" />
                            </el-badge>
                        </template>
                        <div class="notificationTitle font14">
                            {{ $t('homeHeader.notification') }}
                        </div>
                        <el-table :data="notification" style="width: 100%" :show-header="false"
                        :row-style="notificationStyle" max-height="300"
                        @row-click="notificationJump">
                            <el-table-column class-name="elTable">
                                <template #default="scope">
                                    <el-row>
                                        <el-col>
                                            <div>{{ formatNotificationInfo(scope.row.info) }}</div>
                                        </el-col>
                                    </el-row>
                                    <el-row justify="end">
                                        <el-col :span="10">
                                            <div class="font12">{{ formatCreateTime(scope.row.createTime) }}</div>
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-popover>
                </span>
                <span>
                    <el-button :type="signType" icon="Checked" class="btnFrame" @click="sign" />
                </span>
                <span class="marginR">
                    <el-popover placement="top-start" :width="260" trigger="click"
                        popper-style="margin-top: 10px;" popper-class="notificationPop">
                        <template #reference>
                            <el-button type="primary" icon="Avatar" class="btnFrame" />
                        </template>
                        <el-descriptions :column="1">
                            <template #title>
                                <span class="font14">{{$t('homeHeader.userInfo')}}</span>
                            </template>
                            <el-descriptions-item>
                                <template #default>
                                    <div class="descriptionInfo">
                                        <span>{{$t('homeHeader.username')}}</span>
                                        <span>{{ user.username }}</span>
                                    </div>
                                    <div class="descriptionInfo">
                                        <span>{{$t('homeHeader.email')}}</span>
                                        <span>{{ user.email }}</span>
                                    </div>
                                    <div class="descriptionInfo">
                                        <span>{{$t('homeHeader.department')}}</span>
                                        <span>{{ user.departmentName }}</span>
                                    </div>
                                    <div>
                                        <span>{{$t('homeHeader.sign')}}</span>
                                        <span v-if="signType !== ''">
                                            <el-tag :type="signType">{{ $t(signText) }}</el-tag>
                                        </span>
                                    </div>
                                </template>
                            </el-descriptions-item>
                        </el-descriptions>
                        <el-row>
                            <el-col :span="24">
                                <el-button type="primary" plain @click="openEditDialog" class="fullWidth ">
                                    {{ $t('homeHeader.edit') }}
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-button type="danger" plain @click="logout" class="fullWidth margin-top">
                                    {{ $t('homeHeader.logout') }}
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-popover>
                </span>
            </div>
        </div>
    </el-aside>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue';
import icon from '@/assets/icon/icons9-logo.svg';
import userStore from '@/config/store/user';
import navigationStore from '@/config/store/navigation';
import websocketStore  from '@/config/store/websocket';
import { ElMessageBox } from 'element-plus';
import i18nSelector from '@/components/tool/I18nSelector.vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const ws = websocketStore();
const { proxy } = getCurrentInstance();
const loading = ref(false);
const list = ref([]);
const navi = navigationStore();
const navigation = computed(() => navi.path);
const defaultActive = ref('home');
const activeColor = '#0f2b3d';
const normalColor = '#12354b';
const logo = icon;
const editDialog = ref(false);
const user = userStore();
const userForm = reactive({
    id: user.id,
    email: user.email
})
const notification = ref([])
const signText = computed(() => {
    switch (user.attendStatus) {
        case 1:
            return 'homeHeader.signText.noPunch';
        case 2:
            return 'homeHeader.signText.punch';
        case 3:
            return 'homeHeader.signText.clockOut';
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
    roleIds: ''
});
onMounted(async () => {
    loading.value = true;
    list.value = await getMenu();
    await ws.connect();
    ws.subscribe('/user/topic/notification', handleNotification);//偶發loading問題
    ws.subscribe('/user/topic/clientStatus', userKick);
    loading.value = false;
});
//觸發用戶強制踢出
const userKick = async (msg) => {
    const response = await user.logout();
    const showMessage = t(JSON.parse(msg).data);
    console.log(showMessage);
    if (response && response.data.code == 200) {
        ws.disconnect();
        proxy.$router.push({
            name: 'login',
            query: {
                message: t(showMessage),
                type: 'danger'
            }
        });
    }
}
const handleNotification = (message) => {
    var data = JSON.parse(message).data;
    data.forEach(msg => notification.value.push(msg));
    
};

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
//點擊某個路徑，用來'改已選顏色'和'當前路徑導航'
function changeActive(routerName) {
    defaultActive.value = routerName;
}
async function logout() {
    const response = await user.logout();
    if (response && response.data.code == 200) {
        ws.disconnect();
        proxy.$router.push({
            name: 'login',
            query: {
                message: t('homeHeader.logoutSuccess'),
                type: 'success'
            }
        });
    }
}
async function editUser() {
    loading.value = true;
    const response = await request.update(userForm);
    handleEditResponse(response);
    loading.value = false;
}
function handleEditResponse(response) {
    if (response.data.code === 200) {
        proxy.$msg.success(t('homeHeader.success'));
        user.update(response.data.data);
        editDialog.value = false
    }
}
const handleClose = () => {
    ElMessageBox.confirm(t('homeHeader.confirmClose'))
        .then(() => {
            editDialog.value = false
        })
        .catch((e) => {
            console.log(e);
        });
};
async function sign() {
    loading.value = true;
    if (user.attendStatus == '1') {
        const response = await request.signIn();
        handleSignResponse(response, 2);
    } else if ((user.attendStatus == '2')) {
        const response = await request.signOut();
        handleSignResponse(response, 3);
    } else if ((user.attendStatus == '3')) {
        proxy.$msg.warn(t('homeHeader.clockOutMessage'));
    } else {
        proxy.$msg.error(t('homeHeader.unknowError'));
    }
    loading.value = false;
}

function handleSignResponse(response, status) {
    if (response.data.code === 200) {
        proxy.$msg.success(t('homeHeader.success'));
        user.updateAttendStatus(status);
    }
}
function openEditDialog() {
    userForm.email = user.email;
    editDialog.value = true;
}
function formatCreateTime(val) {
    if (typeof val === 'string' && val.includes('T')) {
        return val.split('T')[0];
    } else {
        return val;
    }
}
function notificationStyle(data) {
    if(data.row.status === false){
        return {
            cursor: 'pointer',
            userSelect: "none",
            backgroundColor: "#e3eef3"
          };
    }else{
        return {
            cursor: 'pointer',
            userSelect: "none"
          };
    }
}
function checkNotificationSize(){
    let count = 0;
    notification.value.forEach((element) => {
        if(element.status == false) count++;
    });
    return count;
    
}
function notificationJump(row){
    if(row.status === false){
        row.status = true;
        request.notificationStatus({"id" : row.id});
    }
    var routerPath = row.router;
    if(routerPath){
        proxy.$router.push({name: routerPath});
    }
}
function getNavigationRoute(name){
    if(name.startsWith(':')){
        return null;
    }else{
        return {path : name};
    }
}
function formatNotificationInfo(info){
    const arr1 = info.split('++');
    if(!arr1[1]) return t(arr1[0]);
    return t(arr1[0], arr1[1].split(','));
}
</script>

<style scoped>
.centerFrame {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

#logoFrame {
    margin: 10px 0 10px 0;
}

.homeBtn {
    text-decoration: blink;
    color: white;
}

#logo {
    margin-left: 20px;
    width: 90px;
}

.el-menu {
    border-right: none;
}

.is-opened,
.el-menu-item {
    background-color: #12354b;
}

.el-menu-item:hover {
    background-color: #0f2b3d !important;
}

.el-header,
.el-main {
    padding: 0;
}

#container {
    height: 100%;
    background-color: #16415c;
}

#headerHeight {
    height: 117.75px;
}

.btnFrame {
    margin: 10px;
    height: 30px;
    width: 30px;
    font-size: 30px;
    transition: all 0.15s ease;
}

.btnFrame:hover {
    box-shadow: 1px 1px rgb(53, 53, 53);
}

.fullWidth {
    width: 100%
}

.margin-top {
    margin-top: 5px;
}

.notificationTitle{
    color: var(--el-text-color-primary);
    font-weight: 700;
    padding: 12px;
}

.descriptionInfo {
  max-width: 230px; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.font12{
    font-size: 12px;
}

.font14{
    font-size: 14px;
}
#titleFrame{
    position: fixed;
    margin-left: 300px;
    width: 100%;
    z-index: 99;
    background-color: #cccccc;
    border-bottom: 2px solid #c0c0c0;
    top: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
}
#titleRight{
    display: flex; 
    justify-content: flex-end;
    align-items: center;
    margin-right: 300px;
}
.marginR{
    margin-right: 10px;
}
#titleLeft{
    display: flex; 
    align-items: center;
    padding-left: 20px;
}
#navigation{
    padding-left: 5px;
}
.naviA{
    color: black;
    text-decoration: none;
    transition: all 0.5s ease;
    padding: 5px;
}
.naviA:hover{
    color: rgb(80, 80, 80);
    box-shadow: 1px 2px 2px 1px rgb(53, 53, 53);
}
</style>