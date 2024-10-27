import { API_LOGIN, API_PHONE, API_USERS } from "../../../../utils/livestart/api";
import * as net from "../../../../utils/livestart/net";
import { userInfo } from "../../../../utils/livestart/userInfo";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCheck: false,
    code: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.updateWXLoginCode()
  },

  onClickLogin(e: any) {
    console.log("onClickLogin:", e)
    if (!e.detail.encryptedData) return
    // console.log('onClicklogin', e.detail.code, this.data.code)
    net.get(API_LOGIN, { code: this.data.code }, loginRes => {
      if (loginRes.code === 200) {
        net.post(API_PHONE, {
          "code":  e.detail.code,
          "user_id": loginRes.data.unionid
        }, phoneRes => {
          if (phoneRes.code === 200) {
            net.get(API_USERS, { user_id: loginRes.data.unionid } , res => {
              if (res.code === 200) {
                userInfo.setUserInfo(res.data[0])
                this.endingLogin()
              }
            })  
          }
        })
      } else {
        this.updateWXLoginCode()
      }
    })
    // step 1: wx.code 请求获取 sessionId

    // 两个分支
    //    1、已注册直接登录
    //    2、未注册解码手机号
    // encryptedData: e.detail.encryptedData,
    // iv: e.detail.iv,
    // sessionId: data.sessionId,
  },
  checkboxChange(e: any) {
    console.log('checkboxChange', e.detail.value)
    this.setData({
      isCheck: e.detail.value.length == 1
    })
  },

  updateWXLoginCode() {
    let that = this
    wx.login({
      success(res) {
        console.log('login successfuly,', res)
        if (res.code) {
          that.setData({
            code: res.code
          })
        }
      },
      fail(res) {
        console.warn("Failed to login wx,", res);
      },
    })
  },

  endingLogin() {
    wx.navigateBack()
  },

})