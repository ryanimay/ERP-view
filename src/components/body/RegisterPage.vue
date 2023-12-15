<template>
  <BasicBody>
      <div id="formContainer">
          <div id="formframe">
              <div id="placeholder">
                  <p id="info">{{ info }}</p>
              </div>
              <form id='loginform' action="">
              </form>
          </div>
      </div>
  </BasicBody>
</template>

<script>
import config from '@/config/RouterConfig';
import axios from '@/config/Axios.js';

export default {
  data() {
      return {
          status: null,
          info: '',
          formData: {
              username: '',
              password: '',
          },
      };
  },
  methods: {
      forgetPassword() {
          console.log('forgetPassword!');
      },
      async doLogin() {
          try {
              const response = await axios.post(config.api.client.login, this.formData);
              this.$router.push({ name: 'home', params: { data: response } });

          } catch (error) {
              console.error('API request failed:', error);
              this.info = error.response.data.data
          }
      }
  }
}
</script>

<style scoped>
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

#placeholder {
  position: relative;
  width: 100%;
  height: 10%;
  text-align: center;
}

#registerlink:hover {
  content: url('@/assets/icon/svg/Register_hover.svg');
}

#LoginArea {
  cursor: pointer;
  align-items: center;
  justify-content: center;
  width: 100%;
}

#LoginArea * {
  margin: auto o;
  width: 100%;
  height: 100%;
}

#LoginArea:hover {
  content: url('@/assets/icon/svg/LoginBtn_hover.svg');
}

#RegisterArea {
  display: flex;
  margin: auto;
}

#clickable {
  cursor: pointer;
  color: gray;
  box-sizing: border-box;
  text-align: center;
}

#clickable:hover {
  color: rgb(59, 59, 59);
  text-decoration: underline;
  box-sizing: border-box;
}

.inputArea {
  padding: 0 5%;
  margin: 3% 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  box-sizing: border-box;
}

.inputText {
  width: 20%;
  box-sizing: border-box;
}

.inputdiv {
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

#welcomeText {
  width: 33%;
  box-sizing: border-box;
}

#SigninText {
  margin-top: 10%;
  width: 90%;
  box-sizing: border-box;

}

#formframe {
  display: flex;
  flex-direction: column;
  margin: 8%;
  width: 100%;
  box-sizing: border-box;

}

#loginform {
  height: 100%;
  display: flex;
  flex-direction: column;
  margin: 3% 0;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
}

#formContainer {
  position: absolute;
  top: 10%;
  right: 28%;
  height: 77%;
  width: 33%;
  display: flex;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 10px 10px 10px rgba(73, 73, 73, 0.5);
  transition: box-shadow 0.3s ease;
  box-sizing: border-box;
}

#formContainer:hover {
  box-shadow: 10px 10px 10px rgba(19, 19, 19, 0.5);
}
</style>