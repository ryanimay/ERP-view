<template>
  <BasicBody>
    <div id="formContainer">
      <backbtn/>
      <!-- title -->
      <div id="title" class="marginside">
        <img style="width: 50%;" class="img" src="@/assets/icon/svg/resetPwd/PasswordReset.svg">
      </div>
      <!-- info -->
      <div class="marginside">
        <img style="margin-bottom: 2%;" class="img" src="@/assets/icon/svg/resetPwd/resetInfo.svg">
      </div>
      <!-- 提示字留白 -->
      <div id="placeholder">
        <p id="info">{{ info }}</p>
      </div>
      <!-- username -->
      <div class="marginside" style="height: 20%;">
        <img style="width: 20%; height: 70%;" class="img" src="@/assets/icon/svg/resetPwd/Username.svg">
        <input v-model="formData.username" class="inputArea" type="text" placeholder="Enter your username">
      </div>
      <!-- password -->
      <div class="marginside" style="height: 20%;">
        <img style="width: 10%; height: 70%;" class="img" src="@/assets/icon/svg/resetPwd/Email.svg">
        <input v-model="formData.email" class="inputArea" type="text" placeholder="Enter your email">
      </div>
      <!-- submit -->
      <div class="marginside" style="margin-top: 3%;" @click="doReset">
        <img id="submitiocn" class="img" src="@/assets/icon/svg/resetPwd/submit.svg">
      </div>
    </div>
  </BasicBody>
</template>

<script>
import config from '@/config/RouterPath';
import { ref, getCurrentInstance } from 'vue';
import backbtn from '@/components/body/BackBtn.vue'
export default {
  setup() {
    const { proxy } = getCurrentInstance();//獲取全局組件
    const formData = ref({
      username: '',
      email: ''
    });
    const info = ref('');
    const goBack = () => {
      proxy.$router.back();
    };
    const doReset = async() => {
      try {
        const response = await proxy.$axios.put(config.api.client.resetPassword, formData.value);
        proxy.$store.dispatch('setPromptMessage', response.data.data);
        proxy.$router.push({
          name: "messagePage"
        });
      } catch (error) {
        console.error('API request failed:', error);
        info.value = error.response.data.data
      }
    };
    return{
      formData,
      info,
      goBack,
      doReset,
    }
  },
  components:{
    backbtn
  }
}
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

.inputArea {
  padding: 0 3%;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  box-sizing: border-box;
}

.img {
  margin-right: auto;
  width: 100%;
  height: 100%;
}

#submitiocn {
  cursor: pointer;
}

#submitiocn:hover {
  content: url('@/assets/icon/svg/resetPwd/submit_hover.svg');
}

.marginside {
  margin: 0 6%;
  display: flex;
  flex-direction: column;
}

#title {
  margin-top: 1%;
  margin-bottom: 3%;
}

#formContainer {
  position: absolute;
  top: 25%;
  right: 35%;
  height: 45%;
  width: 25%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 10px 10px 10px rgba(73, 73, 73, 0.5);
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
  overflow: hidden;
}

#formContainer:hover {
  box-shadow: 10px 10px 10px rgba(19, 19, 19, 0.5);
}
</style>