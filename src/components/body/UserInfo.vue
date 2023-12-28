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
                <img src="@/assets/icon/svg/editPasswordBtn.svg" id="editPwdbtn" @click="editPwdbtn">
            </div>
            <!-- <div class="textblock canchange">
                <span v-if="!formData.oldpassword">Please enter your password</span>
                <div style="display: flex; align-items: center;">
                    <font-awesome-icon icon="key" />
                    <label for="oldpassword" style="margin-left: 4%;">
                        <p style="margin-left: 0;">Old Password: </p>
                    </label>
                    <div class="inputArea">
                        <VField v-model="formData.oldpassword" :type="showPassword ? 'text' : 'password'" name="oldpassword"
                            id="oldpassword" rules="required" placeholder="Enter your password" />
                        <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/visible.svg">
                        <img v-else class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/invisible.svg">
                    </div>
                </div>
            </div>

            <div class="textblock canchange">
                <ErrorMessage v-if="formData.password" name="password" />
                <span v-else>If no changes are made, leave it blank.</span>
                <div style="display: flex; align-items: center;">
                    <font-awesome-icon icon="key" />
                    <label for="password" style="margin-left: 4%;">
                        <p style="margin-left: 0;">New Password: </p>
                    </label>
                    <div class="inputArea">
                        <VField v-model="formData.password" :type="showPassword ? 'text' : 'password'" name="password"
                            id="password" :rules="passwordRules" placeholder="Enter your password" />
                        <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/visible.svg">
                        <img v-else class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/invisible.svg">
                    </div>
                </div>
            </div>

            <div class="textblock canchange">
                <ErrorMessage name="confirmPassword" />
                <div style="display: flex; align-items: center;">
                    <font-awesome-icon icon="key" />
                    <label for="confirmPassword" style="margin-left: 3%;">
                        <p style="margin-left: 0;">Confirm New Password:</p>
                    </label>
                    <div class="inputArea">
                        <VField :type="showPassword ? 'text' : 'password'" name="confirmPassword" id="confirmPassword"
                            rules="confirmed:@password" placeholder="Confirm your password" />
                        <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/visible.svg">
                        <img v-else class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/invisible.svg">
                    </div>
                </div>
            </div> -->

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
</template>

<script setup>
import { ref, watchEffect, getCurrentInstance } from 'vue';
import config from '@/config/RouterPath';
const { proxy } = getCurrentInstance();//獲取全局組件
const user = ref(JSON.parse(localStorage.getItem('user')));
const isEdit = ref(false);
const formData = ref({
    username: user.value.username,
    email: user.value.email
});
let info = ref(undefined);
const editbtn = () => {
    isEdit.value = !isEdit.value;
    formData.value.email = user.value.email;
}
// const showPassword = ref(false);
// const showpassword = () => {
//     showPassword.value = !showPassword.value;
// };
let passwordRules = ref(undefined);
//動態設置規則
watchEffect(() => {
    passwordRules.value = formData.value.password
        ? 'min:8|max:20|atLeastOneLowercase|atLeastOneUppercase|atLeastOneNumber|noSpecialChars'
        : undefined;
});

const isLoading = ref(false);
const handleSubmit = async () => {
    formData.value
    try {
        isLoading.value = true;
        const response = await proxy.$axios.put(config.api.client.update.path, formData.value);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        user.value = response.data.data;
        isEdit.value = !isEdit.value;
    } catch (error) {
        console.error('API request failed:', error);
        info.value = error.response.data.data;
    } finally {
        isLoading.value = false;
    }
}
</script>

<style scoped>
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