<template>
  <section>
    <a
      class="friend-link"
      v-for="(i , index) in friendLink"
      :key="index"
      target="_blank"
      :href="i.url"
    >{{i.name}}</a>
  </section>
</template>
<script>
export default {
  data() {
    return {
      friendLink: [
        {
          name: "彩虹设计网",
          url: "http://www.chdesign.cn/"
        },
        {
          name: "Angular",
          url: "https://www.angular.cn/"
        },
        {
          name: "Ionic",
          url: "https://ionicframework.com/docs/"
        },
        {
          name: "Vue",
          url: "https://cn.vuejs.org/"
        }
      ]
    };
  }
};
</script>
<style lang="less" scoped>
section {
  border-top: 1px solid #409eff;
  padding: 10px 0;
}
.friend-link {
  font-size: 13px;
  color: #666;
  margin-right: 6vw;
}
</style>


