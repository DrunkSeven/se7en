<template>
  <section class="canvas-body" onkeydown="onkeydown($event)">
    <!-- <div>{{time}}</div> -->
    <div id="whiteboard">
      <!-- <iframe
        id="ppt"
        src="http://vip.ow365.cn/?i=34&n=5&furl=http%3A%2F%2Fofficeweb365.com%2Fviewfile%2F%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAHTML5%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91.pptx&p=1"
        width="1186px"
        height="691px"
        frameborder="0"
      ></iframe>-->
      <!-- <iframe
        id="ppt"
        frameborder="0"
        src="https://view.officeapps.live.com/op/embed.aspx?src=http%3A%2F%2Fvideo%2Ech9%2Ems%3A80%2Fbuild%2F2011%2Fslides%2FTOOL%2D532T%5FSutter%2Epptx&amp;wdAr=1.7777777777777777"
        width="962px"
        height="565px"
      ></iframe>-->
      <canvasDraw :drawObj="drawObj" ref="cv" />
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
          :transform="`matrix(${setMatrix()})`"
        />
        <ellipse
          ref="ellipse"
          v-if="drawObj.type=='ellipse'"
          :rx="Math.abs(drawObj.position.x-drawObj.position.x1)||0"
          :ry="Math.abs(drawObj.position.y-drawObj.position.y1)||0"
          :stroke="drawObj.color"
          :stroke-width="drawObj.lineWidth"
          :fill="drawObj.fillColor"
          :fill-opacity="drawObj.fill?1:0"
          :stroke-dasharray="drawObj.dashLine?`${drawObj.lineWidth*2}, ${drawObj.lineWidth}`:'0'"
          :transform="`matrix(${setMatrix()})`"
        />
        <rect
          :x="drawObj.position.angle?-Math.abs(drawObj.position.x1-drawObj.position.x) / 2:0"
          :y="drawObj.position.angle?-Math.abs(drawObj.position.y1-drawObj.position.y) / 2:0"
          v-if="drawObj.type=='rect'"
          :width="Math.abs(drawObj.position.x1-drawObj.position.x)||0"
          :height="Math.abs(drawObj.position.y1-drawObj.position.y)||0"
          :stroke="drawObj.color"
          :stroke-width="drawObj.lineWidth"
          :fill="drawObj.fillColor"
          :fill-opacity="drawObj.fill?1:0"
          :stroke-dasharray="drawObj.dashLine?`${drawObj.lineWidth*2}, ${drawObj.lineWidth}`:'0'"
          :transform="`matrix(${setMatrix()})`"
        />
      </svg>
      <img
        v-show="shwoDrag"
        draggable="true"
        @dragstart="dragstart($event,'move')"
        @drag="draging($event,'move')"
        @dragend="dragend($event,'move')"
        @touchstart="dragstart($event,'move')"
        @touchmove="draging($event,'move')"
        @touchend="dragend($event,'move')"
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
        @dragstart="dragstart($event,'rotate')"
        @drag="draging($event,'rotate')"
        @dragend="dragend($event,'rotate')"
        @touchstart="dragstart($event,'rotate')"
        @touchmove="draging($event,'rotate')"
        @touchend="dragend($event,'rotate')"
        id="drag"
        class="drag"
        width="20px"
        height="20px"
        :style="{'left':drawObj.position.x1-10+'px','top':drawObj.position.y1-10+'px'}"
        src="~assets/img/rotate.png"
      />
    </div>
    <drawUtil :drawObj="drawObj" @selectUtil="selectUtil" />
  </section>
</template>
<script>
import io from "socket.io-client";
import canvasDraw from "./../components/canvasDraw";
import svgDraw from "./../components/svgDraw";
import drawUtil from "./../components/drawUtil";
export default {
  components: {
    svgDraw,
    drawUtil,
    canvasDraw
  },
  layout: "empty",
  data() {
    return {
      svg: {},
      ctrlBox: {},
      shwoDrag: false,
      isMobile: false,
      time: 0,
      socket: {},
      drag: {},
      isPlayback: false,
      ctxArrIndex: 0, //回放时记录ctxArr位置的指针
      pageArr: {}, //页面画布数组对象
      drawObj: {
        action: "",
        time: 0,
        fill: false,
        fillColor: "#000",
        pageIndex: 0,
        animationIndex: 0,
        type: "pen",
        polyLine: 3,
        color: "#FF0000",
        lineWidth: 3,
        dashLine: false,
        path: [],
        position: {
          x: 0,
          y: 0,
          x1: 0,
          y1: 0,
          angle: 0
        }
      }
    };
  },

  mounted() {
    this.socket = io("http://127.0.0.1:8080", { reconnection: false }); //创建socket连接
    let teacher = this.$route.query.teacher; //是否是老是端
    this.svg = this.$refs.svg; //获取到画布Dom
    let { top, left } = this.svg.getBoundingClientRect(); //获取画布离屏幕顶部和左边的距离
    this.isMobile = this.util.showMobileTheme();
    //pc端触发鼠标点击事件
    this.svg.onmousedown = e => {
      let x = e.offsetX;
      let y = e.offsetY;
      let x1 = x;
      let y1 = y;
      if (!"peneraser".includes(this.drawObj.type)) {
        this.$refs.cv.drawCanvas();
      }
      this.drawObj.position = {
        x: x || 0,
        y: y || 0,
        x1: x1 || 0,
        y1: y1 || 0,
        angle: 0
      };
      this.sendMsg("onmousedown");
      this.$refs.cv.onmousedown(x, y);
      this.shwoDrag = false;
      this.svg.onmousemove = e => {
        x1 = e.offsetX;
        y1 = e.offsetY;
        this.sendMsg("onmousemove");
        this.onmousemove(x, y, x1, y1, true);
      };
      document.onmouseup = e => {
        this.onmouseup(true);
        this.sendMsg("onmouseup");
        if (!"penerasercancel".includes(this.drawObj.type)) {
          if (Math.abs(x1 - x) || Math.abs(y1 - y)) {
            this.shwoDrag = true;
          }
        }
      };
    };
    this.socket.on("draw", diff => {
      //接收socket消息
      let action = diff.action;
      this.drawObj = diff;
      let { x, y, x1, y1 } = this.drawObj.position;
      if (action == "onmouseup") {
        this.onmouseup();
      } else if (action == "onmousemove") {
        this.onmousemove(x, y, x1, y1);
      } else if (action == "onmousedown") {
        this.$refs.cv.drawCanvas();
        this.$refs.cv.onmousedown(x, y);
      }
    });
  },
  methods: {
    changeUtil() {
      if (this.drawObj.type != "cancel") {
        this.$refs.cv.drawCanvas();
        this.drawObj.position = {};
      }
    },
    //发送socket消息
    sendMsg(action) {
      this.drawObj.action = action;
      console.log(this.drawObj);
      this.socket.emit("draw", this.drawObj);
    },
    selectUtil(type) {
      //设置绘图工具
      this.shwoDrag = false;
      let arr = this.pageArr[this.drawObj.pageIndex];
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
        this.$refs.cv.drawCanvas();
        this.drawObj.position = {};
        this.drawObj.type = type;
      }
    },

    setMatrix() {
      let {
        position: { x = 0, y = 0, x1 = 0, y1 = 0, angle = 0 },
        type
      } = this.drawObj;
      let cx = x,
        cy = y;
      if (type == "rect" && angle) {
        cx = x + Math.abs(x1 - x) / 2;
        cy = y + Math.abs(y1 - y) / 2;
      }
      let deg = Math.PI / 180;
      let cosNum = Math.cos(deg * angle);
      let sinNum = Math.sin(deg * angle);
      return `
          ${cosNum},
          ${sinNum},
          ${-sinNum},
          ${cosNum},
          ${cx},
          ${cy}
        `;
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
      if (mx == px && my > py) {
        //鼠标在y轴负方向上
        angle = 90;
      }
      if (mx < px && my == py) {
        //鼠标在x轴正方向上
        angle = 270;
      }
      if (mx < px && my == py) {
        //鼠标在x轴正方向上
        angle = 180;
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
      let p = "";
      if (x || y || x1 || y1) {
        let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        for (let i = 0; i < polyLine; i++) {
          let radian = ((2 * Math.PI) / polyLine) * i;
          let nx = r * Math.sin(radian);
          let ny = r * Math.cos(radian);
          p += nx + ",";
          p += ny + " ";
        }
      }
      return p;
    },
    dragstart(e, type) {
      e.stopPropagation();
    },
    draging(e, type) {
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
      this.sendMsg("draging");
    },
    dragend(e, type) {
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
      this.sendMsg("dragend");
    },
    onmousemove(x, y, x1, y1) {
      this.drawObj.position = {
        x: x || 0,
        y: y || 0,
        x1: x1 || 0,
        y1: y1 || 0,
        angle: this.drawObj.position.angle
      };
      if ("peneraser".includes(this.drawObj.type)) {
        this.$refs.cv.drawCanvas();
      }
    },
    onmouseup() {
      this.svg.onmousemove = null;
      document.onmouseup = null;
    }
  }
};
</script>
<style lang="less" scoped>
#canvas {
  max-width: 100%;
}
.svg {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  top: 0;
}

.drag {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  cursor: pointer;
}
.canvas-body {
  position: relative;
}

#whiteboard {
  border: 1px solid #000;
  width: 640px;
  height: 370px;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

#ppt {
  width: 100%;
  height: calc(100% + 48px);
}

#canvas {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

