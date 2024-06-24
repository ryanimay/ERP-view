<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-row style="width: 100%;">
            <el-col>
                <h2>{{ $t('updateEmailBody.title') }}</h2>
            </el-col>
        </el-row>
        <el-form :model="formData" label-position="left" label-width="auto" size="large" ref="formRef">
            <el-form-item prop="email" :label="$t('updateEmailBody.email')" :rules="emailRules">
                <el-input v-model="formData.email" class="input-area" @keyup.enter="doUpdate"/>
            </el-form-item>
            <el-form-item>
                <el-row id="btnFrame">
                    <el-col :span="4">
                        <el-button type="info" @click="homePage" class="btn">{{ $t('updateEmailBody.cancel') }}</el-button>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="18">
                        <el-button type="primary" @click="doUpdate" class="btn">{{ $t('updateEmailBody.submit') }}</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import request from '@/config/api/request.js';
import { reactive, ref, getCurrentInstance, watch } from 'vue';
import userStore from '@/config/store/user';
import { useI18n } from 'vue-i18n';
const { t, locale } = useI18n();
const user = userStore();
const loading = ref(false);
const formData = reactive({
    id: user.id,
    email: ''
})
const { proxy } = getCurrentInstance();//獲取全局組件

const homePage = () => {
    logout();
}

async function logout() {
    const response = await user.logout();
    if (response && response.data.code == 200) {
        proxy.$router.push({ name: 'login' });
    }
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
        user.update(response.data.data);
        proxy.$msg.success(t('updateEmailBody.updateSuccess'));
        proxy.$router.push({ name: 'home' });
    }
}
const formRef = ref(null);
const emailRules = [
    {
        required: true,
        message: t('updateEmailBody.requiredEmail'),
        trigger: 'blur',
    },
    {
        type: 'email',
        message: t('updateEmailBody.errorEmail'),
        trigger: 'blur',
    },
];
watch(locale, () => {
    emailRules[0].message = t('updateEmailBody.requiredEmail');
    emailRules[1].message = t('updateEmailBody.errorEmail');
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