<template>
  <div class="snake-page">
    <h1 class="title">贪吃蛇儿</h1>
    <p>
      <el-radio-group :disabled="start" size="mini" v-model="difficulty">
        <el-radio-button label="手残"></el-radio-button>
        <el-radio-button label="正常"></el-radio-button>
        <el-radio-button label="地狱"></el-radio-button>
      </el-radio-group>
      <el-button size="mini" type="primary" @click="startGame">{{start?`分数：${mark}`:'点我开吃'}}</el-button>
    </p>
    <div class="slider-box">
      <el-slider :disabled="start" :min="10" :max="20" height="200px" v-model="rw"></el-slider>
    </div>
    <canvas ref="myCanvas" :width="rw*30" :height="rw*20"></canvas>
    <div class="btn-box">
      <el-button round type="primary" @click="changeKey(38)" icon="el-icon-arrow-up"></el-button>
      <div>
        <el-button round type="primary" @click="changeKey(37)" icon="el-icon-arrow-left"></el-button>
        <el-button round type="primary" @click="changeKey(39)" icon="el-icon-arrow-right"></el-button>
      </div>
      <el-button round type="primary" @click="changeKey(40)" icon="el-icon-arrow-down"></el-button>
    </div>
  </div>
</template>
<script>
class snake {
  head;
}
export default {
  data() {
    return {
      cw: 0,
      ch: 0,
      rw: 20,
      ctx: "",
      snakeBody: [],
      direction: 39,
      head: {},
      food: {},
      rect: {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        c: ""
      },
      timer: 0,
      mark: 0,
      start: false,
      canvasSize: 10,
      difficulty: "正常",
      timeNum: 200
    };
  },
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "3");
    content.store.commit("changeBreadcrumb", []);
  },
  mounted() {
    let canvas = this.$refs.myCanvas;
    this.ctx = canvas.getContext("2d");
    canvas.width = this.rw * 30;
    canvas.height = this.rw * 20;
    this.cw = canvas.width;
    this.ch = canvas.height;
  },
  destroyed() {
    clearInterval(this.timer);
  },
  watch: {
    rw: function() {
      let canvas = this.$refs.myCanvas;
      canvas.width = this.rw * 30;
      canvas.height = this.rw * 20;
      this.cw = canvas.width;
      this.ch = canvas.height;
    }
  },
  methods: {
    startGame() {
      this.timeNum =
        this.difficulty == "手残" ? 200 : this.difficulty == "正常" ? 100 : 50;
      this.start = true;
      this.$store.commit("showHeader", false);
      this.snakeBody = [];
      this.direction = 39;
      this.mark = 0;
      clearInterval(this.timer);
      this.ctx.clearRect(0, 0, this.cw, this.ch);
      for (let i = 0; i < 4; i++) {
        let rect = {
          x: i * this.rw,
          y: 0,
          c: i == 3 ? "red" : "yellow"
        };
        if (i == 3) {
          this.head = JSON.parse(JSON.stringify(rect));
        }
        this.snakeBody.unshift(rect);
      }
      document.onkeydown = e => {
        this.changeKey(e.keyCode);
      };
      this.snakeBody.forEach(element => {
        this.drawRect(element);
      });
      this.setFood();
      this.snakeAnimate();
    },
    drawRect(rect) {
      this.ctx.beginPath();
      this.ctx.fillStyle = rect.c;
      this.ctx.rect(rect.x, rect.y, this.rw, this.rw);
      this.ctx.fill();
      this.ctx.stroke();
    },
    snakeAnimate() {
      this.timer = setInterval(() => {
        if (!this.gameOver()) {
          this.setSnakeBody();
        } else {
          clearInterval(this.timer);
          this.start = false;
          this.showText();
        }
      }, this.timeNum);
    },
    gameOver() {
      let flag = false;
      if (this.direction == 37 && this.head.x == 0) {
        flag = true;
      } else if (this.direction == 38 && this.head.y == 0) {
        flag = true;
      } else if (this.direction == 39 && this.head.x == this.cw - this.rw) {
        flag = true;
      } else if (this.direction == 40 && this.head.y == this.ch - this.rw) {
        flag = true;
      }
      this.snakeBody.forEach((element, index) => {
        if (index && element.x == this.head.x && element.y == this.head.y) {
          flag = true;
        }
      });
      return flag;
    },
    eatFoot() {
      if (this.head.x == this.food.x && this.head.y == this.food.y) {
        this.mark++;
        this.setFood();
        return true;
      }
      return false;
    },
    setFood() {
      this.food = {
        x:
          Math.round(Math.random() * Math.round(this.cw / this.rw - 1)) *
          this.rw,
        y:
          Math.round(Math.random() * Math.round(this.ch / this.rw - 1)) *
          this.rw,
        c: "#f00"
      };
      this.snakeBody.forEach(element => {
        if (element.x == this.food.x && element.y == this.food.y) {
          this.setFood();
        }
      });
    },
    changeKey(key) {
      if (
        (this.direction == 37 && key == 39) ||
        (this.direction == 39 && key == 37) ||
        (this.direction == 38 && key == 40) ||
        (this.direction == 40 && key == 38)
      ) {
        return;
      }
      this.direction = key;
    },
    showText() {
      let tip;
      if (this.mark == 0) {
        tip = "手废了吧，你才得了0分儿";
      } else if (this.mark < 10) {
        tip = `渣渣，你才得了${this.mark}分儿`;
      } else if (this.mark < 20) {
        tip = `你才得了${this.mark}分儿`;
      } else if (this.mark < 50) {
        tip = `得了${this.mark}分儿`;
      } else if (this.mark < 100) {
        tip = `有点厉害哟，得了${this.mark}分儿`;
      } else {
        tip = `大神，请收下我的膝盖`;
      }
      this.$message(tip);
      //   this.$alert(tip, "嘿嘿嘿", {
      //     confirmButtonText: "确定",
      //     showClose: false
      //   });
      //   this.$prompt("上榜啦，请输入你的id", tip, {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     inputPlaceholder: "1-10个字符",
      //     inputPattern: /^.{1,10}$/,
      //     inputErrorMessage: "按规则输入好嘛"
      //   })
      //     .then(({ value }) => {
      //       this.$message({
      //         type: "success",
      //         message: "你的id是: " + value
      //       });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "取消输入"
      //       });
      //     });
    },
    setSnakeBody() {
      switch (this.direction) {
        case 37:
          this.head.x -= this.rw;
          break;
        case 38:
          this.head.y -= this.rw;
          break;
        case 39:
          this.head.x += this.rw;
          break;
        case 40:
          this.head.y += this.rw;
      }
      let head = JSON.parse(JSON.stringify(this.head));
      this.snakeBody[0].c = "yellow";
      this.snakeBody.unshift(head);
      if (!this.eatFoot()) {
        this.snakeBody.pop();
      }
      this.ctx.clearRect(0, 0, this.cw, this.ch);
      this.snakeBody.forEach(element => {
        this.drawRect(element);
      });
      this.drawRect(this.food);
    }
  }
};
</script>
<style lang="less">
.snake-page {
  text-align: center;
  .title {
    margin-top: 0;
    margin-bottom: 10px;
  }
  canvas {
    border: 1px solid #000;
    max-width: 100%;
  }
  .slider-box {
    width: 300px;
    margin: auto;
  }
  .btn-box {
    margin-top: 20px;
    .el-button {
      width: 120px;
      height: 60px;
      margin: 0 20px;
    }
  }
}
</style>

