<template>
  <section>
    <div class="center-box">
      <div class="left-box">
        <h3 style="margin-top:0">推荐阅读</h3>
        <el-carousel indicator-position="none" arrow="always" :interval="4000" height="300px">
          <el-carousel-item v-for="(o,index) in dataList.slice(0,3)" :key="index">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <nuxt-link
                :to="`/essayDetail/${o.id}`"
                class="card-img"
                :style="{'background':`url('${o.img}')`,'background-size':'cover','background-position': 'center'}"
              >
                <div class="card-bottom">
                  <span>{{o.title}}</span>
                  <div>
                    <span class="time">{{ o.createTime}}</span>
                    <el-button type="text" class="read-detail">阅读详情</el-button>
                  </div>
                </div>
              </nuxt-link>
            </el-card>
          </el-carousel-item>
        </el-carousel>
        <h3>最近更新
          <nuxt-link to="/essayList/all" class="more">更多></nuxt-link>
        </h3>
        <essayList :dataList="dataList.slice(3,dataList.length)" :total="0" :currentPage="0"></essayList>
        <h3>最新留言
          <nuxt-link to="/message" class="more">更多></nuxt-link>
        </h3>
        <messageList :dataList="messageList" :total="0" :currentPage="0"></messageList>
      </div>
      <div class="right-box">
        <h3>关于本站</h3>
        <p class="about-text">
          本站为基于vue的服务端渲染网站，前端由vue+nuxt搭建，
          后端为node.js，可视化后台由angular7+element-ui搭建。
        </p>
        <div class="auther">
          <img
            src="~/assets/img/header.jpg"
            @mousemove="showWxCode=true"
            @mouseout="showWxCode=false"
            height="50px"
            width="50px"
            class="header-img"
          >
          <div class="auther-text">
            <p>
              微博：
              <a href="https://weibo.com/u/2326305275" target="_blank">幻化成扇子</a>
            </p>
            <p>QQ: 345413763
              <br>Email: 345413763@qq.com
            </p>
          </div>
          <div class="wxcode-box" v-show="showWxCode">
            <p>作者微信</p>
            <img width="150" height="150" src="~/assets/img/wx_code.png">
          </div>
        </div>
        <p style="text-align:center;color:#f00">~欢迎交流~</p>
      </div>
    </div>
    <h3>友情链接</h3>
    <friendLink></friendLink>
  </section>
</template>

<script>
import http from "~/plugins/axios";
import messageList from "../components/messageList";
import essayList from "../components/essayList";
import friendLink from "../components/friendLink";
import util from "~/plugins/common";
export default {
  components: {
    essayList,
    messageList,
    friendLink
  },
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "0");
    content.store.commit("changeBreadcrumb", []);
    const data = await http.post("getEssayList", {
      pageSize: 8,
      pageIndex: 1
    });
    const message = await http.post("getMessage", {
      pageSize: 5,
      pageIndex: 1
    });
    return {
      dataList: data.dataList,
      messageList: message.dataList
    };
  },
  data() {
    return {
      showWxCode: false
    };
  }
};
</script>

<style lang="less" scoped>
.about-text {
  padding-top: 20px;
  border-top: 1px solid #409eff;
  color: #666;
}
.center-box {
  display: flex;
  align-items: flex-start;
  .left-box {
    flex: 1;
  }
  .more {
    cursor: pointer;
    margin-top: 5px;
    float: right;
    color: #409eff;
    font-size: 14px;
    font-weight: normal;
  }
}
.right-box {
  margin-left: 40px;
  width: 300px;
  .auther {
    font-size: 14px;
    display: flex;
    border-bottom: 1px solid #409eff;
    align-items: center;
    position: relative;
  }
  .auther-text {
    margin-left: 20px;
  }
  .header-img {
    cursor: pointer;
  }
  .wxcode-box {
    position: absolute;
    top: 80px;
    text-align: center;
    border: 1px solid #409eff;
    background: #fff;
  }
}
.card-list-box {
  flex-wrap: wrap;
  .el-col {
    margin-bottom: 20px;
  }
}
.card {
  padding: 0;
}
.card-img {
  cursor: pointer;
  height: 300px;
  position: relative;
  display: block;
}
.card-bottom {
  padding: 5px 10px;
  position: absolute;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 60px;
  color: #fff;
  box-sizing: border-box;
}
.time {
  font-size: 12px;
  color: #999;
}
.read-detail {
  float: right;
  padding: 0;
}
@media screen and (max-width: 700px) {
  .center-box {
    display: block;
  }
  .right-box {
    width: auto;
    margin: auto;
  }
}
</style>
