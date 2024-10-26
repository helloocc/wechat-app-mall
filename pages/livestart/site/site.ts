// pages/site/site.ts
import { PAGE_SITE, PAGE_SITE_QRCODE } from "../../../utils/livestart/page";
import { PAGE_LIVESHOW } from "../../../utils/livestart/page";
import { loadLiveshow } from "../../../utils/livestart/global";
import { API_SITE } from "../../../utils/livestart/api";
import { getData } from "../../../utils/livestart/request";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showData: [] as Array<MonthLiveshow>,
    current: 0,
    collectIcon: "../../icons/shoucang_shouye.png",
    expandShowId: 0, // 当前对哪个演出 id 进行详情展开。
    scrollTop: 0 as number | undefined, // 竖向滚动位置
    siteInfo: {} as Site,
  },
  monthViewRectList: [] as Array<ViewRect>,
  scrollViewRect: { top: 0 } as ViewRect,
  scrollTop: 0,
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

  async onLoad(options: any) {
    if (options.city && options.name) {
      const resp = await getData(API_SITE, {
        city: options.city,
        name: options.name,
      });
      const showData = await this.loadShow(
        options.city,
        // 同一场地多场馆同时查询
        resp.data.owner || options.name
      );
      this.setData(
        {
          siteInfo: {
            city: resp.data.city,
            name: resp.data.name,
            owner: resp.data.owner,
            logo: resp.data.logo,
            description: resp.data.description,
            location: resp.data.location,
            room_key: resp.data.room_key,
          },
          showData: showData.map((item: any) => ({
            ...item,
            title: `${item.month}月演出`,
          })),
        },
        this.updateRect
      );
    }
  },

  async onReady(): Promise<void> {},

  onChangeMonth(current: any) {
    this.tap = true;
    const scrollTop = this.monthViewRectList[current.detail].top;
    wx.pageScrollTo({ scrollTop: scrollTop });
    this.setData({
      scrollTop: scrollTop + Math.random(),
      current: current.detail,
    });
  },

  onTouchStart() {
    this.tap = false;
  },

  // 处理 liveshow 滚动事件，触发吸顶电梯变化
  onPageScroll(e: any) {
    if (this.tap) {
      return;
    }
    const scrollTop = e.scrollTop + this.monthViewRectList[0].top;
    for (let i = 0; i < this.monthViewRectList.length; i++) {
      const item = this.monthViewRectList[i];
      if (i === this.data.current) { 
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

  onPullDownRefresh() {
    this.loadShow(this.data.siteInfo.city, this.data.siteInfo.name).then(() =>
      wx.stopPullDownRefresh()
    );
  },

  onShareAppMessage() {
    return {
      title: `${this.data.siteInfo.city}${this.data.siteInfo.name}演出概览`,
      path: `${PAGE_SITE}?city=${this.data.siteInfo.city}&name=${this.data.siteInfo.name}`,
    };
  },

  onShareTimeline() {
    return {
      title: `${this.data.siteInfo.city}${this.data.siteInfo.name}演出概览`,
      path: `${PAGE_SITE}?city=${this.data.siteInfo.city}&name=${this.data.siteInfo.name}`,
    };
  },

  handleSelectLiveItem(e: any) {
    const targetExpandId = e.detail;
    this.setData({
      expandShowId:
        targetExpandId === this.data.expandShowId ? 0 : targetExpandId,
    });
  },

  goSiteQrCode() {
    wx.navigateTo({
      url: `${PAGE_SITE_QRCODE}?city=${this.data.siteInfo.city}&roomKey=${this.data.siteInfo.room_key}`,
    });
  },

  async loadShow(city: string, site: string): Promise<any> {
    // @ts-ignore
    const p = new Promise((resolve, reject) => {
      loadLiveshow(city, site, false, (data) => {
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0,
          success: () => {
            resolve(data);
          },
        });
      });
    });
    return p;
  },

  goLiveshow() {
    wx.switchTab({
      url: PAGE_LIVESHOW,
    });
  },
});
