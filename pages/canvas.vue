<template>
  <section class="canvas-body" onkeydown="onkeydown($event)">
    <canvas class="canvas" ref="canvas" />
  </section>
</template>
<script>
export default {
  data() {
    return {
      canvas: {},
      cantext:{}
    };
  },

  mounted() {
    this.canvas = this.$refs.canvas;
    0
  },
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

