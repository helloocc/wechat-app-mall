import * as net from "../../../../utils/livestart/net";
import { convertShowViewData } from "../../../../utils/livestart/global";
import { API_LIVESHOW } from "../../../../utils/livestart/api";
import { PAGE_TICKETS_PUBLISH } from "../../../../utils/livestart/page";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "",
    searchKey: "",
    searchTimer: -1,
    list: [],
    expandShowId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
  },
  query() {
    wx.showLoading({ title: "加载中" });
    net.get(API_LIVESHOW, {
      city: this.data.city,
      keyword: this.data.searchKey
    }, res => {
      if (res.code === 200) {
        for (let item of res.data) {
          item = convertShowViewData(item, false)
        }
        this.setData({
          list: res.data
          // list: res.data.slice(0, 10)
        })
      }
      wx.hideLoading();
    })
  },
  handleSelectLiveItem(e: any) {
    // console.log('handleSelectLiveItem', e.detail)
    this.setData({
      expandShowId: e.detail
    })
  },
  handleCancle() {
    this.setData({
      searchKey: "",
      list: []
    });
  },
  handleSelectCity(e: any) {
    console.log("handleSelectCity", e)
    this.setData({
      city: e.detail.name
    })
    this.query()
  },
  handleFlushSearch(e: any) {
    // if (this.data.searchTimer) {
    //   clearTimeout(this.data.searchTimer)
    // }
    // const timer = setTimeout(() => {
    // }, 800)
    this.setData({
      searchKey: e.detail.value,
      // searchTimer: timer
    }, () => {
      this.query()
    });
  },
  handleNoLiveshow() {
    wx.navigateTo({
      url: PAGE_TICKETS_PUBLISH
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})