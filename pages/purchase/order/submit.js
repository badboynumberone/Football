// pages/order/submit.js
import request from '../../../utils/request'
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    skuList: null,
    buyerRemark: '',
    preOrderData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取传过来用户购买商品的信息
    var skuList = JSON.parse(options.skuListJson)
    var that = this
    request.post('/order/getPreOrder', skuList).then(function (data) {
      console.log(data)
      app.formatItemSpec(data.validItemList)
      app.formatItemSpec(data.invalidItemList)
      that.setData({
        skuList: skuList,
        preOrderData: data
      })
      //从全局获取默认的地址
      var address = app.globalData.address
      if (address) {
        that.data.preOrderData.receiverName = address.name;
        that.data.preOrderData.receiverPhone = address.phone;        
        var receiverAddress = '';
        if (address.provinceCode === '110000' || address.provinceCode === '120000' || address.provinceCode === '310000' || address.provinceCode === '500000') {
          receiverAddress = address.provinceName + address.areaName + address.detail;
        } else {
          receiverAddress = address.provinceName + address.cityName + address.areaName + address.detail;
        }
        that.data.preOrderData.receiverAddress = receiverAddress;
        that.setData({
          preOrderData: that.data.preOrderData
        })
      }
    }, function (err) {
      console.log(err)
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData.address)
    var address = app.globalData.address;
    if (address) {
      this.data.preOrderData.receiverName = address.name;
      this.data.preOrderData.receiverPhone = address.phone;
      var receiverAddress = '';
      if (address.provinceCode === '110000' || address.provinceCode === '120000' || address.provinceCode === '310000' || address.provinceCode === '500000') {
        receiverAddress = address.provinceName + address.areaName + address.detail;
      } else {
        receiverAddress = address.provinceName + address.cityName + address.areaName + address.detail;
      }
      this.data.preOrderData.receiverAddress = receiverAddress;
      this.setData({
        preOrderData: this.data.preOrderData
      })
    }
    
  },

  goAddressList() {
    wx.navigateTo({
      url: '/pages/purchase/address/list?fromOrder=true',
    })
  },

  goCart() {
    wx.switchTab({
      url: '/pages/cart/index'
    })
  },

  deleteInvalidItem() {
    console.log(this.data.skuList)
    var skuList = new Array()
    for (var i = 0; i < this.data.skuList.length; i++) {
      var valid = true
      for (var j = 0; j < this.data.preOrderData.invalidItemList.length; j++) {
        if (this.data.skuList[i].skuId === this.data.preOrderData.invalidItemList[j].skuId) {
          valid = false
          break
        }
      }
      if (valid) {
        skuList.push(this.data.skuList[i])
      }
    }
    this.setData({
      skuList: skuList
    })
  },

  onInput(e) {
    var fieldName = e.target.dataset.fieldName
    this.data[fieldName] = e.detail.value
    this.setData(this.data)
  },

  submit() {
    var that = this
    Dialog.confirm({
      title: '确定要提交订单？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '提交'
    }).then(() => {
      console.log('提交订单')
      var receiverName = that.data.preOrderData.receiverName
      var receiverPhone = that.data.preOrderData.receiverPhone
      var receiverAddress = that.data.preOrderData.receiverAddress
      var deliveryType = that.data.preOrderData.deliveryType
      request.post('/order/submitOrder', {
        "receiverName": receiverName,
        "receiverPhone": receiverPhone,
        "receiverAddress": receiverAddress,
        "deliveryType": deliveryType,
        "buyerRemark": that.data.buyerRemark,
        "itemList": that.data.skuList
      }).then(function (data) {
        console.log(data)
        var orderId = data.id
        var orderFee = data.orderFee
        var paymentMethod = data.paymentMethod
        var paymentChannel = data.paymentChannel
        var alipayAccount = data.alipayAccount
        wx.setStorageSync('refreshCart', true)
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
                // wx.showToast({
                //   title: '支付成功',
                //   icon: 'none',
                //   duration: 1000
                // })
                wx.navigateTo({
                  url: '/pages/purchase/order/success?orderId=' + orderId + '&orderFee=' + orderFee
                })
              },
              fail(res) {
                wx.navigateTo({
                  url: '/pages/purchase/order/list'
                })
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