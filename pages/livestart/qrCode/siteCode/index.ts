// index.ts
// 获取应用实例

import { copy } from "../../../utils/util";
import { API_QRCODE_BOT, API_QRCODE_GROUP } from "../../../utils/api";
import { QrCode_DEV } from "../../../utils/const";
import { PAGE_LIVESHOW, PAGE_SITE_QRCODE } from "../../../utils/page";


Page({
  data: {
    city: "",
    roomKey: "",
    botQrCode: API_QRCODE_BOT,
    groupQrCode: API_QRCODE_GROUP,
  },

  onLoad: async function (params: any) {
    this.load(params.city, params.roomKey);
  },

  onShow() { },

  onShareAppMessage() {
    return {
      title: `加入场地群`,
      path: `${PAGE_SITE_QRCODE}?city=${this.data.city}&roomKey=${this.data.roomKey}`,
    };
  },

  onShareTimeline() {
    return {
      title: `加入场地群`,
      path: `${PAGE_SITE_QRCODE}?city=${this.data.city}&roomKey=${this.data.roomKey}`,
    };
  },

  async load(city: string, roomKey: string) {
    let city_group = API_QRCODE_GROUP + "?city=" + city;
    let city_bot = API_QRCODE_BOT + "?city=" + city;
    this.setData({
      city: city,
      roomKey: roomKey,
      groupQrCode: city_group,
      botQrCode: city_bot,
    });
  },

  noBot() {
    this.setData({
      botQrCode: QrCode_DEV
    });
  },

  noGroup() {
    this.setData({
      groupQrCode: ""
    });
  },

  goLiveshow() {
    wx.switchTab({
      url: PAGE_LIVESHOW
    })
  },

  handleClickCopy(e: any) {
    copy("#加群 " + e.currentTarget.dataset.topic, "是否复制：#加群 " + e.currentTarget.dataset.topic)
  },

});
