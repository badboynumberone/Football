// pages/address/list.js
import request from '../../../utils/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    fromOrder: false,
    selected: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fromOrder === 'true') {
      this.setData({
        fromOrder: true
      })
    }
    var that = this
    request.post('/address/getAddressList').then(function (data) {
      console.log(data)
      that.setData({
        addressList: data
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

  },

  goDetail(e) {
    var itemId = e.target.dataset.itemId
    if (!itemId) {
      itemId = '0'
    }
    wx.navigateTo({
      url: '/pages/address/detail?fromOrder=' + this.data.fromOrder + '&itemId=' + itemId
    })
  },

  onAddressChange(e) {
    console.log(e)
    this.setData({
      selected: e.detail
    })
    var address = null
    for (var i = 0; i < this.data.addressList.length; i++) {
      if (e.detail === this.data.addressList[i].id) {
        address = this.data.addressList[i]
        break
      }
    }
    request.post('/address/setDefaultAddress', {
      id: address.id
    }).then(function (data) {
      app.globalData.address = address
      wx.navigateBack({
        delta: 1
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