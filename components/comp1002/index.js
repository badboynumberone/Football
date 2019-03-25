// components/cmp1002/index.js
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
      console.log('1002模板已加载')
      this.refresh()
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    show() {
      // 页面被展示
      console.log('1002模板展示')
      this.setData({
        autoplay2: true
      })
    },
    hide() {
      // 页面被隐藏
      console.log('1002模板隐藏')
      this.setData({
        autoplay2: false
      })
    },
    resize(size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    searchValue: '',
    indicatorDots: true,
    indicatorDots2: false,
    indicatorColor: '#ccc',
    indicatorActiveColor: '#fff',
    autoplay: true,
    autoplay2: true,
    interval: 5000,
    duration: 1000,
    swiperCurrent: 0,
    productHeight: wx.getSystemInfoSync().windowWidth / 2 - 20
  },

  /**
   * 组件的方法列表
   */
  methods: {
    refresh() {
      var pageData = JSON.parse(this.properties.templateData.content)
      console.log(pageData)
      var todayListData = new Array()
      for (var i = 0, len = pageData.todayList.data.length; i < len; i += 3) {
        todayListData.push(pageData.todayList.data.slice(i, i + 3));
      }
      console.log(todayListData)
      pageData.todayList.data = todayListData
      this.setData({
        pageData: pageData
      })
    },
    onSearch: function (e) {
      var searchValue = e.detail
      if (searchValue) {
        wx.navigateTo({
          url: '/pages/product/index?isSearch=true&searchValue=' + searchValue
        })
      }      
    },
    itemAction: function (e) {
      // 1:页面 2:商品 3:分类 4:品牌 5:我的订单 6:购物车 7:个人中心
      var item = e.currentTarget.dataset.item
      console.log(item)
      if (item.targetType === '1') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/page/index?id=' + item.targetContent
          })
        }
      } else if (item.targetType === '2') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/product/detail?id=' + item.targetContent
          })
        }
      } else if (item.targetType === '3') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/product/index?categoryId=' + item.targetContent
          })
        }
      } else if (item.targetType === '4') {
        if (item.targetContent) {
          wx.navigateTo({
            url: '/pages/product/index?brandId=' + item.targetContent
          })
        }
      } else if (item.targetType === '5') {
        wx.navigateTo({
          url: '/pages/order/list'
        })
      } else if (item.targetType === '6') {
        wx.switchTab({
          url: '/pages/cart/index'
        })
      } else if (item.targetType === '7') {
        wx.switchTab({
          url: '/pages/mine/index'
        })
      } else {
        if (item.id) {
          wx.navigateTo({
            url: '/pages/product/detail?id=' + item.id
          })
        }
      }
    },
    fn(e) {
      this.setData({
        swiperCurrent: e.currentTarget.dataset.i
      })
      console.log(e)
    },
    swiperChange: function (e) {
      // console.log(e.detail)
      this.setData({
        swiperCurrent: e.detail.current
      })
    }
  }
})
