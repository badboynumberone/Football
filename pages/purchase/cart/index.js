// pages/cart/index.js
import request from '../../../utils/request'
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    isSelectAll: false,
    selectedSkuIdList: [],
    isEdit: false,
    hasLoaded: false 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setStorageSync('refreshCart', false)
    request.post('/cart/getItemList').then(function (data) {
      console.log(data)
      app.formatItemSpec(data.validItemList)
      app.formatItemSpec(data.invalidItemList)
      that.setData({
        hasLoaded: true,
        validItemList: data.validItemList,
        invalidItemList: data.invalidItemList
      })
      var selectAllCheckbox = that.selectComponent('#selectAllCheckbox')
      if (selectAllCheckbox) {
        selectAllCheckbox.toggle()
      }
    }, function (err) {
      that.setData({
        hasLoaded: true
      })
    });
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
    if (wx.getStorageSync('refreshCart') === true) {
      console.log('刷新购物车')
      var that = this
      request.post('/cart/getItemList').then(function (data) {
        console.log(data)
        var isSelectAll = false
        var oldSelectedSkuIdList = that.data.selectedSkuIdList
        var validItemList = data.validItemList
        var selectedSkuIdList = new Array()
        for (var i = 0; i < oldSelectedSkuIdList.length; i++) {
          var selectedSkuId = oldSelectedSkuIdList[i]
          for (var j = 0; j < validItemList.length; j++) {
            var validItem = validItemList[j]
            if (selectedSkuId === validItem.skuId) {
              selectedSkuIdList.push(selectedSkuId)
              break
            }
          }
        }
        if (selectedSkuIdList.length === validItemList.length) {
          isSelectAll = true
        }
        that.setData({
          validItemList: data.validItemList,
          invalidItemList: data.invalidItemList
        })
        that.setData({        
          isSelectAll: isSelectAll,
          selectedSkuIdList: selectedSkuIdList
        })
        that.calculatePrice()
        wx.setStorageSync('refreshCart', false)
      }, function (err) {
      })
    }
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

  toProductDetail:function(e){
    var sku = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/product/detail?id=' + sku.productId
    })
  },

  calculatePrice() {
    console.log('计算购物车总价')
    var selectedSkuIdList = this.data.selectedSkuIdList    
    var validItemList = this.data.validItemList
    var selectedSkuList = new Array()
    for (var i = 0; i < selectedSkuIdList.length; i++) {
      var selectedSkuId = selectedSkuIdList[i]
      for (var j = 0; j < validItemList.length; j++) {
        var validItem = validItemList[j]  
        if (selectedSkuId === validItem.skuId) {          
          selectedSkuList.push(validItem)
          break
        }
      }
    }
    var totalPrice = 0
    if (selectedSkuList) {
      for (var i = 0; i < selectedSkuList.length; i++){
        var selectedSku = selectedSkuList[i]
        totalPrice += selectedSku.price * selectedSku.num
      }
    }
    this.setData({
      totalPrice: totalPrice / 100,
      selectedSkuList: selectedSkuList
    })
  },

  goSubmit() {
    console.log('购物车结算')
    var selectedSkuList = this.data.selectedSkuList
    console.log(selectedSkuList)
    if (!selectedSkuList || selectedSkuList.length == 0) {
      wx.showToast({
        title: '请选择商品再结算',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var skuList = new Array()
    for (var i = 0; i < selectedSkuList.length; i++) {
      var sku = {
        skuId: selectedSkuList[i].skuId,
        num: selectedSkuList[i].num
      }
      skuList.push(sku)
    }
    wx.navigateTo({
      url: '/pages/purchase/order/submit?skuListJson=' + JSON.stringify(skuList)
    })
  },

  onSkuNumChange(e) {
    console.log(e)
    var sku = e.target.dataset.item
    var num = e.detail
    console.log(sku)
    console.log(num)
    request.post('/cart/updateItemNum', {
      skuId: sku.skuId,
      num: num
    }).then(function (data) {
    }, function (err) {
    })
    var validItemList = this.data.validItemList
    if (validItemList) {
      for (var i = 0; i < validItemList.length; i++) {
        var validItem = validItemList[i]
        if (validItem.skuId === sku.skuId) {
          validItem.num = num
          break
        }
      }
    }
    this.calculatePrice()
  },

  onSkuNumOverLimit(e) {
    if (e.detail === 'minus') {
      wx.showToast({
        title: '最少保留一件商品',
        icon: 'none',
        duration: 1000
      })
    } else if (e.detail === 'plus') {
      wx.showToast({
        title: '就这么几件啦！',
        icon: 'none',
        duration: 1000
      })
    }
  },

  onSkuChange(e) {
    console.log(e.detail)
    var validItemList = this.data.validItemList
    var isSelectAll = false
    if (e.detail.length === validItemList.length) {
      isSelectAll = true
    }
    this.setData({
      selectedSkuIdList: e.detail,
      isSelectAll: isSelectAll
    })
    this.calculatePrice()
  },

  onAllSkuChange(e) {
    var isSelectAll = e.detail
    console.log('是否选择所有SKU:' + isSelectAll)
    var selectedSkuIdList = new Array()
    if (isSelectAll) {
      var validItemList = this.data.validItemList
      if (validItemList) {
        for (var i = 0; i < validItemList.length; i++) {
          var validItem = validItemList[i]
          selectedSkuIdList.push(validItem.skuId)
        }
      }
    } else {
      selectedSkuIdList = []
    }
    this.setData({
      isSelectAll: isSelectAll,
      selectedSkuIdList: selectedSkuIdList
    })
    this.calculatePrice()
  },

  onSkuDelete(e) {
    var that = this
    const { position, instance } = e.detail
    var sku = instance.dataset.item
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          title: '确定删除选中的商品？',
          message: ' ',
          cancelButtonText: '取消',
          confirmButtonText: '现在删除'
        }).then(() => {
          instance.close();
          request.post('/cart/deleteItem', {
            id: sku.skuId
          }).then(function (data) {
            that.removeSku(sku.skuId)
            that.calculatePrice()
          }, function (err) {
          })
        });
        break;
    }
  },

  removeSku(skuId) {
    console.log('移除列表SKU')
    var selectedSkuIdList = this.data.selectedSkuIdList
    var delIndex = null
    for (var i = 0; i < selectedSkuIdList.length; i++) {
      if (skuId == selectedSkuIdList[i]) {
        delIndex = i
        break
      }
    }
    if (delIndex != null) {
      selectedSkuIdList.splice(delIndex, 1)
    }
    delIndex = null
    var validItemList = this.data.validItemList
    for (var i = 0; i < validItemList.length; i++) {
      if (skuId == validItemList[i].skuId) {
        delIndex = i
        break
      }
    }
    if (delIndex != null) {
      validItemList.splice(delIndex, 1)
      this.setData({
        validItemList: validItemList
      })
      var isSelectAll = false
      if (selectedSkuIdList.length === validItemList.length) {
        isSelectAll = true
      }
      this.setData({
        selectedSkuIdList: selectedSkuIdList,
        isSelectAll: isSelectAll
      })
    }    
  },

  deleteInvalidItem() {
    var that = this
    Dialog.confirm({
      title: '确定清除所有失效商品？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '删除'
    }).then(() => {
      request.post('/cart/deleteInvalidItem').then(function (data) {
        that.setData({
          invalidItemList: []
        })
      }, function (err) {
      })
    });
  },

  goHome() {
    wx.switchTab({
      url: '/pages/purchase/index/index',
    })
  },

  edit() {
    this.setData({
      isEdit: true
    })
  },

  finish() {
    this.setData({
      isEdit: false
    })
  },

  remove() {
    var that = this
    Dialog.confirm({
      title: '确定删除选中的商品？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '现在删除'
    }).then(() => {
      var selectedSkuList = that.data.selectedSkuList
      var skuIdList = new Array()
      if (selectedSkuList) {
        for (var i = 0; i < selectedSkuList.length; i++) {
          skuIdList.push(selectedSkuList[i].skuId)
        }
      }
      console.log('批量删除SKU:' + skuIdList)
      if (skuIdList.length > 0) {
        request.post('/cart/batchDeleteItem', {
          ids: skuIdList
        }).then(function (data) {
          for (var i = 0; i < selectedSkuList.length; i++) {
            that.removeSku(selectedSkuList[i].skuId)
          }
          that.calculatePrice()
        }, function (err) {
        })
      }
    })
  }
})