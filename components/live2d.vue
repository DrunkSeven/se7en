<template>
  <div class="live2d-box" v-show="show">
    <div class="message" v-show="showText" v-html="text"></div>
    <canvas @click="hide" id="live2d" class="canvas" width="500" height="500"></canvas>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: "",
      showText: true,
      clickNum: 0,
      show: true,
      timer: 0
    };
  },
  watch: {
    text(value) {
      if (!value) {
        return;
      }
      this.showText = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showText = false;
        this.text = "";
      }, 2000);
    },
    $route(value) {
      setTimeout(() => {
        let text = document.title.split("-")[1] || document.title.split("-")[0];

        this.text = "你现在在看的是<br/>" + text || text;
      }, 200);
    }
  },
  mounted() {
    loadlive2d("live2d", "/model/model.json");
    this.text = "你好鸭,欢迎";
  },
  methods: {
    hide() {
      this.clickNum++;
      if (this.clickNum == 2) {
        setTimeout(() => {
          this.show = false;
        }, 2000);
        this.text = "哼!再见!";
      } else {
        this.text = "再碰我就要消失啦";
      }

      setTimeout(() => {
        this.clickNum = 0;
      }, 2000);
    }
  }
};
</script>
<style lang="less" scoped>
.live2d-box {
  text-align: center;
}
#live2d {
  width: 150px;
}
.message {
  background: rgba(0, 0, 0, 0.5);
  padding: 3px 10px;
  border-radius: 100px;
  border: 1px solid #409eff;
  color: #fff;
  font-size: 12px;
}
</style>

