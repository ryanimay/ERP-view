<template>
    <BasicBody>
        <div id="formContainer">
            <div id="frame">
                <div id="message">
                    <p style="margin: 0 0;">{{ message }}</p>
                </div>
                <router-link id="btn" :to="{ name: 'login' }">
                    <img id="img" src="@/assets/icon/svg/resetPwd/backToLogin.svg">
                </router-link>
            </div>
        </div>
    </BasicBody>
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue';
export default {
    setup(){
        const { proxy } = getCurrentInstance();//獲取全局組件
        const message = ref('Somethings Wrong, Please Re-Login');
        onMounted(() => {
            message.value = proxy.$store.state.promptMessage;
        });

        return{
            message,
        }
    }
};
</script>

<style scoped>
#btn {
    flex: 1;
    height: 50%;
}

#message {
    font-weight: bold;
    font-size: 100%;
    flex: 1;
    height: 30%;
    margin-top: 6%;
}

#img:hover {
    cursor: pointer;
    content: url('@/assets/icon/svg/resetPwd/backToLogin_hover.svg');
}

#message,
#btn,
#img {
    width: 100%;
}

#frame {
    margin: 3% 5%;
    height: 100%;
}

#formContainer {
    position: absolute;
    top: 33%;
    right: 35%;
    height: 20%;
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