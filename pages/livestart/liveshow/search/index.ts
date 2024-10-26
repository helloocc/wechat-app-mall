import {
  PAGE_LIVESHOW,
  PAGE_LIVESHOW_SEARCH,
} from "../../../../utils/livestart/page";
import { SHARE_TITILE } from "../../../../utils/livestart/const";
import { loadLiveshow } from "../../../../utils/livestart/global";
import { debounce } from "../../../../utils/livestart/util";

const historyStoreKey = "search-history";

Page({
  data: {
    showData: [],
    search: "",
    focusSearchInput: true,
    searchHistory: (wx.getStorageSync(historyStoreKey) as string[]) || [],
    expandShowId: 0, // 要展开的演出 id
  },

  onLoad: function (params: any) {
    if (params.search) {
      this.setData({ search: params.search });
      this.loadShow(params.search);
    }
  },

  onShow() {
    const searchHistory = (wx.getStorageSync(historyStoreKey) as []) || [];
    this.setData({ searchHistory, focusSearchInput: true });
  },

  // 取消搜索，直接展示默认的广告位、或者【最近搜索】内容。
  onCancelSearch() {
    // wx.navigateBack();
    wx.switchTab({
      url: PAGE_LIVESHOW,
      fail: (err) => {
        console.log("Failed to go liveshow page: ", err);
      },
    });
  },

  // 清空 input 事件
  onClearSearch() {
    this.setData({
      search: "",
      showData: [],
      focusSearchInput: true,
      searchHistory: (wx.getStorageSync(historyStoreKey) as []) || [],
    });
  },

  // 搜索
  doSearch(ctx, value: string) {
    if (value === "") {
      // 手动清空了搜索框
      ctx.setData({
        search: "",
        showData: [],
      });
      return;
    }
    const history = [value, ...ctx.data.searchHistory];
    // 保存最近 10 个搜索历史
    wx.setStorageSync(historyStoreKey, history.slice(0, 10));
    ctx.loadShow(value);
  },

  onSearchInputChange(e: any) {
    debounce(this.doSearch, 500)(this, e.detail);
  },

  // 点击一个搜索历史，再次进行搜索
  onSelectHistory(e: any) {
    const index = e.currentTarget.dataset.index;
    if (index < 0) {
      return;
    }
    const text = this.data.searchHistory?.[index];
    if (!text) {
      return;
    }

    // 把选择的历史记录，排到第一位
    const nextHistory = [text]
      .concat(this.data.searchHistory.slice(0, index))
      .concat(this.data.searchHistory.slice(index + 1));
    wx.setStorageSync(historyStoreKey, nextHistory);

    // 搜索
    this.loadShow(text);
  },

  // 删除一个搜索历史记录
  onRemoveHistory(e: any) {
    const index = e.currentTarget.dataset.index;
    const nextHistory = this.data.searchHistory;
    nextHistory.splice(index, 1);
    wx.setStorageSync(historyStoreKey, nextHistory);
    this.setData({
      searchHistory: nextHistory,
    });
  },

  // 点击一个演出信息，展开或收起详细信息
  handleSelectLiveItem(e: any) {
    const targetExpandId = e.detail;
    this.setData({
      expandShowId:
        targetExpandId === this.data.expandShowId ? 0 : targetExpandId,
    });
  },

  loadShow(search: string) {
    wx.showLoading({ title: '搜索中' })
    // const city = await getCurrentCity();
    const searchHistory = (wx.getStorageSync(historyStoreKey) as []) || [];
    loadLiveshow("", search, true, (data) => {
      this.setData({ search: search, showData: data, searchHistory });
      wx.hideLoading()
    });
  },

  onShareAppMessage() {
    return {
      title: SHARE_TITILE,
      path: PAGE_LIVESHOW_SEARCH + "?search=" + this.data.search,
    };
  },

  onShareTimeline() {
    return {
      title: SHARE_TITILE,
      path: PAGE_LIVESHOW_SEARCH + "?search=" + this.data.search,
    };
  },
});
