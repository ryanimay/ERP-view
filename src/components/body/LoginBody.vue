<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <div class="centerFrame" id="messageFrame">
            <p v-if="message" id="message">{{ message }}</p>
            <p v-else></p>
        </div>
        <el-form :model="loginForm" label-position="left" label-width="auto" size="large">
            <el-form-item label="Username:">
                <el-input v-model="loginForm.username" class="input-area" />
            </el-form-item>
            <el-form-item label="Password:">
                <el-input v-model="loginForm.password" type="password" show-password class="input-area" />
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" label="RememberMe" />
            <el-form-item>
                <el-button type="primary" @click="doLogin" id="btn">Login</el-button>
            </el-form-item>
            <div class="centerFrame">
                <router-link :to="{ name: 'forgetPassword' }" id="forgetPassword">ForgetPassword</router-link>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import config from '@/config/RouterPath';
import { reactive, ref, getCurrentInstance } from 'vue';
const loading = ref(false);
const loginForm = reactive({
    username: '',
    password: '',
    rememberMe: ''
})
const { proxy } = getCurrentInstance();//獲取全局組件
const message = proxy.$route.query.message;
if (message) {
    proxy.$msg.warn(message);
    proxy.$router.replace({ query: { ...proxy.$route.query, message: null } });
}
const doLogin = async () => {
    try {
        loading.value = true;
        const response = await proxy.$axios.post(config.api.client.login.path, loginForm);
        if (response.data.code != 200) {
            proxy.$msg.error(response.data.data);
        } else {
            localStorage.setItem('user', JSON.stringify(response.data.data));
            console.log(response);
            //須重設密碼
            if(response.data.data.mustUpdatePassword){
                proxy.$router.push({ name: 'updatePassword' });
            }else{
                //檢查是否需要設置email
                if(response.data.data.email){
                    proxy.$router.push({ name: 'home' });
                }else{
                    proxy.$router.push({ name: 'updateEmail' });
                }
            }
        }
    } catch (error) {
        console.error('API request failed:', error);
    } finally {
        loading.value = false;
    }
};
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
    height: 236px;
    margin-left: -203px;
    margin-top: -128px;
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
}

#forgetPassword:hover {
    color: #79bbff;
}

#message {
    color: red;
    margin-top: 0px;
    margin-bottom: 10px;
}

#messageFrame {
    height: 28px;
}
</style>