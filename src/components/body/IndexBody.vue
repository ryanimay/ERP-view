<template>
    <el-form v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)" :model="loginForm"
        label-width="auto" id="body-container" size="large">
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
    </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue';
const loading = ref(false);
const loginForm = reactive({
    username: '',
    password: '',
    rememberMe: ''
})

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
    padding: 40px 30px 10px 30px;
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
</style>