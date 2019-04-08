import base from 'base'

const request = (url, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: base.apiHost + url,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': wx.getStorageSync('accessToken'),
        'Shop-Id': base.shopId
      },
      success(res) {
        // console.log('success')
        if (res.statusCode === 200) {
          if (res.data.errcode === '0') {
            resolve(res.data.data)
          } else if (res.data.errcode === '-1') {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 1000
            })
            reject(res.data)
          } else {
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          wx.removeStorage({
            key: 'accessToken',
            success(res) {
              autoLogin(function () {
                post(url, options).then(resolve, reject)
              })
            }
          })
        } else if (res.statusCode === 417) {
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 1000
          })
        } else {
          console.log("请求失败")
        }
      },
      fail(error) {
        console.log('fail')
        console.log(error)
        wx.showToast({
          title: '请求失败，请稍后再试！',
          icon: 'none',
          duration: 1000
        })
        reject(error)
      },
      complete(res) {
        // console.log('complete')
        // console.log(res)
      }
    })
  })
}
const requestTest = (url, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: base.testHost + url,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': wx.getStorageSync('accessToken'),
        'Shop-Id': base.testshopId
      },
      success(res) {
        // console.log('success')
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.errcode === '0') {
            resolve(res.data.data)
          } else if (res.data.errcode === '-1') {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 1000
            })
            reject(res.data)
          } else {
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 1000
          })
          wx.removeStorage({
            key: 'accessToken',
            success(res) {
              autoLogin(function () {
                post(url, options).then(resolve, reject)
              })
            }
          })
        } else if (res.statusCode === 417) {
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '请求失败，请稍后再试！',
            icon: 'none',
            duration: 1000
          })
        }
      },
      fail(error) {
        console.log('fail')
        console.log(error)
        wx.showToast({
          title: '请求失败，请稍后再试！',
          icon: 'none',
          duration: 1000
        })
        reject(error)
      },
      complete(res) {
        // console.log('complete')
        // console.log(res)
      }
    })
  })
}
const starRequest = (url, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: base.starHost + url,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': wx.getStorageSync('accessToken'),
        'Shop-Id': base.testshopId
      },
      success(res) {
        // console.log('success')
        console.log(res)
        if (res.statusCode === 200) {
          if (res.data.errcode === '0') {
            resolve(res.data.data)
          } else if (res.data.errcode === '-1') {
            wx.showToast({
              title: res.data.errmsg,
              icon: 'none',
              duration: 1000
            })
            reject(res.data)
          } else {
            reject(res.data)
          }
        } else if (res.statusCode === 401) {
          console.log("登录失效")
          wx.removeStorage({
            key: 'accessToken',
            success(res) {
              autoLogin(function () {
                post(url, options).then(resolve, reject)
              })
            }
          })
        } else if (res.statusCode === 417) {
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 1000
          })
        }else{
          console.log("请求失败")
          reject("请求失败")
        }
      },
      fail(error) {
        console.log("请求失败")
        reject(error)
      },
      complete(res) {
        // console.log('complete')
        // console.log(res)
      }
    })
  })
}
function autoLogin(callback) {
  console.log('小程序登录中...')
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log("临时登录凭证code:" + res.code)
      post('/customer/login', {
        code: res.code
      }).then(function (data) {
        wx.setStorageSync('accessToken', data.accessToken)
        callback()
      }, function (err) {
      })
    }
  })
}

const get = (url, options = {}) => {
  return request(url, { method: 'GET', data: options })
}

const post = (url, options) => {
  return request(url, { method: 'POST', data: options })
}

const put = (url, options) => {
  return request(url, { method: 'PUT', data: options })
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
  return request(url, { method: 'DELETE', data: options })
}
//上传文件
function upLoadFile(filePath){
  return new Promise(function(resolve,reject){
    wx.uploadFile({
      url: 'https://api.itchou.net/mall-api-wxapp/oss/upload', // 仅为示例，非真实的接口地址
      filePath: filePath[0],
      name: 'file',
      header:{
        'content-type': 'multipart/form-data',
        'Authorization': wx.getStorageSync('accessToken'),
        'Shop-Id': base.shopId
      },
      success(res) {
        console.log(res)
        if(res.statusCode==200){
          try{
            resolve(JSON.parse(res.data).data)
          }catch(err){
            resolve(res.data.data)
          }
        }
       
      },
      fail(err){
        console.log('上传失败')
        reject(err)
      }
    })
  })
}

module.exports = {
  starRequest,
  requestTest,
  request,
  upLoadFile,
  get,
  post,
  put,
  remove
}