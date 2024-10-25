import { userInfo } from "../../../utils/userInfo";
import * as net from "../../../utils/net";
import { API_USERS } from "../../../utils/api";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showName: false,
    showWechat: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      userInfo: userInfo.getUserInfo(),
    });
  },
  handleNameShow() {
    this.setData({ showName: true });
  },
  handleNameClose() {
    this.setData({ showName: false });
  },
  handleInputName(e: any) {
    const value = e.detail.value;
    this.setData({ "userInfo.nickname": value });
  },
  handleNameUpdate() {
    if (
      String(this.data.userInfo.nickname).trim() == "" ||
      String(this.data.userInfo.nickname).trim().length < 2
    ) {
      wx.showToast({
        title: "昵称过短",
        icon: "none",
        duration: 1500,
      });
      return;
    }
    net.put(
      API_USERS + `/${this.data.userInfo.user_id}`,
      this.data.userInfo,
      (res) => {
        if (res.code === 200) {
          wx.showToast({
            title: "修改成功",
          });
          userInfo.setUserInfo(res.data[0]);
          this.setData({ showName: false });
        }
      }
    );
  },

  handleWechatShow() {
    this.setData({ showWechat: true });
  },
  handleWechatClose() {
    this.setData({ showWechat: false });
  },
  handleInputWechat(e: any) {
    const value = e.detail.value;
    this.setData({ "userInfo.wechat": value });
  },
  handleWechatUpdate() {
    if (
      String(this.data.userInfo.wechat).trim() == "" ||
      String(this.data.userInfo.wechat).trim().length < 5
    ) {
      wx.showToast({
        title: "微信号填写错误",
        icon: "none",
        duration: 1500,
      });
      return;
    }
    net.put(
      API_USERS + `/${this.data.userInfo.user_id}`,
      this.data.userInfo,
      (res) => {
        if (res.code === 200) {
          wx.showToast({
            title: "修改成功",
          });
          userInfo.setUserInfo(res.data[0]);
          this.setData({ showWechat: false });
        }
      }
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
