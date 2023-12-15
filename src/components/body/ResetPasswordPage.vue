<template>
  <BasicBody>
    <div id="formContainer">
      <div>
        <img src="@/assets/icon/svg/resetPwd/back.svg">
      </div>
      <div>
        <img src="@/assets/icon/svg/resetPwd/PasswordReset.svg">
      </div>
      <div>
        <img src="@/assets/icon/svg/resetPwd/resetInfo.svg">
      </div>
      <div>
        <img src="@/assets/icon/svg/resetPwd/Username.svg">
      </div>
      <div>
        <img src="@/assets/icon/svg/resetPwd/Email.svg">
      </div>
      <div>
        <img src="@/assets/icon/svg/resetPwd/submit.svg">
      </div>
      <div>
        <img src="@/assets/icon/svg/resetPwd/submit_hover.svg">
      </div>
    </div>
  </BasicBody>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.back();
    }
  }
}
</script>

<style scoped>

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
}

#formContainer:hover {
  box-shadow: 10px 10px 10px rgba(19, 19, 19, 0.5);
}
</style>