import { API_TICKET_USER } from "../../../../utils/livestart/api";
import { getWeek } from "../../../../utils/livestart/util";
import { userInfo } from "../../../../utils/livestart/userInfo";
import { getData } from "../../../../utils/livestart/request";
import dayjs from "dayjs";

Page({
  data: {
    tickets: [],
  },

  onShow() {
    this.onSearch();
  },

  async onSearch() {
    const user = userInfo.getUserInfo();
    const resp = await getData(API_TICKET_USER, {
      keyword: "",
      user_id: user.user_id,
      my_ticket: true,
    });
    const status_map = {
      出票中: "/images/icon/livestart/chupiaozhong.svg",
      已出票: "/images/icon/livestart/yichupiao.svg",
      已关闭: "/images/icon/livestart/yiguanbi.svg",
    };
    for (let item of resp.data) {
      let show_time = item.show_time * 1000;
      let create_time = item.create_time * 1000;
      item.show_day = dayjs(show_time).format("MM月DD日");
      item.create_time = dayjs(create_time).format("YYYY.MM.DD HH:mm");
      item.show_time = dayjs(show_time).format("MM月DD日 HH:mm");
      item.show_weekday = getWeek(show_time);
      item.performers = item.performers ? item.performers : item.title;
      item.status_icon = status_map[item.status];
      item.show_tel = item.status != "已出票";
    }
    this.setData({
      tickets: resp.data,
    });
  },

  onPullDownRefresh() {
    this.onSearch();
    wx.stopPullDownRefresh();
  },
});
