// pages/order/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    orderFee: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      orderFee: options.orderFee
    })
  },
  //去订单页面
  goOrderDetail() {
    wx.navigateTo({
      url: '/pages/purchase/order/detail?id=' + this.data.orderId,
    })
  }
})