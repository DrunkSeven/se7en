<template>
  <section>
    <h1 class="essay-title">{{essayDetail.title}}</h1>
    <p class="update-time">
      <span>时间：</span>
      {{util.changeTimeForm(essayDetail.createdAt).split(' ')[0]}}
    </p>
    <div class="detail-box" v-html="essayDetail.detail"></div>
  </section>
</template>
<script>
import http from "~/plugins/axios";
export default {
  // middleware: "response",
  async asyncData({ store, app, params }) {
    const essayDetail = await app.$api.getEssayById(params.id);
    store.commit("changeActiveIndex", "1");

    store.commit("changeBreadcrumb", [
      { name: "列表", url: "/essayList/all" },
      {
        name: essayDetail.title,
        url: `/essayDetail/${params.id}`
      }
    ]);
    return { essayDetail: essayDetail };
  },
  validate({ params }) {
    return /^\d+$/.test(params.id);
  },
  head() {
    return {
      title: `${process.env.title}-${this.essayDetail.title}`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${process.env.title}-${this.essayDetail.title}`
        },
        {
          hid: "Keywords",
          name: "Keywords",
          content: `${this.essayDetail.keyword}`
        }
      ]
    };
  },
  computed: {
    wxReady() {
      return this.$store.state.wxReady;
    }
  },
  watch: {
    wxReady: function() {
      if (process.client) {
        this.$store.commit("setShare", {
          title: this.essayDetail.title,
          imgUrl: this.essayDetail.img,
          desc: this.essayDetail.intorduction
        });
      }
    }
  }
};
</script>
<style lang="less">
.essay-title {
  text-align: center;
}
.update-time {
  font-size: 12px;
  color: #999;
  text-align: center;
  span {
    color: #ccc;
  }
}
.detail-box {
  background: #eee;
  padding: 2vh 2vw;
  img {
    max-width: 100%;
  }
  p:first-child {
    margin-top: 0;
  }
}
</style>

