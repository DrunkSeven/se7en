import http from "~/plugins/axios";

export default async function (context) {
  const token = await http.get("token");
  console.log(token);

  // context.userAgent = process.server ? console.log('server') : console.log('client');
  return token;
}
