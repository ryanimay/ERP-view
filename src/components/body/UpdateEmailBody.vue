<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-row style="width: 100%;">
            <el-col>
                <h2>UpdateEmail</h2>
            </el-col>
        </el-row>
        <el-form :model="formData" label-position="left" label-width="auto" size="large" ref="formRef">
            <el-form-item prop="email" label="Email:" :rules="emailRules">
                <el-input v-model="formData.email" class="input-area" />
            </el-form-item>
            <el-form-item>
                <el-row id="btnFrame">
                    <el-col :span="4">
                        <el-button type="info" @click="lastPage" class="btn">Cancel</el-button>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="18">
                        <el-button type="primary" @click="doUpdate" class="btn">Submit</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import request from '@/config/api/request.js';
import { reactive, ref, getCurrentInstance } from 'vue';
const user = JSON.parse(localStorage.getItem('user'));
const loading = ref(false);
const formData = reactive({
    id: user.id,
    email: ''
})
const { proxy } = getCurrentInstance();//獲取全局組件

const lastPage = () => {
    proxy.$router.push({ name: 'login' });
}

const doUpdate = async () => {
    if (await validate()) {
        loading.value = true;
        const response = await request.update(formData);
        handleResponse(response);
        loading.value = false;
    } else {
        return false;
    }
};

function handleResponse(response) {
    if (response.data.code != 200) {
        proxy.$msg.error(response.data.data);
    } else {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        proxy.$msg.success('Update success');
        proxy.$router.push({ name: 'home' });
    }
}
const formRef = ref(null);
const emailRules = [
    {
        required: true,
        message: 'Please input email address',
        trigger: 'blur',
    },
    {
        type: 'email',
        message: 'Please input correct email address',
        trigger: 'blur',
    },
];
function validate() {
    return formRef.value.validate((valid) => {
        return valid;
    })
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
    height: 180px;
    margin-left: -203px;
    margin-top: -100px;
}

.btn {
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
    align-items: center;
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
    margin: 0;
}

#messageFrame {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

#btnFrame {
    width: 100%;
    margin-top: 10px;
}
</style>