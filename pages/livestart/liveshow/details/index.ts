
import * as net from "../../../../utils/livestart/net";
import { convertShowViewData } from "../../../../utils/livestart/global";
import { userInfo } from "../../../../utils/livestart/userInfo";
import { copy } from "../../../../utils/livestart/util";
import { PAGE_LIVESHOW_DETAILS, PAGE_SITE } from "../../../../utils/livestart/page";
import { API_FAVOR, API_LIVESHOW, API_QRCODE_BOT } from "../../../../utils/livestart/api";
// import { isImageUrl, isPromise } from "miniprogram/miniprogram_npm/@vant/weapp/common/validator";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {} as LiveShowInfo,
    botQrCode: API_QRCODE_BOT
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    if (options.id) {
      this.getLoadDetail(options.id)
    }
  },

  getLoadDetail(id: any) {
    console.log("liveshow details id:", id)
    let user_id = ""
    if (userInfo.isLogin()) {
      const info = userInfo.getUserInfo()
      user_id = info.user_id
    }
    net.get(API_LIVESHOW + `/${id}`, {
      user_id: user_id
    }, res => {
      if (res.code === 200) {
        const liveshow = res.data[0]
        convertShowViewData(liveshow, false)
        liveshow.dayTime = liveshow.time.replace(" ", ` ${liveshow.weekday} `)
        this.setData({
          info: liveshow,
          botQrCode: API_QRCODE_BOT + "?city=" + liveshow.city
        })
        console.log("liveshow details:", this.data.info)
      }
    })
  },

  onShareAppMessage() {
    return {
      title: this.data.info.title,
      path: PAGE_LIVESHOW_DETAILS + "?id=" + this.data.info.id,
      success: () => { },
      fail: () => { },
      complete: () => { }
    }
  },

  onShareTimeline() {
    return {
      title: this.data.info.title,
      path: PAGE_LIVESHOW_DETAILS + "?id=" + this.data.info.id,
      success: () => { },
      fail: () => { },
      complete: () => { }
    }
  },

  handleClickCopyUrl(e: any) {
    copy(e.currentTarget.dataset.topic, "是否复制购票链接")
  },

  handleClickCopyRoomName(e: any) {
    copy("#加群 " + e.currentTarget.dataset.topic, "是否复制：#加群 " + e.currentTarget.dataset.topic)
  },

  // 收藏 / 取消收藏
  handleClickLike() {
    if (userInfo.checkLogin()) {
      const user = userInfo.getUserInfo()
      const data = {
        user_id: user.user_id,
        target_type: 1,
        target_id: this.data.info.id,
        is_favor: !this.data.info.is_favor
      }
      net.put(API_FAVOR, data, res => {
        if (res.code === 200) {
          this.getLoadDetail(this.data.info.id)
        }
      })
    }
  },
  // 打开出票列表
  handleClickTicket() {
    // this.data.info.performers
    const url = '/pages/liveshow/tickets/ticketsInfo?performers=' + this.data.info.performers
    wx.navigateTo({ url: url })
    // wx.switchTab({ url: url })
  },

  // 打开场地页
  goToSiteDetails() {
    const url = `${PAGE_SITE}?city=${this.data.info.city}&name=${this.data.info.site}`
    wx.navigateTo({ url: url })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
})