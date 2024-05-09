<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="centerFrame">
            <h2 id="title">{{ $t('loginBody.login') }}</h2>
        </div>
        <el-form :model="loginForm" label-position="left" label-width="auto" size="large" @submit.prevent>
            <el-form-item :label="$t('loginBody.username')">
                <el-input v-model="loginForm.username" class="input-area" @keyup.enter="doLogin"/>
            </el-form-item>
            <el-form-item :label="$t('loginBody.password')">
                <el-input v-model="loginForm.password" type="password" show-password class="input-area" @keyup.enter="doLogin"/>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" :label="$t('loginBody.rememberMe')" />
            <el-form-item>
                <el-button type="primary" @click="doLogin" id="btn">{{ $t('loginBody.login') }}</el-button>
            </el-form-item>
            <div class="centerFrame">
                <router-link :to="{ name: 'forgetPassword' }" id="forgetPassword">{{ $t('loginBody.forgetPassword') }}</router-link>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import userStore from '@/config/store/user.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const rememberMeCheck = localStorage.getItem('rememberMe');
const { proxy } = getCurrentInstance();//獲取全局組件
const loading = ref(false);
const loginForm = reactive({
    username: rememberMeCheck ? rememberMeCheck : '',
    password: '',
    rememberMe: rememberMeCheck ? true : ''
})
const type = proxy.$route.query.type;
const message = proxy.$route.query.message;
if (message) {
    const msg = messageTypeSwitch(type);
    msg(message);
    proxy.$router.replace(proxy.$route.path);
}
const doLogin = async () => {
    loading.value = true;
    setRememberMe();
    const response = await userStore().login(loginForm);
    handleResponse(response);
    loading.value = false;
};
function setRememberMe() {
    if (loginForm.rememberMe === true) {
        localStorage.setItem('rememberMe', loginForm.username);
    } else {
        localStorage.removeItem('rememberMe');
    }
}

function handleResponse(response) {
    if(response !== undefined){
        if (response.data.code === 200) {
            proxy.$msg.success(t('loginBody.loginSuccess'));
            proxy.$router.push({ name: 'home' });
        } else {
            proxy.$msg.error(response.data.data);
        }
    }
}
function messageTypeSwitch(type){
    switch (type) {
        case 'success':
            return proxy.$msg.success;
        case 'danger':
            return proxy.$msg.error;
        default:
            return proxy.$msg.warn;
    }
}
</script>

<style scoped>
#body-container {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px 30px 10px 30px;
    border-radius: 15px;
    width: 346px;
    height: 274px;
    margin-left: -203px;
    margin-top: -142px;
}

#btn {
    width: 100%;
}

.input-area {
    width: 250px;
}

.el-form-item--large {
    font-weight: bolder;
    --font-size: 18px;
    margin-bottom: 10px;
}

.centerFrame {
    width: 100%;
    display: flex;
    justify-content: center;
}

#forgetPassword {
    width: 100px;
    text-decoration: underline;
    font-weight: bold;
    color: #409eff;
    display: inline-flex;
    justify-content: center;
}

#forgetPassword:hover {
    color: #79bbff;
}

#message {
    color: red;
    margin-top: 0px;
    margin-bottom: 10px;
}

#title {
    height: 28px;
}
</style>