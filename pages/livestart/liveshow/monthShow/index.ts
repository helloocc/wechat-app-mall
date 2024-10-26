import { API_BANNER } from "../../../../utils/livestart/api";
import { SHARE_TITILE } from "../../../../utils/livestart/const";
import {
  PAGE_LIVESHOW_SEARCH,
  PAGE_LIVESHOW,
  PAGE_CITY_QRCODE,
} from "../../../../utils/livestart/page";
import { getCityId, loadLiveshow } from "../../../../utils/livestart/global";
import { getData } from "../../../../utils/livestart/request";
import { cacheImage } from "../../../../utils/livestart/util";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showData: [] as Array<MonthLiveshow>,
    collectIcon: "../../icons/shoucang_shouye.png",
    city: '',

    // 广告位的图片
    banners: [
      // { id: 0, url: "/images/bannerV4.jpg" }
    ],

    // 月份电梯的当前月份
    currentMonth: 0,

    // 竖向滚动位置
    scrollTop: 0 as number | undefined,

    // 是否展示 notice bar
    showNotice: true,
  },

  // 月份视图区域的元素信息
  monthViewRectList: [] as Array<ViewRect>,
  // 滚动区域的元素信息
  scrollViewRect: { top: 0 } as ViewRect,
  tap: false,

  // 获取每个月份视图区域的坐标信息
  async updateRect(): Promise<void> {
    // @ts-ignore
    this.monthViewRectList = await Promise.all(
      this.data.showData.map((show) =>
        this.getBoundingClientRect(`#month-${show.month}`)
      )
    );
    this.scrollViewRect = await this.getBoundingClientRect("#scroll-view");

  },

  getBoundingClientRect(id: string) {
    // @ts-ignore
    return new Promise((resolve: (data: any) => void) => {
      wx.createSelectorQuery()
        .select(id)
        .boundingClientRect()
        .exec((ret) => {
          if (ret && ret[0]) {
            resolve(ret[0]);
          }
        });
    });
  },

  onLoad: function () {
    this.loadShow();
    this.loadBanner();
  },

  onPullDownRefresh() {
    this.loadShow();
    wx.stopPullDownRefresh();
  },

  // 处理 liveshow 滚动事件，触发吸顶电梯变化
  onPageScroll(e: any) {
    if (this.tap) {
      return;
    }
    const scrollTop = e.scrollTop + this.monthViewRectList[0].top;
    for (let i = 0; i < this.monthViewRectList.length; i++) {
      const item = this.monthViewRectList[i];
      if (i === this.data.currentMonth) { 
        // 当前 active 月份，不动
        continue
      }
      if (scrollTop < item.top) { 
        // 当前位置还未达到该月，那么后面月份肯定也未达到，直接退出循环
        break
      }
      if (i == this.monthViewRectList.length - 1 || scrollTop < this.monthViewRectList[i + 1].top) {
        // 当前位置是最后一个月份了，或者未到达i+1月份，说明当前i月就是正在浏览的
        this.setData({
          currentMonth: i,
        });
        return;
      }
    }
  },

  // 通用分享函数
  onShare() {
    return {
      title: SHARE_TITILE,
      path: PAGE_LIVESHOW + "?cityId=" + getCityId(),
    };
  },
  // 分享给朋友
  onShareAppMessage() { return this.onShare() },
  // 分享到朋友圈
  onShareTimeline() { return this.onShare() },

  // 选择城市
  handleSelectCity(e: any) {
    console.log(
      `Liveshow page city: [${this.data.city}] -> [${e.detail.name}]`
    );
    if (e.detail.name == this.data.city) {
      return;
    }
    this.setData({
      city: e.detail.name,
    });
    this.loadShow();
  },

  // 点击月份电梯，快速跳转到特定演出
  onChangeMonth(current: any) {
    this.tap = true;
    const scrollTop = this.monthViewRectList[current.detail].top;
    wx.pageScrollTo({ scrollTop: scrollTop }).then(() => { this.tap = false });
    this.setData({
      scrollTop: scrollTop + Math.random(),
      currentMonth: current.detail,
    });
  },

  // 点击搜索框，进入到搜索页
  gotoSearchShowPage(e: any) {
    let url = PAGE_LIVESHOW_SEARCH;
    if (e.currentTarget.dataset.keyword) {
      url = url + "?search=" + e.currentTarget.dataset.keyword;
    }
    wx.navigateTo({
      url: url,
      fail: (err) => {
        console.log("Failed to go searchshow page: ", err);
      },
    });
  },

  // 进入加好友二维码页面
  goQrCode() {
    wx.navigateTo({
      url: PAGE_CITY_QRCODE,
    });
  },


  // 加载 banner
  loadBanner() {
    getData(API_BANNER, {}).then(resp => {
      for (let item of resp.data) {
        item.url = cacheImage(item.url);
      }
      this.setData({
        banners: resp.data,
      });
      console.log("Banners: ", this.data.banners);
    });
  },

  // 加载演出
  loadShow() {
    if (!this.data.city) {
      return
    }
    wx.showLoading({ title: "加载中" })
    const that = this;
    loadLiveshow(this.data.city, "", false, (data) => {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
        success: () => {
          that.setData(
            {
              showData: data.map((item: any) => ({ ...item, title: `${item.month}月演出` })),
              scrollTop: 0,
            },
            () => {
              this.updateRect();
              wx.hideLoading();
            }
          );
        },
      });
    });
  },

  onCloseNotice() {
    this.setData({ showNotice: false }, () => {
      // reset the top fixed offset
    });
  },
});
