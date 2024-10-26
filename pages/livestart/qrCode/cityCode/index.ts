// index.ts
// 获取应用实例

import { API_QRCODE_BOT, API_QRCODE_GROUP } from "../../../../utils/livestart/api";
import { SHARE_TITILE, QrCode_DEV } from "../../../../utils/livestart/const";
import { PAGE_LIVESHOW,PAGE_CITY_QRCODE } from "../../../../utils/livestart/page";
import { APP, getCityId } from "../../../../utils/livestart/global";

Page({
  data: {
    currentCity: {} as City,
    cityList: [] as City[],
    botQrCode: API_QRCODE_BOT,
    groupQrCode: API_QRCODE_GROUP,
  },

  onLoad: async function (params: any) {
    // 使用参数中带的 cityId 加载城市数据
    const cityId = params.cityId ? Number(params.cityId) : getCityId();
    this.load(cityId);
  },

  onShow() {},

  onShareAppMessage() {
    return {
      title: SHARE_TITILE,
      path: PAGE_CITY_QRCODE + `?cityId=${this.data.currentCity.id}`,
    };
  },

  onShareTimeline() {
    return {
      title: SHARE_TITILE,
      path: PAGE_CITY_QRCODE + `?cityId=${this.data.currentCity.id}`,
    };
  },

  // load 加载要展示的城市数据。如果 cityId 为 undefined，则默认展示城市列表的第一个 city。
  async load(cityId: number) {
    const that = this;
    const cityList = await APP.getCityList();
    if (cityList.length === 0) {
      // 没有城市列表，什么都不加载显示
      return;
    }
    let city = cityList.find((city) => city.id === cityId);
    if (city === undefined) {
      city = cityList[0];
    }

    let city_group = API_QRCODE_GROUP + "?city=" + city.name;
    let city_bot = API_QRCODE_BOT + "?city=" + city.name;
    this.setData({
      cityList: cityList,
      currentCity: city,
      groupQrCode: city_group,
      botQrCode: city_bot,
    });
  },

  // 点击选择一个城市
  handleSelectCity(event: any) {
    this.load(event.detail.id);
  },

  noBot() {
    this.setData({
      botQrCode: QrCode_DEV,
    });
  },

  noGroup() {
    this.setData({
      groupQrCode: "",
    });
  },

  goLiveshow() {
    wx.switchTab({
      url: PAGE_LIVESHOW,
    });
  },
});
