<template>
  <BasicBody>
    <div id="formContainer">
      <backBtn />
      <div id="formframe">
        <div id="title">
          <img src="@/assets/icon/svg/registration/title.svg">
        </div>
        <!-- 提示字留白 -->
        <div id="placeholder">
          <p id="info">{{ info }}</p>
        </div>
        <VForm @submit="handleSubmit" id="form">
          <div class="input">
            <div class="inputInfo">
              <label for="username">
                <p>Username</p>
              </label>
              <ErrorMessage name="username" />
            </div>
            <div class="inputArea">
              <VField v-model="formData.username" name="username" id="username" rules="required|min:6|max:20"
                placeholder="Enter your username" />
            </div>
          </div>

          <div class="input">
            <div class="inputInfo">
              <label for="password">
                <p>Password</p>
              </label>
              <ErrorMessage name="password" />
            </div>
            <div class="inputArea">
              <VField v-model="formData.password" :type="showPassword ? 'text' : 'password'" name="password" id="password"
                rules="required|min:8|max:20" placeholder="Enter your password" />
              <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                src="@/assets/icon/svg/loginPage/visible.svg">
              <img v-else class="showPasswordBtn" @click="showpassword" src="@/assets/icon/svg/loginPage/invisible.svg">
            </div>
          </div>

          <div class="input">
            <div class="inputInfo">
              <label for="confirmPassword">
                <p>ConfirmPassword</p>
              </label>
              <ErrorMessage name="confirmPassword" />
            </div>
            <div class="inputArea">
              <VField :type="showPassword ? 'text' : 'password'" name="confirmPassword" id="confirmPassword"
                rules="required|confirmed:@password" placeholder="Confirm your password" />
              <img v-if="showPassword" class="showPasswordBtn" @click="showpassword"
                src="@/assets/icon/svg/loginPage/visible.svg">
              <img v-else class="showPasswordBtn" @click="showpassword" src="@/assets/icon/svg/loginPage/invisible.svg">
            </div>
          </div>

          <div class="input">
            <div class="inputInfo">
              <label for="email">
                <p>Email</p>
              </label>
              <ErrorMessage name="email" />
            </div>
            <div class="inputArea">
              <VField v-model="formData.email" name="email" id="email" rules="required|email"
                placeholder="Enter your email" />
            </div>
          </div>

          <div class="input">
            <div class="inputInfo">
              <label for="department">
                <p>Department</p>
              </label>
              <ErrorMessage name="department" />
            </div>
            <div class="inputArea">
              <VField as="select" name="department" id="department" v-model="formData.roleId">
                <option value=undefined selected style="color: gray;">none</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.roleName }}</option>
              </VField>
            </div>
          </div>

          <div class="input"></div>

          <button class="input" type="submit" id="registerButton">
            <img id="registerimg" src="@/assets/icon/svg/registration/register.svg">
          </button>
        </VForm>
      </div>
    </div>
  </BasicBody>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import backBtn from '@/components/body/BackBtn.vue';
import config from '@/config/RouterPath';
const { proxy } = getCurrentInstance();//獲取全局組件

const showPassword = ref(false);
const roles = ref([]);
const formData = ref({
  username: '',
  email: '',
  password: '',
  roleId: undefined,
});
const info = ref('');

onMounted(async () => {
  try {
    const response = await proxy.$axios.get(config.api.role.list);
    roles.value = response.data.data;
  } catch (e) {
    console.error('loading roles error:' + e);
  }
});

const handleSubmit = async () => {
  try {
    const response = await proxy.$axios.post(config.api.client.register, formData.value);
    proxy.$store.dispatch('setPromptMessage', response.data.data);
    proxy.$router.push({
      name: "messagePage"
    });
  } catch (error) {
    console.error('API request failed:', error);
    info.value = error.response.data.data
  }
};

const showpassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
#placeholder {
  position: relative;
  width: 100%;
  height: 3%;
  text-align: center;
}

#info {
  margin: 0;
  color: red;
  font-size: 90%;
  font-weight: bold;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

label {
  display: flex;
  align-items: center;
  justify-content: center;
}

label * {
  margin: 0;
  font-size: 110%;
}

.input {
  flex: 1;
  display: flex;
  flex-direction: column;
}

input,
#department {
  height: 66%;
  width: 100%;
  padding: 0 5%;
  border-radius: 5px;
  margin-bottom: 1%;
}

.showPasswordBtn {
  display: flex;
  align-items: center;
  position: absolute;
  right: 10px;
  height: 33%;
  cursor: pointer;
  margin-bottom: 1%;
}

#registerimg {
  width: 100%;
}

#registerimg:hover {
  content: url('@/assets/icon/svg/registration/register_hover.svg');
}

#registerButton {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.inputInfo {
  display: flex;
  justify-content: space-between;
  flex: 1;
}

.inputInfo * {
  font-weight: bold;
}

.inputInfo span {
  color: #c50000;
}

.inputArea {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
  flex: 4;
}

#form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#title {
  margin-right: auto;
}

#formframe {
  display: flex;
  flex-direction: column;
  margin: 8%;
  margin-top: 0%;
  width: 84%;
  box-sizing: border-box;
  overflow: auto;
  height: 100%;
}

#formContainer {
  position: absolute;
  top: 10%;
  right: 28%;
  height: 77%;
  width: 33%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 10px 10px 10px rgba(73, 73, 73, 0.5);
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
  overflow: auto;
}

#formContainer:hover {
  box-shadow: 10px 10px 10px rgba(19, 19, 19, 0.5);
}
</style>