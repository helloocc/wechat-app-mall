import { copy } from "../../../../utils/livestart/util";
import { SHARE_TITILE } from "../../../../utils/livestart/const";
import {
  PAGE_CITY_QRCODE,
  PAGE_ROOMS,
  PAGE_ROOMS_SEARCH,
} from "../../../../utils/livestart/page";
import { API_TAG_ROOM } from "../../../../utils/livestart/api";
import { getData } from "../../../../utils/livestart/request";

Page({
  data: {
    city: "",
    rooms: [],
    tabValue: 0,
    tabRooms: [
      { title: "演出群", value: 0, key: "one" },
      { title: "乐迷群", value: 1, key: "two" },
      { title: "其他群", value: 2, key: "three" },
    ],
    selectId: -1,
    page: 1,
    pageSize: 15,
    maxPageIndex: 0,
  },

  onLoad() {},

  onReachBottom() {
    if (this.data.page < this.data.maxPageIndex) {
      this.getRoomList(this.data.page + 1);
    }
  },

  async getRoomList(page: number = 1) {
    const res = await getData(API_TAG_ROOM, {
      tag: this.data.tabRooms[this.data.tabValue].title,
      city: this.data.city,
      page: page,
      size: this.data.pageSize,
    });
    const maxPageIndex =
      res.data.total > this.data.pageSize
        ? ~~(res.data.total / this.data.pageSize) + 1
        : 1;
    console.log(
      `Room total: ${res.data.total}, page:${page}, max page: ${maxPageIndex}`
    );
    this.setData({
      rooms: this.data.rooms.concat(res.data.items),
      maxPageIndex: maxPageIndex,
      page: page,
    });
    wx.hideLoading();
  },

  handleSelectItem(e: any) {
    console.log("handleSelectItem", e.currentTarget.dataset.id);
    const id = e.currentTarget.dataset.id;
    this.setData({
      // selectId: id
      selectId: id === this.data.selectId ? -1 : id,
    });
  },

  handleChangeTabs(e: any) {
    console.log("changeTabs",  e.detail);
    this.setData({
      tabValue: e.detail,
      selectId: -1,
      page: 1,
      rooms: [],
      maxPageIndex: 0,
    });
    this.getRoomList();
  },

  handleGotoSearch() {
    wx.navigateTo({
      url: PAGE_ROOMS_SEARCH,
    });
  },

  handleClickCopy(e: any) {
    copy(
      "#加群 " + e.currentTarget.dataset.topic,
      "是否复制：#加群 " + e.currentTarget.dataset.topic
    );
  },

  handleSelectCity(e: any) {
    console.log(`Room page city: [${this.data.city}] -> [${e.detail.name}]`);
    if (e.detail.name == this.data.city) {
      return;
    }
    this.setData({
      city: e.detail.name,
      page: 1,
      rooms: [],
      maxPageIndex: 0,
    });
    this.getRoomList();
  },

  onPullDownRefresh() {
    this.getRoomList();
    wx.stopPullDownRefresh();
  },

  handleSearchLower() {
    console.log("Scroll to lower");
  },

  goQrCode() {
    wx.navigateTo({
      url: PAGE_CITY_QRCODE,
    });
  },

  onShareAppMessage() {
    return {
      title: SHARE_TITILE,
      path: PAGE_ROOMS,
    };
  },

  onShareTimeline() {
    return {
      title: SHARE_TITILE,
      path: PAGE_ROOMS,
    };
  },
});
