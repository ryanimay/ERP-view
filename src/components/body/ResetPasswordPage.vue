<template>
  <BasicBody>
    <div id="formContainer">
      <div>
        <img src="">
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
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