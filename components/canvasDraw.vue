<template>
  <div>
    <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
  </div>
</template>
<script>
import Draw from "./../plugins/draw";
export default {
  props: ["drawObj"],
  data() {
    return {
      ctx: {}, //绘图对象
      draw: {}, //绘图工具类
      canvas: {}, //画布
      putImageData: []
    };
  },
  mounted() {
    this.canvas = this.$refs.canvas; //获取到画布Dom
    this.ctx = this.canvas.getContext("2d"); //获取到画布对象
    let teacher = this.$route.query.teacher; //是否是老是端
    this.draw = new Draw(this.ctx); //创建绘画工具实例
    setTimeout(() => {
      //页面渲染完后设置画布的大小
      this.canvas.width = whiteboard.offsetWidth;
      this.canvas.height = whiteboard.offsetHeight;
    }, 100);
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
    onmousedown(x, y) {
      //sandMsg可以判断是否是用户自主操作
      Object.assign(this.draw, this.drawObj);
      if (this.draw.type == "pen") {
        //如果当前的工具时铅笔,绘制之前要调用特别的方法
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      }
    },
    onmousemove() {
      //鼠标或手指移动时的事件
      if ("peneraser".includes(this.draw.type)) this.drawCanvas();
    },
    onmouseup() {
      this.canvas.onmousemove = null;
      document.onmouseup = null;
      this.ctx.save();
    }
  }
};
</script>
