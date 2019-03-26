// pages/order/payment.js
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
import request from '../../../utils/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    orderFee: '',
    alipayAccount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      orderFee: options.orderFee,
      alipayAccount: options.alipayAccount
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

  copy() {
    var that = this
    wx.setClipboardData({
      data: that.data.alipayAccount,
      success(res) {
      }
    })
  },

  pay() {
    console.log('确认付款')
    var that = this
    Dialog.confirm({
      title: '是否已线下付款？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认付款'
    }).then(() => {
      request.post('/order/offlinePay', {
        id: this.data.orderId
      }).then(function (data) {
        console.log(data)
        wx.navigateTo({
          url: '/pages/purchase/order/list?orderStatus=0'
        })
      }, function (err) {
      })
    }).catch(() => {

    })
  },

  goDetail() {
    wx.navigateTo({
      url: '/pages/purchase/order/detail?id=' + this.data.orderId
    })
  }
})