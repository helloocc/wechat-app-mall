import * as net from "../../../../utils/livestart/net";
import { copy } from "../../../../utils/livestart/util";
import { API_ROOM_NAME } from "../../../../utils/livestart/api";
import { SHARE_TITILE } from "../../../../utils/livestart/const";
import { PAGE_ROOMS_SEARCH } from "../../../../utils/livestart/page";
import { debounce } from "../../../../utils/livestart/util";

Page({
  data: {
    list: [],
    total: 0,
    search: "",
    selectId: -1,
  },

  onLoad(params: any) {
    if (params.search) {
      this.onSearch(params.search);
    }
  },

  onSearch(keyword: string) {
    console.log(`Search room keyword: [${keyword}]`);
    if (keyword.length === 0) {
      this.setData({
        list: [],
      });
      return;
    }
    wx.showLoading({ title: "加载中" });
    net.get(
      API_ROOM_NAME,
      {
        keyword: keyword,
      },
      (res) => {
        if (res.code === 200) {
          let list = res.data;
          let index = 0;
          for (let i in list) {
            for (let j in list[i].items) {
              list[i].items[j].id = index;
              index++;
            }
          }
          this.setData(
            {
              search: keyword,
              list: list,
              total: index,
            },
            () => {
              wx.hideLoading();
            }
          );
        }
      }
    );
  },

  handleSearch(e: any) {
    debounce(this.onSearch)(e.detail.value);
  },

  handleSelectItem(e: any) {
    console.log("handleSelectItem", e.currentTarget.dataset.id);
    const id = e.currentTarget.dataset.id;
    this.setData({
      // selectId: id
      selectId: id === this.data.selectId ? -1 : id,
    });
  },

  handleClickCopy(e: any) {
    copy(
      "#加群 " + e.currentTarget.dataset.topic,
      "是否复制：#加群 " + e.currentTarget.dataset.topic
    );
  },

  handleCancle() {
    this.setData({
      search: "",
      list: [],
    });
  },

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {},

  onShareAppMessage() {
    return {
      title: SHARE_TITILE,
      path: PAGE_ROOMS_SEARCH + "?search=" + this.data.search,
    };
  },

  onShareTimeline() {
    return {
      title: SHARE_TITILE,
      path: PAGE_ROOMS_SEARCH + "?search=" + this.data.search,
    };
  },
});
