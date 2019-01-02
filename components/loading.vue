 <template lang="html">
  <div class="loading-page" v-if="loading">
    <img src="~/assets/img/loading.gif"/>
    <p>加载中...</p>
  </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true;
    },
    finish() {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
.loading-page {
  z-index: 11;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
  padding-top: 250px;
  font-size: 25px;
  font-family: sans-serif;
}
</style>