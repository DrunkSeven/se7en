import axios from 'axios';
import { util } from '@/plugins/common.js';

let http = axios.create({
  baseURL: process.env.baseUrl,
  timeout: 10 * 1000
});

http.interceptors.request.use((config) => {
  // 强制调用时传递method用大写
  let method = config.method || 'get';
  if (method != 'get') {
    // 强制传递了method
  } else if (config.params) {
    config.method = 'get';
  } else if (config.data) {
    config.method = 'post';
  }
  if (process.client && $nuxt.$store.state.token) {
    config.headers['token'] = $nuxt.$store.state.token
  }
  if ((config.data || config.params) && method == 'get') {
    config.data = util.serialize(config.data || config.params);
  }
  return config;
}, error => {
  return Promise.resolve(error);
});

http.interceptors.response.use(response => {
  if (response.status == 200) {
    let data = response.data;
    return Promise.resolve(data);
  } else {
    return Promise.reject(false);
  }
}, error => {
  let response = error.response;
  if (response) {
    if (process.client && $nuxt.isOnline) {
      switch (response.status) {
        case 500:
          util.error('网络连接失败');
          break;
        case 501:
          util.error('网络连接失败');
          break;
        case 503:
          util.error('网络连接失败');
          break;
        case 401:
          //出现401判断是否在app内,通知app刷新token
          if ($nuxt.$store.state.client) {
            // util.returnToLogin();
          } else {
            // deal401();
          }
          return;
      }
    }
    if (response.status == 500) {
      return Promise.resolve(false);
    } else {
      return Promise.reject(response);
    }
  }
  return Promise.resolve(false);

});
let refreshingToken = false;
/**
 * 出现401登录过期的情况,先判断是否有refresh_tolen,没有就清空用户信息,有就用
 * refresh_token换access_token将数据存入localStorage. 刷新页面
 */
function deal401() {
  // 防止重复请求
  if (refreshingToken) {
    return;
  }

  let refresh_token = util.getRefreshToken();
  if (!refresh_token) {

    util.logout(false);
    util.toLogin();
    return;
  }
  refreshingToken = true;
  // api.getRefreshToken(refresh_token).then(data => {
  //   refreshingToken = false;
  //   if (data.access_token) {
  //     util.setToken(data.access_token);
  //     util.setRefreshToken(data.refresh_token);
  //     util.setRememberUser();
  //     location.reload(true);
  //   }
  // }).catch(error => {
  //   if ($nuxt.$store.state.client) {
  //     util.returnToLogin();
  //   } else {
  //     refreshingToken = false;
  //     util.logout(false);
  //     util.toLogin();
  //   }
  // });
}
export default http;
