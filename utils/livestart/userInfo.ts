import { PAGE_LOGIN } from "./page";

const USER_INFO = "USER_INFO";
const USER_CITY_ID = "USER_CITY_ID";
const CITY_STORE_DATE = "CITY_STORE_DATE";

class UserInfo {
  setUserInfo(data: any) {
    return wx.setStorageSync(USER_INFO, data)
  }
  getUserInfo() {
    return wx.getStorageSync(USER_INFO)
  }
  isLogin() {
    let info = this.getUserInfo()
    return !!(info && info.user_id)
  }
  checkLogin() {
    if (this.isLogin()) {
      return true
    } else {
      wx.showModal({
        title: '提示',
        content: '登录后使用完整功能，请登录',
        // cancelText: "",
        // confirmText: "",
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: PAGE_LOGIN
            })
          }
        }
      })
      return false
    }
  }
  loginExit() {
    wx.removeStorageSync(USER_INFO)
  }
  setUserCityId(id: any) {
    return wx.setStorageSync(USER_CITY_ID, id)
  }
  getUserCityId() {
    return wx.getStorageSync(USER_CITY_ID)
  }
  checkStorageOutDated(): boolean {
    var storedDate = wx.getStorageSync(CITY_STORE_DATE);
    var currentDate = new Date().getTime();
    wx.setStorageSync(CITY_STORE_DATE, currentDate);
    let outdated = false
    if (storedDate === "") {
      outdated = false
    } else {
      storedDate = new Date(Number(storedDate));
      // 计算两个日期之间的差值，结果是毫秒数
      var timeGap = currentDate - storedDate;
      const threshold = 1000 * 60 * 60 * 24 * 2
      if (timeGap > threshold) {
        outdated = true
      }
    }
    console.log("storage outdated:", outdated)
    return outdated
  }
};

const userInfo = new UserInfo();
export { userInfo }