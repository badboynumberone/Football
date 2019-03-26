// pages/order/list.js
import util from '../../../utils/util'
import request from '../../../utils/request'
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    pageNo: 1,
    pageSize: 10,
    orderList: [],
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMore: false,
    active: 0,
    orderStatus: '',
    timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var active = 0
    var orderStatus = options.orderStatus ? options.orderStatus : ''
    if (orderStatus === '0') {
      active = 1
    } else if (orderStatus === '1') {
      active = 2
    } else if (orderStatus === '2') {
      active = 3
    } else if (orderStatus === '3') {
      active = 4
    } else if (orderStatus === '4') {
      active = 5
    }
    this.setData({
      active: active,
      orderStatus: orderStatus
    })
    this.initData();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  initData(){
    if (this.data.isRefreshing || this.data.isLoadingMore) {
      return
    }
    clearInterval(this.data.timer)
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    var that = this;
    that.data.pageNo = 1;
    request.post('/order/getOrderList', {
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      orderStatus: that.data.orderStatus
    }).then(function (data) {
      if (data.length < that.data.pageSize) {
        that.setData({
          "hasMoreData": false,
          isRefreshing: false
        })
      }
      var orderList = data
      if (orderList) {
        for (var i = 0; i < orderList.length; i++) {
          if (orderList[i].leftTime) {
            var leftTime = parseInt(orderList[i].leftTime)            
            if (leftTime > 0) {
              var minutes = util.formatNumber(parseInt(leftTime / 1000 / 60 % 60, 10))
              var seconds = util.formatNumber(parseInt(leftTime / 1000 % 60, 10))
              orderList[i].leftTimeStr = minutes + ":" + seconds
            }
          } else {
            orderList[i].leftTime = ''
            orderList[i].leftTimeStr = ''
          }          
        }
      }
      that.setData({
        orderList: data
      })
      wx.stopPullDownRefresh();
      that.setData({
        isRefreshing: false
      })
      var timer = setInterval(function () {
        var orderList = that.data.orderList
        if (orderList) {
          for (var i = 0; i < orderList.length; i++) {
            if (orderList[i].leftTime) {
              var leftTime = parseInt(orderList[i].leftTime)
              leftTime = leftTime - 1000
              orderList[i].leftTime = leftTime
              if (leftTime > 0) {
                var minutes = util.formatNumber(parseInt(leftTime / 1000 / 60 % 60, 10))
                var seconds = util.formatNumber(parseInt(leftTime / 1000 % 60, 10))
                orderList[i].leftTimeStr = minutes + ":" + seconds
              }
            } else {
              orderList[i].leftTime = ''
              orderList[i].leftTimeStr = ''
            }
          }
        }
        that.setData({
          orderList: orderList
        })
      }, 1000)
      that.setData({
        timer: timer
      })      
    }, function (err) {
      console.log(err);
      wx.stopPullDownRefresh();
      that.setData({
        isRefreshing: false
      })
    })
  },
  onPullDownRefresh: function () {
    this.initData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMore || !this.data.hasMoreData) {
      return
    }
    this.setData({
      isLoadingMore: true
    })
    var that = this;
    if (!that.data.hasMoreData) {
      console.log('没有更多订单啦')
      return;
    }
    request.post('/order/getOrderList', {
      pageNo: that.data.pageNo + 1,
      pageSize: that.data.pageSize,
      orderStatus: that.data.orderStatus
    }).then(function (data) {
      if (data.length < that.data.pageSize) {
        that.setData({
          "hasMoreData": false
        })
      }
      if (data.length > 0) {
        that.setData({
          "pageNo": that.data.pageNo + 1,
          "orderList": that.data.orderList.concat(data)
        })
      }
      that.setData({
        isLoadingMore: false
      })
    }, function (err) {
      console.log(err);
      that.setData({
        isLoadingMore: false
      })
    });
  },

  
  goDetail(e) {
    var orderId = e.currentTarget.dataset.orderId
    wx.navigateTo({
      url: '/pages/order/detail?id=' + orderId,
    })
  },

  goLogistics(e) {
    var orderId = e.currentTarget.dataset.orderId
    wx.navigateTo({
      url: '/pages/order/logistics?id=' + orderId,
    })
  },

  onChange(e) {
    var active = e.detail.index
    var orderStatus = ''
    if (active === 0) {
      orderStatus = ''
    } else if (active === 1) {
      orderStatus = '0'
    } else if (active === 2) {
      orderStatus = '1'
    } else if (active === 3) {
      orderStatus = '2'
    } else if (active === 4) {
      orderStatus = '3'
    } else if (active === 5) {
      orderStatus = '4'
    }
    this.setData({
      active: active,
      orderStatus: orderStatus
    })
    this.initData();
  },

  cancelOrder(e) {
    var that = this
    Dialog.confirm({
      title: '确定要取消该订单？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }).then(() => {
      var orderId = e.target.dataset.orderId
      console.log('取消订单:' + orderId)
      request.post('/order/cancelOrder', {
        "id": orderId
      }).then(function (data) {
        if (that.data.orderStatus != '') {
          that.removeOrder(orderId)
        } else {
          that.updateOrderStatus(orderId, '4')
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
  },

  confirmReceipt(e) {
    var that = this
    Dialog.confirm({
      title: '确定要确认收货？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认收货'
    }).then(() => {
      var orderId = e.target.dataset.orderId
      console.log('确认收货:' + orderId)
      request.post('/order/confirmReceipt', {
        "id": orderId
      }).then(function (data) {
        if (that.data.orderStatus != '') {
          that.removeOrder(orderId)
        } else {
          that.updateOrderStatus(orderId, '3')
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
  },

  pay(e) {
    var that = this
    Dialog.confirm({
      title: '确定要支付？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认支付'
    }).then(() => {
      var order = e.target.dataset.order
      var orderId = order.id
      var orderFee = order.orderFee
      var paymentMethod = order.paymentMethod
      var alipayAccount = order.alipayAccount
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
                title: '支付成功',
                icon: 'none',
                duration: 1000
              })
              if (that.data.orderStatus != '') {
                that.removeOrder(orderId)
              } else {
                that.updateOrderStatus(orderId, '1')
              }
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
          url: '/pages/order/payment?orderId=' + orderId + '&orderFee=' + orderFee + '&alipayAccount=' + alipayAccount
        })
      }
    }).catch(() => {

    })
  },

  updateOrderStatus(orderId, orderStatus) {
    console.log('更新列表订单状态')
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (orderId == this.data.orderList[i].id) {
        this.data.orderList[i].orderStatus = orderStatus        
        break
      }
    }
    this.setData({
      orderList: this.data.orderList
    })
  },

  updateRefundStatus(orderId, refundId, refundStatus) {
    console.log('更新列表订单退款状态')
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (orderId == this.data.orderList[i].id) {
        this.data.orderList[i].refundId = refundId
        this.data.orderList[i].refundStatus = refundStatus
        break
      }
    }
    this.setData({
      orderList: this.data.orderList
    })
  },

  removeOrder(orderId) {
    console.log('移除列表订单')
    var delIndex = null
    for (var i = 0; i < this.data.orderList.length; i++) {
      if (orderId == this.data.orderList[i].id) {
        delIndex = i
        break
      }
    }
    if (delIndex != null) {
      this.data.orderList.splice(delIndex, 1)
      this.setData({
        orderList: this.data.orderList
      })
    }
  },

  goRefundApply(e) {
    var orderId = e.target.dataset.orderId
    var refundId = e.target.dataset.refundId
    var orderStatus = e.target.dataset.orderStatus
    var refundStatus = e.target.dataset.refundStatus
    if (refundId && orderStatus === '1' && refundStatus !== '6') {
      wx.navigateTo({
        url: '/pages/refund/detail?id=' + refundId
      })
    } else if (refundId && orderStatus === '3' && refundStatus !== '6') {
      wx.navigateTo({
        url: '/pages/refund/detail?id=' + refundId
      })
    } else {
      wx.navigateTo({
        url: '/pages/refund/apply?orderId=' + orderId
      })
    }
  },

  goHome() {
    wx.switchTab({
      url: '/pages/purchase/index/index',
    })
  }
})