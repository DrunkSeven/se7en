import Vue from 'vue'
import http from './axios';
import { Notification } from 'element-ui';
// import { Loading } from 'element-ui'
const util = {
  install(Vue) {
    Vue.prototype.util = util
  },
  setCookie: function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
  },
  getCookie: function (cname, cookie) {
    var name = cname + "=";
    var ca = cookie || document.cookie;
    ca = ca.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  },
  error(message = '网络连接失败', duration = 3000) {
    Notification({
      title: '错误提示',
      type: "error",
      message,
      duration
    });
  },
  serialize: function (data) {
    let list = [];
    Object.keys(data).forEach(ele => {
      list.push(`${ele}=${data[ele]}`);
    });
    return list.join('&');
  },
  changeTimeForm(time) {
    let date = new Date(time);
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
  },
  getToken: async function (refresh) {

    // setTimeout(() => {
    //     loading.close();
    // }, 500);
    let token = Utils.getCookie('token');
    if (refresh || !token) {
      token = (await http.post("getToken")).token;
      Utils.setCookie("token", token);
    }
    return token;
  },
  showMobileTheme() {
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent) && (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) < 728) {
      return true;
    }
    return false;
  },
}
export { util };
Vue.use(util);
export default ({ app }) => {
  app.$util = util
}
