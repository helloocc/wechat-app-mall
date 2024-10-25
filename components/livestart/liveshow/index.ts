import { API_FAVOR } from "../../../utils/livestart/api";
import * as net from "../../../utils/livestart/net";

Component({
  properties: {
    expand: {
      type: Boolean,
      value: false,
    },
    value: {
      type: Object,
      value: {
        id: 0,
        day: "",
        time: "",
        weekday: "",
        performers: "",
        title: false,
        is_favor: false,
        room_info: "",
        is_new: "",
        related_rooms: "",
      },
    },
  },

  data: {
    id: 0,
    day: "",
    time: "",
    weekday: "",
    is_favor: false,
    performers: "",
    title: false,
    room_info: "",
    is_new: "",
    related_rooms: "",
  },

  lifetimes: {
    attached: function () {
      this.setData({ ...this.properties.value });
    },
  },

  methods: {
    onJoinus() {
      if (this.data.related_rooms) {
        wx.navigateTo({
          url: "",
        });
      } else {
        console.log("no related rooms");
      }
    },

    onFavor(e: any) {
      const that = this;
      const app = getApp();
      net.post(
        API_FAVOR,
        {
          user_id: app.globalData.userInfo.uid,
          target_type: 1,
          target_id: this.data.id,
          is_favor: !this.data.is_favor,
        },
        (res: any) => {
          that.setData({
            is_favor: !that.data.is_favor,
          });
          wx.showToast({
            title: "收藏成功",
            icon: "success",
            duration: 1500,
          });
        }
      );
    },

    copyText(e: any) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success: function (res: any) {
          wx.getClipboardData({
            success: function (res: any) {
              wx.showToast({
                title: "复制成功",
              });
              console.log(res);
            },
          });
          console.log(res);
        },
      });
    },
  },
});
