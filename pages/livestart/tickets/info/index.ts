import { API_TICKET } from "../../../../utils/livestart/api";
import { debounce, getWeek } from "../../../../utils/livestart/util";
import { userInfo } from "../../../../utils/livestart/userInfo";
import {
  PAGE_TICKETS_DETAILS,
  PAGE_TICKETS_INFO,
  PAGE_TICKETS_LIVESHOW,
} from "../../../../utils/livestart/page";
import { getData } from "../../../../utils/livestart/request";
import dayjs from "dayjs";

const statusList = [
  {
    cn: "出票中",
    icon: "/images/icon/livestart/chupiaozhong.svg",
  },
  {
    cn: "已出票",
    icon: "/images/icon/livestart/yichupiao.svg",
  },
  {
    cn: "已关闭",
    icon: "/images/icon/livestart/yiguanbi.svg",
  },
];

Page({
  data: {
    tickets: [],
    keyword: "",
    page: 1,
    pageSize: 10,
    maxPage: 0,
    scrollTop: 0,
  },

  onShow() {
    this.doSearch(this.data.keyword, this.data.page);
  },

  onCancel() {
    wx.showToast({
      title: "取消搜索",
    });
    this.doSearch();
  },

  gotoTicketPublish() {
    if (userInfo.checkLogin()) {
      wx.navigateTo({
        url: PAGE_TICKETS_LIVESHOW,
      });
    }
  },

  goTicketDetail() {
    wx.navigateTo({
      url: PAGE_TICKETS_DETAILS,
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

  onSearchInputChange(e: any) {
    debounce((ctx, value) => {
      ctx.doSearch(value);
    })(this, e.detail);
  },

  async doSearch(keyword: string = "", page: number = 1) {
    console.log(`Ticket search keyword: [${keyword}], load page: ${page}`);
    if (page == 1) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }
    wx.showLoading({title: "加载中..."})
    const resp = await getData(API_TICKET, {
      keyword: keyword,
      page: page,
      size: this.data.pageSize,
      user_id: userInfo.getUserInfo().user_id,
    });
    wx.hideLoading()
    console.log(resp.data);

    for (let item of resp.data.items) {
      let show_time = item.show_time * 1000;
      let create_time = item.create_time * 1000;
      item.show_day = dayjs(show_time).format("MM月DD日");
      item.create_time = dayjs(create_time).format("YYYY.MM.DD HH:mm");
      item.show_time = dayjs(show_time).format("MM月DD日 HH:mm");
      item.show_weekday = getWeek(show_time);
      item.status_icon = statusList.find((s) => s.cn === item.status)?.icon;
      item.show_tel = item.status != "已出票";
    }
    const maxPage =
      resp.data.total > this.data.pageSize
        ? ~~(resp.data.total / this.data.pageSize) + 1
        : 1;

    let tickets = resp.data.items;
    if (page > 1) {
      tickets = this.data.tickets.concat(resp.data.items);
    }
    this.setData({
      tickets: tickets,
      page: page,
      maxPage: maxPage,
      keyword: keyword,
    });
  },

  scrollToLower() {
    if (this.data.page < this.data.maxPage) {
      this.doSearch(this.data.keyword, this.data.page + 1);
    }
  },

  onReachBottom() {
    console.log(`Ticket reach bottom, current page: ${this.data.page}`);
    if (this.data.page < this.data.maxPage) {
      this.doSearch(this.data.keyword, this.data.page + 1);
    }
  },

  onHide() {},
  onUnload() {},

  onPullDownRefresh() {
    this.doSearch(this.data.keyword);
    wx.stopPullDownRefresh();
  },

  onShareAppMessage() {
    return {
      title: "LiveStart出票",
      desc: "LiveStart出票",
      path: PAGE_TICKETS_INFO,
    };
  },

  onShareTimeline() {
    return {
      title: "LiveStart出票",
      desc: "LiveStart出票",
      path: PAGE_TICKETS_INFO,
    };
  },
});
