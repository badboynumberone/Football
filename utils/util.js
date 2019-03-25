const app = getApp();

//更新用户信息
export function updateUserInfo(data) {
  for(let key in data){
    wx.setStorageSync(key, data[key]);
  }
}
//获取用户信息
export function getUserInfo(dataArr){ 
    let object={};
    dataArr.forEach((item) => {
      object[item] = wx.getStorageSync(item);
    });
    return object;
}

//检查session是否过期
export function checkSession() {
  wx.checkSession({
    success: function () {
      //session_key 未过期，并且在本生命周期一直有效
      console.log('session_key 未过期')
      return true;
    },
    fail: function () {
      // session_key 已经失效，需要重新执行登录流程
      console.log('session_key 已经失效')
      return false;
    }
  })
}
//检查登录状态
export function checkLogin(isToast = false,isSwitch = false) {
  if (!wx.getStorageSync('nickName') && !checkSession()) {
    if (isToast) {
      wx.showModal({
        title: '还没有登录,暂不可用',
        content: '前往个人中心,去登录认证',
        success: (result) => {
          if (result.confirm) {
              wx.switchTab({
                url: '/pages/me/index/index'
              });
          }
        }
      });
    }
    if(isSwitch){
      wx.showToast({
        title: '请先登录！',
        icon: 'none',
        duration: 1500,
      });
    }
    return false;
  }
  return true;
}

//提示错误信息
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}





module.exports = {
  checkLogin,
  updateUserInfo,
  getUserInfo,
  showErrorToast
}
