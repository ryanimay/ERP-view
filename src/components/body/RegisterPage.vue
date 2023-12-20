<template>
  <BasicBody>
    <div id="formContainer">
      <div id="formframe">
      </div>
    </div>
  </BasicBody>
</template>

<script>
import { getCurrentInstance } from 'vue';
export default {
  setup() {
    const { proxy } = getCurrentInstance();//獲取全局組件
    const goBack = () => {
      proxy.$router.back();
    };
    return {
      goBack,
    }
  }
}
</script>

<style scoped>
#formframe {
  display: flex;
  flex-direction: column;
  margin: 8%;
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