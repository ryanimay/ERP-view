<template>
    <BasicBody>
        <div id="formContainer">
            <div id="message"><p>{{ message }}test</p></div>
            <div id="btn"><img src="@/assets/icon/svg/resetPwd/submit.svg"></div>
        </div>
    </BasicBody>
</template>

<script>
export default {
    data(){
        console.log(this.$route.params);
        return{
            message:this.$route.params,
        }
    }
};
</script>

<style>
#formContainer {
    position: absolute;
    top: 33%;
    right: 35%;
    height: 25%;
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