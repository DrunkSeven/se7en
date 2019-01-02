import http from "~/plugins/axios";

export default async function (context) {
    const essayDetail = await http.post("getEssayDetail", {
        id: context.params.id
    });
    // context.userAgent = process.server ? console.log('server') : console.log('client');
    return essayDetail;
}