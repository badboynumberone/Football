// pages/refund/detail.js
import request from '../../../utils/request'
import util from '../../../utils/util'
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    credentialImageArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var refundId = options.id
    var that = this
    request.post('/refundOrder/getRefundOrderDetail', {
      id: refundId
    }).then(function (data) {
      console.log(data)
      data.refundOrder.createTime = util.formatTimeStamp(data.refundOrder.createTime)
      var credentialImage = data.refundOrder.credentialImage
      var credentialImageArray = []
      if (credentialImage) {
        credentialImageArray = credentialImage.split(',')
      }
      app.formatItemSpec(data.itemList)
      that.setData({
        order: data.order,
        refundOrder: data.refundOrder,
        itemList: data.itemList,
        credentialImageArray: credentialImageArray
      })
    }, function (err) {
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

  },

  goOrderDetail() {
    wx.navigateTo({
      url: '/pages/order/detail?id=' + this.data.order.id,
    })
  },

  previewImage(e) {
    var current = this.data.imageBaseUrl + e.currentTarget.dataset.imgSrc
    var credentialImageArray = this.data.credentialImageArray
    var urls = new Array()
    for (var i = 0; i < credentialImageArray.length; i++) {
      urls.push(this.data.imageBaseUrl + credentialImageArray[i])
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  goLogistics() {
    var refundOrderId = this.data.refundOrder.id
    wx.navigateTo({
      url: '/pages/refund/logistics?refundOrderId=' + refundOrderId,
    })
  },

  cancelRefundOrder() {
    var that = this
    Dialog.confirm({
      title: '取消退款申请',
      message: '撤销退款申请后，本次退款申请将关闭，如果后续仍有问题，您可继续发起退款申请。',
      cancelButtonText: '取消',
      confirmButtonText: '关闭退款'
    }).then(() => {
      var refundOrderId = that.data.refundOrder.id
      console.log('取消退单申请:' + refundOrderId)
      request.post('/refundOrder/cancelRefundOrder', {
        "id": refundOrderId
      }).then(function (data) {
        wx.showToast({
          title: '取消退款申请成功',
          icon: 'none',
          duration: 1000
        })
        that.data.refundOrder.refundStatus = '6'
        that.setData({
          refundOrder: that.data.refundOrder
        })
      }, function (err) {
        wx.showToast({
          title: err.errmsg,
          icon: 'none',
          duration: 1000
        })
      })
    }).catch(() => {

    })
  }
})