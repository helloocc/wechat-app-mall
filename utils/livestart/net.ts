import { TOKEN } from "./const";

function getPromise<T>(url: string, data = {}) {
  return new Promise<T>((resolve, reject) => {
    wx.request({
      header: {
        "access-token": TOKEN,
        "content-type": "application/json",
      },
      url: url,
      data: data,
      success: (resp) => {
        resolve(resp.data?.data);
      },
      fail: reject,
    });
  });
}

const fetch = (method: any) => {
  return function (url: string, data = {}, successCallback = (res: any) => {}) {
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
        successCallback(res.data);
        return;
      },
      fail: function (res) {
        console.log("net fail", res);
      },
      complete: function (res) {
        // if (res.statusCode == 401) {}
      },
    });
  };
};

const get = fetch("GET");
const post = fetch("POST");
const put = fetch("PUT");

export { get, post, put, getPromise };
