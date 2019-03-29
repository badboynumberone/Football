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

//清空用户信息
export function resetUserInfo(){
  wx.removeStorageSync('nickName');
  wx.removeStorageSync('avatarUrl');
  wx.removeStorageSync('userName');
  wx.removeStorageSync('userHeader');
  wx.removeStorageSync('birthDay'); 
  wx.removeStorageSync('signature'); 
  wx.removeStorageSync('sexIndex');     
  wx.removeStorageSync('phone');                                                                               
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
//获取当前时间
function getNowTime(){
    function addZero(val){
      return val<10 ? '0'+val:val;
    }
    let day = new Date();
    return day.getFullYear() + "-" + addZero(day.getMonth() + 1) + "-" + addZero(day.getDate())+" "+
      + addZero(day.getHours()) + ":" + addZero(day.getMinutes()) + ":" + addZero(day.getSeconds());
}
//提示错误信息
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}
//数组分块
export const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );
//由左到右依次执行
export const pipeFunctions = (...fns) => fns.reduce((f, g) => (...args) => g(f(...args)));

//将参数数组映射到该函数的输入
export const spreadOver = fn => argsArr => fn(...argsArr);

//countBy - 返回每个分组数组中元素的数量
export const countBy = (arr, fn) =>
arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
  acc[val] = (acc[val] || 0) + 1;
  return acc;
}, {});
module.exports = {
  getNowTime,
  resetUserInfo,
  checkLogin,
  updateUserInfo,
  getUserInfo,
  showErrorToast,
  chunk,
  pipeFunctions
}
