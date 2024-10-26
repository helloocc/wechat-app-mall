import { getCityList, setCityId } from "../../../../utils/livestart/global";

Page({
  data: {
    cities: getCityList(),
  },

  onLoad() {},

  onPageScroll(e) {
    this.setData({
      scrollTop: e.scrollTop,
    });
  },

  onTagTap(e: any) {
    let cityId = e.detail.activeLabelId;
    setCityId(cityId);
  },
});
