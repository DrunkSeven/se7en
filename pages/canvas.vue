<template>
  <section class="canvas-body" onkeydown="onkeydown($event)">
    <div id="whiteboard">
      <iframe
        id="ppt"
        src="http://vip.ow365.cn/?i=34&n=5&furl=http%3A%2F%2Fofficeweb365.com%2Fviewfile%2F%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAHTML5%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91.pptx&p=1"
        width="1186px"
        height="691px"
        frameborder="0"
      ></iframe>
      <!-- <iframe id="ppt" frameborder="0"></iframe> -->
      <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
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
          <el-input-number
            size="mini"
            type="number"
            v-model="drawObj.polyLine"
            value="3"
            :max="9"
            :min="3"
          />
        </div>
        <el-button size="mini" @click="selectUtil('cut')">剪切</el-button>
        <el-button size="mini" @click="selectUtil('cancel')">撤销</el-button>
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
      </div>
    </div>
  </section>
</template>
<script>
import Draw from "./../plugins/draw";
import io from "socket.io-client";
export default {
  data() {
    return {
      utilType: [
        { type: "pen", name: "铅笔" },
        { type: "line", name: "线条" },
        { type: "circle", name: "圈圈" },
        { type: "rect", name: "矩形" },
        { type: "eraser", name: "橡皮" }
      ],
      color: ["#000000", "#FFFFFF", "#FF0000", "#0000FF", "#FFFF00", "#9AFF02"],
      socket: {},
      draw: {},
      ctxArr: [],
      pageArr: {}, //页面画布数组对象
      otherDrawObj: {}, //外界的操作对象
      canvas: {},
      ctx: {},
      drawObj: {
        fill: false,
        fillColor: "#000",
        pageIndex: 0,
        animationIndex: 0,
        type: "pen",
        polyLine: 3,
        color: "#000000",
        lineWidth: 3,
        dashLine: false
      }
    };
  },

  mounted() {
    // this.socket = io("https://127.0.0.1:7001");
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.draw = new Draw(this.ctx);
    let teacher = this.$route.query.teacher;
    console.dir(teacher);
    // if (!teacher) {
    //   ctrlBox.style.display = "none";
    // }
    this.draw.type = this.drawObj.type;
    // if (teacher) {

    this.canvas.onmousedown = e => {
      let x = e.offsetX;
      let y = e.offsetY;
      let path = [];
      this.onmousedown(x, y, true);
      this.canvas.onmousemove = e => {
        let x1 = e.offsetX;
        let y1 = e.offsetY;
        this.onmousemove(x, y, x1, y1, true);
        path.push({ x: x1, y: y1 });
      };
      document.onmouseup = e => {
        this.onmouseup(true);
        let drawInfo = Object.assign({ path: path }, this.drawObj);
        this.ctxArr.push(drawInfo);
        console.log(this.ctxArr);
      };
    };
    // }
    setTimeout(() => {
      this.canvas.width = whiteboard.offsetWidth;
      this.canvas.height = whiteboard.offsetHeight;
    }, 100);
    window.addEventListener(
      "message",
      event => {
        console.log(event);
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
            socket.emit("ppt", diff);
          } else if (
            this.otherDrawObj.pageIndex &&
            this.otherDrawObj.pageIndex != this.drawObj.pageIndex
          ) {
            syncPPTPage();
          } else if (
            this.otherDrawObj.animationIndex &&
            this.otherDrawObj.animationIndex != this.drawObj.animationIndex
          ) {
            syncPPTAction();
          }
        }
      },
      false
    );
    // this.socket.on("draw", function(diff) {
    //   console.log(diff);
    //   let {
    //     action,
    //     data: { x, y, x1, y1 },
    //     color,
    //     lineWidth,
    //     type
    //   } = diff;
    //   otherDrawObj.type = type || otherDrawObj.type;
    //   otherDrawObj.color = color || otherDrawObj.color;
    //   otherDrawObj.lineWidth = lineWidth || otherDrawObj.lineWidth;
    //   otherDrawObj.polyLine = diff.polyLine || otherDrawObj.polyLine;
    //   switch (action) {
    //     case "onmousedown":
    //       onmousedown(x, y);
    //       break;
    //     case "onmousemove":
    //       onmousemove(x, y, x1, y1);
    //       break;
    //     case "onmouseup":
    //       onmouseup();
    //       break;
    //   }
    // });
    // this.socket.on("ppt", function(diff) {
    //   otherDrawObj.pageIndex = diff.data[1];
    //   otherDrawObj.animationIndex = diff.data[2];
    //   syncPPTPage();
    // });
    // preAnim.addEventListener("click", () => {
    //     setPage('preAnim')
    // })
    // nextAnim.addEventListener("click", () => {
    //     setPage('nextAnim')
    // })
  },
  methods: {
    setPage(type) {
      let ppt = document.getElementById("ppt");
      console.log(type);
      if (Number.isInteger(type)) {
        ppt.contentWindow.postMessage("goPage," + type, "*");
      } else {
        ppt.contentWindow.postMessage(type, "*");
      }
    },
    selectUtil(type) {
      let arr = this.pageArr[this.drawObj.pageIndex];
      if (type == "cancel" && arr) {
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
        this.drawObj.type = type;
      }
    },
    selectColor(color) {
      this.drawObj.color = color;
    },
    onmousedown(x, y, sendMsg) {
      if (sendMsg) {
        Object.assign(this.draw, this.drawObj);
        let diff = {
          action: "onmousedown",
          type: this.drawObj.type,
          color: this.drawObj.color,
          lineWidth: this.drawObj.lineWidth,
          polyLine: this.drawObj.polyLine,
          data: {
            x: x,
            y: y
          }
        };
        // this.socket.emit("draw", diff);
      } else {
        this.draw.color = this.otherDrawObj.color;
        this.draw.lineWidth = this.otherDrawObj.lineWidth;
        this.draw.polyLine = this.otherDrawObj.polyLine;
        this.draw.type = this.otherDrawObj.type;
      }
      if (this.draw.type == "pen") {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
      }
    },
    onmousemove(x, y, x1, y1, sendMsg) {
      if (!this.pageArr[this.drawObj.pageIndex]) {
        this.pageArr[this.drawObj.pageIndex] = [];
      }
      let arr = this.pageArr[this.drawObj.pageIndex];
      console.log(arr);

      if (this.draw.type != "eraser") {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (arr.length != 0) {
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
      this.draw[this.draw.type](x, y, x1, y1);
      if (sendMsg) {
        let diff = {
          action: "onmousemove",
          data: {
            x: x,
            y: y,
            x1: x1,
            y1: y1
          }
        };
        // this.socket.emit("draw", diff);
      }
    },
    onmouseup(sendMsg) {
      let arr = this.pageArr[this.drawObj.pageIndex];
      this.canvas.onmousemove = null;
      document.onmouseup = null;
      this.ctx.save();
      arr.push(
        this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      );
      if (sendMsg) {
        let diff = {
          action: "onmouseup",
          data: {}
        };
        // this.socket.emit("draw", diff);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.canvas-body {
  position: relative;
}

.color-box,
.util-box {
  padding: 5px 10px;
  display: flex;
  align-items: center;
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

