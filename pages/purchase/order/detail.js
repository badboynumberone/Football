// pages/order/detail.js
import request from '../../../utils/request'
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.id
    var that = this
    request.post('/order/getOrderDetail', {
      id: orderId
    }).then(function (data) {      
      console.log(data)
      app.formatItemSpec(data.itemList)
      that.setData({
        order: data.order,
        refundOrder: data.refundOrder,
        itemList: data.itemList,
        alipayAccount: data.alipayAccount
      })
    }, function (err) {
      console.log(err)
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

  

  copyOrderNo() {
    var that = this
    wx.setClipboardData({
      data: that.data.order.orderNo,
      success(res) {
      }
    })
  },

  cancelOrder(e) {
    var that = this
    Dialog.confirm({
      title: '确认要取消该订单？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }).then(() => {
      var orderId = that.data.order.id
      console.log('取消订单:' + orderId)
      request.post('/order/cancelOrder', {
        "id": orderId
      }).then(function (data) {
        wx.showToast({
          title: '取消订单成功',
          icon: 'none',
          duration: 1000
        })
        that.data.order.orderStatus = '4'
        that.setData({
          order: that.data.order
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
  },

  pay(e) {
    var that = this
    Dialog.confirm({
      title: '确定要支付？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认支付'
    }).then(() => {
      var orderId = that.data.order.id
      var orderFee = that.data.order.orderFee
      var paymentMethod = that.data.order.paymentMethod
      var alipayAccount = that.data.alipayAccount
      console.log('支付:' + orderId)
      if (paymentMethod === '1') {
        // 线上支付
        request.post('/wxpay/createPayRequest', {
          "orderId": orderId
        }).then(function (data) {
          console.log(data)
          var _data = JSON.parse(data)
          wx.requestPayment({
            timeStamp: _data.timeStamp,
            nonceStr: _data.nonceStr,
            package: _data.package,
            signType: _data.signType,
            paySign: _data.paySign,
            success(res) {
              wx.showToast({
                title: '订单支付成功',
                icon: 'none',
                duration: 1000
              })
              that.data.order.orderStatus = '1'
              that.setData({
                order: that.data.order
              })
            },
            fail(res) {

            }
          })
        }, function (err) {
          wx.showToast({
            title: err.errmsg,
            icon: 'none',
            duration: 1000
          })
        })
      } else if (paymentMethod === '2') {
        // 线下支付
        wx.navigateTo({
          url: '/pages/purchase/order/payment?orderId=' + orderId + '&orderFee=' + orderFee + '&alipayAccount=' + alipayAccount
        })
      } 
    }).catch(() => {

    })
  },

  goRefundApply(e) {
    var orderId = this.data.order.id
    var refundId = this.data.refundOrder.id
    var orderStatus = this.data.order.orderStatus
    var refundStatus = this.data.refundOrder.refundStatus
    if (refundId && orderStatus === '1' && refundStatus !== '6') {
      wx.navigateTo({
        url: '/pages/purchase/refund/detail?id=' + refundId
      })
    } else if (refundId && orderStatus === '3' && refundStatus !== '6') {
      wx.navigateTo({
        url: '/pages/purchase/refund/detail?id=' + refundId
      })
    } else {
      wx.navigateTo({
        url: '/pages/purchase/refund/apply?orderId=' + orderId
      })
    }
  },

  goRefundDetail() {
    var refundOrderId = that.data.refundOrder.id
    wx.navigateTo({
      url: '/pages/purchase/refund/detail?id=' + refundOrderId
    })
  },

  goLogistics(e) {
    var orderId = e.currentTarget.dataset.orderId
    wx.navigateTo({
      url: '/pages/purchase/order/logistics?id=' + orderId,
    })
  },

  confirmReceipt(e) {
    var that = this
    Dialog.confirm({
      title: '确定要确认收货？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认收货'
    }).then(() => {
      var orderId = that.data.order.id
      console.log('确认收货:' + orderId)
      request.post('/order/confirmReceipt', {
        "id": orderId
      }).then(function (data) {
        wx.showToast({
          title: '确认收货成功',
          icon: 'none',
          duration: 1000
        })
        that.data.order.orderStatus = '3'
        that.setData({
          order: that.data.order
        })
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        prevPage.updateOrderStatus(orderId, '3')
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
    }).catch(() => {

    })
  }
})