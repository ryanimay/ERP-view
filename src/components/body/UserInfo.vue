<template>
    <BasicBody>
        <VForm @submit="handleSubmit" class="bodyframe" v-if="isEdit">
            <div class="textblock" style="margin-top: 3%; justify-content: space-between;">
                <h1>EditUser</h1>
                <p style="color: #c50000; font-size: 14px; margin-right: 50%;">{{ info }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="address-card" />
                <p>User ID: {{ user.id }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="file-signature" />
                <p>User Name: {{ user.username }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="key" />
                <p>Password:</p>
                <img src="@/assets/icon/svg/editPasswordBtn.svg" id="editPwdbtn" @click="isdialogVisible">
            </div>
            <div class="textblock canchange">
                <ErrorMessage name="email" />
                <div style="display: flex; align-items: center;">
                    <font-awesome-icon icon="envelope" />
                    <label for="email" style="margin-left: 4.5%;">
                        <p style="margin-left: 0;">Email:</p>
                    </label>
                    <VField v-model="formData.email" name="email" id="email" rules="required|email"
                        placeholder="Enter your email" />
                </div>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="building-user" />
                <p>Department ID: {{ user.roleId }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="calendar-days" />
                <p>Active: {{ user.active }}</p>
            </div>
            <div class="textblock" style="display: flex; flex: 1; margin-bottom: 3%;">
                <button type="submit" id="savebtn" style="flex: 1; margin-right: 1%;">
                    <img id="saveimg" style=" width: 100%;" src="@/assets/icon/svg/save.svg">
                </button>
                <div id="savebtn" style="flex: 1; margin-left: 1%; display: flex; align-items: center;">
                    <img id="cancelimg" style=" width: 100%;" src="@/assets/icon/svg/cancel.svg" @click="editbtn">
                </div>
            </div>
        </VForm>
        <div class="bodyframe" v-else>
            <div class="textblock" style="margin-top: 3%;">
                <h1>UserInfo</h1>
                <p style="color: #c50000; font-size: 14px; margin-left: 5%;">{{ info }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="address-card" />
                <p>User ID: {{ user.id }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="file-signature" />
                <p>User Name: {{ user.username }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="key" />
                <p>Password: ********************</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="envelope" />
                <p>Email: {{ user.email }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="building-user" />
                <p>Department ID: {{ user.roleId }}</p>
            </div>
            <div class="textblock">
                <font-awesome-icon icon="calendar-days" />
                <p>Active: {{ user.active }}</p>
            </div>
            <div class="textblock" style="justify-content: center; margin-bottom: 3%;">
                <img src="@/assets/icon/svg/editbtn.svg" id="editbtn" @click="editbtn">
            </div>
        </div>
    </BasicBody>
    <VLoading :active="isLoading"></VLoading>
    <VForm @submit="submitUpdatePassword">
        <el-dialog v-model="dialogVisible" width="500px" draggable>
            <template #header="{ titleId, titleClass }">
                <div class="my-header">
                    <h1 :id="titleId" :class="titleClass" style="margin-bottom: 0;"><b>Update Password</b></h1>
                    <p style="color: #c50000; font-size: 16px; margin-left: 3%;">{{ updatePasswordError }}</p>
                </div>
            </template>
            <span id="dialogbody">
                <div class="textblock canchange" style="margin: 2% 0; ">
                    <ErrorMessage name="oldpassword" />
                    <div style="display: flex; align-items: center; ">
                        <font-awesome-icon icon="key" />
                        <label for="oldpassword" style="margin-left: 2%;">
                            <p style="margin-left: 0;">Old Password: </p>
                        </label>
                        <div class="inputArea">
                            <VField v-model="passwordForm.oldPassword" :type="showPassword ? 'text' : 'password'"
                                name="oldpassword" id="oldpassword" rules="required" placeholder="Enter your password" />
                            <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                                src="@/assets/icon/svg/loginPage/visible.svg">
                            <img v-else class="showPasswordBtn" @click="showpassword"
                                src="@/assets/icon/svg/loginPage/invisible.svg">
                        </div>
                    </div>
                </div>

                <div class="textblock canchange" style="margin: 2% 0;">
                    <ErrorMessage name="password" />
                    <div style="display: flex; align-items: center;">
                        <font-awesome-icon icon="key" />
                        <label for="password" style="margin-left: 2%;">
                            <p style="margin-left: 0;">New Password: </p>
                        </label>
                        <div class="inputArea">
                            <VField v-model="passwordForm.password" :type="showPassword ? 'text' : 'password'" name="password"
                                id="password" :rules="'required|min:8|max:20|atLeastOneLowercase|atLeastOneUppercase|atLeastOneNumber|noSpecialChars'" placeholder="Enter your password" />
                            <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                                src="@/assets/icon/svg/loginPage/visible.svg">
                            <img v-else class="showPasswordBtn" @click="showpassword"
                                src="@/assets/icon/svg/loginPage/invisible.svg">
                        </div>
                    </div>
                </div>

                <div class="textblock canchange" style="margin: 2% 0;">
                    <ErrorMessage name="confirmPassword" />
                    <div style="display: flex; align-items: center;">
                        <font-awesome-icon icon="key" />
                        <label for="confirmPassword" style="margin-left: 2%;">
                            <p style="margin-left: 0;">Confirm Password:</p>
                        </label>
                        <div class="inputArea">
                            <VField v-model="passwordForm.confirmPassword" :type="showPassword ? 'text' : 'password'" name="confirmPassword" id="confirmPassword"
                                rules="required|confirmed:@password" placeholder="Confirm your password" />
                            <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                                src="@/assets/icon/svg/loginPage/visible.svg">
                            <img v-else class="showPasswordBtn" @click="showpassword"
                                src="@/assets/icon/svg/loginPage/invisible.svg">
                        </div>
                    </div>
                </div>
            </span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" native-type="submit">
                        Save
                    </el-button>
                    <el-button @click="isdialogVisible">Cancel</el-button>
                </span>
            </template>
        </el-dialog>
    </VForm>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';
import config from '@/config/RouterPath';
import crypto from '@/config/Crypto';
const dialogVisible = ref(false);
const { proxy } = getCurrentInstance();//獲取全局組件
const user = ref(JSON.parse(localStorage.getItem('user')));
const isEdit = ref(false);
const formData = ref({
    username: user.value.username,
    email: user.value.email
});
const passwordForm = ref({
    username: user.value.username,
    oldPassword: undefined,
    password: undefined,
    confirmPassword: undefined,
});
let info = ref(undefined);
let updatePasswordError = ref(undefined);
const editbtn = () => {
    isEdit.value = !isEdit.value;
    formData.value.email = user.value.email;
    info.value = undefined;
}
const showPassword = ref(false);
const showpassword = () => {
    showPassword.value = !showPassword.value;
};

const isLoading = ref(false);
const handleSubmit = async () => {
    try {
        isLoading.value = true;
        const response = await proxy.$axios.put(config.api.client.update.path, formData.value);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        user.value = response.data.data;
        isEdit.value = !isEdit.value;
        info.value = 'update success';
    } catch (error) {
        console.error('API request failed:', error);
        info.value = error.response.data.data;
    } finally {
        isLoading.value = false;
    }
}
const isdialogVisible = () => {
    dialogVisible.value = !dialogVisible.value;
    passwordForm.value.oldPassword = undefined;
    passwordForm.value.password = undefined;
    passwordForm.value.confirmPassword = undefined;
    updatePasswordError.value = undefined;
}
const submitUpdatePassword = async () => {
    try {
        isLoading.value = true;
        const response = await proxy.$axios.put(config.api.client.updatePassword.path, passwordForm.value);
        const encodePwd = crypto.encryptData(passwordForm.value.password);
        localStorage.setItem('rememberPassword', encodePwd);
        isdialogVisible();
        editbtn();
        info.value = response.data.data;
    } catch (error) {
        console.error('API request failed:', error);
        updatePasswordError.value = error.response.data.data;
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
.vld-overlay.is-active {
  z-index: 9999 !important;
}
#dialogbody{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.my-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
}
.dialog-footer button:first-child  {
    width: 58px;
    margin-right: 5px;
}
.dialog-footer button:last-child {
    width: 58px;
    margin-left: 5px;
}

#editPwdbtn {
    margin-left: 1%;
    cursor: pointer;
}

#editPwdbtn:hover {
    content: url('@/assets/icon/svg/editPasswordBtn_hover.svg');
}

input {
    width: 100%;
    padding: 0 3%;
    border-radius: 10px;
    margin-left: 1%;
}

.inputArea {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 100%;
    flex: 4;
}

.showPasswordBtn {
    display: flex;
    align-items: center;
    position: absolute;
    height: 50%;
    cursor: pointer;
    right: 3%
}

#savebtn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    max-width: 423px;
}

#saveimg:hover {
    content: url('@/assets/icon/svg/save_hover.svg');
}

#cancelimg:hover {
    content: url('@/assets/icon/svg/cancel_hover.svg');
}

#editbtn:hover {
    content: url('@/assets/icon/svg/editbtn_hover.svg');
    cursor: pointer;
}

.textblock {
    flex: 1;
    margin: 0 5%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 20px;
    font-weight: bold;
}

.textblock label {
    display: flex;
    align-items: center;
    justify-content: center;
}

.textblock label p {
    margin: 0;
    margin-left: 2%;
}

.textblock p {
    margin: 0;
    margin-left: 2%;
}

.canchange {
    flex-direction: column;
    align-items: start;
    justify-content: center;
}

.canchange span {
    color: #c50000;
    font-size: 14px;
    line-height: 15px;
}

.canchange input::placeholder {
    font-size: 16px;
}

.bodyframe {
    min-width: 450px;
    width: 100%;
    height: 92%;
    margin: 3% 25%;
    border: 1px solid rgb(211, 211, 211);
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 10px 10px 10px rgba(73, 73, 73, 0.5);
    transition: box-shadow 0.5s ease;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.bodyframe:hover {
    box-shadow: 10px 10px 10px rgba(19, 19, 19, 0.5);
    border: 1px solid rgb(202, 202, 202);
}
</style>