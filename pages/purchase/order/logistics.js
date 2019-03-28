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
  }
})