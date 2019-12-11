<template>
  <section class="canvas-body" onkeydown="onkeydown($event)">
    <div>{{time}}</div>
    <div id="whiteboard">
      <!-- <iframe
        id="ppt"
        src="http://vip.ow365.cn/?i=34&n=5&furl=http%3A%2F%2Fofficeweb365.com%2Fviewfile%2F%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAHTML5%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91.pptx&p=1"
        width="1186px"
        height="691px"
        frameborder="0"
      ></iframe>-->
      <iframe
        id="ppt"
        frameborder="0"
        src="https://view.officeapps.live.com/op/embed.aspx?src=http%3A%2F%2Fvideo%2Ech9%2Ems%3A80%2Fbuild%2F2011%2Fslides%2FTOOL%2D532T%5FSutter%2Epptx&amp;wdAr=1.7777777777777777"
        width="962px"
        height="565px"
      ></iframe>
      <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
      <svgDraw
        class="svg"
        ref="svg"
        :drawObj="drawObj"
        @onmouseup="onmouseup"
        @onmousemove="onmousemove"
        @onmousedown="onmousedown"
        @drawCanvas="drawCanvas"
        :socket="socket"
      />
    </div>
    <div id="ctrl-box">
      <div class="util-box">
        <span class="label">工具:</span>
        <el-button
          :type="item.type==drawObj.type?'primary':''"
          v-for="item in utilType"
          :key="item.type"
          @click="selectUtil(item.type)"
          size="mini"
        >{{item.name}}</el-button>

        <div class="poly-box">
          <el-button
            @click="selectUtil('poly')"
            size="mini"
            :type="drawObj.type=='poly'?'primary':''"
          >正多边形</el-button>
          <el-input-number size="mini" type="number" v-model="drawObj.polyLine" :max="9" :min="3" />
        </div>
        <!-- <el-button size="mini" @click="selectUtil('cut')">剪切</el-button>
        <el-button size="mini" @click="selectUtil('cancel')">撤销</el-button>-->
      </div>
      <div class="util-box">
        <span class="label">线条:</span>
        <el-switch
          v-model="drawObj.dashLine"
          active-color="#409EFF"
          inactive-color="#ff4949"
          active-text="虚线"
          inactive-text="实线"
        ></el-switch>
        <div class="line-width-box">
          <span class="label">粗细:</span>
          <el-slider class="line-width" v-model="drawObj.lineWidth" :max="20" :min="1"></el-slider>
        </div>
        <!-- <input type="range" min="1" max="20" value="1" /> -->
        <div class="select-color-box">
          <span class="label">颜色:</span>
          <span ref="selectColor" class="color" :style="{'background': drawObj.color}"></span>
        </div>
        <span
          class="color"
          v-for="item in color"
          :key="item"
          :style="{'background':item}"
          @click="drawObj.color=item"
        ></span>
      </div>
      <div class="util-box">
        <span class="label">填充:</span>
        <el-switch
          v-model="drawObj.fill"
          active-color="#409EFF"
          inactive-color="#ff4949"
          active-text="是"
          inactive-text="否"
        ></el-switch>
        <div class="select-color-box">
          <span class="label">颜色:</span>
          <span class="color" :style="{'background': drawObj.fillColor}"></span>
        </div>
        <span
          class="color"
          v-for="item in color"
          :key="item"
          :style="{'background':item}"
          @click="drawObj.fillColor=item,drawObj.fill=true"
        ></span>
      </div>
      <div class="control-box">
        <el-button @click="setPage('prePage')">上一张</el-button>
        <!-- <button id="preAnim">上一个动画</button>
        <button>重置</button>
        <button id="nextAnim">下一个动画</button>-->
        <el-button @click="setPage('nextPage')">下一张</el-button>
        <!-- <el-button @click="playback()">重绘</el-button> -->
      </div>
    </div>
  </section>
</template>
<script>
import Draw from "./../plugins/draw";
import io from "socket.io-client";
import svgDraw from "./../components/svgDraw";
export default {
  components: {
    svgDraw
  },
  layout: "empty",
  data() {
    return {
      isMobile: false,
      time: 0,
      utilType: [
        { type: "pen", name: "铅笔" },
        { type: "line", name: "线条" },
        { type: "ellipse", name: "圈圈" },
        { type: "rect", name: "矩形" },
        { type: "eraser", name: "橡皮" }
      ],
      color: ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#FFFF00", "#9AFF02"],
      socket: {},
      drag: {},
      isPlayback: false,
      ctxArrIndex: 0, //回放时记录ctxArr位置的指针
      draw: {}, //绘图工具类
      pageArr: {}, //页面画布数组对象
      otherDrawObj: {}, //外界的操作对象
      canvas: {}, //画布
      ctx: {}, //绘图对象
      drawing: false,
      drawObj: {
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
    this.drawTimer(); //设置计时器
    this.socket = io("http://127.0.0.1:8080", { reconnection: false }); //创建socket连接
    this.canvas = this.$refs.canvas; //获取到画布Dom
    this.ctx = this.canvas.getContext("2d"); //获取到画布对象
    let teacher = this.$route.query.teacher; //是否是老是端
    this.draw = new Draw(this.ctx); //创建绘画工具实例
    setTimeout(() => {
      //页面渲染完后设置画布的大小
      this.canvas.width = whiteboard.offsetWidth;
      this.canvas.height = whiteboard.offsetHeight;
    }, 100);
    window.addEventListener(
      //获取iframe发来的消息
      "message",
      event => {
        if (event.data && event.data[0] == "pptAction") {
          if (this.drawObj.pageIndex != event.data[1]) {
            this.drawObj.pageIndex = event.data[1];

            if (!this.pageArr[this.drawObj.pageIndex]) {
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            } else {
              let arr = this.pageArr[this.drawObj.pageIndex];
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
            }
          }
          this.drawObj.animationIndex = event.data[2] || 0;
          if (this.teacher) {
            let diff = {
              action: "changepage",
              data: event.data
            };
            socket.emit("ppt", diff); //将对ppt的操作通过socket广播出去
          } else if (
            this.otherDrawObj.pageIndex &&
            this.otherDrawObj.pageIndex != this.drawObj.pageIndex
          ) {
            syncPPTPage(); //同步ppt页面
          } else if (
            this.otherDrawObj.animationIndex &&
            this.otherDrawObj.animationIndex != this.drawObj.animationIndex
          ) {
            syncPPTAction(); //同步ppt动画     有点问题
          }
        }
      },
      false
    );
    this.socket.on("draw", diff => {
      //接收socket消息
      let action = diff.action;
      this.drawObj = diff;
      console.log(diff);

      switch (action) {
        case "onmousedown":
          this.socketOnmousedown(diff);
          break;
        case "onmousemove":
          this.socketOnmousemove(diff);
          break;
        case "onmouseup":
          this.socketOnmouseup(diff);
          break;
      }
    });
    this.socket.on("ppt", diff => {
      this.otherDrawObj.pageIndex = diff.data[1];
      this.otherDrawObj.animationIndex = diff.data[2];
      this.syncPPTPage();
    });
  },
  methods: {
    socketOnmousedown(diff) {
      let {
        type,
        position: { x, y, x1, y1 }
      } = diff;
      Object.assign(this.draw, this.drawObj);
      if (type == "pen") {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      } else {
        this.$refs.svg.onmousedown({ x, y });
      }
    },
    socketOnmousemove(diff) {
      let {
        type,
        position: { x, y, x1, y1 }
      } = diff;
      if (type == "pen") {
        this.onmousemove(position);
      } else {
        this.$refs.svg.onmousemove(x, y, x1, y1);
      }
    },
    socketOnmouseup(diff) {
      this.$refs.svg.onmouseup();
    },
    drawTimer() {
      //计时器
      setInterval(() => {
        this.time++;
        //= new Date().getTime();
        if (
          this.isPlayback &&
          this.time >= this.draw.ctxArr[this.ctxArrIndex].time &&
          !this.drawing
        ) {
          //如果正在回放时间大于或等于当时图形生成的时间,开始绘制图形,计时器继续跑
          this.reDraw(this.draw.ctxArr[this.ctxArrIndex++]);
        }
        if (!this.draw.ctxArr[this.ctxArrIndex]) {
          //如果没有下一个图形,结束回放
          this.isPlayback = false;
        }
      }, 1000);
    },
    *drawPath(path) {
      //生成器,生成鼠标或手指在画布上移动的路径
      for (let i = 0; i < path.length; i++) {
        let { x, y } = path[0];
        let x1 = path[i].x;
        let y1 = path[i].y;
        this.onmousemove({ x, y, x1, y1 });
        yield i;
      }
    },
    playback() {
      //点击回放按钮时触发
      this.pageArr = []; //清空之前保存的画布数据
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); //清除画布
      this.time = 0; //重置时间
      this.ctxArrIndex = 0; //重置图形数组的指针位置
      this.isPlayback = true; //回放开始
    },
    reDraw(obj) {
      //根据数据重新绘制图形

      this.otherDrawObj = obj;
      this.drawing = true;
      new Promise((resolve, reject) => {
        let { x, y } = obj.path[0];
        let drawPath = this.drawPath(obj.path);
        this.onmousedown(x, y, false);
        let timer = setInterval(() => {
          let d = drawPath.next();
          if (d.done) {
            clearInterval(timer);
            resolve(1);
          }
        }, 10);
      }).then(res => {
        this.onmouseup(false);
        this.drawing = false;
        if (
          this.isPlayback &&
          this.time >= this.draw.ctxArr[this.ctxArrIndex].time //如果回放没结束并且,当时图形生成的时间小于回放的时间,绘制下一个图形
        ) {
          this.reDraw(this.draw.ctxArr[this.ctxArrIndex++]);
        }
      });
    },
    syncPPTPage() {
      //同步ppt数据
      if (otherDrawObj.pageIndex > drawObj.pageIndex) {
        this.setPage("nextPage");
      } else if (otherDrawObj.pageIndex < drawObj.pageIndex) {
        this.setPage("prePage");
      } else {
        return;
      }
    },
    setPage(type) {
      //
      let ppt = document.getElementById("ppt");
      if (Number.isInteger(type)) {
        ppt.contentWindow.postMessage("goPage," + type, "*");
      } else {
        ppt.contentWindow.postMessage(type, "*");
      }
    },
    selectUtil(type) {
      //设置绘图工具
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
        this.shwoDrag = false;
      }
    },
    onmousedown({ x, y, sendMsg }) {
      //sandMsg可以判断是否是用户自主操作
      if (sendMsg) {
        Object.assign(this.draw, this.drawObj);
        let diff = {
          action: "onmousedown"
        };
        this.drawObj.time = this.time;
        Object.assign(diff, this.drawObj);
        this.socket.emit("draw", diff);
      } else {
        Object.assign(this.draw, this.otherDrawObj);
      }
      if (this.draw.type == "pen") {
        //如果当前的工具时铅笔,绘制之前要调用特别的方法
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      } else {
        this.drawCanvas();
      }
    },
    onmousemove({ x, y, x1, y1, sendMsg }) {
      //鼠标或手指移动时的事件
      if (!this.pageArr[this.drawObj.pageIndex]) {
        //如果页面信息数组为空,创建一个页面
        this.pageArr[this.drawObj.pageIndex] = [];
      }
      let arr = this.pageArr[this.drawObj.pageIndex];
      if ("peneraser".includes(this.draw.type))
        this.draw[this.draw.type](x, y, x1, y1);
      if (sendMsg) {
        let diff = {
          action: "onmousemove"
        };
        Object.assign(diff, this.drawObj);
        this.drawObj.path.push({ x: x1, y: y1 }); //保存用户绘制的路径
        diff.position = { x, y, x1, y1 };
        this.socket.emit("draw", diff);
      }
    },
    onmouseup(sendMsg) {
      this.shwoDrag = true;
      if (!this.pageArr[this.drawObj.pageIndex]) {
        //如果页面信息数组为空,创建一个页面
        this.pageArr[this.drawObj.pageIndex] = [];
      }
      let arr = this.pageArr[this.drawObj.pageIndex];
      this.canvas.onmousemove = null;
      document.onmouseup = null;
      this.ctx.save();
      arr.push(
        this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      );
      if (sendMsg) {
        let diff = {
          action: "onmouseup"
        };
        Object.assign(diff, this.drawObj);
        this.socket.emit("draw", diff);
      }
      this.draw.ctxArr.push(this.drawObj);
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
.canvas-body {
  position: relative;
}

.color-box,
.util-box {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* justify-content: center; */
}
.line-width-box {
  display: flex;
  align-items: center;
  margin: 0 20px;
}
.line-width {
  min-width: 100px;
}
#whiteboard {
  border: 1px solid #000;
  width: 640px;
  height: 370px;
  max-width: 100%;
  overflow: hidden;
  position: relative;
}

#ctrl-box {
  z-index: 1;
}

.select-color-box {
  display: flex;
  align-items: center;
  margin-right: 20px;
  justify-content: space-between;
}

.util-box {
  .color {
    display: inline-block;
    width: 30px;
    height: 30px;
    border: 1px solid #000;
    cursor: pointer;
    margin-right: 3px;
  }
}

.label {
  margin-right: 10px;
}

.poly-box {
  display: flex;
  align-items: center;
  margin-right: 2px;
}

.poly-box .util {
  margin-right: 0;
}

#polyLine {
  width: 30px;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.5);
  padding-left: 5px;
  height: 26px;
  border-left: none;
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

