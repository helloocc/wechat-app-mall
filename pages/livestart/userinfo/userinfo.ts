// pages/userinfo/userinfo.ts
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cells: [
 
        [{title: '我的头像', text: '',url:'', access: true, fn: 'changeImg'}],
        [{title: '我的昵称', text: '', access: true, fn: 'editName'}],
        [{title: '手机号', text: '134567890', }],
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  changeImg: function(){
      var that=this;
    wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        camera: 'back',
        success(res) {
          console.log(res.tempFiles[0].tempFilePath)
          that.setData({
         'cells[0][0].url':res.tempFiles[0].tempFilePath ,
          });
        }
      })
},
editName: function(){
    var that=this;
    wx.showModal({
        title: '昵称修改',
        editable:true,
        placeholderText:'请输入昵称',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            if(res.content){
                that.setData({
                    'cells[1][0].text':res.content,
                     });
            }
            console.log(that.data.cells)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})