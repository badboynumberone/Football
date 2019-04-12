//app.js
import auth from '/utils/auth'
import {resetUserInfo} from '/utils/util'
App({
  onLaunch: function () {
    console.log("asd")
    this.checkLogin()
  },
  onShow: function () {
    this.checkLogin()
  },
  checkLogin: function () {
    wx.checkSession({
      success: function () {
        //session_key 未过期，并且在本生命周期一直有效
        if (!wx.getStorageSync('accessToken')) {
          // 重新登录
          resetUserInfo();
          auth.login()
        }
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        // 重新登录
        auth.login()
      }
    })
  },
  formatItemSpec: function (itemList) {
    if (itemList) {
      for (var i = 0; i < itemList.length; i++) {
        var specDetail = itemList[i].specDetail
        if (specDetail) {
          try {
            var specObj = JSON.parse(specDetail)
            var specValueArray = new Array()
            for (var key in specObj) {
              console.log(specObj[key])
              specValueArray.push(specObj[key])
            }
            itemList[i].specDesc = specValueArray.join(',')
          } catch (err) {
            console.log(err.message)
          }
        }
      }
    }
  },
  globalData: {
    imageBaseUrl: 'https://wxlittleprogram.oss-cn-shanghai.aliyuncs.com/',
    searchHistory:[],
    uploadImage:[],//上传图片
    uploadVideo:[],//上传的视频
    videoOrImg:false
  }
})