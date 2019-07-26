<template>
  <div class="code-box">
    <div v-html="$store.state.code" @click="updateCode"></div>
    <input
      class="code-input"
      maxlength="4"
      type="text"
      v-bind:value="codeStr"
      v-on:input="$emit('getCodeStr', $event.target.value)"
      placeholder="请输入验证码"
    />
  </div>
</template>
<script>
import http from "~/plugins/axios";
export default {
  props: ["codeStr"],
  data() {
    return {};
  },
  methods: {
    updateCode() {
      this.$store.commit("getVerificationCode");
    }
  }
};
</script>
<style lang="less" scoped>
.code-box {
  display: flex;
  align-items: center;
  padding: 20px 0;
  max-width: 30vw;
  justify-content: center;
}
.code-input {
  height: 30px;
  padding-left: 10px;
  border: 1px solid #ccc;
}
@media screen and (max-width: 700px) {
  .code-box {
    max-width: 100%;
  }
  .code-input {
    width: 130px;
  }
}
</style>

