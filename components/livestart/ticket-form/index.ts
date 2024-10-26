import { APP, setCityId, convertShowViewData } from "../../../utils/livestart/global";
import * as net from "../../../utils/livestart/net";
import { userInfo } from "../../../utils/livestart/userInfo";
import { PAGE_TICKETS_INFO } from "../../../utils/livestart/page";
import { API_LIVESHOW, API_TICKET } from "../../../utils/livestart/api";
import dayjs from 'dayjs';

Component({
  properties: {
    edit: {
      // 是否是编辑出票
      type: Boolean,
      value: false,
    },
    ticketId: {
      type: Number,
      value: -1,
    },
    liveshowId: {
      type: Number,
      value: -1,
    },
  },

  data: {
    cityList: [] as City[],
    cityIndex: 0,
    customItem: "全部",
    form: {
      user_id: "",
      nickname: "",
      description: "",
      show_time: 0,
      city: "",
      // price: 0,
      count: 1,
      showTime: "",
      showDate: "",
      site: "",
      contact_info: "",
    },
    showConfirm: false,
    confirmType: false,
    confirmDisable: true,
    commitList: [false, false],
    commitText: [
      "1. 票务信息真实有效，来源正规，由官方渠道购入\n2. 不出售溢价票/强实名/邀请函\n3. 不发布收票信息",
      '1. 每天限发布一次\n2. 非标准演出类目，仅展示不转发\n3. 出票完成可将状态修改为"已出票"(不显示联系方式)/"已关闭"(不可再次编辑)',
    ],
    statusList: ["出票中", "已出票", "已关闭"],
    statusIndex: 0,
  },

  lifetimes: {
    async attached() {
      const cityList = await APP.getCityList();
      const cityId = userInfo.getUserCityId();
      const cityIndex = cityList.findIndex((item) => item.id == cityId);
      this.setData({
        statusIndex: 0,
        cityIndex: cityIndex >= 0 ? cityIndex : 0,
        cityList: cityList,
        ["form.contact_info"]: `${userInfo.getUserInfo().wechat}`,
      });
      console.log("Ticket-from data:", this.properties);
      if (this.properties.ticketId > 0) {
        this.loadTicket(this.properties.ticketId);
      } else if (this.properties.liveshowId > 0) {
        this.loadLiveshow(this.properties.liveshowId);
      }
    },
  },

  methods: {
    // 加载 ticket(出票信息)
    loadTicket(id: Number) {
      console.log("ticket-form load ticket...");
      const that = this;
      net.get(API_TICKET + `/${id}`, {}, (res) => {
        if (res.code === 200) {
          const ticket = res.data[0];
          const cityIndex = this.data.cityList.findIndex(
            (item: any) => item.name == ticket.city
          );
          const statusIndex = this.data.statusList.findIndex(
            (item: any) => item == ticket.status
          );
          const show_time = ticket.show_time * 1000;
          const showTime = dayjs(show_time);
          ticket.time = showTime.format("YYYY.MM.DD HH:mm");
          const form = {
            description: ticket.description,
            show_id: ticket.id,
            showDate: ticket.time.split(" ")[0],
            showTime: ticket.time.split(" ")[1],
            site: ticket.site,
            count: ticket.count,
            price: ticket.price,
            user_id: ticket.user_id,
            contact_info: ticket.contact_info,
          };
          console.log("initializing form:", form);
          that.setData({
            form: form,
            cityIndex: cityIndex >= 0 ? cityIndex : 0,
            statusIndex: statusIndex >= 0 ? statusIndex : 0,
          });
        }
      });
    },

    // 加载 liveshow(演出信息)
    loadLiveshow(id: Number) {
      console.log("ticket-form load liveshow...");
      const user = userInfo.getUserInfo();
      const that = this;
      net.get(API_LIVESHOW + `/${id}`, {}, (res) => {
        if (res.code === 200) {
          const liveshow = res.data[0];
          convertShowViewData(liveshow, false);
          const cityIndex = this.data.cityList.findIndex(
            (item: any) => item.name == liveshow.city
          );
          const form = {
            description: liveshow.title,
            show_id: liveshow.id,
            showDate: liveshow.time.split(" ")[0],
            showTime: liveshow.time.split(" ")[1],
            site: liveshow.site,
            count: 1,
            // price: 100,
            show_time: 0,
            user_id: "",
            nickname: "",
            contact_info: `${user.wechat}`,
          };
          console.log("initializing form:", form);
          that.setData({
            form: form,
            cityIndex: cityIndex >= 0 ? cityIndex : that.data.cityIndex,
          });
        }
      });
    },

    validateFormData(): Boolean {
      let error_msg = "";
      console.log(this.data.form.showDate);
      if (
        this.data.form.description == undefined ||
        this.data.form.description.trim() == ""
      ) {
        error_msg = "出票内容为空";
      } else if (
        this.data.form.site == undefined ||
        this.data.form.site.trim() == ""
      ) {
        error_msg = "演出地点为空";
      } else if (
        this.data.form.showDate == undefined ||
        this.data.form.showDate.trim() == ""
      ) {
        error_msg = "演出时间为空";
      } else if (this.overTimeShow()) {
        error_msg = "演出时间已过";
      } else if (
        this.data.form.price == undefined ||
        String(this.data.form.price).trim() == "" ||
        isNaN(this.data.form.price) ||
        parseFloat(this.data.form.price) < 0
      ) {
        error_msg = "出票单价错误";
      } else if (
        this.data.form.contact_info == undefined ||
        String(this.data.form.contact_info).trim() == "" ||
        String(this.data.form.contact_info).length < 5
      ) {
        error_msg = "联系方式错误";
      }

      if (error_msg == "") {
        return true;
      } else {
        wx.showToast({
          title: error_msg,
          icon: "none",
          duration: 1500,
        });
        return false;
      }
    },

    overTimeShow(): boolean {
      let nowTime =
        new Date(Date.parse(new Date().toString())).getTime() / 1000;
      let showTime = this.convertPickerTime();
      return nowTime >= showTime;
    },

    handleClickShowConfirm() {
      if (this.validateFormData()) {
        this.setData({ showConfirm: true });
      }
    },

    handleClickHideConfirm() {
      this.setData({ showConfirm: false });
    },

    handleInput(e: any) {
      const name = e.currentTarget.dataset.name;
      this.setData({
        [`form.${name}`]: e.detail.value,
      });
    },
    /*数字加减器 */
    //数字加1
    handleAddNum: function () {
      let num = this.data.form.count;
      this.setData({
        ["form.count"]: ++num,
      });
    },
    //数字减1
    handleMinusNum: function () {
      let num = this.data.form.count;
      if (num >= 1) {
        this.setData({
          ["form.count"]: --num,
        });
      } else {
        wx.showToast({
          title: "不能再减少了哟！",
          icon: "none",
          duration: 1500,
        });
      }
    },

    onChangeCity(e: any) {
      const cityIndex = Number(e.detail.value);
      const cityId = this.data.cities?.[cityIndex]?.id;
      setCityId(cityId);
      this.setData({
        cityIndex,
      });
    },

    onChangeStatus(e: any) {
      console.log(e.detail);
      const statusIndex = Number(e.detail.value);
      this.setData({
        statusIndex,
      });
    },

    onDateChange: function (e: any) {
      console.log("picker发送选择改变，携带值为", e.detail.value);
      var showDate = e.detail.value;
      if (showDate != "null") {
        this.setData({ ["form.showDate"]: showDate });
      }
    },

    onTimeChange: function (e: any) {
      console.log("picker发送选择改变，携带值为", e.detail.value);
      this.setData({
        ["form.showTime"]: e.detail.value,
      });
    },

    convertPickerTime() {
      let pickerTime = "00:00:00";
      if (this.data.form.showTime) {
        pickerTime = `${this.data.form.showTime}:00`;
      }
      let showTime = `${this.data.form.showDate.replace(
        /\./g,
        "-"
      )} ${pickerTime}`;
      console.log("convert show time:", showTime);
      return new Date(showTime).getTime() / 1000;
    },

    handleFormData() {
      const user = userInfo.getUserInfo();
      this.data.form.show_time = this.convertPickerTime();
      this.data.form.user_id = user.user_id;
      this.data.form.nickname = user.nickname;
      this.data.form.city = this.data.cityList[this.data.cityIndex].name;
      this.data.form.status = this.data.statusList[this.data.statusIndex];
      console.log("Ticket Form data: ", this.data.form);
    },

    // 点击发布
    handleSubmitPublish() {
      if (!this.validateFormData()) {
        return;
      }

      this.handleFormData();
      if (this.data.confirmType || this.data.confirmDisable) return;
      this.setData(
        {
          confirmType: true,
        },
        () => {
          net.post(API_TICKET, this.data.form, (res) => {
            if (res.code === 200) {
              wx.showToast({
                title: "出票发布成功",
                icon: "success",
                duration: 1500,
              });
              setTimeout(function () {
                wx.switchTab({
                  url: PAGE_TICKETS_INFO,
                });
              }, 1500);
            } else if (res.code === 202) {
              wx.showToast({
                title: "[提示]" + res.msg,
                icon: "none",
                duration: 5000,
              });
              setTimeout(function () {
                wx.switchTab({
                  url: PAGE_TICKETS_INFO,
                });
              }, 5000);
            } else {
              let errMsg = "内部错误";
              if (res.msg) {
                errMsg = res.msg;
              }
              wx.showToast({
                title: "[发布失败]" + errMsg,
                icon: "none",
                duration: 5000,
              });
              setTimeout(function () {
                wx.switchTab({
                  url: PAGE_TICKETS_INFO,
                });
              }, 5000);
            }
          });
        }
      );
    },

    // 点击编辑
    handleSubmitEdit() {
      if (!this.validateFormData()) {
        return;
      }
      this.handleFormData();
      this.setData(
        {
          confirmType: true,
        },
        () => {
          net.put(
            API_TICKET + `/${this.properties.ticketId}`,
            this.data.form,
            (res) => {
              if (res.code === 200) {
                wx.showToast({
                  title: "修改成功",
                  icon: "success",
                  duration: 1500,
                });
                setTimeout(function () {
                  wx.switchTab({
                    url: PAGE_TICKETS_INFO,
                  });
                }, 1500);
              } else {
                wx.showToast({
                  title: `修改失败: ${res.msg}`,
                  icon: "none",
                  duration: 3000,
                });
                setTimeout(function () {
                  wx.switchTab({
                    url: PAGE_TICKETS_INFO,
                  });
                }, 3500);
              }
            }
          );
        }
      );
    },

    // 点击确认承诺
    handleClickPromise(e: any) {
      const index = e.currentTarget.dataset.index;
      const list = this.data.commitList;
      list[index] = !list[index];
      this.setData({
        commitList: list,
        confirmDisable: !list.every((item: Boolean) => item),
      });
    },
  },
});
