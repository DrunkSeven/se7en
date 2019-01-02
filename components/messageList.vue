<template>
  <div>
    <ul class="msg-list">
      <li class="msg-item" v-for="(o,index) in dataList" :key="index">
        <p class="msg">{{o.msg}}</p>
        <span class="ip">{{o.ip}}</span>
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
<style lang="less">
@default-color: #409eff;
.msg-list {
  padding-left: 0;
  border: solid @default-color;
  border-width: 1px 0;
}
.msg-item {
  list-style: none;
  padding: 5px 0;
  border-bottom: 1px dashed #999;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  &:last-child {
    border-bottom: none;
  }
  .msg {
    font-size: 14px;
    margin: 0 15px 0 0;
  }
  .ip {
    font-size: 12px;
  }
}
</style>

