<template>
    <div id="body-container">
        <div class="centerFrame" id="messageFrame">
            <p v-if="message" id="message">{{ message }}</p>
            <p v-else></p>
        </div>
        <el-form v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)" :model="loginForm"
            label-width="auto" size="large">
            <el-form-item label="Username:">
                <el-input v-model="loginForm.username" class="input-area" />
            </el-form-item>
            <el-form-item label="Password:">
                <el-input v-model="loginForm.password" type="password" show-password class="input-area" />
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" label="RememberMe" />
            <el-form-item>
                <el-button type="primary" @click="onSubmit" id="btn">Login</el-button>
            </el-form-item>
            <div class="centerFrame">
                <el-link type="primary" :underline="false" id="forgetPassword">ForgetPassword</el-link>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue';
const loading = ref(false);
const loginForm = reactive({
    username: '',
    password: '',
    rememberMe: ''
})
const { proxy } = getCurrentInstance();//獲取全局組件
const message = proxy.$route.query.message;

const onSubmit = () => {
    console.log(loginForm.username);
    console.log(loginForm.password);
    console.log(loginForm.rememberMe);
    loading.value = true;
}
</script>

<style scoped>
#body-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px 30px 10px 30px;
    border-radius: 15px;
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
    font-weight: bolder;
}

#message{
    color: red;
    margin-top: 0px;
    margin-bottom: 10px;
}

#messageFrame{
    height: 28px;
}
</style>