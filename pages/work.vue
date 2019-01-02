<template>
  <div class="card-list">
    <a
      class="card-content"
      target="_blank"
      :href="o.url"
      v-for="(o,index) in workList"
      :key="index"
    >
      <div>
        <p>{{o.name}}</p>
        <p class="keyword">关键词：{{o.keyword}}</p>
      </div>
      <i class="turnpage iconfont icon-tiaozhuan"></i>
    </a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      workList: [
        {
          name: "彩虹设计网",
          url: "http://www.chdesign.cn/",
          keyword: "jquery,原生"
        },
        {
          name: "彩虹设计网(移动版)",
          url: "http://m.chdesign.cn/",
          keyword: "angualrjs,ionic1"
        },
        {
          name: "哈呀运动官网",
          url: "http://120.79.88.200:1520/hy/",
          keyword: "响应式,angualr2,ionic2"
        },
        {
          name: "合商益民官网",
          url: "http://120.79.88.200:1520/hsym/",
          keyword: "响应式,angualr2,ionic2"
        },
        {
          name: "猩派客官网",
          url: "http://120.79.88.200:1520/xpk/",
          keyword: "响应式,angualr2,ionic2"
        },
        {
          name: "易淘金官网",
          url: "http://120.79.88.200:1520/ytj/",
          keyword: "响应式,angualr2,ionic2"
        },
        {
          name: "财合汇官网",
          url: "http://120.79.88.200:1520/chh/",
          keyword: "响应式,angualr2,ionic2"
        }
      ]
    };
  }
};
</script>

<style lang="less">
.card-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.card-content {
  border: 1px solid #409eff;
  margin-bottom: 1vh;
  color: #000;
  display: flex;
  align-items: center;
  width: 45vw;
  max-width: 500px;
  justify-content: space-between;
  padding: 0 3vw;
  box-sizing: border-box;
  border-radius: 5px;
  transition: box-shadow 0.5s;
  &:nth-child(2n + 1) {
    margin-right: 10px;
  }
  &:hover {
    box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 50px;
    height: 50px;
  }
  .turnpage {
    font-size: 28px;
    color: #409eff;
  }
  .keyword {
    font-size: 12px;
    color: #999;
  }
}
@media screen and (max-width: 700px) {
  .card-content {
    width: 100vw;
    max-width: 100%;
    &:nth-child(2n + 1) {
      margin-right: 0;
    }
  }
}
</style>

