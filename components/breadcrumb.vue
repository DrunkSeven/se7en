<template>
  <el-breadcrumb
    v-show="breadcrumbList.length>1"
    class="breadcrumb"
    separator-class="el-icon-arrow-right"
  >
    <el-breadcrumb-item
      class="breadcrumb-item"
      v-for="(i,index) in breadcrumbList"
      :key="index"
      :to="{ path: i.url }"
    >{{i.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>
<script>
export default {
  data() {
    return {
      breadcrumbList: this.$store.state.breadcrumbList
    };
  }
};
</script>
<style lang="less" scoped>
.breadcrumb {
  padding-left: 20px;
  border-bottom: 1px dashed #409eff;
  .breadcrumb-item {
    margin-bottom: 2vh;
  }
}
</style>

