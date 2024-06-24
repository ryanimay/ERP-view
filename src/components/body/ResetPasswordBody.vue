<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-row style="width: 100%;">
            <el-col>
                <h2>{{ $t('resetPasswordBody.title') }}</h2>
            </el-col>
        </el-row>
        <el-form :model="formData" label-position="left" label-width="auto" size="large" ref="formRef" @submit.prevent>
            <el-form-item prop="username" :label="$t('resetPasswordBody.username')" :rules="requiredRule">
                <el-input v-model="formData.username" class="input-area" @keyup.enter="resetPassword(formRef)" />
            </el-form-item>
            <el-form-item prop="email" :label="$t('resetPasswordBody.email')" :rules="emailRules">
                <el-input v-model="formData.email" class="input-area" @keyup.enter="resetPassword(formRef)" />
            </el-form-item>
            <el-form-item>
                <el-row style="width: 100%;">
                    <el-col :span="4">
                        <el-button type="info" @click="lastPage" class="btn">{{ $t('resetPasswordBody.cancel') }}</el-button>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="18">
                        <el-button type="primary" @click="resetPassword(formRef)" class="btn">{{ $t('resetPasswordBody.submit') }}</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import request from '@/config/api/request.js';
import { reactive, ref, getCurrentInstance, watch } from 'vue';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const loading = ref(false);
const formData = reactive({
    username: '',
    email: ''
})
const { proxy } = getCurrentInstance();//獲取全局組件
const lastPage = () => {
    proxy.$router.push({ name: 'login' });
}

const resetPassword = async () => {
    if (await validate()) {
        loading.value = true;
        const response = await request.resetPassword(formData);
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
        proxy.$msg.success(t('resetPasswordBody.resetPasswordSuccess'));
        proxy.$router.push({ name: 'login' });
    }
}
const formRef = ref(null);
const emailRules = [
    {
        required: true,
        message: t('resetPasswordBody.requiredEmail'),
        trigger: 'blur',
    },
    {
        type: 'email',
        message: t('resetPasswordBody.errorEmail'),
        trigger: 'blur',
    },
];
const requiredRule = [
    {
        required: true,
        message: t('resetPasswordBody.requiredUserName'),
        trigger: 'blur',
    }
];
watch(locale, () => {
    emailRules[0].message = t('resetPasswordBody.requiredEmail');
    emailRules[1].message = t('resetPasswordBody.errorEmail');
    requiredRule[0].message = t('resetPasswordBody.requiredUserName');
});
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
    height: 236px;
    margin-left: -203px;
    margin-top: -128px;
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

.el-form-item--large[data-v-55c09de2] {
    margin-bottom: 20px;
}
</style>