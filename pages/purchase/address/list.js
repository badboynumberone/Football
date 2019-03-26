// pages/address/list.js
import request from '../../../utils/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    fromOrder: false,//判断是否是从订单页面进入的
    selected: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //如果是从订单页面进入的则设置fromOrder为true
    if (options.fromOrder === 'true') {
      this.setData({
        fromOrder: true
      })
    }
    var that = this
    //请求获取用户地址列表
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
  //新增地址
  goDetail(e) {
    var itemId = e.target.dataset.itemId
    // 如果没有地址就把这个地址的id设置成o
    if (!itemId) {
      itemId = '0'
    }
    //跳转到地址详情页
    wx.navigateTo({
      url: '/pages/purchase/address/detail?fromOrder=' + this.data.fromOrder + '&itemId=' + itemId
    })
  },
  //当默认地址发生改变的时候
  onAddressChange(e) {
    console.log(e)
    this.setData({
      selected: e.detail
    })
    var address = null
    //遍历所有地址判断是否是默认地址如果是则把默认地址存到globalData中去
    for (var i = 0; i < this.data.addressList.length; i++) {
      if (e.detail === this.data.addressList[i].id) {
        address = this.data.addressList[i]
        break
      }
    }
    //发送请求告诉服务器设置的后台默认地址的id
    request.post('/address/setDefaultAddress', {
      id: address.id
    }).then(function (data) {
      console.log("设置默认地址成功")
      app.globalData.address = address
      wx.navigateBack({
        delta: 1
      })
      console.log(app.globalData.address)
    }, function (err) {
      wx.showToast({
        title: err.errmsg,
        icon: 'none',
        duration: 1000
      })
    })    
  }
})