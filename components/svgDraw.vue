<template>
  <div></div>
</template>
<script>
export default {
  data() {
    return {
      svg: {},
      ctrlBox: {},
      shwoDrag: false
    };
  },
  mounted() {
    this.svg = this.$refs.svg; //获取到画布Dom
    let { top, left } = this.svg.getBoundingClientRect(); //获取画布离屏幕顶部和左边的距离
    this.isMobile = this.util.showMobileTheme();
    //pc端触发鼠标点击事件
    // this.svg.onmousedown = e => {
    //   let x = e.offsetX;
    //   let y = e.offsetY;
    //   let x1 = x;
    //   let y1 = y;
    //   // this.drawObj.position = {
    //   //   x: x || 0,
    //   //   y: y || 0,
    //   //   x1: x1 || 0,
    //   //   y1: y1 || 0,
    //   //   angle: 0
    //   // };

    //   this.$emit("drawing", this.drawObj);
    //   this.shwoDrag = false;
    //   this.svg.onmousemove = e => {
    //     x1 = e.offsetX;
    //     y1 = e.offsetY;
    //     this.onmousemove(x, y, x1, y1, true);
    //     this.$emit("onmousemove", { x, y, x1, y1, sendMsg: true });
    //   };
    //   document.onmouseup = e => {
    //     this.onmouseup(true);
    //     if (
    //       this.drawObj.type != "pen" &&
    //       this.drawObj.type != "eraser" &&
    //       this.drawObj.type != "cancel"
    //     ) {
    //       if (Math.abs(x1 - x) || Math.abs(y1 - y)) {
    //         this.shwoDrag = true;
    //       }
    //     }
    //     this.$emit("onmouseup");
    //   };
    // };
  },
  methods: {
    setMatrix() {
      let {
        position: { x, y, x1, y1, angle = 0 },
        type
      } = this.drawObj;
      if (type == "rect" && angle) {
        x = x + Math.abs(x1 - x) / 2;
        y = y + Math.abs(y1 - y) / 2;
      }
      let deg = Math.PI / 180;
      let cosNum = Math.cos(deg * angle);
      let sinNum = Math.sin(deg * angle);
      return `
          ${cosNum},
          ${sinNum},
          ${-sinNum},
          ${cosNum},
          ${x},
          ${y}
        `;
    },
    setCtrlStyle() {
      let {
        position: { x, y, x1, y1 },
        type
      } = this.drawObj;
      let f = "rectline".includes(type);
      let width = f ? Math.abs(x - x1) + "px" : Math.abs(x - x1) * 2 + "px";
      let height = f ? Math.abs(y - y1) + "px" : Math.abs(y - y1) * 2 + "px";
      this.ctrlBox = {
        w: width,
        h: height,
        x: f ? x + "px" : x1 - Math.abs(x - x1) + "px",
        y: f ? y + "px" : y1 - Math.abs(y - y1) + "px"
      };
    },
    angle(px, py, mx, my) {
      var x = Math.abs(px - mx);
      var y = Math.abs(py - my);
      var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      var cos = y / z;
      var radina = Math.acos(cos); //用反三角函数求弧度
      var angle = Math.floor(180 / (Math.PI / radina)); //将弧度转换成角度

      if (mx > px && my > py) {
        //鼠标在第四象限
        angle = 90 - angle;
      }

      if (mx < px && my > py) {
        //鼠标在第三象限
        angle = 90 + angle;
      }

      if (mx < px && my < py) {
        //鼠标在第二象限
        angle = 270 - angle;
      }
      if (mx > px && my < py) {
        //鼠标在第一象限
        angle = 270 + angle;
      }
      return angle;
    },
    setPoly() {
      let {
        position: { x, y, x1, y1 },
        polyLine
      } = this.drawObj;
      let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
      let p = "";
      for (let i = 0; i < polyLine; i++) {
        let radian = ((2 * Math.PI) / polyLine) * i;
        let nx = r * Math.sin(radian);
        let ny = r * Math.cos(radian);
        p += parseInt(nx) + ",";
        p += parseInt(ny) + " ";
      }
      return p;
    },
    dragStart(e, type) {
      e.stopPropagation();
    },
    dragEvent(e, type) {
      e.stopPropagation();
      let { top, left } = this.svg.getBoundingClientRect();
      let mx = this.isMobile ? e.targetTouches[0].pageX - left : e.pageX - left;
      let my = this.isMobile ? e.targetTouches[0].pageY - top : e.pageY - top;
      let { x, y, x1, y1 } = this.drawObj.position;
      let offsetX = mx - x;
      let offsetY = my - y;
      if (type == "move") {
        this.onmousemove(mx, my, x1 + offsetX, y1 + offsetY);
      } else if (type == "rotate") {
        if (this.drawObj.type == "line") {
          this.onmousemove(x, y, mx, my);
        } else {
          this.drawObj.position.angle = this.angle(x, y, mx, my);
        }
      }
    },
    dragEnd(e, type) {
      e.stopPropagation();
      let { top, left } = this.svg.getBoundingClientRect();
      let mx = this.isMobile ? e.targetTouches[0].pageX - left : e.pageX - left;
      let my = this.isMobile ? e.targetTouches[0].pageY - top : e.pageY - top;
      let { x, y, x1, y1 } = this.drawObj.position;
      let offsetX = mx - x;
      let offsetY = my - y;
      if (type == "move") {
        this.onmousemove(mx, my, x1 + offsetX, y1 + offsetY);
      } else if (type == "rotate") {
        if (this.drawObj.type == "line") {
          this.onmousemove(x, y, mx, my);
        } else {
          this.drawObj.position.angle = this.angle(x, y, mx, my);
        }
      }
      this.onmouseup();
    },
    onmousemove(x, y, x1, y1) {
      this.drawObj.position = {
        x: x || 0,
        y: y || 0,
        x1: x1 || 0,
        y1: y1 || 0,
        angle: 0
      };
    },
    onmouseup() {
      this.svg.onmousemove = null;
      document.onmouseup = null;
      this.setCtrlStyle();
    }
  }
};
</script>
<style lang="less" scoped>
.svg {
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
