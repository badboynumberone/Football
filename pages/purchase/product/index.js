// pages/product/index.js
import request from '../../../utils/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    pageNo: 1,
    pageSize: 10,
    productList: [],
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMore: false,
    isSearch: false,
    searchValue: '',
    categoryId: '',
    brandId: '',
    multipleSort: '1',
    priceSort: '0',
    saleSort: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isSearch: options.isSearch === 'true' ? true : false,
      searchValue: options.searchValue ? options.searchValue : '',
      categoryId: options.categoryId ? options.categoryId : '',
      brandId: options.brandId ? options.brandId : ''
    })
    wx.startPullDownRefresh()
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
    if (this.data.isRefreshing || this.data.isLoadingMore) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    var that = this;
    that.data.pageNo = 1;
    var url = ''
    var options = {
      pageNo: this.data.pageNo,
      pageSize: this.data.pageSize,
      multipleSort: this.data.multipleSort,
      priceSort: this.data.priceSort,
      saleSort: this.data.saleSort
    }
    if (this.data.isSearch) {
      url = '/product/searchProduct'
      options.productName = this.data.searchValue
    } else {
      url = '/product/getProductList'
      options.categoryId = this.data.categoryId
      options.brandId = this.data.brandId
    }
    request.post(url, options).then(function (data) {
      if (data.length < that.data.pageSize) {
        that.setData({
          "hasMoreData": false,
          isRefreshing: false
        })
      }
      that.setData({
        "productList": data
      })
      wx.stopPullDownRefresh();
      that.setData({
        isRefreshing: false
      })
    }, function (err) {
      console.log(err);
      wx.stopPullDownRefresh();
      that.setData({
        isRefreshing: false
      })
    })
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
      console.log('没有更多商品啦')
      return;
    }
    var url = null
    var options = {
      pageNo: this.data.pageNo + 1,
      pageSize: this.data.pageSize,
      multipleSort: this.data.multipleSort,
      priceSort: this.data.priceSort,
      saleSort: this.data.saleSort
    }
    if (this.data.isSearch) {
      url = '/product/searchProduct'
      options.productName = this.data.searchValue
    } else {
      url = '/product/getProductList'
      options.categoryId = this.data.categoryId
      options.brandId = this.data.brandId
    }
    request.post(url, options).then(function (data) {
      if (data.length < that.data.pageSize) {
        that.setData({
          "hasMoreData": false
        })
      }
      if (data.length > 0) {
        that.setData({
          "pageNo": that.data.pageNo + 1,
          "productList": that.data.productList.concat(data)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },

  toProductDetail:function(e){    
    var id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/product/detail?id=' + id
    })
  },

  refresh(e) {
    var sort = e.currentTarget.dataset.sort
    var multipleSort = '0'
    var priceSort = '0'
    var saleSort = '0'
    if (sort === 'multiple') {
      multipleSort = '1'
    } else if (sort === 'price') {
      if (this.data.priceSort === '1') {
        priceSort = '2'
      } else {
        priceSort = '1'
      }
    } else if (sort === 'sale') {
      saleSort = '1'
    }
    this.setData({
      multipleSort: multipleSort,
      priceSort: priceSort,
      saleSort: saleSort
    })
    wx.startPullDownRefresh()
  },

  onSearch: function (e) {
    var searchValue = e.detail
    if (this.data.isSearch) {
      this.setData({
        searchValue: searchValue
      })
      wx.startPullDownRefresh()
    }
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})