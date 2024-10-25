import { copy } from "../../../utils/livestart/util";
import * as net from "../../../utils/livestart/net";
import { userInfo } from "../../../utils/livestart/userInfo";
import { PAGE_TICKETS_EDIT } from "../../../utils/livestart/page";
import { API_FAVOR } from "../../../utils/livestart/api";

Component({
  properties: {
    value: {
      type: Object,
      value: {
        id: 0,
        performers: "",
        city: "",
        description: "",
        contact_info: "",
        nickname: "",
        created_time: "",
        status: "",
        status_icon: "",
        is_favor: false,
        can_edit: false,
        show_tel: true,
      },
    },
  },

  data: {
    id: 0,
    performers: "",
    city: "",
    description: "",
    contact_info: "",
    nickname: "",
    created_time: "",
    status: "",
    status_icon: "",
    is_favor: false,
    can_edit: false,
    show_tel: true,
  },

  lifetimes: {
    attached: function () {
      this.setData({ ...this.properties.value });
    },
  },

  methods: {
    onFavor() {
      if (userInfo.checkLogin()) {
        const user = userInfo.getUserInfo();
        const data = {
          user_id: user.user_id,
          target_type: 2,
          target_id: this.data.id,
          is_favor: !this.data.is_favor,
        };
        net.put(API_FAVOR, data, (res) => {
          if (res.code === 200) {
            this.setData({
              is_favor: data.is_favor,
            });
            console.log("change favor status:", this.data.is_favor);
          }
        });
      }
    },

    onEdit(e: any) {
      const ticketId = e.currentTarget?.dataset?.id || this.data.id;
      wx.navigateTo({
        url: PAGE_TICKETS_EDIT + `?ticketId=${ticketId}`,
      });
    },

    handleClickCopy(e: any) {
      copy(
        e.currentTarget.dataset.contact_info,
        "是否复制: " + e.currentTarget.dataset.contact_info
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
