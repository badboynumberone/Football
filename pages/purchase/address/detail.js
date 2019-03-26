// pages/address/detail.js
import AreaList from './area'
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
import request from '../../../utils/request'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    fromOrder: false,
    areaList: AreaList,
    address: {},
    receiverName: '',
    receiverPhone: '',
    receiverArea: '',
    receiverDetail: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fromOrder === 'true') {
      this.setData({
        fromOrder: true
      })
    }
    var itemId = options.itemId
    var that = this
    if (itemId !== '0') {
      request.post('/address/getAddress', {
        id: itemId
      }).then(function (data) {
        console.log(data)
        var receiverArea = ''
        if (data.provinceCode === '110000' || data.provinceCode === '120000' || data.provinceCode === '310000' || data.provinceCode === '500000') {
          receiverArea = data.provinceName + '/' + data.areaName
        } else {
          receiverArea = data.provinceName + '/' + data.cityName + '/' + data.areaName
        }
        that.setData({
          address: data,
          receiverName: data.name,
          receiverPhone: data.phone,
          receiverArea: receiverArea,
          receiverDetail: data.detail
        })
      }, function (err) {
      })
    }    
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

  clearContent(e){
    console.log(e)
    let name = e.currentTarget.dataset.fieldName;
    this.setData({
      [name]:''
    })
  },

  showAreaPopup() {
    this.setData({
      show: true
    })
  },

  onAreaPopupClose() {
    this.setData({
      show: false
    })
  },

  onAreaConfirm(e) {
    var values = e.detail.values
    console.log(values)
    var provinceCode = values[0].code
    var provinceName = values[0].name
    var cityCode = values[1].code
    var cityName = values[1].name
    var areaCode = values[2].code
    var areaName = values[2].name
    var receiverArea = ''
    if (values[0].code === '110000' || values[0].code === '120000' || values[0].code === '310000' || values[0].code === '500000') {
      receiverArea = values[0].name + '/' + values[2].name
    } else {
      receiverArea = values[0].name + '/' + values[1].name + '/' + values[2].name
    }
    this.data.address.provinceCode = provinceCode
    this.data.address.provinceName = provinceName
    this.data.address.cityCode = cityCode
    this.data.address.cityName = cityName
    this.data.address.areaCode = areaCode
    this.data.address.areaName = areaName
    this.setData({
      address: this.data.address,
      receiverArea: receiverArea,
      show: false
    })
  },

  onAreaCancel() {
    this.setData({
      show: false
    })
  },

  onInput(e) {
    var fieldName = e.target.dataset.fieldName
    this.data[fieldName] = e.detail.value
    this.setData(this.data)
  },

  saveAddress() {
    var that = this
    Dialog.confirm({
      title: '确定保存该地址？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '保存'
    }).then(() => {
      console.log('保存收货地址')
      var address = that.data.address
      address.name = that.data.receiverName
      address.phone = that.data.receiverPhone
      address.detail = that.data.receiverDetail
      var url = ''
      if (address.id) {
        url = '/address/updateAddress'
      } else {
        url = '/address/addAddress'
      }
      request.post(url, address).then(function (data) {
        console.log(data)
        console.log(that.data.fromOrder)
        if (that.data.fromOrder) {
          app.globalData.address = address
          wx.navigateBack({
            delta: 2
          })
        } else {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]          
          var addressList = prevPage.data.addressList
          if (data.id) {
            address.id = data.id
            addressList.unshift(address)
          } else {
            for (var i = 0; i < addressList.length; i++) {
              if (addressList[i].id === address.id) {
                addressList[i] = address
                break
              }
            }
          }          
          prevPage.setData({
            addressList: addressList
          })
          wx.navigateBack({
            delta: 1
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
  },

  deleteAddress() {
    var that = this
    Dialog.confirm({
      title: '确定删除该地址？',
      message: ' ',
      cancelButtonText: '取消',
      confirmButtonText: '现在删除'
    }).then(() => {
      console.log('删除收货地址')
      var address = that.data.address
      request.post('/address/deleteAddress', {
        id: address.id
      }).then(function (data) {
        if (app.globalData.address && app.globalData.address.id === address.id) {
          app.globalData.address = null
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]
        var addressList = prevPage.data.addressList
        var delIndex = null
        for (var i = 0; i < addressList.length; i++) {
          if (addressList[i].id === address.id) {
            delIndex = i
            break
          }
        }
        if (delIndex != null) {
          addressList.splice(delIndex, 1)
        }
        prevPage.setData({
          addressList: addressList
        })
        wx.navigateBack({
          delta: 1
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
  }
})