import { API_FAVOR } from "../../../../utils/livestart/api";
import { APP, convertShowViewData } from "../../../../utils/livestart/global";
import { userInfo } from "../../../../utils/livestart/userInfo";
import * as net from "../../../../utils/livestart/net";
Page({
  data: {
    shows: [],
    expandShowId: 0, // 当前对哪个演出 id 进行详情展开。
    tickets: [],
    contentHeight: 100,
  },

  onLoad() {
    const winInfo = wx.getWindowInfo();
    this.setData({
      contentHeight: (750 / winInfo.windowWidth) * winInfo.windowHeight,
    });
    this.loadShows();
  },

  onChangeTabs(e: any) {
    switch (e.detail.activeKey) {
      case "show":
        this.loadShows();
        break;
      case "ticket":
        this.loadTickets();
        break;
    }
  },

  handleSelectLiveItem(e: any) {
    const targetExpandId = e.detail;
    this.setData({
      expandShowId:
        targetExpandId === this.data.expandShowId ? 0 : targetExpandId,
    });
  },

  loadShows() {
    console.log("loading show");
    let that = this;
    const user = userInfo.getUserInfo();
    net.get(`${API_FAVOR}/${user.user_id}/1`, {}, (res: any) => {
      for (let item of res.data) {
        item = convertShowViewData(item, true);
      }
      that.setData({
        shows: res.data,
      });
    });
  },

  loadTickets() {
    console.log("loading tickets");
    let that = this;
    net.get(
      `${API_FAVOR}/${APP.globalData.userInfo?.uid}/2`,
      {},
      (res: any) => {
        console.log(res.data);
        that.setData({
          tickets: res.data,
        });
      }
    );
  },
});
