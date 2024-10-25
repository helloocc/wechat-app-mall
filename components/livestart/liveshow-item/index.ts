// components/liveshow-item/index.ts
import { PAGE_LIVESHOW_DETAILS, PAGE_TICKETS_PUBLISH } from "../../../utils/livestart/page";
import { userInfo } from "../../../utils/livestart/userInfo";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否详情页
    isDetail: {
      type: Boolean,
      value: false,
    },
    // 是否出票
    isTicket: {
      type: Boolean,
      value: false,
    },
    expand: {
      type: Boolean,
      value: false,
    },
    value: {
      type: Object,
      value: {
        id: 0,
        day: '',
        time: '',
        weekday: '',
        performers: '',
        title: false,
        is_favor: false,
        room_info: '',
        is_new: '',
        related_rooms: ''
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    id: 0,
    day: '',
    time: '',
    weekday: '',
    is_favor: false,
    performers: '',
    title: false,
    room_info: '',
    is_new: '',
    related_rooms: ''
  },
  lifetimes: {
    attached: function () {
      this.setData({ ...this.properties.value });
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleSelectLiveItem(e: any) {
      console.log('handleSelectLiveItem', e.currentTarget.dataset.id)
      // this.triggerEvent('select', e.currentTarget.dataset.id)
      wx.navigateTo({
        url: PAGE_LIVESHOW_DETAILS + `?id=${e.currentTarget.dataset.id}`
      })
    },
    handleClickTicket(e: any) {
      wx.navigateTo({
        url: PAGE_TICKETS_PUBLISH + `?id=${e.currentTarget.dataset.id}`
      })
    },
    handleClickExpand(e: any) {
      if (this.properties.isTicket) return
      console.log('handleClickExpand liveshow details:', e.currentTarget.dataset.id)
      // if (userInfo.checkLogin()) {
      wx.navigateTo({
        url: PAGE_LIVESHOW_DETAILS + `?id=${e.currentTarget.dataset.id}`
      })
      // }
    },
  }
})
