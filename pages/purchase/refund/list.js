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
    this.initData();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh(){
    this.initData();
  },
  initData: function () {
    //判断是否正在更新或者是在加载更多，如果是，则停止
    if (this.data.isRefreshing || this.data.isLoadingMore) {
      return
    }
    this.setData({
      isRefreshing: true,
      hasMoreData: true
    })
    var that = this;
    that.data.pageNo = 1;
    //获取退货列表传入页面内型，页面大小退货状态
    request.post('/refundOrder/getRefundOrderList', {
      pageNo: that.data.pageNo,
      pageSize: that.data.pageSize,
      refundStatus: that.data.refundStatus
    }).then(function (data) {
      //如果获取的退货信息小于10,则没有更多,无法刷新
      if (data.length < that.data.pageSize) {
        that.setData({
          "hasMoreData": false
        })
      }
      //设置退货信息
      that.setData({
        refundOrderList: data
      })
      //停止下拉刷新
      wx.stopPullDownRefresh();
      //把刷新状态改成可以刷新
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
  //页面触底加载更多
  onReachBottom: function () {
    if (this.data.isRefreshing || this.data.isLoadingMore || !this.data.hasMoreData) {
      return
    }
    // 更改状态
    this.setData({
      isLoadingMore: true
    })
    var that = this;
    if (!that.data.hasMoreData) {
      console.log('没有更多退单啦')
      return;
    }
    //发送请求加载更多
    request.post('/refundOrder/getRefundOrderList', {
      pageNo: that.data.pageNo + 1,
      pageSize: that.data.pageSize,
      refundStatus: that.data.refundStatus
    }).then(function (data) {
      if (data.length < that.data.pageSize) {
        //没有更多了
        that.setData({
          "hasMoreData": false
        })
      }
      //如果数据大于0,页面数增加一同时数据添加一条
      if (data.length > 0) {
        that.setData({
          "pageNo": that.data.pageNo + 1,
          "refundOrderList": that.data.refundOrderList.concat(data)
        })
      }
      //再继续更改加载状态
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

  //跳转到退货详情页面
  goDetail(e) {
    var refundOrderId = e.currentTarget.dataset.refundOrderId
    wx.navigateTo({
      url: '/pages/purchase/refund/detail?id=' + refundOrderId
    })
  },
  //导航栏跳转
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
    this.initData();
  },
  //取消申请退款
  cancelRefundOrder(e) {
    var that = this
    Dialog.confirm({
      title: '取消申请',
      message: '确认要取消申请吗？'
    }).then(() => {
      //获取退货id之后发送退货请求
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
  //更新订单列表状态
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
  //删除订单
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
  //去退货物流信息
  goLogistics(e) {
    var refundOrderId = e.target.dataset.refundOrderId
    wx.navigateTo({
      url: '/pages/purchase/refund/logistics?refundOrderId=' + refundOrderId,
    })
  }
})