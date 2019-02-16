<template>
  <div>直播</div>
</template>
<script>
export default {
  async asyncData(content) {
    content.store.commit("changeActiveIndex", "4");
    content.store.commit("changeBreadcrumb", []);
  }
};
</script>
