// components/cmp1001/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    templateData: Object
  },

  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log('1001模板已加载')
      this.refresh()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    searchValue: '',
    indicatorDots: true,
    indicatorColor: '#ccc',
    indicatorActiveColor: '#fff',
    autoplay: true,
    interval: 5000,
    duration: 1000,
    productHeight: wx.getSystemInfoSync().windowWidth / 2 - 20
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refresh() {
      var pageData = JSON.parse(this.properties.templateData.content)
      
      this.setData({
        pageData: pageData
      })
    },
    onSearch: function (e) {
      var searchValue = e.detail
      if (searchValue) {
        wx.navigateTo({
          url: '/pages/purchase/product/index?isSearch=true&searchValue=' + searchValue
        })
      }
    },
    itemAction: function (e) {
      // 1:页面 2:商品 3:分类 4:品牌 5:我的订单 6:购物车 7:个人中心
      var item = e.currentTarget.dataset.item
      if (item.targetType === '1') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/purchase/page/index?id=' + item.targetContent
          })
        }        
      } else if (item.targetType === '2') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/purchase/product/detail?id=' + item.targetContent
          })
        }        
      } else if (item.targetType === '3') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/purchase/product/index?categoryId=' + item.targetContent
          })
        }        
      } else if (item.targetType === '4') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/purchase/product/index?brandId=' + item.targetContent
          })
        }        
      } else if (item.targetType === '5') {
        wx.navigateTo({
          url: '/pages/purchase/order/list'
        })
      } else if (item.targetType === '6') {
        wx.switchTab({
          url: '/pages/purchase/cart/index'
        })
      } else if (item.targetType === '7') {
        wx.switchTab({
          url: '/pages/purchase/mine/index'
        })
      } else {
        if (item.id) {
          wx.navigateTo({
            url: '/pages/purchase/product/detail?id=' + item.id
          })
        }
      }
    }
  }
})
