<template>
  <section>
    <el-input
      maxlength="150"
      minlength="5"
      class="message"
      type="textarea"
      v-model="message"
      placeholder="不少于5个字"
    ></el-input>
    <verificationCode :codeImg="codeImg" :codeStr="codeStr" v-on:getCodeStr="getCodeStr"></verificationCode>
    <el-button :disabled="disabled" class="submit-msg" type="primary" @click="submitMsg()">确定</el-button>
    <messageList
      :dataList="messageList"
      :total="total"
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      @getDataList="getDataList($event)"
    ></messageList>
  </section>
</template>
<script>
import http from "~/plugins/axios";
import messageList from "../components/messageList";
import verificationCode from "~/components/verificationCode";

export default {
  components: {
    messageList,
    verificationCode
  },
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "2");
    content.store.commit("changeBreadcrumb", []);
    const pageSize = 10;
    const message = await http.post("getMessage", {
      pageSize: pageSize,
      pageIndex: 1
    });
    return {
      pageIndex: 1,
      pageSize: pageSize,
      total: message.total,
      messageList: message.dataList,
      codeImg: content.store.code
    };
  },
  head() {
    return {
      title: `${process.env.title}-留言板`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `${process.env.title}的留言板`
        }
      ]
    };
  },
  data() {
    return {
      message: "",
      disabled: true,
      codeStr: ""
    };
  },
  created() {
    if (process.client) {
      this.$store.commit("getVerificationCode");
    }
  },
  methods: {
    getDataList(pageIndex) {
      this.pageIndex = pageIndex || this.pageIndex;
      http
        .post("getMessage", {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex
        })
        .then(res => {
          if (res.total) {
            this.messageList = res.dataList;
            this.total = res.total;
          }
        });
    },
    getCodeStr(val) {
      this.codeStr = val;
    },
    submitMsg() {
      if (this.disabled) {
        this.$message("别点我");
        return;
      }
      http
        .post("setMessage", {
          msg: this.message,
          code: this.codeStr
        })
        .then(val => {
          if (val.flag) {
            this.$store.commit("getVerificationCode");
            this.codeStr = "";
            this.message = "";
            this.$message({
              message: "留言成功",
              type: "success"
            });
            this.getDataList(1);
          } else {
            this.$message({
              message: `留言失败,${val.msg}`,
              type: "error"
            });
          }
        });
    }
  },
  watch: {
    codeStr: function() {
      this.message.length > 4 && this.codeStr.length == 5
        ? (this.disabled = false)
        : (this.disabled = true);
    },
    message: function() {
      this.message.length > 4 && this.codeStr.length == 5
        ? (this.disabled = false)
        : (this.disabled = true);
    }
  }
};
</script>
<style lang="less">
.submit-msg {
  display: block;
  width: 100%;
}
</style>
