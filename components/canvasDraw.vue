<template>
  <div>
    <canvas
      :style="{'transform': `scale(${scale})`}"
      ref="canvas"
      class="canvas"
      :width="1920"
      :height="1080"
    ></canvas>
  </div>
</template>
<script>
import Draw from "./../plugins/draw";
export default {
  props: ["drawObj", "windowSize", "scale"],
  data() {
    return {
      ctx: {}, //绘图对象
      draw: {}, //绘图工具类
      canvas: {}, //画布
      putImageData: [],
      pageArr: []
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas; //获取到画布Dom
    this.ctx = this.canvas.getContext("2d"); //获取到画布对象
    let teacher = this.$route.query.teacher; //是否是老是端
    this.draw = new Draw(this.ctx); //创建绘画工具实例
    this.canvas.onmousedown = e => {
      let x = e.offsetX;
      let y = e.offsetY;
      let x1 = x;
      let y1 = y;
      if (!"peneraser".includes(this.drawObj.type)) {
        this.drawCanvas();
      }
      if (!this.pageArr[this.drawObj.pageIndex]) {
        //如果页面信息数组为空,创建一个页面
        this.pageArr[this.drawObj.pageIndex] = [];
      }
      let arr = this.pageArr[this.drawObj.pageIndex];
      this.drawObj.position = {
        x: x || 0,
        y: y || 0,
        x1: x1 || 0,
        y1: y1 || 0,
        angle: 0
      };

      this.onmousedown(x, y);

      this.canvas.onmousemove = e => {
        x1 = e.offsetX;
        y1 = e.offsetY;
        // this.drawCanvas();

        console.log(arr);
        this.drawObj.position = {
          x: x || 0,
          y: y || 0,
          x1: x1 || 0,
          y1: y1 || 0,
          angle: 0
        };
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (arr.length > 0) {
          this.ctx.putImageData(
            arr[arr.length - 1],
            0,
            0,
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
        }
        this.drawCanvas();
        // this.onmousemove(x, y, x1, y1, true);
      };
      document.onmouseup = e => {
        this.onmouseup(true);
        this.canvas.onmousemove = null;
        document.onmouseup = null;
        arr.push(
          this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
        );
      };
    };
  },
  methods: {
    drawCanvas() {
      let { x, y, x1, y1, angle } = this.drawObj.position;
      if (x || y || x1 || y1) {
        Object.assign(this.draw, this.drawObj);
        this.draw[this.draw.type](x, y, x1, y1, angle || 0);
        this.shwoDrag = false;
      }
    },
    selectUtil(type) {
      //设置绘图工具
      let arr = this.putImageData;
      if (type == "cancel" && arr) {
        //如果用户点击了撤销,把画布信息数组中的最后一个数据删除,获取倒数第二个数据
        arr.pop();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (arr.length > 0) {
          this.ctx.putImageData(
            arr[arr.length - 1],
            0,
            0,
            0,
            0,
            this.canvas.width,
            this.canvas.height
          );
        }
      } else if (type != "cancel") {
        this.drawCanvas();
        this.drawObj.position = {};
        this.drawObj.type = type;
      }
    },
    selectColor(color) {
      //设置颜色
      this.drawObj.color = color;
    },
    drawCanvas() {
      let { x, y, x1, y1, angle } = this.drawObj.position;
      if (x || y || x1 || y1) {
        Object.assign(this.draw, this.drawObj);
        this.draw[this.draw.type](x, y, x1, y1, angle || 0);
      }
    },
    onmousemove() {},
    onmousedown(x, y) {
      //sandMsg可以判断是否是用户自主操作
      Object.assign(this.draw, this.drawObj);
      if (this.draw.type == "pen") {
        //如果当前的工具时铅笔,绘制之前要调用特别的方法
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      }
    },
    onmouseup() {
      this.ctx.save();
    }
  }
};
</script>
<style lang="less" scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
