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
  if (!wx.getStorageSync('userName') && !checkSession()) {
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
export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
//清除空行
export const clearLine = str =>{
	
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatTimeStamp = timestamp => {
  if (timestamp) {
    return formatTime(new Date(parseInt(timestamp)))
  } else {
    return ''
  }
}
const mapTime = (value,name)=>{
  if(value instanceof  Array){
    return value.map(function(item){
      for(let key in item){
        if(item[key] instanceof Array){
          mapTime(item[key],name)
        }
      }
      item[name]= formatTimeStamp(item[name])
      return item
    })
  }else if(value.constructor == Object){
    value[name] = formatTimeStamp(value[name])
    return value
  }else if(value.constructor == String){
    return  formatTimeStamp(value)
  }
}

module.exports = {
  sleep,
  getNowTime,
  resetUserInfo,
  checkLogin,
  updateUserInfo,
  getUserInfo,
  showErrorToast,
  chunk,
  pipeFunctions,
  formatTime,
  formatNumber,
  formatTimeStamp,
  mapTime
}
