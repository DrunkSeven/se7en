<template>
  <div>
    <ul class="essay-list">
      <li v-for="(o,index) in dataList" :key="index">
        <nuxt-link class="essay-item" :to="`/essayDetail/${o.id}`">
          <div class="left-box">
            <img width="60px" height="60px" :src="o.img" onerror="~/assets/img/header.jpg">
            <div class="box-center">
              <p class="title">{{o.title}}</p>
              <p class="intorduction">{{o.intorduction}}</p>
              <p class="keyword">{{o.keyword||'暂无'}}</p>
            </div>
          </div>
          <div class="right-box">
            <i v-show="o.top&&total" class="iconfont icon-zhiding zhiding"></i>
            <p class="update-time">{{o.createTime.split(' ')[0]}}</p>
          </div>
        </nuxt-link>
      </li>
    </ul>
    <el-pagination
      background
      layout="prev, pager, next"
      @current-change="currentChange"
      :page-size="pageSize||10"
      :total="total"
      v-show="total"
      :current-page="pageIndex"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  props: ["dataList", "total", "pageIndex", "pageSize"],
  data() {
    return {};
  },
  methods: {
    currentChange: function(val) {
      // this.$store.commit('increment');
      this.$emit("getDataList", val);
    }
  }
};
</script>
<style lang="less" scoped>
.zhiding {
  font-size: 60px;
  position: absolute;
  right: 0;
  top: 0;
  color: #409eff;
}
.el-pagination {
  padding: 0;
}
.auther {
  color: #999;
}
.update-time {
  margin: 0;
}
.essay-list {
  padding-left: 0;
  li {
    display: block;
  }
  li:nth-child(2n + 1) {
    background: #eee;
  }
}
.essay-item {
  color: #333;
  list-style: none;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  .el-icon-arrow-right {
    font-size: 30px;
    line-height: 36px;
    display: block;
    margin-right: 0;
    width: 20px;
  }
}
.left-box {
  overflow: hidden;
  display: flex;
  align-items: center;
  margin-right: 2vw;
  flex: 1;
  img {
    min-width: 60px;
    margin-right: 2vw;
  }
  .title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    font-weight: bold;
    max-width: 50vw;
  }
  .keyword,
  .intorduction {
    font-size: 12px;
    line-height: 15px;
    color: #464646;
    margin-bottom: 0;
    margin-top: 5px;
    max-height: 30px;
    overflow: hidden;
  }
  .keyword {
    &::before {
      content: "关键词：";
    }
    color: #999;
    margin: 5px 0 0 0;
    height: auto;
  }
}
.right-box {
  font-size: 12px;
  min-width: 80px;
  p {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
</style>


