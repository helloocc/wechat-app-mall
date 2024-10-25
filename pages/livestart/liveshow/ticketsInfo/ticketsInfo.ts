import moment from "moment";
import { API_TICKET } from "../../../utils/api";
import { SHARE_TITILE } from "../../../utils/const";
import { getWeek } from "../../../utils/util";
import {
  PAGE_TICKETS_DETAILS,
  PAGE_TICKETS_INFO,
  PAGE_TICKETS_LIVESHOW,
  PAGE_TICKETS_PUBLISH,
} from "../../../utils/page";
import * as net from "../../../utils/net";
Page({
  data: {
    tickets: [],
    searchKey: "",
  },
  onLoad(options: any) {
    if (options.performers) {
      this.setData(
        {
          searchKey: options.performers,
        },
        () => {
          this.doQuery();
        }
      );
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.doQuery();
  },

  onCancel() {
    wx.showToast({
      title: "取消搜索",
    });
    this.setData({
      searchKey: "",
    });
    this.doQuery();
  },

  gotoTicketPublish() {
    // wx.navigateBack
    wx.redirectTo({
      url: PAGE_TICKETS_LIVESHOW,
    });
    return;
  },

  goTicketDetail() {
    wx.navigateTo({
      url: PAGE_TICKETS_PUBLISH,
    });
  },

  goDetail(event: any) {
    // 详情页未完成，暂时不跳过去
    return;
    console.log(event.currentTarget.dataset.ticketId);
    let ticketId = event.currentTarget.dataset.ticketId;
    wx.navigateTo({
      url: PAGE_TICKETS_DETAILS + "?id=" + ticketId,
    });
  },

  flushSearch(e: any) {
    this.setData({
      searchKey: e.detail.value,
    });
    this.doQuery();
  },
  doQuery() {
    let that = this;
    net.get(API_TICKET, { keyword: that.data.searchKey }, (res) => {
      for (let item of res.data) {
        let show_time = item.show_time * 1000;
        let create_time = item.create_time * 1000;
        item.show_day = moment(show_time).format("MM月DD日");
        item.create_time = moment(create_time).format("YYYY.MM.DD HH:mm");
        item.show_time = moment(show_time).format("MM月DD日 HH:mm");
        item.show_weekday = getWeek(show_time);
        item.performers = item.performers ? item.performers : item.title;
      }
      that.setData({
        tickets: res.data,
      });
      console.log(res.data.data);
    });
  },
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
  onPullDownRefresh() {
    this.doQuery();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: SHARE_TITILE,
      path: PAGE_TICKETS_INFO,
    };
  },

  onShareTimeline() {
    return {
      title: SHARE_TITILE,
      path: PAGE_TICKETS_INFO,
    };
  },
});
