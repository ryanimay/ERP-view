<template>
  <BasicBody>
    <div id="bodyframe">
      <div style="display: flex; margin: 1%; flex-direction: column; height: 97%;">
        <div style="flex: 1; margin-right: auto; margin-left: 2%;">
          <h1 style="font-size: 300%;">首頁</h1>
        </div>
        <div style="flex: 2; display: flex; align-items: stretch;">
            <div class="quickblock">
              <font-awesome-icon icon="people-group" class="icongroup"/>
            </div>
            <div class="quickblock">
              <font-awesome-icon icon="sack-dollar" class="icongroup"/>
            </div>
            <div class="quickblock">
              <font-awesome-icon icon="lightbulb" class="icongroup"/>
            </div>
            <div class="quickblock">
              <font-awesome-icon icon="car" class="icongroup"/>
            </div>
            <div class="quickblock">
              <font-awesome-icon icon="shield-halved" class="icongroup"/>
            </div>
            <div class="quickblock">
              <font-awesome-icon icon="wrench" class="icongroup"/>
            </div>
        </div>
        <div style="flex: 3;">

        </div>
        <div style="flex: 3;">

        </div>
      </div>
    </div>
  </BasicBody>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const user = ref(null);

    onMounted(() => {
      user.value = JSON.parse(localStorage.getItem('user'));
    });

    return {
      user,
    };
  },
};
</script>

<style scoped>
.icongroup{
  color: white; 
  font-size: 100px;
}
.quickblock{
  flex: 1;
  background-color: rgb(32, 34, 43);
  border-radius: 30px;
  margin: 1%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.quickblock:hover{
  background-color: rgb(51, 52, 58);
}
#bodyframe {
  width: 100%;
  height: 92%;
  margin: 3% 3%;
  border: 1px solid rgb(211, 211, 211);
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 10px 10px 10px rgba(73, 73, 73, 0.5);
  transition: box-shadow 0.5s ease;
  box-sizing: border-box;
}

#bodyframe:hover {
  box-shadow: 10px 10px 10px rgba(19, 19, 19, 0.5);
  border: 1px solid rgb(202, 202, 202);
}
</style>