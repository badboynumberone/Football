// pages/order/logistics.js
import request from '../../../utils/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    orderId: '',
    trackingInfo: {},
    steps: [],
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.id
    this.setData({
      orderId: options.id
    })
    var that = this
    request.post('/order/getLogisticsTracking', {
      id: orderId
    }).then(function (data) {
      console.log(data)
      var detailList = data.detailList
      var steps = new Array()
      for (var i = 0; i < detailList.length; i++) {
        var step = {
          text: detailList[i].context,
          desc: detailList[i].time
        }
        steps.push(step)
      }
      that.setData({
        trackingInfo: data,
        steps: steps
      })
    }, function (err) {
      wx.showToast({
        title: err.errmsg,
        icon: 'none',
        duration: 1000
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})