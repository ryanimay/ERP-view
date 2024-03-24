<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-row style="width: 100%;">
            <el-col>
                <h2>ResetPassword</h2>
            </el-col>
        </el-row>
        <el-form :model="formData" label-position="left" label-width="auto" size="large">
            <el-form-item label="Username:">
                <el-input v-model="formData.username" class="input-area" />
            </el-form-item>
            <el-form-item label="Email:">
                <el-input v-model="formData.email" class="input-area" />
            </el-form-item>
            <el-form-item>
                <el-row style="width: 100%;">
                    <el-col :span="4">
                        <el-button type="info" @click="lastPage" id="btn">Cancel</el-button>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="18">
                        <el-button type="primary" @click="resetPassword" id="btn">Submit</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import config from '@/config/RouterPath';
import { reactive, ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
const loading = ref(false);
const formData = reactive({
    username: '',
    email: ''
})
const { proxy } = getCurrentInstance();//獲取全局組件
const router = useRouter();
const lastPage = () => {
    router.go(-1);
}

const resetPassword = async () => {
    try {
        loading.value = true;
        const response = await proxy.$axios.put(config.api.client.resetPassword.path, formData);
        if (response.data.code != 200) {
            proxy.$msg.error(response.data.data);
        } else {
            proxy.$msg.success('ResetPassword success');
            proxy.$router.push({ name: 'login' });
        }
    } catch (error) {
        proxy.$msg.error('Unknown Error');
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
</style>