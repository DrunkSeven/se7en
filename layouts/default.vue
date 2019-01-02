<template>
  <div>
    <header class="header">
      <h1 class="head-title">{{title}}</h1>
      <div class="content" :class="{'top-menu-fixed':topFixed}" ref="topMenu">
        <topMenu></topMenu>
        <div>
          <audio :src="audioLink"></audio>
        </div>
      </div>
    </header>
    <div class="content center-box">
      <breadcrumb></breadcrumb>
      <nuxt/>
    </div>
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
export default {
  components: {
    breadcrumb,
    topMenu
  },
  // watchQuery: ["activeIndex"],
  data() {
    return {
      title: `${process.env.title}`,
      audioLink: "",
      topFixed: false
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
  watch: {
    // $route: function() {
    //   console.log(this.$store.state.activeIndex);
    // }
  },
  methods: {
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
body {
  margin: 0;
  font-family: "Microsoft YaHei";
}
.header {
  background: @default-color;
  padding-top: 1px;
  height: 160px;
  .head-title {
    text-align: center;
    color: #fff;
    cursor: default;
    transition: letter-spacing 1s;
    &:hover {
      letter-spacing: 2vw;
    }
  }
}
.top-menu-fixed {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
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
  padding: 2vh 0;
  box-sizing: border-box;
  min-height: calc(100vh - 220px);
}
.content {
  max-width: 1100px;
  margin: auto;
  box-sizing: border-box;
  padding-left: 2vw;
  padding-right: 2vw;
  box-sizing: border-box;
}
a {
  text-decoration: none;
}
.link {
  display: block;
  color: #999;
}
</style>
