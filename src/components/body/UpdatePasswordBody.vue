<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-row style="width: 100%;">
            <el-col class="centerFrame">
                <h2>{{ $t('updatePasswordBody.title') }}</h2>
            </el-col>
        </el-row>
        <el-form :model="formData" label-position="left" label-width="auto" size="large" ref="formRef"
            :rules="formRules" status-icon>
            <el-form-item prop="oldPassword" :label="$t('updatePasswordBody.oldPassword')">
                <el-input v-model="formData.oldPassword" class="input-area" type="password" />
            </el-form-item>
            <el-form-item prop="password" :label="$t('updatePasswordBody.password')">
                <el-input v-model="formData.password" class="input-area" type="password" />
            </el-form-item>
            <el-form-item prop="confirmPassword" :label="$t('updatePasswordBody.confirmPassword')">
                <el-input v-model="formData.confirmPassword" class="input-area" type="password" />
            </el-form-item>
            <el-form-item>
                <el-row style="width: 100%;">
                    <el-col :span="4">
                        <el-button type="info" @click="lastPage" class="btn">{{ $t('updatePasswordBody.cancel') }}</el-button>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="18">
                        <el-button type="primary" @click="resetPassword" class="btn">{{ $t('updatePasswordBody.submit') }}</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import request from '@/config/api/request.js';
import { reactive, ref, getCurrentInstance } from 'vue';
import userStore from '@/config/store/user';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const user = userStore();
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
        loading.value = true;
        const response = await request.updatePassword(formData);
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
        proxy.$msg.success(response.data.data);
        user.$patch({ mustUpdatePassword : false});
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
        callback(new Error(t('updatePasswordBody.validate.requiredOldPassword')));
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
        callback(new Error(t('updatePasswordBody.validate.requiredPassword')));
    } else {
        if (!lowerCaseRegex.test(value)) {
            proxy.$msg.error(t('updatePasswordBody.validate.lowercase'));
        } else if (!upperCaseRegex.test(value)) {
            proxy.$msg.error(t('updatePasswordBody.validate.uppercase'));
        } else if (!numberRegex.test(value)) {
            proxy.$msg.error(t('updatePasswordBody.validate.number'));
        } else if (!specialCharRegex.test(value)) {
            proxy.$msg.error(t('updatePasswordBody.validate.special'));
        } else if (value.length < 8 || value.length > 20) {
            proxy.$msg.error(t('updatePasswordBody.validate.between'));
        } else {
            callback();
        }
        callback(new Error(t('updatePasswordBody.validate.invalid')));
    }
}
function confirmPwd(rule, value, callback) {
    const password = formData.password;
    if (!value) {
        callback(new Error(t('updatePasswordBody.validate.requiredConfirmPassword')));
    } else if (value !== password) {
        callback(new Error(t('updatePasswordBody.validate.noMatch')));
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