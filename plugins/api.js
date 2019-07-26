//requireToken参数为true时说明该接口需要token,若缓存中没有token,不发送请求直接跳转到登录页,减小服务器压力,提高响应速度
import http from '@/plugins/axios';
import Vue from 'vue';
const api = {
  install(Vue) {
    Vue.prototype.api = api
  },
  getEssay(query) {
    return http({
      url: '/essay?' + getPathParam(query),
    });
  },
  getMessage(query) {
    return http({
      url: '/message?' + getPathParam(query),
    });
  },
  getEssayById(id) {
    return http({
      url: '/essay/' + id,
    });
  }
}

function getPathParam(param = {}) {
  let arr = [];
  for (let key in param) {
    if (param[key] && key != 'password') {
      arr.push(key + '=' + param[key]);
    }
  }
  return arr.join('&');
}


export {
  api
};
Vue.use(api);
export default ({
  app
}) => {
  app.$api = api
}
