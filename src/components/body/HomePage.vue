<template>
  <BasicBody>
    <p>{{ user }}</p>
  </BasicBody>
</template>
<script>
export default {
  data() {
    return {
      user: null,
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'));
  },
};
</script>

<style></style>