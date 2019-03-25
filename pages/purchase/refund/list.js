// pages/refund/list.js
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
    refundOrderList: [],
    hasMoreData: true,
    isRefreshing: false,
    isLoadingMore: false,
    active: 0,
    refundStatus: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh();
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
    request.post('/refundOrder/getRefundOrderList', {
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      refundStatus: that.data.refundStatus
    }).then(function (data) {
      if (data.length < that.data.pageSize) {
        that.setData({
          "hasMoreData": false,
          isRefreshing: false
        })
      }
      that.setData({
        refundOrderList: data
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
      console.log('没有更多退单啦')
      return;
    }
    request.post('/refundOrder/getRefundOrderList', {
      pageNo: that.data.pageNo + 1,
      pageSize: that.data.pageSize,
      refundStatus: that.data.refundStatus
    }).then(function (data) {
      if (data.length < that.data.pageSize) {
        that.setData({
          "hasMoreData": false
        })
      }
      if (data.length > 0) {
        that.setData({
          "pageNo": that.data.pageNo + 1,
          "refundOrderList": that.data.refundOrderList.concat(data)
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

  goDetail(e) {
    var refundOrderId = e.currentTarget.dataset.refundOrderId
    wx.navigateTo({
      url: '/pages/refund/detail?id=' + refundOrderId
    })
  },

  onChange(e) {
    var active = e.detail.index
    var refundStatus = ''
    if (active === 0) {
      refundStatus = ''
    } else if (active === 1) {
      refundStatus = '0'
    } else if (active === 2) {
      refundStatus = '1'
    } else if (active === 3) {
      refundStatus = '2'
    } else if (active === 4) {
      refundStatus = '3'
    } else if (active === 5) {
      refundStatus = '4'
    } else if (active === 6) {
      refundStatus = '5'
    } else if (active === 7) {
      refundStatus = '6'
    }
    this.setData({
      active: active,
      refundStatus: refundStatus
    })
    wx.startPullDownRefresh();
  },

  cancelRefundOrder(e) {
    var that = this
    Dialog.confirm({
      title: '取消申请',
      message: '确认要取消申请吗？'
    }).then(() => {
      var refundOrderId = e.target.dataset.refundOrderId
      console.log('取消申请:' + refundOrderId)
      request.post('/refundOrder/cancelRefundOrder', {
        "id": refundOrderId
      }).then(function (data) {
        if (that.data.refundStatus != '') {
          that.removeRefundOrder(refundOrderId)
        } else {
          that.updateRefundOrderStatus(refundOrderId, '6')
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

  updateRefundOrderStatus(refundOrderId, refundStatus) {
    console.log('更新列表订单状态')
    for (var i = 0; i < this.data.refundOrderList.length; i++) {
      if (refundOrderId == this.data.refundOrderList[i].id) {
        this.data.refundOrderList[i].refundStatus = refundStatus
        break
      }
    }
    this.setData({
      refundOrderList: this.data.refundOrderList
    })
  },

  removeRefundOrder(refundOrderId) {
    console.log('移除列表订单')
    var delIndex = null
    for (var i = 0; i < this.data.refundOrderList.length; i++) {
      if (refundOrderId == this.data.refundOrderList[i].id) {
        delIndex = i
        break
      }
    }
    if (delIndex != null) {
      this.data.refundOrderList.splice(delIndex, 1)
      this.setData({
        refundOrderList: this.data.refundOrderList
      })
    }
  },

  goLogistics(e) {
    var refundOrderId = e.target.dataset.refundOrderId
    wx.navigateTo({
      url: '/pages/refund/logistics?refundOrderId=' + refundOrderId,
    })
  }
})