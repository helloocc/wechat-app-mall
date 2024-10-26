import { APP } from "../../../utils/livestart/global";
import { userInfo } from "../../../utils/livestart/userInfo";
import {
  PAGE_CONTACT_US,
  PAGE_LOGIN,
  PAGE_MY_COLLECTS,
  PAGE_MY_TICKETS,
  PAGE_UPDATE_USER,
} from "../../../utils/livestart/page";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: APP.globalData.userInfo,
    userInfo: {
      nickname: "",
      avatar: "../../icons/unlogin.svg",
    },
    isLogin: false,
  },
  onShow() {
    this.loadUserInfo();
  },
  onLoad() {},
  loadUserInfo() {
    if (userInfo.isLogin()) {
      this.setData({
        userInfo: userInfo.getUserInfo(),
        isLogin: true,
      });
    }
  },
  handleClickLoginExit() {
    const that = this;
    wx.showModal({
      title: "提示",
      content: "确认退出登录？",
      success(res) {
        if (res.confirm) {
          userInfo.loginExit();
          that.setData({
            userInfo: {
              nickname: "",
              avatar: "../../icons/unlogin.svg",
            },
            isLogin: false,
          });
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  handleClickUpdate() {
    wx.navigateTo({
      url: PAGE_UPDATE_USER,
    });
  },
  gotoMyCollect() {
    wx.navigateTo({
      url: PAGE_MY_COLLECTS,
      fail: (err) => {
        console.log("Failed to goto my collect page: ", err);
      },
    });
  },

  gotoMyTickets() {
    wx.navigateTo({
      url: PAGE_MY_TICKETS,
      fail: (err) => {
        console.log("Failed to goto my tickets page: ", err);
      },
    });
  },

  gotoContactUs() {
    wx.navigateTo({
      url: PAGE_CONTACT_US,
      fail: (err) => {
        console.log("Failed to goto contactUs page: ", err);
      },
    });
  },

  handleClickLogin() {
    wx.navigateTo({
      url: PAGE_LOGIN,
    });
  },

  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },
});
