<template>
  <HeaderContainer>
    <template v-slot:slot1>
      <HeaderLogo/>
    </template>
    <template v-slot:slot2>
      <div id='headerbody'>
        <p>
          Web Introduction0
        </p>
        <p>
          Web Introduction00
        </p>
        <p>
          Web Introduction000
        </p>
        <p>
          Web Introduction0000
        </p>
        <p>
          Web Introduction00000
        </p>
      </div>
    </template>
  </HeaderContainer>
  <BasicBody>

  </BasicBody>
</template>
<script>
export default {
  components: {
  }
};
</script>

<style>
#headerbody{
  flex: 66%;
  margin: 0 10%;
  text-align: left;
  font-size: 20px;
}
</style>