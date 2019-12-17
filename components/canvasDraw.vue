<template>
  <div>
    <canvas ref="canvas" class="canvas" :width="windowSize[0]" :height="windowSize[1]"></canvas>
  </div>
</template>
<script>
import Draw from "./../plugins/draw";
export default {
  props: ["drawObj", "windowSize"],
  data() {
    return {
      shwoDrag: false,
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
    //如果页面信息数组为空,创建一个页面
    this.pageArr[this.drawObj.pageIndex] = [];
    this.canvas.onmousedown = e => {
      let x = e.offsetX;
      let y = e.offsetY;
      let x1 = x;
      let y1 = y;
      if (!"peneraser".includes(this.drawObj.type)) {
        this.drawCanvas();
      }

      this.drawObj.position = {
        x: x || 0,
        y: y || 0,
        x1: x1 || 0,
        y1: y1 || 0,
        angle: 0
      };
      this.shwoDrag = false;
      this.onmousedown(x, y);

      // this.canvas.onmousemove = e => {
      //   x1 = e.offsetX;
      //   y1 = e.offsetY;
      //   // this.drawCanvas();
      //   this.drawObj.position = {
      //     x: x || 0,
      //     y: y || 0,
      //     x1: x1 || 0,
      //     y1: y1 || 0,
      //     angle: 0
      //   };
      //   this.drawCanvas();
      //   // this.onmousemove(x, y, x1, y1, true);
      // };
      // document.onmouseup = e => {
      //   this.onmouseup(true);
      //   this.canvas.onmousemove = null;
      //   document.onmouseup = null;
      //   arr.push(
      //     this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      //   );
      //   this.shwoDrag = true;
      // };
    };
  },
  methods: {
    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    changePage(index) {
      this.drawCanvas();
      this.pageArr[this.drawObj.pageIndex].push(
        this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      );
      if (!this.pageArr[index]) {
        this.pageArr[index] = [];
      }
      let arr = this.pageArr[index];
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
      this.drawObj.pageIndex = index;
    },
    drawCanvas() {
      let { x, y, x1, y1, angle } = this.drawObj.position;
      if (x || y || x1 || y1) {
        Object.assign(this.draw, this.drawObj);
        this.draw[this.draw.type](x, y, x1, y1, angle || 0);
      }
    },
    onmousemove(X, Y, X1, Y1) {},
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
      let arr = this.pageArr[this.drawObj.pageIndex];
      arr.push(
        this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      );
      console.log(this.pageArr);
    },
    dragstart(e, type) {
      e.stopPropagation();
    },
    draging(e, type) {
      e.stopPropagation();

      let { top, left } = this.$refs.canvas.getBoundingClientRect();
      let mx = this.isMobile ? e.targetTouches[0].pageX - left : e.pageX - left;
      let my = this.isMobile ? e.targetTouches[0].pageY - top : e.pageY - top;
      let { x, y, x1, y1 } = this.drawObj.position;
      let offsetX = mx - x;
      let offsetY = my - y;
      if (type == "move") {
        this.drawObj.position = {
          x: mx,
          x1: x1 + offsetX,
          y: my,
          y1: y1 + offsetY
        };
      } else if (type == "rotate") {
        if (this.drawObj.type == "line") {
          this.drawObj.position = {
            x: x,
            x1: mx,
            y: y,
            y1: my
          };
        } else {
          this.drawObj.position.angle = this.angle(x, y, mx, my);
        }
      }

      this.drawCanvas();
      // this.sendMsg("draging");
    },
    dragend(e, type) {
      e.stopPropagation();
      let { top, left } = this.$refs.canvas.getBoundingClientRect();
      let mx = this.isMobile ? e.targetTouches[0].pageX - left : e.pageX - left;
      let my = this.isMobile ? e.targetTouches[0].pageY - top : e.pageY - top;
      let { x, y, x1, y1 } = this.drawObj.position;
      let offsetX = mx - x;
      let offsetY = my - y;
      if (type == "move") {
        this.drawObj.position = {
          x: mx,
          x1: x1 + offsetX,
          y: my,
          y1: y1 + offsetY
        };
      } else if (type == "rotate") {
        if (this.drawObj.type == "line") {
          this.drawObj.position = {
            x: x,
            x1: mx,
            y: y,
            y1: my
          };
        } else {
          this.drawObj.position.angle = this.angle(x, y, mx, my);
        }
      }
      this.drawCanvas();
      this.onmouseup();
      // this.sendMsg("dragend");
    }
  }
};
</script>
<style lang="less" scoped>
.canvas {
  width: 100%;
  height: 100%;
}

.drag {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>
