//index.js
//获取应用实例
import request from '../../../utils/request'
const app = getApp()

Page({
  data: {
    templateCode: '',
    templateData: null,
    isRefreshing: false
  },
  onLoad: function () {
    var that = this
    request.post('/shopPage/getShopHomePage').then(function (data) {
      // console.log(data)
      that.setData({
        templateCode: data.templateCode,
        templateData: data
      })
    }, function (err) {
    });
  },

  onPullDownRefresh: function () {
    if (this.data.isRefreshing) {
      return
    }
    this.setData({
      isRefreshing: true
    })
    var that = this;
    that.data.pageNo = 1;
    request.post('/shopPage/getShopHomePage').then(function (data) {
      wx.stopPullDownRefresh();
      that.setData({
        isRefreshing: false,
        templateCode: data.templateCode,
        templateData: data
      })
      that.selectComponent("#comp" + data.templateCode).refresh()
    }, function (err) {
      console.log(err);
      wx.stopPullDownRefresh();
      that.setData({
        isRefreshing: false
      })
    })
  }
})
