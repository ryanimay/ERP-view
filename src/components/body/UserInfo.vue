<template>
    <BasicBody>
        <VForm @submit="handleSubmit" class="bodyframe" v-if="isEdit">
            <div class="textblock" style="margin-top: 3%; justify-content: space-between;">
                <h1>EditUser</h1>
                <p>{{ info }}</p>
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
                <ErrorMessage name="password" />
                <div style="display: flex;">
                    <label for="password">
                        <p>Password: </p>
                    </label>
                    <div class="inputArea">
                        <VField v-model="formData.password" :type="showPassword ? 'text' : 'password'" name="password"
                            id="password"
                            rules="required|min:8|max:20|atLeastOneLowercase|atLeastOneUppercase|atLeastOneNumber|noSpecialChars"
                            placeholder="Enter your password" />
                        <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/visible.svg">
                        <img v-else class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/invisible.svg">
                    </div>
                </div>
            </div>

            <div class="textblock">
                <ErrorMessage name="confirmPassword" />
                <div style="display: flex;">
                    <label for="confirmPassword">
                        <p>ConfirmPassword:</p>
                    </label>
                    <div class="inputArea">
                        <VField :type="showPassword ? 'text' : 'password'" name="confirmPassword" id="confirmPassword"
                            rules="required|confirmed:@password" placeholder="Confirm your password" />
                        <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/visible.svg">
                        <img v-else class="showPasswordBtn" @click="showpassword"
                            src="@/assets/icon/svg/loginPage/invisible.svg">
                    </div>
                </div>
            </div>

            <div class="textblock">
                <ErrorMessage name="email" />
                <div style="display: flex;">
                    <label for="email">
                        <p>Email:</p>
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
</template>

<script setup>
import { ref } from 'vue';
const user = ref(JSON.parse(localStorage.getItem('user')));
const isEdit = ref(false);
const editbtn = () => {
    isEdit.value = !isEdit.value;
}
const formData = {
    password: user.value.password,
    email: user.value.email
};
const showPassword = ref(false);
const showpassword = () => {
    showPassword.value = !showPassword.value;
};
</script>

<style scoped>
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
    right:3%
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
    font-size: 24px;
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