<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-row style="width: 100%;">
            <el-col class="centerFrame">
                <h2>UpdatePassword</h2>
            </el-col>
        </el-row>
        <el-form :model="formData" label-position="left" label-width="auto" size="large" ref="formRef"
            :rules="formRules" status-icon>
            <el-form-item prop="oldPassword" label="Old Password:">
                <el-input v-model="formData.oldPassword" class="input-area" type="password" />
            </el-form-item>
            <el-form-item prop="password" label="New Password:">
                <el-input v-model="formData.password" class="input-area" type="password" />
            </el-form-item>
            <el-form-item prop="confirmPassword" label="Confirm:">
                <el-input v-model="formData.confirmPassword" class="input-area" type="password" />
            </el-form-item>
            <el-form-item>
                <el-row style="width: 100%;">
                    <el-col :span="4">
                        <el-button type="info" @click="lastPage" class="btn">Cancel</el-button>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="18">
                        <el-button type="primary" @click="resetPassword" class="btn">Submit</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import config from '@/api/RouterPath';
import { reactive, ref, getCurrentInstance } from 'vue';
const user = JSON.parse(localStorage.getItem('user'));
const loading = ref(false);
const formData = reactive({
    id: user.id,
    oldPassword: '',
    password: '',
    confirmPassword: '',
})
const { proxy } = getCurrentInstance();//獲取全局組件
const lastPage = () => {
    proxy.$router.push({ name: 'login' });
}

const resetPassword = async () => {
    if (await validate()) {
        try {
            loading.value = true;
            const response = await updatePasswordRequest();
            handleResponse(response);
        } catch (error) {
            proxy.$handleError(error);
        } finally {
            loading.value = false;
        }
    } else {
        return false;
    }
};
async function updatePasswordRequest() {
    return await proxy.$axios.put(config.api.client.updatePassword.path, formData);
}
function handleResponse(response) {
    if (response.data.code != 200) {
        proxy.$msg.error(response.data.data);
    } else {
        proxy.$msg.success(response.data.data);
        user.mustUpdatePassword = false;
        localStorage.setItem('user', JSON.stringify(user))
        proxy.$router.push({ name: 'home' });
    }
}
const formRef = ref(null);
const formRules = reactive({
    oldPassword: [{ validator: requiredRule, trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
    confirmPassword: [{ validator: confirmPwd, trigger: 'blur' }]
})
function validate() {
    return formRef.value.validate((valid) => {
        return valid;
    })
}
function requiredRule(rule, value, callback) {
    if (!value) {
        callback(new Error('Please input old password'));
    } else {
        callback();
    }

}
function validatePassword(rule, value, callback) {
    const lowerCaseRegex = /.*[a-z].*/;
    const upperCaseRegex = /.*[A-Z].*/;
    const numberRegex = /.*\d.*/;
    const specialCharRegex = /^[^\s!@#$%^&*()_+={}[\]:;<>,.?~\\/-]+$/;
    if (!value) {
        callback(new Error('Please input password'));
    } else {
        if (!lowerCaseRegex.test(value)) {
            proxy.$msg.error('Password must contain lowercase letters.');
        } else if (!upperCaseRegex.test(value)) {
            proxy.$msg.error('Password must contain uppercase letters.');
        } else if (!numberRegex.test(value)) {
            proxy.$msg.error('Password must contain a number.');
        } else if (!specialCharRegex.test(value)) {
            proxy.$msg.error('Password must not contain special characters.');
        } else if (value.length < 8 || value.length > 20) {
            proxy.$msg.error('Password length must be between 8 and 20 characters.');
        } else {
            callback();
        }
        callback(new Error('Invalid input'));
    }
}
function confirmPwd(rule, value, callback) {
    const password = formData.password;
    if (!value) {
        callback(new Error('Please input confirm'));
    } else if (value !== password) {
        callback(new Error('The passwords entered do not match'));
    } else {
        callback();
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
    height: 300px;
    margin-left: -203px;
    margin-top: -160px;
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
    margin-bottom: 20px;
}

.centerFrame {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>