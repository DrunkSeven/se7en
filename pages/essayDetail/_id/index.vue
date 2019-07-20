<template>
  <section>
    <h1 class="essay-title">{{essayDetail.title}}</h1>
    <p class="update-time">
      <span>时间：</span>
      {{essayDetail.createTime}}
    </p>
    <div class="detail-box" v-html="essayDetail.detail"></div>
  </section>
</template>
<script>
import http from "~/plugins/axios";
export default {
  // middleware: "response",
  async asyncData(content) {
    const essayDetail = await http.get("/essay", {
      id: content.params.id
    });
    content.store.commit("changeActiveIndex", "1");

    content.store.commit("changeBreadcrumb", [
      { name: "列表", url: "/essayList/all" },
      {
        name: essayDetail.data.title,
        url: `/essayDetail/${content.params.id}`
      }
    ]);
    return { essayDetail: essayDetail.data };
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

