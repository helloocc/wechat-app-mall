import { TOKEN } from "./const";

const request = (params: { url: string; method: any; data: any }) => {
  const { url, method, data } = params;
  return new Promise((resolve) => {
    wx.request({
      method: method,
      dataType: "json",
      responseType: "text",
      header: {
        "access-token": TOKEN,
        "content-type": "application/json",
      },
      url: url,
      data: data,
      success: function (res) {
        console.log("request success", res.data);
        resolve(res.data);
      },
      fail: function (res) {
        console.log("request fail", res);
      },
      complete: function () {},
    });
  });
};

export async function getData(url: string, data: any): Promise<any> {
  return await request({ url: url, method: "GET", data: data });
}
