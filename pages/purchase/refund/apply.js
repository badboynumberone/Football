// pages/refund/apply.js
import request from '../../../utils/request'
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageBaseUrl: app.globalData.imageBaseUrl,
    isShowReason: false,
    isShowCredentialType: false,
    refundReason: '',
    refundRemark: '',
    credentialType: '',
    credentialImageArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var orderId = options.orderId
    var that = this
    request.post('/refundOrder/getPreRefundOrder', {
      orderId: orderId
    }).then(function (data) {
      console.log(data)
      if (data.refundType === '1') {
        wx.setNavigationBarTitle({
          title: '申请退款',
        })
      } else {
        wx.setNavigationBarTitle({
          title: '申请退货',
        })
      }
      app.formatItemSpec(data.itemList)
      that.setData({
        refundType: data.refundType,
        order: data.order,
        itemList: data.itemList
      })
    }, function (err) {
      wx.showToast({
        title: err.errmsg,
        icon: 'none',
        duration: 1000
      })
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

  showReason() {
    this.setData({
      isShowReason: true
    })
  },

  hideReason() {
    this.setData({
      isShowReason: false
    })
  },

  onSelectReason(e) {
    this.setData({
      isShowReason: false,
      refundReason: e.target.dataset.name
    })
  },

  showCredentialType() {
    this.setData({
      isShowCredentialType: true
    })
  },

  hideCredentialType() {
    this.setData({
      isShowCredentialType: false
    })
  },

  onSelectCredentialType(e) {
    this.setData({
      isShowCredentialType: false,
      credentialType: e.target.dataset.name
    })
  },

  onInput(e) {
    var fieldName = e.target.dataset.fieldName
    this.data[fieldName] = e.detail.value
    this.setData(this.data)
  },

  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
        var tempFiles = res.tempFiles
        var imgSrc = tempFilePaths[0]
        var imgSize = tempFiles[0].size
        if (imgSrc.lastIndexOf('.gif') != -1) {
          wx.showToast({
            title: '不能上传gif格式图片',
            icon: 'none',
            duration: 1000
          })
          return
        }
        if (imgSize > 4 * 1024 * 1024) {
          wx.showToast({
            title: '凭证图片不能超过4M',
            icon: 'none',
            duration: 1000
          })
          return
        }
        wx.showLoading({
          title: '上传图片中...',
        })
        request.post('/oss/getPolicy').then(function (data) {
          console.log(data)
          var key = data.dir + new Date().getTime() + '.png'
          wx.uploadFile({
            url: data.host,
            filePath: imgSrc,
            name: 'file',
            formData: {
              name: imgSrc,
              key: key,
              policy: data.policy,
              OSSAccessKeyId: data.accessKeyId,
              signature: data.signature,
              success_action_status: 200
            },
            success(res) {              
              console.log(res)
              if (res.statusCode === 200) {
                var credentialImageArray = that.data.credentialImageArray
                credentialImageArray.push(key)
                that.setData({
                  credentialImageArray: credentialImageArray
                })
              } else {
                wx.showToast({
                  title: '图片上传失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            },
            complete() {
              wx.hideLoading()
            }
          })
        }, function (err) {
          wx.hideLoading()
        })
      }
    })
  },

  previewImage(e) {
    var current = this.data.imageBaseUrl + e.currentTarget.dataset.imgSrc
    var credentialImageArray = this.data.credentialImageArray
    var urls = new Array()
    for (var i = 0; i < credentialImageArray.length; i++) {
      urls.push(this.data.imageBaseUrl + credentialImageArray[i])
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  applySubmit() {
    var that = this
    var typeStr = this.data.refundType === '1' ? '退款' : '退货'
    Dialog.confirm({
      title: '确定要申请' + typeStr + '？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }).then(() => {
      var orderId = that.data.order.id
      console.log(typeStr + '申请提交:' + orderId)
      var url = ''
      var options = {
        orderId: orderId,
        refundReason: that.data.refundReason,
        refundRemark: that.data.refundRemark
      }      
      if (that.data.refundType === '1') {
        url = '/refundOrder/refundApply'
      } else {
        url = '/refundOrder/returnApply'
        options.credentialType = that.data.credentialType
        var credentialImageArray = that.data.credentialImageArray
        if (credentialImageArray && credentialImageArray.length > 0) {
          options.credentialImage = credentialImageArray.join(',')
        }
      }
      console.log(options)
      request.post(url, options).then(function (data) {
        // wx.showToast({
        //   title: typeStr + '申请提交成功',
        //   icon: 'none',
        //   duration: 1000
        // })
        var pages = getCurrentPages()
        var prevPage = pages[pages.length - 2]
        prevPage.updateRefundStatus(orderId, data.id, '0')
        wx.navigateTo({
          url: '/pages/refund/detail?id=' + data.id,
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

  removeCredentialImage(e) {
    var that = this
    Dialog.confirm({
      title: '确定要删除该凭证?',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    }).then(() => {
      var current = e.currentTarget.dataset.imgSrc
      var credentialImageArray = that.data.credentialImageArray
      var index = null
      for (var i = 0; i < credentialImageArray.length; i++) {
        if (credentialImageArray[i] === current) {
          index = i
          break
        }
      }
      if (index != null && index > -1) {
        credentialImageArray.splice(index, 1)
        that.setData({
          credentialImageArray: credentialImageArray
        })
      }
    }).catch(() => {

    })
  }
})