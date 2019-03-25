// pages/mine/index.js
import request from '../../../utils/request'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    waitingPaymentCount: '',
    waitingShipmentCount: '',
    waitingReceiveCount: '',
    completedCount: '',
    refundCount: '',
    nickname: '',
    headImgUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      nickname: wx.getStorageSync('nickname'),
      headImgUrl: wx.getStorageSync('headImgUrl')
    })
    var that = this
    request.post('/order/getOrderCount').then(function (data) {
      console.log(data)
      that.setData({
        waitingPaymentCount: data.waitingPaymentCount,
        waitingShipmentCount: data.waitingShipmentCount,
        waitingReceiveCount: data.waitingReceiveCount
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
    var that = this
    request.post('/order/getOrderCount').then(function (data) {
      console.log(data)
      that.setData({
        waitingPaymentCount: data.waitingPaymentCount,
        waitingShipmentCount: data.waitingShipmentCount,
        waitingReceiveCount: data.waitingReceiveCount
      })
    }, function (err) {
    })
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

  goOrderList(e) {
    var orderStatus = e.currentTarget.dataset.orderStatus
    wx.navigateTo({
      url: '/pages/order/list?orderStatus=' + e.currentTarget.dataset.orderStatus,
    })
  },

  goRefundOrderList(e) {
    wx.navigateTo({
      url: '/pages/refund/list'
    })
  },

  goAddressList() {
    wx.navigateTo({
      url: '/pages/address/list',
    })
  },

  getUserInfo(e) {
    console.log(e)
    var that = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      var userInfo = e.detail.userInfo
      that.setData({
        nickname: userInfo.nickName,
        headImgUrl: userInfo.avatarUrl
      })
      wx.setStorageSync('nickname', userInfo.nickName)
      wx.setStorageSync('headImgUrl', userInfo.avatarUrl)
      request.post('/customer/bindWechatUserInfo', {
        rawData: e.detail.rawData,
        signature: e.detail.signature,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }).then(function (data) {
        console.log(data)
      }, function (err) {
      })
    }
  }
})