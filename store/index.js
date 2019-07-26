import Vue from 'vue'
import Vuex from 'vuex'
import http from "~/plugins/axios";
Vue.use(Vuex)

const store = () => new Vuex.Store({

  state: {
    code: '',
    wxReady: false,
    breadcrumbList: [],
    activeIndex: "0",
    showHeader: true,
    token: ""
  },
  mutations: {
    async getVerificationCode(state) {
      const res = await http.post("/verificationCode", { token: state.token })
      state.code = res.data || '';
      state.token = res.token
    },
    showHeader(state, flag) {
      state.showHeader = flag;
    },
    changeActiveIndex(state, path) {
      state.activeIndex = path;
    },
    changeBreadcrumb(state, arr) {
      state.breadcrumbList.length = [];
      state.breadcrumbList.push({ name: "首页", url: "/" }),
        arr.forEach(element => {
          state.breadcrumbList.push(element)
        });
    },
    setShare(state, shareData) {
      if (process.client) {
        shareData.link = window.location.href;
        wx.updateAppMessageShareData(shareData);
        wx.updateTimelineShareData(shareData);
        wx.onMenuShareTimeline(shareData);
        wx.onMenuShareAppMessage(shareData);
      }
    }
  },
})

export default store
