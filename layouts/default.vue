<template>
  <div id="se7en">
    <header class="header" :style="{'margin-top':$store.state.showHeader?'':'-70px'}">
      <h1 class="head-title">{{title}}</h1>
      <div style="height:61px" v-show="topFixed"></div>
      <div class="content" :class="{'top-menu-fixed':topFixed}" ref="topMenu">
        <topMenu/>
        <div>
          <audio :src="audioLink"></audio>
        </div>
      </div>
    </header>
    <!-- <pullTab/> -->
    <div class="content center-box">
      <breadcrumb></breadcrumb>
      <nuxt/>
    </div>
    <!-- <canvas class="bg-canvas" id="bgCanvas"></canvas> -->
    <footer class="footer">
      <div class="content">
        <p>by 幻化成扇子 © 2018</p>
      </div>
    </footer>
  </div>
</template>
<script>
import util from "~/plugins/common";
import http from "~/plugins/axios";
import breadcrumb from "~/components/breadcrumb";
import topMenu from "~/components/topMenu";
import pullTab from "~/components/pullTab";

import Vue from "vue";
export default {
  components: {
    breadcrumb,
    topMenu,
    pullTab
  },
  // watchQuery: ["activeIndex"],
  data() {
    return {
      title: `${process.env.title}`,
      audioLink: "",
      topFixed: false,
      ctx: "",
      canvasWidth: 0,
      canvasHeight: 0,
      dot: []
      // breadcrumbList: this.$store.state.breadcrumbList
    };
  },
  created() {
    let path = this.$router.history.current.path;
    if (path.indexOf("essay") != -1) {
      this.activeIndex = "essay";
    }
    if (process.client) {
      window.addEventListener("scroll", this.scrollEvent);
      this.showConsole();
      let isWeixin = (function() {
        return (
          navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1
        );
      })();
      if (isWeixin) {
        http.post("/getSignature", { url: window.location.href }).then(res => {
          let data = res.data;
          wx.config({
            // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名
            jsApiList: [
              "onMenuShareTimeline",
              "updateAppMessageShareData",
              "updateTimelineShareData",
              "onMenuShareAppMessage"
            ] // 必填，需要使用的JS接口列表
          });
          wx.ready(() => {
            this.$store.commit("setShare", {
              title: "Se7en", // 分享标题
              desc: "一个小前端", // 分享描述
              imgUrl: "http://se7en.iego.net/header.jpg" // 分享图标
            });
            this.$store.state.wxReady = true;
          });
        });
      }
    }
  },
  watch:{
    $route:function(){
      this.$store.commit('showHeader',true);
    }
  },
  methods: {
    drawInit() {
      let canvas = document.getElementById("bgCanvas");
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;

      this.canvasWidth = canvas.width;
      this.canvasHeight = canvas.height;
      this.ctx = canvas.getContext("2d");
      for (let i = 0; i < 10; i++) {
        let x = Math.floor(Math.random() * this.canvasWidth);
        let y = Math.floor(Math.random() * this.canvasHeight);
        this.dot.push(this.drawArc(this.ctx, x, y));
        this.animate(this.dot[i]);
      }
      setInterval(() => {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        for (let i = 0; i < this.dot.length; i++) {
          let dot = this.dot[i];
          this.dot[i] = this.drawArc(
            dot.ctx,
            dot.x + dot.offset,
            dot.y + dot.offset
          );
        }
      }, 50);
    },
    drawArc(ctx, x, y) {
      let offset = Math.floor(Math.random() * 5);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = "green";
      ctx.fill();
      ctx.restore();
      return { ctx: ctx, offset: offset, x: x, y: y };
    },
    animate(ctx) {
      console.log(ctx);
    },
    scrollEvent() {
      var offsetTop = 85;
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      scrollTop > offsetTop ? (this.topFixed = true) : (this.topFixed = false);
    },
    showConsole() {
      const text = `
               .5qYr        Z27 ..
               SvQ  BBv:. Bv:  PYB
               B.                  B.
              LB.                  Br
             75                    .B:
             B     ————      ————   :B
            B.                       :B
            B                         g
           .E                         Q.
            B.    别看了，你学不会的    B
            rB                       BM
             XB                     BB
              iBRY:             .iPQ7
                iSgBBLdQP7ri.vgXP7:`;
      console.log("%c%s", "color:#409eff;font-size:18px", text);
    }
  }
};
</script>
<style lang="less">
@default-color: #409eff;
#se7en {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}
body {
  margin: 0;
  font-family: "Microsoft YaHei";
}
.header {
  background: @default-color;
  max-height: 160px;
  transition: all 0.5s;
  .head-title {
    text-align: center;
    color: #fff;
    cursor: default;
    transition: letter-spacing 1s;
    &:hover {
      letter-spacing: 2vw;
    }
  }
  .content {
    margin-bottom: 16px;
  }
}
.top-menu-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 11;
  .el-menu {
    background: #409eff;
    border-bottom: solid 1px #409eff;
    transition: background 0.5s;
    .el-menu-item {
      i {
        color: #fff;
      }
      &:hover {
        background: #409eff;
      }
    }
    .is-active {
      border-color: #fff !important;
    }
    .el-menu-item > a {
      color: #fff !important;
    }
    .sub-menu {
      color: #333;
    }
  }
}
.footer {
  background: #333;
  color: #fff;
  border-top: 3px solid @default-color;
  overflow: hidden;
  text-align: center;
  height: 56px;
}
.center-box {
  flex: 1;
  width: 100%;
  background: #fff;
  padding: 2vh 0;
  box-sizing: border-box;
}
.content {
  max-width: 1100px;
  margin: auto;
  padding-left: 2vw;
  padding-right: 2vw;
}
.bg-canvas {
  // width: 100vw;
  // height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 12;
}
a {
  text-decoration: none;
}
.link {
  display: block;
  color: #999;
}
</style>
