import { PAGE_CONTACT_US } from "../../../../utils/livestart/page";

Page({
  data: {},

  onLoad: async function (params: any) { },

  onShow() { },

  onShareAppMessage() {
    return {
      title: "联系我们",
      path: PAGE_CONTACT_US,
    };
  },

  onShareTimeline() {
    return {
      title: "联系我们",
      path: PAGE_CONTACT_US,
    };
  }

});
