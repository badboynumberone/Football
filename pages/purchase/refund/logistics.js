// pages/refund/logistics.js
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
import request from '../../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    refundOrderId: null,
    logisticsCompanyId: '',
    logisticsCompanyName: '',
    logisticsCompanyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      refundOrderId: options.refundOrderId
    })
    var that = this
    request.post('/logisticsCompany/getAllLogisticsCompanyList').then(function (data) {
      that.setData({
        logisticsCompanyList: data
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

  showLogisticsCompany() {
    this.setData({
      show: true
    })
  },

  hideLogisticsCompany() {
    this.setData({
      show: false
    })
  },

  onSelectLogisticsCompany(e) {
    this.setData({
      show: false,
      logisticsCompanyId: e.target.dataset.item.id,
      logisticsCompanyName: e.target.dataset.item.name
    })
  },

  onInput(e) {
    var fieldName = e.target.dataset.fieldName
    this.data[fieldName] = e.detail.value
    this.setData(this.data)
  },

  saveLogistics() {
    var that = this
    Dialog.confirm({
      title: '确定要保存物流信息？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '保存'
    }).then(() => {
      console.log('保存物流信息')
      request.post('/refundOrder/saveLogistics', {
        id: that.data.refundOrderId,
        logisticsCompanyId: that.data.logisticsCompanyId,
        trackingNumber: that.data.trackingNumber
      }).then(function (data) {
        wx.showToast({
          title: '保存物流信息成功',
          icon: 'none',
          duration: 1000
        })
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        if (prevPage.route === 'pages/refund/list') {
          prevPage.updateRefundOrderStatus(that.data.refundOrderId, '2')
          wx.navigateBack({
            delta: 1
          })
        } else if (prevPage.route === 'pages/refund/detail') {
          prevPage = pages[pages.length - 3]
          prevPage.updateRefundOrderStatus(that.data.refundOrderId, '2')
          wx.navigateBack({
            delta: 2
          })
        }
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