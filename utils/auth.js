import request from 'request'

module.exports = {
  login: login
}

function login () {
  wx.showLoading({
    title: '正在加载中...',
  })
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log("临时登录凭证code:" + res.code)
      request.post('/customer/login', {
        code: res.code
      }).then(function (data) {
        wx.hideLoading()
        wx.setStorageSync('accessToken', data.accessToken)
        wx.setStorageSync('userId',data.id)
      }, function (err) {
          login()
      })
    }
  })
}