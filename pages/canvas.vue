<template>
  <section class="canvas-body" onkeydown="onkeydown($event)">
    <div id="whiteboard">
      <!-- <iframe id="ppt"
            src="http://vip.ow365.cn/?i=34&n=5&furl=http%3A%2F%2Fofficeweb365.com%2Fviewfile%2F%E6%B7%B1%E5%85%A5%E6%B5%85%E5%87%BAHTML5%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91.pptx&p=1"
      width="1186px" height="691px" frameborder="0"></iframe>-->
      <canvas ref="canvas" id="canvas" width="640" height="480"></canvas>
    </div>
    <div id="ctrl-box">
      <div class="util-box">
        <span class="label">工具:</span>
        <button
          v-for="item in utilType"
          :key="item.type"
          class="util"
          @click="selectUtil(item.type)"
        >{{item.name}}</button>

        <div class="poly-box">
          <button class="util" data-type="poly">正多边形</button>
          <input type="number" id="polyLine" value="3" max="9" min="3" maxlength="2" />
        </div>
        <button class="util" data-type="cut">剪切</button>
        <button class="util" data-type="cancel">撤销</button>
      </div>
      <div class="util-box">
        <span class="label">线条:</span>
        <button class="util" data-type="line">实线</button>
        <button class="util" data-type="dash">虚线</button>
        <span class="label">粗细:</span>
        <input id="lineWidth" type="range" min="1" max="20" value="1" />
        <span id="lineWidthValue">1</span>
        <div class="select-color-box">
          <span class="label">颜色:</span>
          <span ref="selectColor" class="color" style="background: #000"></span>
        </div>
        <span
          class="color"
          v-for="item in color"
          :key="item"
          :style="{'background':item}"
          @click="selectColor(item)"
        ></span>
      </div>
      <div class="control-box">
        <button id="prePage">上一张</button>
        <!-- <button id="preAnim">上一个动画</button>
            <button>重置</button>
        <button id="nextAnim">下一个动画</button>-->
        <button id="nextPage">下一张</button>
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
      pageArr: {},
      otherDrawObj: {},
      canvas: {},
      drawObj: {
        pageIndex: 0,
        animationIndex: 0,
        type: "pen",
        polyLine: 3,
        color: "#000000",
        lineWidth: 1
      }
    };
  },

  mounted() {
    // this.socket = io("https://127.0.0.1:7001");
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.draw = new Draw(this.ctx);
    // let arr: Array<ImageData> = [];
    let teacher = this.$route.query.teacher;
    console.dir(teacher);
    // if (!teacher) {
    //   ctrlBox.style.display = "none";
    // }
    this.draw.type = this.drawObj.type;
    // lineWidth.addEventListener("change", e => {
    //   const target = e.target;
    //   drawObj.lineWidth = parseInt(target.value);
    //   document.getElementById("lineWidthValue").innerText = target.value;
    // });
    // polyLineDom.addEventListener("change", e => {
    //   const target = e.target;
    //   let num = parseInt(target.value);
    //   drawObj.type = "poly";
    //   if (num > 2 && num < 10) {
    //     drawObj.polyLine = num;
    //   } else {
    //     target.value = drawObj.polyLine.toString();
    //   }
    // });
    // if (teacher) {

    this.canvas.onmousedown = e => {
      let x = e.offsetX;
      let y = e.offsetY;
      this.onmousedown(x, y, true);
      this.canvas.onmousemove = e => {
        let x1 = e.offsetX;
        let y1 = e.offsetY;
        this.onmousemove(x, y, x1, y1, true);
      };
      document.onmouseup = e => {
        this.onmouseup(true);
      };
    };
    // }
    setTimeout(() => {
      this.canvas.width = whiteboard.offsetWidth;
      this.canvas.height = whiteboard.offsetHeight;
    }, 100);

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
    prePage.addEventListener("click", () => {
      setPage("prePage");
    });
    nextPage.addEventListener("click", () => {
      setPage("nextPage");
    });
    // preAnim.addEventListener("click", () => {
    //     setPage('preAnim')
    // })
    // nextAnim.addEventListener("click", () => {
    //     setPage('nextAnim')
    // })
  },
  methods: {
    selectUtil(type) {
      let arr = this.pageArr[this.drawObj.pageIndex];
      this.drawObj.type = type;
      if (type == "cancel") {
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
      }
    },
    selectColor(color) {
      this.drawObj.color = color;
      this.$refs.selectColor.style.background = this.drawObj.color;
    },
    onmousedown(x, y, sendMsg) {
      if (sendMsg) {
        this.draw.color = this.drawObj.color;
        this.draw.lineWidth = this.drawObj.lineWidth;
        this.draw.polyLine = this.drawObj.polyLine;
        this.draw.type = this.drawObj.type;
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
.line-width-box,
.color-box,
.util-box {
  padding: 5px 10px;
  display: flex;
  align-items: center;
  /* justify-content: center; */
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

.util {
  background: #fff;
  min-width: 60px;
  height: 30px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ccc;
  margin-right: 2px;
}

.util:hover {
  border: 1px solid #409eff;
  color: #409eff;
  transform: scale(1.1);
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

