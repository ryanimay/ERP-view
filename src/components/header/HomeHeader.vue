<template>
    <el-aside id="homeHeaderContainer" v-loading.fullscreen.lock="loading"
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
            <el-footer>
                <el-row>
                    <el-col :span="8">
                        <el-popover placement="top-start" :width="200" trigger="click"
                            popper-style="border: 2px solid #606266; padding: 0;">
                            <template #reference>
                                <el-badge :value="notification.size" :max="10" :show-zero="false">
                                    <el-button type="info" icon="Bell" circle class="btnFrame" />
                                </el-badge>
                            </template>
                            <div class="notificationTitle font14">
                                {{ $t('homeHeader.notification') }}
                            </div>
                            <el-table :data="notification.data" style="width: 100%" :show-header="false"
                            :highlight-current-row="true" :row-style="notificationStyle" max-height="300"
                            @row-click="notificationJump">
                                <el-table-column>
                                    <template #default="scope">
                                        <el-row>
                                            <el-col>
                                                <div>{{ scope.row.info }}</div>
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
                    </el-col>
                    <el-col :span="8">
                        <el-popover placement="top-start" :width="260" trigger="click"
                            popper-style="border: 2px solid #12354b">
                            <template #reference>
                                <el-button type="primary" icon="Avatar" circle class="btnFrame" />
                            </template>
                            <el-descriptions :column="1">
                                <template #title>
                                    <span class="font14">{{$t('homeHeader.userInfo')}}</span>
                                </template>
                                <template #extra>
                                    <component :is="i18nSelector" />
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
                                            <span><el-tag :type="signType">{{ $t(signText) }}</el-tag></span>
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
                    </el-col>
                    <el-col :span="8">
                        <el-button :type="signType" icon="Checked" circle class="btnFrame" @click="sign" />
                    </el-col>
                </el-row>
            </el-footer>
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
    </el-aside>
</template>

<script setup>
import request from '@/config/api/request.js';
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue';
import icon from '@/assets/icon/icons8-logo.svg';
import userStore from '@/config/store/user';
import { ElMessageBox } from 'element-plus';
import i18nSelector from '@/components/tool/I18nSelector.vue';
import { useI18n } from 'vue-i18n';
import { websocketStore } from '@/config/store/websocket';

const { t } = useI18n();
const ws = websocketStore();
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
    id: user.id,
    email: user.email
})
const notification = reactive({
    size: 0,
    data: [
        { info: t('homeHeader.errorConnecting'), createTime: getNow()}
    ]
})
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
    ws.subscribe('/user/topic/notification', handleNotification);
    loading.value = false;
});

const handleNotification = (message) => {
    var data = JSON.parse(message).data;
    notification.data = data;
    checkNotificationSize();
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
function changeActive(routerName) {
    defaultActive.value = routerName;
}
async function logout() {
    const response = await user.logout();
    if (response && response.data.code == 200) {
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
    if (response.data.code != 200) {
        proxy.$msg.error(response.data.data);
    } else {
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
    if (response.data.code != 200) {
        proxy.$msg.error(response.data.data);
    } else {
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
function notificationStyle() {
    return {
        cursor: 'pointer',
        backgroundColor: "#ececec",
        userSelect: "none"
      };
}
function checkNotificationSize(){
    let count = 0;
    notification.data.forEach((element) => {
        if(element.status == false) count++;
    });
    notification.size = count;
}
function notificationJump(row){
    var routerPath = row.router;
    if(routerPath){
        proxy.$router.push({name: routerPath});
    }
}
function getNow(){
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}
</script>

<style scoped>
#homeHeaderContainer {
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

.homeBtn {
    text-decoration: blink;
    color: white;
}

#logo {
    width: 93.75px;
}

.el-menu {
    border-right: none;
}

.is-opened,
.el-menu-item {
    background-color: #12354b;
}

.el-menu-item:hover {
    background-color: #0f2b3d;
}

.el-header,
.el-main {
    padding: 0;
}

#container {
    height: 100%;
}

#headerHeight {
    height: 117.75px;
}

.btnFrame {
    height: 45px;
    width: 45px;
    font-size: 30px;
    transition: all 0.15s ease;
}

.btnFrame:hover {
    height: 48px;
    width: 48px;
    font-size: 32px;
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
    background-color: #73a6c5;
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
</style>