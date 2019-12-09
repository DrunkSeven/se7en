<template>
  <div>
    <!-- <div
      draggable="true"
      v-show="shwoDrag"
      @dragstart="dragStart($event,'move')"
      @drag="dragEvent($event,'move')"
      @dragend="dragEnd($event,'move')"
      @touchstart="dragStart($event,'move')"
      @touchmove="dragEvent($event,'move')"
      @touchend="dragEnd($event,'move')"
      class="ctrl-box"
      :style="{'width':ctrlBox.w,'height':ctrlBox.h,'left':ctrlBox.x,'top':ctrlBox.y,}"
    ></div>-->
    <svg
      class="svg"
      ref="svg"
      xmlns="http://www.w3.org/2000/svg"
      style="top:0"
      width="640"
      height="480"
    >
      <line
        v-if="drawObj.type=='line'"
        :x1="drawObj.position.x||0"
        :y1="drawObj.position.y||0"
        :x2="drawObj.position.x1||0"
        :y2="drawObj.position.y1||0"
        :stroke="drawObj.color"
        :stroke-width="drawObj.lineWidth"
        :fill="drawObj.fillColor"
        :fill-opacity="drawObj.fill?1:0"
        :stroke-dasharray="drawObj.dashLine?`${drawObj.lineWidth*2}, ${drawObj.lineWidth}`:'0'"
      />
      <polygon
        v-if="drawObj.type=='poly'"
        :points="setPoly()"
        :stroke="drawObj.color"
        :stroke-width="drawObj.lineWidth"
        :fill="drawObj.fillColor"
        :fill-opacity="drawObj.fill?1:0"
        :stroke-dasharray="drawObj.dashLine?`${drawObj.lineWidth*2}, ${drawObj.lineWidth}`:'0'"
        :transform="drawObj.position.angle?`rotate(${drawObj.position.angle},${drawObj.position.x},${drawObj.position.y})`:''"
      />
      <ellipse
        ref="ellipse"
        v-if="drawObj.type=='ellipse'"
        :cx="drawObj.position.x||0"
        :cy="drawObj.position.y||0"
        :rx="Math.abs(drawObj.position.x-drawObj.position.x1)||0"
        :ry="Math.abs(drawObj.position.y-drawObj.position.y1)||0"
        :stroke="drawObj.color"
        :stroke-width="drawObj.lineWidth"
        :fill="drawObj.fillColor"
        :fill-opacity="drawObj.fill?1:0"
        :stroke-dasharray="drawObj.dashLine?`${drawObj.lineWidth*2}, ${drawObj.lineWidth}`:'0'"
        :transform="drawObj.position.angle?`rotate(${drawObj.position.angle},${drawObj.position.x},${drawObj.position.y})`:''"
      />
      <rect
        v-if="drawObj.type=='rect'&&drawObj.position.x1-drawObj.position.x>0"
        :x="drawObj.position.x"
        :y="drawObj.position.y"
        :width="drawObj.position.x1-drawObj.position.x"
        :height="drawObj.position.y1-drawObj.position.y"
        :stroke="drawObj.color"
        :stroke-width="drawObj.lineWidth"
        :fill="drawObj.fillColor"
        :fill-opacity="drawObj.fill?1:0"
        :stroke-dasharray="drawObj.dashLine?`${drawObj.lineWidth*2}, ${drawObj.lineWidth}`:'0'"
        :transform="drawObj.position.angle?`rotate(${drawObj.position.angle},${drawObj.position.x},${drawObj.position.y})`:''"
      />
    </svg>
    <img
      v-show="shwoDrag"
      draggable="true"
      @dragstart="dragStart($event,'move')"
      @drag="dragEvent($event,'move')"
      @dragend="dragEnd($event,'move')"
      @touchstart="dragStart($event,'move')"
      @touchmove="dragEvent($event,'move')"
      @touchend="dragEnd($event,'move')"
      id="drag"
      class="drag"
      width="20px"
      height="20px"
      :style="{'left':drawObj.position.x-10+'px','top':drawObj.position.y-10+'px'}"
      src="~assets/img/drag.png"
    />
    <img
      v-show="shwoDrag"
      draggable="true"
      @dragstart="dragStart($event,'rotate')"
      @drag="dragEvent($event,'rotate')"
      @dragend="dragEnd($event,'rotate')"
      @touchstart="dragStart($event,'rotate')"
      @touchmove="dragEvent($event,'rotate')"
      @touchend="dragEnd($event,'rotate')"
      id="drag"
      class="drag"
      width="20px"
      height="20px"
      :style="{'left':drawObj.position.x1-10+'px','top':drawObj.position.y1-10+'px'}"
      src="~assets/img/rotate.png"
    />
  </div>
</template>
<script>
export default {
  props: ["drawObj"],
  data() {
    return {
      svg: {},
      shwoDrag: false,
      ctrlBox: {}
    };
  },
  mounted() {
    this.svg = this.$refs.svg; //获取到画布Dom
    let { top, left } = this.svg.getBoundingClientRect(); //获取画布离屏幕顶部和左边的距离
    this.isMobile = this.util.showMobileTheme();
    if (this.isMobile) {
      //移动端触发移动端事件
      this.canvas.ontouchstart = e => {
        let x = e.targetTouches[0].pageX - left; //移动端要减去屏幕左边和顶部的距离,获取到手指相对于画布的坐标位置
        let y = e.targetTouches[0].pageY - top;
        let x1 = 0;
        let y1 = 0;
        this.path = [];
        let time = this.time;
        this.onmousedown(x, y, true);
        this.canvas.ontouchmove = e => {
          x1 = e.targetTouches[0].pageX - left;
          y1 = e.targetTouches[0].pageY - top;
          this.onmousemove(x, y, x1, y1, true);
        };
        document.ontouchend = e => {
          this.onmouseup(true);
        };
      };
    } else {
      //pc端触发鼠标点击事件
      this.svg.onmousedown = e => {
        let x = e.offsetX;
        let y = e.offsetY;
        this.shwoDrag = false;
        this.$emit("onmousedown", { x, y, sendMsg: true });
        this.svg.onmousemove = e => {
          let x1 = e.offsetX;
          let y1 = e.offsetY;
          if (this.drawObj.type != "pen" && this.drawObj.type != "eraser") {
            this.onmousemove(x, y, x1, y1, true);
          } else {
            this.$emit("onmousemove", { x, y, x1, y1, sendMsg: true });
          }
        };
        document.onmouseup = e => {
          this.onmouseup(true);
          if (
            this.drawObj.type != "pen" &&
            this.drawObj.type != "eraser" &&
            this.drawObj.type != "cancel"
          ) {
            this.shwoDrag = true;
          } else {
            this.shwoDrag = false;
          }
          this.$emit("onmouseup");
        };
      };
    }
  },
  methods: {
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
        angle = 180 - angle;
      }

      if (mx == px && my > py) {
        //鼠标在y轴负方向上
        angle = 180;
      }

      if (mx > px && my == py) {
        //鼠标在x轴正方向上
        angle = 90;
      }

      if (mx < px && my > py) {
        //鼠标在第三象限
        angle = 180 + angle;
      }

      if (mx < px && my == py) {
        //鼠标在x轴负方向
        angle = 270;
      }

      if (mx < px && my < py) {
        //鼠标在第二象限
        angle = 360 - angle;
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
        let nx = r * Math.sin(radian) + x;
        let ny = r * -Math.cos(radian) + y;
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
      //鼠标或手指移动时的事件
      if (this.drawObj.type != "eraser") {
        this.drawObj.position = {
          x: x || 0,
          y: y || 0,
          x1: x1 || 0,
          y1: y1 || 0,
          angle: 0
        };
      }
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
.ctrl-box {
  position: absolute;
  border: 1px solid #ccc;
}
.drag {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>
