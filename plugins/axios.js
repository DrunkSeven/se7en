import axios from 'axios';
import util from "~/plugins/common";
import { Message } from 'element-ui'
let http = axios.create({
  baseURL: process.env.baseUrl,
  headers: {
    "Content-Type": 'application/json',
  }
});

// 默认超时是10秒
http.defaults.timeout = 100000;

// 定义一个拦截器，查看请求的情况
http.interceptors.request.use(async (config) => {
  //请求时判断是否是浏览器，并且是否请求除getToken之外的接口，并判断是否携带token；
  //如果未携带token则从cookie中读取，如果cookie中没有token则调用getToken方法
  if (process.browser && config.url.indexOf('getToken') == -1 && !config.headers.token) {
    //将获取到的token放在请求头
    config.headers.common['token'] = await util.getToken();
  }
  return config;
});

http.interceptors.response.use(async (response) => {
  //服务端返回flag=-1表示token无效或过期，重新获取token，
  //getToken方法中传入true表示直接从服务器获取token；
  if (process.browser && response.data.flag == -1) {
    util.getToken(true);
    window.location.reload();
  }
  if (process.browser && response.data.flag == 0) {
    Message({
      message: response.data.msg,
      type: "error"
    });
  }
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  if (process.browser && error.response.status == 403) {
    Message({
      message: error.response.data.msg,
      type: "error"
    });
  }
  return;
});

export default http;
