<template>
  <section class="canvas-body" onkeydown="onkeydown($event)"></section>
</template>
<script>
import model from "~/assets/model/model.json";
export default {
  data() {
    return {
      model: model
    };
  },

  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
.canvas-body {
  text-align: center;
}
.canvas {
  border: 1px solid #000;
}
</style>

