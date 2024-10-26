import { getWeek } from "../../../../utils/livestart/util";
import * as net from "../../../../utils/livestart/net";
import dayjs from 'dayjs';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    showMenu: false,
    id: "",
    ticketsData: [
      {
        url:
          "https://pic.rmb.bdstatic.com/bjh/down/050d88fbc8ff14d398fae3c94db6b30b.jpeg",
        name: "h78m",
        time: "7月1日 13:00",
        status: 1,
        localCity: "上海",
        text: "票一张，走大麦，联系微信10293129313",
      },
      {
        url:
          "https://pic.rmb.bdstatic.com/bjh/down/050d88fbc8ff14d398fae3c94db6b30b.jpeg",
        name: "h78m",
        time: "7月7日 13:00",
        status: 1,
        localCity: "上海",
        text: "票一张，走大麦，联系微信10293129313",
      },
    ],
    show: {},
    commentsNum: 0,
    commentsData: [
      {
        nickName: "yoxi",
        txt: "这是一条评论案例",
        time: "1分钟前",
        url:
          "https://pic.rmb.bdstatic.com/bjh/down/050d88fbc8ff14d398fae3c94db6b30b.jpeg",
      },
      {
        nickName: "yoxi",
        txt: "这是一条评论案例",
        time: "1分钟前",
        url:
          "https://pic.rmb.bdstatic.com/bjh/down/050d88fbc8ff14d398fae3c94db6b30b.jpeg",
      },
    ],
    //评论
    talks: [],
    touchStart: 0,
    inputValue: "",
    inputBiaoqing: "",
    faces: [
      "http://file.laike.net/d/img/2019071322101111410.gif",
      "http://file.laike.net/d/img/2019071322101111413.gif",
      "http://file.laike.net/d/img/2019071322101211415.gif",
    ],
    names: ["贝贝", "晶晶", "欢欢", "妮妮"],
    isShow: false, //控制emoji表情是否显示
    isLoad: true, //解决初试加载时emoji动画执行一次
    cfBg: false,
    emojiChar:
      "☺-😋-😌-😍-😏-😜-😝-😞-😔-😪-😭-😁-😂-😃-😅-😆-👿-😒-😓-😔-😏-😖-😘-😚-😒-😡-😢-😣-😤-😢-😨-😳-😵-😷-😸-😻-😼-😽-😾-😿-🙊-🙋-🙏-✈-🚇-🚃-🚌-🍄-🍅-🍆-🍇-🍈-🍉-🍑-🍒-🍓-🐔-🐶-🐷-👦-👧-👱-👩-👰-👨-👲-👳-💃-💄-💅-💆-💇-🌹-💑-💓-💘-🚲",
    //0x1f---
    emoji: [
      "60a",
      "60b",
      "60c",
      "60d",
      "60f",
      "61b",
      "61d",
      "61e",
      "61f",
      "62a",
      "62c",
      "62e",
      "602",
      "603",
      "605",
      "606",
      "608",
      "612",
      "613",
      "614",
      "615",
      "616",
      "618",
      "619",
      "620",
      "621",
      "623",
      "624",
      "625",
      "627",
      "629",
      "633",
      "635",
      "637",
      "63a",
      "63b",
      "63c",
      "63d",
      "63e",
      "63f",
      "64a",
      "64b",
      "64f",
      "681",
      "68a",
      "68b",
      "68c",
      "344",
      "345",
      "346",
      "347",
      "348",
      "349",
      "351",
      "352",
      "353",
      "414",
      "415",
      "416",
      "466",
      "467",
      "468",
      "469",
      "470",
      "471",
      "472",
      "473",
      "483",
      "484",
      "485",
      "486",
      "487",
      "490",
      "491",
      "493",
      "498",
      "6b4",
    ],
    emojis: [], //qq、微信原始表情
    alipayEmoji: [], //支付宝表情
  },

  //import  * as review  from  '../../components/review/review.ts';
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id);
    let id = options.id;
    this.setData({
      id: id,
      //show:this.data.ticketsData[Number(id)-1]
    });
    this.getTicketDetail();

    var em = {},
      that = this,
      emChar = that.data.emojiChar.split("-");
    var emojis = [];
    that.data.emoji.forEach(function (v, i) {
      em = {
        char: emChar[i],
        emoji: "0x1f" + v,
      };
      emojis.push(em);
    });
    that.setData({
      emojis: emojis,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getTicketDetail();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  //解决滑动穿透问题
  emojiScroll: function (e) {
    console.log(e);
  },
  //点击表情显示隐藏表情盒子
  emojiShowHide: function () {
    this.setData({
      isShow: !this.data.isShow,
      isLoad: false,
      cfBg: !this.data.false,
    });
  },
  //表情选择
  emojiChoose: function (e) {
    console.log(e);
    //当前输入内容和表情合并
    // let value = e.currentTarget.dataset.emoji;
    this.data.inputBiaoqing += e.currentTarget.dataset.emoji;
    console.log(this.data.inputBiaoqing);
    this.setData({
      inputValue: this.data.inputBiaoqing,
    });
  },
  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function () {
    console.log("womenlai");
    this.setData({
      isShow: false,
      cfBg: false,
    });
  },
  onReady: function () {
    // 评论弹出层动画创建
    this.animation = wx.createAnimation({
      duration: 400, // 整个动画过程花费的时间，单位为毫秒
      timingFunction: "ease", // 动画的类型
      delay: 0, // 动画延迟参数
    });
  },
  // showTalks: function() {
  // // 加载数据
  // this.loadTalks();
  // // 设置动画内容为：使用绝对定位显示区域，高度变为100%
  // this.animation.bottom("0rpx").height("100%").step()
  // this.setData({
  //  talksAnimationData: this.animation.export()
  // })
  // },

  // hideTalks: function() {
  // // 设置动画内容为：使用绝对定位隐藏整个区域，高度变为0
  // // this.animation.bottom("-100%").height("0rpx").step()
  // this.setData({
  // //  talks: [],
  //  talksAnimationData: this.animation.export()
  // })
  // },

  // 加载数据
  loadTalks: function () {
    // 随机产生一些评论
    wx.showNavigationBarLoading();
    let that = this;
    let talks = [];
    let faces = [
      "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1535701703&di=bfde939cc559b0f8edcbfd1adb6e667d&src=http://img5q.duitang.com/uploads/item/201505/15/20150515205520_iWF2U.jpeg",
      "http://file.laike.net/d/img/2019071322101211424.gif",
      "http://file.laike.net/d/img/2019071322101211425.gif",
    ];
    let names = ["佳佳", "晶晶", "欢欢", "妮妮", "娜娜", "锅锅"];
    let contents = [
      "为什么你总是对我不理不睬呢",
      "干嘛老是不见你了",
      "我们都有字节的梦想",
      "你有什么资格不努力呢",
    ];
    let talktime = "刚刚";
    console.log(talktime);
    talks = talks.concat(that.data.talks);

    // 随机产生10条评论
    for (var i = 0; i < 10; i++) {
      talks.push({
        talkId: i,
        avatarUrl: faces[Math.floor(Math.random() * faces.length)],
        nickName: names[Math.floor(Math.random() * names.length)],
        content: contents[Math.floor(Math.random() * contents.length)],
        talkTime: talktime,
      });
    }
    this.setData({
      talks: talks,
      //talksAnimationData: that.animation.export()
    });
    wx.hideNavigationBarLoading();
  },

  onScrollLoad: function () {
    // 加载新的数据
    this.loadTalks();
  },
  //下拉评论框隐藏
  touchStart: function (e) {
    let touchStart = e.touches[0].clientY;
    this.setData({
      touchStart,
    });
  },
  touchMove: function (e) {
    // console.log(this.data.touchStart)
    let touchLength = e.touches[0].clientY - this.data.touchStart;
    console.log(touchLength - 100);
    if (touchLength > 100) {
      this.animation.bottom("-100%").height("0rpx").step();
      this.setData({
        talks: [],
        talksAnimationData: this.animation.export(),
      });
    }
  },
  //输入框失去焦点时触发
  bindInputBlur: function (e) {
    console.log(e);
    console.log(this.data.inputBiaoqing);
    this.data.inputValue = e.detail.value + this.data.inputBiaoqing;
  },
  //点击发布，发布评论
  faBu: function () {
    let that = this;
    this.data.talks.unshift({
      talkId: 1,
      avatarUrl:
        "https://assets.gitlab.cn/images/new-home/desktop/hero-illustration@2x-desktop.png",
      nickName: this.data.names[
        Math.floor(Math.random() * this.data.names.length)
      ],
      content: this.data.inputValue,
      talkTime: "刚刚",
      // rebackTalk:''
    });
    that.data.inputValue = "";
    that.setData({
      talks: that.data.talks,
      inputValue: that.data.inputValue,
      //  talksAnimationData: that.animation.export()
    });
  },
  rebackFn(event) {
    let nickName = event.currentTarget.dataset.nickName;
    let talkId = event.currentTarget.dataset.talkId;
    console.log(event.currentTarget.dataset);
    var that = this;
    wx.showModal({
      title: "回复" + nickName,
      editable: true,
      placeholderText: "请输入回复",
      success(res) {
        if (res.confirm) {
          console.log("用户点击确定");
          if (res.content) {
            that.data.talks.forEach((item) => {
              if (item.talkId == talkId) {
                item.rebackTalk = res.content;
                that.setData({
                  talks: that.data.talks,
                });
              }
            });
            // that.setData({
            //     'cells[1][0].text':res.content,
            //      });
          }
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      },
    });
  },
  showMenuList() {
    this.setData({
      showMenu: !this.data.showMenu,
    });
  },
  getTicketDetail() {
    let that = this;
    let id = that.data.id;
    net.get(
      `https://www.chenyunfei.cn/api/v1/tickets/${id}`,
      {},
      (res: any) => {
        for (let item of res.data) {
          let show_time = item.show_time * 1000;
          let create_time = item.create_time * 1000;
          item.show_day = dayjs(show_time).format("MM.DD");
          item.show_time = dayjs(show_time).format("MM月DD日 HH:mm");
          item.show_weekday = getWeek(show_time);
          //  item.is_festival = item.title.includes("音乐节") ? true : false;
          // item.performers = item.performers ? item.performers : item.title;
          // item.show_title = item.is_festival
          //   ? item.city + " · " + item.title
          //   : item.performers;
          // item.room_info = item.related_rooms ? " [有群]" : "";
          // item.is_new =
          //   moment().diff(moment(create_time), "hour") <= 24 ? "（新）" : "";
        }
        that.setData({
          ticketsData: res.data,
          show: res.data[0],
        });
        console.log(res.data);
      }
    );
  },
});
