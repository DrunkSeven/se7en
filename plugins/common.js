import http from '../plugins/axios';
import store from '../store/index';
// import { Loading } from 'element-ui'
const Utils = {
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
    }
}
export default Utils;