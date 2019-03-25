import request from 'request'

module.exports = {
  login: login
}

function login () {
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log("临时登录凭证code:" + res.code)
      request.post('/customer/login', {
        code: res.code
      }).then(function (data) {
        wx.setStorageSync('accessToken', data.accessToken)

      }, function (err) {
          login()
      })
    }
  })
}