Page({
  data: {
    Goods_Num:0,
  },
  onLoad: function (options) {
  },
  /*购物车数字加减器 */
  //数字加1
  addNum: function() {
    let num=this.data.Goods_Num
    num++
    this.setData({
      Goods_Num:num
    })
  },
  //数字减1
  minusNum: function() {
    let num=this.data.Goods_Num
    if(num>=1){
      num--
    }
    else{
      wx.showToast({
        title: '不能再减少了哟！',
        icon:'none',
        duration:1500
      })
    }
    this.setData({
      Goods_Num:num
    })
  }
})
