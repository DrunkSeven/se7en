<template>
  <section>
    <el-input
      style="margin-top:2vh"
      v-model="inputValue"
      maxlength="20"
      clearable
      prefix-icon="el-icon-search"
      placeholder="请输入要搜索的内容"
    >
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <essayList
      :dataList="dataList"
      :total="total"
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      @getDataList="getDataList($event)"
    ></essayList>
  </section>
</template>
<script>
import http from "~/plugins/axios";
import essayList from "~/components/essayList";
export default {
  components: {
    essayList
  },
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "1");
    content.store.commit("changeBreadcrumb", [
      { name: "列表", url: "/essayList/all" }
    ]);
    const type = content.params.id == "all" ? undefined : content.params.id;
    const pageSize = 10;
    const data = await http.post("getEssayList", {
      type: type,
      pageSize: pageSize,
      pageIndex: 1
    });
    return {
      dataList: data.dataList,
      total: data.total,
      type: type,
      pageSize: pageSize
    };
  },
  head() {
    return {
      title: `${process.env.title}-文章列表`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${process.env.title}的文章列表`
        }
      ]
    };
  },
  data() {
    return {
      inputValue: "",
      pageIndex: 1,
      keyword: ""
    };
  },

  methods: {
    search() {
      if (this.inputValue) {
        this.keyword = this.inputValue;
        this.pageIndex = 1;
        this.getDataList();
      } else {
        this.$message("请输入要搜索的内容");
      }
    },
    getDataList(pageIndex) {
      this.pageIndex = pageIndex || this.pageIndex;
      http
        .post("getEssayList", {
          keyword: this.keyword,
          type: this.keyword ? undefined : this.type,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        })
        .then(res => {
          if (res.total) {
            this.dataList = res.dataList;
            this.total = res.total;
          } else if (keyword) {
            this.$message("啥也搜不到");
          }
        });
    }
  }
};
</script>

