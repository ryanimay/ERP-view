<template>
    <div id="formContainer">
        <div id="formframe">
            <img id="welcomeText" src="@/assets/icon/svg/Welcome.svg" />
            <img id="SigninText" src="@/assets/icon/svg/SigninText.svg" />
            <form id='loginform' action="">
                <div class="inputdiv" style="flex:2">
                    <img class="inputText" src="@/assets/icon/svg/UsernameText.svg" />
                    <input class="inputArea" type="text" placeholder="Enter your username">
                </div>
                <div class="inputdiv" style="flex:2">
                    <img class="inputText" src="@/assets/icon/svg/PasswordText.svg" />
                    <input class="inputArea" type="password" placeholder="Enter your password">
                </div>
                <div style="display: flex; width: 100%; flex:1;">
                    <input type="checkbox">
                    <img style="width: 33%;" src="@/assets/icon/svg/Rememberme.svg">
                    <p style="margin-left: auto;" class="clickable" @click="forgetPassword">Forget password ?</p>
                </div>
                <div id="LoginArea" style="flex:2" @click="doLogin">
                    <img src="@/assets/icon/svg/LoginBtn.svg">
                </div>
                <div id="RegisterArea" style="flex:1">
                    <img style="width: 66%; margin: auto 2%;" src="@/assets/icon/svg/Don’yhaveanAccount.svg">
                    <router-link id="registerlink" to="/">
                        <img style="width: 100%; height: 100%;" src="@/assets/icon/svg/Register.svg">
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        forgetPassword() {
            console.log('forgetPassword!');
        },
        doLogin() {
            console.log('login!');
        }
    }
}
</script>

<style scoped>
#registerlink{
}
#registerlink:hover{
    content: url('@/assets/icon/svg/Register_hover.svg');
}
#LoginArea{
    cursor: pointer;
    align-items: center; 
    justify-content: center;
    width: 100%;
}
#LoginArea *{
    margin: auto o;
    width: 100%;
    height: 100%;
}
#LoginArea:hover{
    content: url('@/assets/icon/svg/LoginBtn_hover.svg');
}
#RegisterArea{
    display: flex;
    margin: auto;
}
.clickable {
    cursor: pointer;
    color: gray;
    box-sizing: border-box;
    text-align: center;
}

.clickable:hover {
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
    margin: 10% 0;
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