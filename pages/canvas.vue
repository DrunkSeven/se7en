<template>
  <section class="canvas-body" onkeydown="onkeydown($event)">
    <el-form ref="form" label-width="80px">
      <el-form-item label="字符">
        <el-input v-model="text" placeholder="请输入要展示的字符"></el-input>
      </el-form-item>
    </el-form>
    <canvas class="canvas" ref="myCanvas" width="500" height="500"></canvas>
  </section>
</template>
<script>
export default {
  data() {
    return {
      text: ""
    };
  },

  async asyncData(content) {
    content.store.commit("changeActiveIndex", "3");
    content.store.commit("changeBreadcrumb", []);
  },
  watch: {
    text() {
      this.draw();
    }
  },
  mounted() {
    let num = 9;
    let interval = setInterval(() => {
      this.draw(num--);
      if (num == 0) {
        clearInterval(interval);
      }
    }, 1000);
  },
  methods: {
    onkeydown(e) {
      console.log(e.keyCode);
    },
    draw(text) {
      let context = this.$refs.myCanvas.getContext("2d");
      context.fillStyle = "#333333";
      let canvasEl = document.createElement("canvas");
      context.clearRect(0, 0, 500, 500);
      // let canvasEl = this.$refs.canvas2;
      canvasEl.width = 300;
      canvasEl.height = 300;
      let ctx = canvasEl.getContext("2d");
      const { width, height } = canvasEl;
      ctx.font = "bold 100px Arial";
      ctx.fillStyle = "#333333";
      ctx.fillText(text || this.text, width / 2 - 50, height / 2);
      const imgdata = ctx.getImageData(0, 0, width, height).data;
      const data = imgdata.length / 1200;
      for (let i = 0; i < width; i += 4) {
        for (let j = 0; j < height; j += 4) {
          if (imgdata[j * 1200 + i * 4] == 0) {
            context.beginPath();
            context.arc(i * 2 + 4, j * 2 + 4, 4, 0, 2 * Math.PI);
            context.stroke();
          }
        }
      }
    }
  }
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

