<template>
  <div class="top-menu">
    <div class="sub-menu" v-show="showSubMenu" ref="subMenu">
      <nuxt-link class="link" to="/essayList/all">全部</nuxt-link>
      <nuxt-link class="link" to="/essayList/0">技术</nuxt-link>
      <nuxt-link class="link" to="/essayList/1">短文</nuxt-link>
      <nuxt-link class="link" to="/essayList/2">杂谈</nuxt-link>
    </div>
    <el-menu :default-active="$store.state.activeIndex" mode="horizontal">
      <el-menu-item index="0">
        <nuxt-link to="/">首页</nuxt-link>
      </el-menu-item>
      <el-menu-item index="1">
        <nuxt-link to style="padding-right:0">
          <div class="sub-menu-content" ref="subMenuTitle">
            文章
            <i class="el-icon-arrow-down"></i>
          </div>
        </nuxt-link>
      </el-menu-item>
      <!-- <el-menu-item index="3">
        <nuxt-link to="/ticket">票票</nuxt-link>
      </el-menu-item>-->
      <!-- <el-menu-item index="3">
        <nuxt-link to="/canvas">画布</nuxt-link>
      </el-menu-item>-->
      <el-menu-item index="2">
        <nuxt-link to="/message">留言</nuxt-link>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showSubMenu: false
    };
  },
  mounted() {
    const { subMenuTitle, subMenu } = this.$refs;
    subMenuTitle.addEventListener("mousemove", () => {
      this.showSubMenu = true;
    });
    subMenuTitle.addEventListener("mouseleave", () => {
      this.showSubMenu = false;
    });
    subMenu.addEventListener("mousemove", () => {
      this.showSubMenu = true;
    });
    subMenu.addEventListener("mouseleave", () => {
      this.showSubMenu = false;
    });
    subMenu.addEventListener("click", () => {
      this.showSubMenu = false;
    });
  }
};
</script>

<style lang="less" scoped>
.top-menu {
  position: relative;
  .el-icon-arrow-down {
    font-size: 12px;
  }
  li {
    padding: 0;
    a {
      display: block;
      padding: 0 20px;
      line-height: 60px;
    }
  }
}
.sub-menu {
  position: absolute;
  top: 60px;
  left: 70px;
  width: 120px;
  z-index: 10;
  box-shadow: 1px 5px 10px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  border-top: 5px solid rgba(0, 0, 0, 0);
  a {
    background: #fff;
    line-height: 35px;
    // border-bottom: 1px dashed #999;
    padding-left: 15px;
    letter-spacing: 5px;
    &:hover {
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
