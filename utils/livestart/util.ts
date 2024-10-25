import dayjs from "dayjs";

const formatTime = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = (n: number) => {
  const s = n.toString();
  return s[1] ? s : "0" + s;
};

function getWeek(date: number) {
  const week = dayjs(date).day();
  switch (week) {
    case 1:
      return "周一";
    case 2:
      return "周二";
    case 3:
      return "周三";
    case 4:
      return "周四";
    case 5:
      return "周五";
    case 6:
      return "周六";
    case 0:
      return "周日";
    default:
      return "";
  }
}
function getDate() {
  const time = new Date();
  const year = time.getFullYear();
  const month = time.getMonth();
  const monthStr = month < 10 ? "0" + month : month;
  const day = time.getDay();
  const dayStr = day < 10 ? "0" + day : day;
  return [year, monthStr, dayStr].join(".");
}

function showInterstitialAd() {
  // 在页面中定义插屏广告
  let interstitialAd = null;
  // 在页面onLoad回调事件中创建插屏广告实例
  if (wx.createInterstitialAd) {
    interstitialAd = wx.createInterstitialAd({
      adUnitId: "adunit-dcb6b24b5a2a2f27",
    });
    interstitialAd.onLoad(() => {});
    interstitialAd.onError((err) => {
      console.log(err);
    });
    interstitialAd.onClose(() => {});
  }
  // 在适合的场景显示插屏广告
  if (interstitialAd) {
    interstitialAd.show().catch((err) => {
      console.error(err);
    });
  }
}

var timer: NodeJS.Timeout;
function debounce(
  fn: { apply: (arg0: any, arg1: IArguments) => void },
  delay = 500
) {
  return function () {
    // @ts-ignore 将当前上下文（this）赋值给 context
    const context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, arguments);
    }, delay);
  };
}

function copy(text: string, content: string = "是否复制该信息") {
  wx.showModal({
    title: "提示",
    content: content,
    // confirmText: "复制",
    success: function (res) {
      if (res.confirm) {
        console.log("Copy text:", text);
        wx.setClipboardData({
          data: text,
          success: () => {
            wx.getClipboardData({
              success: () => {
                wx.showToast({
                  title: "复制成功",
                });
              },
            });
          },
        });
      }
    },
  });
}

const fs = wx.getFileSystemManager();
function cacheImage(webUrl: string): string {
  let webImages = wx.getStorageSync("webImages") || [];
  let webImage = webImages.find(
    (item: { webUrl: string }) => item.webUrl === webUrl
  );
  if (webImage) {
    try {
      fs.accessSync(webImage.cache);
      console.log(
        `Image cache: ${webImage.webUrl}, ${webImage.cache}, ${webImage.lastTime}`
      );
      return webImage.cache;
    } catch (e) {
      let webImageIdx = webImages.findIndex(
        (item: { webUrl: string }) => item.webUrl === webUrl
      );
      console.log(`Image cache invalid: ${webImage.cache}`);
      webImages.splice(webImageIdx, 1);
      wx.setStorageSync("webImages", webImages);
    }
  } else {
    wx.downloadFile({
      url: webUrl,
      success(res) {
        if (res.statusCode === 200) {
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            success(res) {
              let webImageStorage = wx.getStorageSync("webImages") || [];
              let storage = {
                webUrl: webUrl,
                cache: res.savedFilePath,
                lastTime: new Date().getTime(),
              };
              console.log(`New image: ${webUrl}, cache: ${res.savedFilePath}`);
              webImageStorage.push(storage);
              wx.setStorageSync("webImages", webImageStorage);
            },
            fail(err) {
              console.log("Cache image error:", err);
            },
          });
        } 
      },
    });
  }
  return webUrl;
}

export {
  formatTime,
  getWeek,
  showInterstitialAd,
  getDate,
  debounce,
  copy,
  cacheImage,
};
