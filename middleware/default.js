import axios from "axios";
import { util } from '@/plugins/common.js';
export default async function (context) {
  // let token = ""

  // if (process.server) {
  //   let res = await axios.get(process.env.baseUrl + "/token");
  //   let i = res.headers['set-cookie'][0].split(";");
  //   i.forEach(element => {
  //     let j = []
  //     j = element.split("=")
  //     if (j[0] == "csrfToken") {
  //       token = j[1]
  //     }
  //   });
  //   context.store.commit("setToken", token)
  // } else {
  //   console.log(context);

  //   // util.setCookie("csrfToken", context.store.state.token)
  // }

  return;
}
