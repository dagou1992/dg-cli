<template></template>

<script>
import { reactive, toRefs } from 'vue';
export default {
  name: test,
  setup() {
    const obj = reactive({});
    return {
      ...toRefs(obj),
    };
  },
};
</script>

<style lang="less" scoped></style>