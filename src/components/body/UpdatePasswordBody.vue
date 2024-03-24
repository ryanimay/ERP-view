<template>
    <div id="body-container" v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.5)">
        <el-row style="width: 100%;">
            <el-col class="centerFrame">
                <h2>UpdatePassword</h2>
            </el-col>
        </el-row>
        <el-form :model="formData" label-position="left" label-width="auto" size="large">
            <el-form-item label="Old Password:">
                <el-input v-model="formData.oldPassword" class="input-area" type="password" show-password/>
            </el-form-item>
            <el-form-item label="New Password:">
                <el-input v-model="formData.password" class="input-area" type="password" show-password/>
            </el-form-item>
            <el-form-item label="Confirm New Password:">
                <el-input v-model="formData.confirmPassword" class="input-area" type="password" show-password/>
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
import config from '@/config/RouterPath';
import { reactive, ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
const user = JSON.parse(localStorage.getItem('user'));
const loading = ref(false);
const formData = reactive({
    id: user.id,
    oldPassword: '',
    password: '',
    confirmPassword: '',
})
const { proxy } = getCurrentInstance();//獲取全局組件
const router = useRouter();
const lastPage = () => {
    router.go(-1);
}

const resetPassword = async () => {
    if(formData.confirmPassword != formData.password){
            proxy.$msg.error('Passwords do not match');
    }else{
        try {
            loading.value = true;
            const response = await proxy.$axios.put(config.api.client.updatePassword.path, formData);
            if (response.data.code != 200) {
                proxy.$msg.error(response.data.data);
            } else {
                proxy.$msg.success(response.data.data);
                proxy.$router.push({ name: 'updateEmail' });
            }
        } catch (error) {
            proxy.$msg.error('Unknown Error');
            console.error('API request failed:', error);
        } finally {
            loading.value = false;
        }
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
    height: 270px;
    margin-left: -203px;
    margin-top: -145px;
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
</style>