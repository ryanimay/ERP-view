<template>
  <BasicBody>
    <p>{{ user }}</p>
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

<style></style>