// pages/product/detail.js
import request from '../../../utils/request'
import {checkLogin} from '../../../utils/util';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productId:'',
    imageBaseUrl: app.globalData.imageBaseUrl,
    indicatorDots: true,
    indicatorColor: '#ccc',
    indicatorActiveColor: '#fff',
    swiperHeight: wx.getSystemInfoSync().windowWidth,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    product: null,
    specList: null,
    id: null,
    price: '',
    selectedSpec: {},
    selectedSku: null,
    selectedSkuPrice: '',
    selectedSkuNum: 0,
    remaindSkuNum: 0,
    skuMinNum: 0,
    skuMaxNum: 0,
    show: false,
    addCart: true,
    phone: '',
    cartItemSize: '',
    quantityTip: '',
    hasNetwork: true,
    isValid: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.setData({
      productId:id
    })
    this.init(id)
  },
  onshow(){
    this.init(this.data.productId)
  },
  onShareAppMessage: function () {
    var shareDesc = this.data.product.shareDesc
    if (!shareDesc) {
      shareDesc = this.data.product.name
    }
    return {
      title: shareDesc
    }
  },

  init: function (id) {
    this.setData({
      phone: wx.getStorageSync('phone')
    })
    this.setData({
      id: id
    })
    var that = this
    request.post('/cart/getItemSize').then(function (data) {
      console.log(data)
      var itemSize = parseInt(data.size)
      that.setData({
        cartItemSize: itemSize > 0 ? itemSize : ''
      })
    }, function (err) {
    });
    request.post('/product/getProductDetail', {
      id: id
    }).then(function (data) {
      var specObj = null;
      if (data.spec) {
        try {
          specObj = JSON.parse(data.spec)
        } catch (err) {
          console.log(err.message)
        }
      }
      var specList = new Array()
      for (var key in specObj) {
        specList.push({
          name: key,
          valueList: specObj[key]
        })
      }
      // console.log(specList)
      // console.log(data.skuList)
      var price = ''
      var minPrice = parseInt(data.skuMinPrice)
      var maxPrice = parseInt(data.skuMaxPrice)
      if (minPrice < maxPrice) {
        price = minPrice / 100 + ' - ' + maxPrice / 100
      } else {
        price = minPrice / 100
      }
      var selectedSkuNum = 0
      var remaindSkuNum = 0
      var skuMinNum = 0
      var skuMaxNum = 0
      var selectedSku = null
      var quantityTip = ''
      if (data.quantity > 0) {
        if (data.quantity <= 5) {
          quantityTip = '当前商品库存仅剩' + data.quantity + '件'
        }
        if (specList.length > 0) {
          // 有规格商品
          remaindSkuNum = data.quantity
        } else {
          // 无规格商品          
          skuMinNum = 1
          skuMaxNum = data.quantity
          selectedSkuNum = 1
          remaindSkuNum = data.quantity - selectedSkuNum
          selectedSku = data.skuList[0]
        }
      } else {
        quantityTip = '当前商品已售罄，可查看更多商品'
      }
      var product = data
      var regex = new RegExp('<img', 'gi');
      product.richText = product.richText.replace(regex, '<img style="max-width: 100%;"')
      that.setData({
        product: product,
        specList: specList,
        price: price,
        selectedSkuPrice: price,
        selectedSkuNum: selectedSkuNum,
        remaindSkuNum: remaindSkuNum,
        skuMinNum: skuMinNum,
        skuMaxNum: skuMaxNum,
        selectedSku: selectedSku,
        quantityTip: quantityTip,
        hasNetwork: true,
        isValid: true        
      })
      if (specList.length === 1) {
        var skuState = {}
        var left = null
        var right = specList[0]
        that.calculateSkuState(skuState, left, right)
        console.log(skuState)
      }
    }, function (err) {
      console.log(err)
      if (err.errcode) {
        that.setData({
          hasNetwork: true,
          isValid: false
        })
      } else {
        that.setData({
          hasNetwork: false
        })
      }
    })
  },

  showAddCart: function(){
    if(!checkLogin(true,false)){
      return;
    }
    this.setData({
      show: true,
      addCart: true
    });
  },

  showBuy: function () {
    if(!checkLogin(true,false)){
      return;
    }
    this.setData({
      show: true,
      addCart: false
    });
  },

  addToCart() {
    console.log('添加到购物车')
    var that = this
    var selectedSku = this.data.selectedSku
    var selectedSkuNum = this.data.selectedSkuNum
    console.log(selectedSku)
    console.log(selectedSkuNum)
    if (!selectedSku) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!selectedSkuNum) {
      wx.showToast({
        title: '至少选择一个商品',
        icon: 'none',
        duration: 1000
      })
      return
    }
    request.post('/cart/addItem',{
      skuId: selectedSku.id,
      num: selectedSkuNum
    }).then(function (data) {
      that.setData({ show: false })
      wx.setStorageSync('refreshCart', true)
      wx.showToast({
        title: '添加购物车成功',
        icon: 'none',
        duration: 1000
      })
      request.post('/cart/getItemSize').then(function (data) {
        var itemSize = parseInt(data.size)
        that.setData({
          cartItemSize: itemSize > 0 ? itemSize : ''
        })
      }, function (err) {
      })
    }, function (err) {
      wx.showToast({
        title: err.errmsg,
        icon: 'none',
        duration: 1000
      })
    })
  },

  onClose() {
    this.setData({ show: false });
  },

  goCart() {
    if(!checkLogin(true,false)){
        return;
    }
    wx.navigateTo({
      url: '/pages/purchase/cart/index'
    })
  },

  goSubmit() {
    console.log('立即购买')
    var selectedSku = this.data.selectedSku
    var selectedSkuNum = this.data.selectedSkuNum
    console.log(selectedSku)
    console.log(selectedSkuNum)
    if (!selectedSku) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (!selectedSkuNum) {
      wx.showToast({
        title: '至少选择一个商品',
        icon: 'none',
        duration: 1000
      })
      return
    }
    if (selectedSkuNum > selectedSku.quantity) {
      wx.showToast({
        title: '该商品库存不足',
        icon: 'none',
        duration: 1000
      })
      return
    }
    var skuList = new Array()
    var sku = {
      skuId: selectedSku.id,
      num: selectedSkuNum
    }
    skuList.push(sku)
    console.log(skuList)
    wx.navigateTo({
      url: '/pages/purchase/order/submit?skuListJson=' + JSON.stringify(skuList)
    })
  },
  
  skuClick(e) {
    var specName = e.target.dataset.specName
    var specValue = e.target.dataset.specValue
    var specValueState = e.target.dataset.specValueState
    if (specValueState === 'disable') {
      return
    }
    if (this.data.selectedSpec[specName] !== specValue) {
      this.data.selectedSpec[specName] = specValue
      // console.log(this.data.selectedSpec)
      // console.log(this.data.specList)
      for (var i = 0; i < this.data.specList.length; i++) {
        if (specName === this.data.specList[i].name) {
          this.data.specList[i].active = specValue
          break
        }
      }
    } else {
      this.data.selectedSpec[specName] = ''
      for (var i = 0; i < this.data.specList.length; i++) {
        if (specName === this.data.specList[i].name) {
          this.data.specList[i].active = ''
          break
        }
      }
    }
    this.setData({
      specList: this.data.specList
    })
    this.syncSkuState()
    this.calculatePrice()
  },

  syncSkuState() {
    var skuState = {}
    var specList = this.data.specList
    if (specList.length === 1) {
      if (!specList[0].active) {
        this.setData({
          remaindSkuNum: this.data.product.quantity
        })
      }
    } else if (specList.length === 2) {
      if (specList[0].active) {
        var left = new Array()
        left.push({
          name: specList[0].name,
          value: specList[0].active
        })
        var right = specList[1]
        this.calculateSkuState(skuState, left, right)
      }
      if (specList[1].active) {
        var left = new Array()
        left.push({
          name: specList[1].name,
          value: specList[1].active
        })
        var right = specList[0]
        this.calculateSkuState(skuState, left, right)
      }
      if (!specList[0].active && !specList[1].active) {
        this.setData({
          skuState: null
        })
      }
      if (!specList[0].active || !specList[1].active) {
        this.setData({
          remaindSkuNum: this.data.product.quantity
        })
      }
      console.log(skuState)
    } else if (specList.length === 3) {
      if (specList[0].active && specList[1].active) {
        var left = new Array()
        left.push({
          name: specList[0].name,
          value: specList[0].active
        })
        left.push({
          name: specList[1].name,
          value: specList[1].active
        })
        var right = specList[2]
        this.calculateSkuState(skuState, left, right)
      }
      if (specList[1].active && specList[2].active) {
        var left = new Array()
        left.push({
          name: specList[1].name,
          value: specList[1].active
        })
        left.push({
          name: specList[2].name,
          value: specList[2].active
        })
        var right = specList[0]
        this.calculateSkuState(skuState, left, right)
      }
      if (specList[0].active && specList[2].active) {
        var left = new Array()
        left.push({
          name: specList[0].name,
          value: specList[0].active
        })
        left.push({
          name: specList[2].name,
          value: specList[2].active
        })
        var right = specList[1]
        this.calculateSkuState(skuState, left, right)
      }
      if ((!specList[0].active && !specList[1].active) || (!specList[1].active && !specList[2].active) || (!specList[0].active && !specList[2].active)) {
        this.setData({
          skuState: null,
          remaindSkuNum: this.data.product.quantity
        })
      }
      console.log(skuState)
    }
  },

  calculateSkuState(skuState, left, right) {
    var skuList = this.data.product.skuList
    var stateList = new Array()
    for (var i = 0; i < right.valueList.length; i++) {
      var specDetail = {}
      if (left) {
        for (var k = 0; k < left.length; k++) {
          specDetail[left[k].name] = left[k].value
          specDetail[right.name] = right.valueList[i]
        }
      } else {
        specDetail[right.name] = right.valueList[i]
      }
      // console.log(specDetail)
      var sku = null
      for (var j = 0; j < skuList.length; j++) {
        // console.log(skuList[j])
        var specObj = null
        try {
          specObj = JSON.parse(skuList[j].specDetail)
          var find = true
          for (var key in specObj) {
            var value = specDetail[key]
            if (value !== specObj[key]) {
              find = false
              break
            }
          }
          if (find) {
            sku = skuList[j]
            break
          }
        } catch (err) {
          console.log(err.message)
        }
      }
      stateList.push(sku.quantity > 0 ? '' : 'disable')
    }
    skuState[right.name] = stateList
    this.setData({
      skuState: skuState
    })
  },

  calculatePrice() {
    // console.log('calculatePrice')
    var selectedSku = {}
    var skuList = this.data.product.skuList
    var selectedSpec = this.data.selectedSpec
    for (var i = 0; i < skuList.length; i++) {
      // console.log(skuList[i])
      var specObj = null
      try {
        specObj = JSON.parse(skuList[i].specDetail)
        var find = true
        for (var key in specObj) {
          var value = selectedSpec[key]
          if (value !== specObj[key]) {
            find = false
            break
          }
        }
        if (find) {
          selectedSku = skuList[i]
          break
        }
      } catch (err) {
        console.log(err.message)
      }
    }
    // console.log(selectedSku)
    var selectedSkuPrice = this.data.selectedSkuPrice
    var selectedSkuNum = this.data.selectedSkuNum
    var remaindSkuNum = this.data.remaindSkuNum
    var skuMinNum = this.data.skuMinNum
    var skuMaxNum = this.data.skuMaxNum
    if (selectedSku) {
      if (selectedSku.price) {
        selectedSkuPrice = selectedSku.price / 100
      }
      // console.log(selectedSkuPrice)
      selectedSkuNum = 0
      skuMinNum = 0
      skuMaxNum = 0      
      if (selectedSku.quantity) {        
        skuMinNum = 1
        skuMaxNum = selectedSku.quantity
        selectedSkuNum = 1
        remaindSkuNum = selectedSku.quantity - selectedSkuNum
        remaindSkuNum = remaindSkuNum >= 0 ? remaindSkuNum : 0 
      }
    }
    // console.log(skuMinNum + ':' + skuMaxNum)
    this.setData({
      selectedSku: selectedSku,
      selectedSkuPrice: selectedSkuPrice,
      selectedSkuNum: selectedSkuNum,
      remaindSkuNum: remaindSkuNum,
      skuMinNum: skuMinNum,
      skuMaxNum: skuMaxNum
    })
  },

  onSkuNumChange(event) {
    var selectedSkuNum = event.detail    
    var selectedSku = this.data.selectedSku
    var remaindSkuNum = this.data.remaindSkuNum
    if (selectedSku) {
      if (selectedSku.quantity) {
        remaindSkuNum = selectedSku.quantity - selectedSkuNum
      }
    }
    remaindSkuNum = remaindSkuNum < 0 ? 0 : remaindSkuNum
    this.setData({
      selectedSkuNum: selectedSkuNum,
      remaindSkuNum: remaindSkuNum
    })
  },

  

  goHome() {
    wx.switchTab({
      url: '/pages/purchase/index/index',
    })
  },

  goProductList() {
    wx.navigateTo({
      url: '/pages/purchase/index',
    })
  },

  refresh() {
    this.init(this.data.id)
  }
})