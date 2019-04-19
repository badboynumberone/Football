// pages/refund/logistics.js
// 退货填写物流信息
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
    //首先获取退货id
    this.setData({
      refundOrderId: options.refundOrderId
    })
    var that = this;
    //请求获取快递公司列表
    request.post('/logisticsCompany/getAllLogisticsCompanyList').then(function (data) {
      console.log(data)
      that.setData({
        logisticsCompanyList: data
      })
    }, function (err) {
    })
  },
  //显示所有快递公司
  showLogisticsCompany() {
    this.setData({
      show: true
    })
  },
  //隐藏所有快递公司列表
  hideLogisticsCompany() {
    this.setData({
      show: false
    })
  },

  //当选择快递公司后
  onSelectLogisticsCompany(e) {
    this.setData({
      show: false,
      logisticsCompanyId: e.target.dataset.item.id,
      logisticsCompanyName: e.target.dataset.item.name
    })
  },
  //当输入快递单号的时候实现数据绑定
  onInput(e) {
    var fieldName = e.target.dataset.fieldName
    this.data[fieldName] = e.detail.value
    this.setData(this.data)
  },
  //保存物流
  saveLogistics() {
    var that = this
    Dialog.confirm({
      title: '确定要提交物流信息？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确定'
    }).then(() => {
      console.log('保存物流信息')
      //发送退货物流信息接口
      //确认保存物流信息之后逻辑发送退货信息给后台,发送成功后显示保存成功，获取当前页面
      request.post('/refundOrder/saveLogistics', {
        id: that.data.refundOrderId,
        logisticsCompanyId: that.data.logisticsCompanyId,
        trackingNumber: that.data.trackingNumber,
        returnTel:that.data.phoneNumber
      }).then(function (data) {
        wx.showToast({
          title: '提交成功',
          icon: 'none',
          duration: 1000
        })
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        if (prevPage.route === 'pages/purchase/refund/list') {
          prevPage.updateRefundOrderStatus(that.data.refundOrderId, '2')
          wx.navigateBack({
            delta: 1
          })
        } else if (prevPage.route === 'pages/purchase/refund/detail') {
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