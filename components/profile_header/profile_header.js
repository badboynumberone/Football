import request from '../../utils/request';
import {checkLogin} from '../../utils/util';
import {updateUserInfo} from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    headerType:{
      type:String,
      value:'person'
    },
    personalInfo:{
      type:Array,
      value:[]
    },//获取用户关注粉丝获赞赞过的情况
  },
  /**
   * 组件的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    offsetOne:false,
    offsetTwo:true,
    userInfo:{},//用户信息
  },

  /**
   * 组件的方法列表
   */
  methods: {
    login(e){
      if(!wx.getStorageSync('userName') && this.properties.headerType=='me'){
        //登录流程
        var that = this
        if (e.detail.errMsg === 'getUserInfo:ok') {
          console.log(e)
          let data = {
            'nickName': e.detail.userInfo.nickName,
            'avatarUrl': e.detail.userInfo.avatarUrl,
            'sex':e.detail.userInfo.gender
          }
          updateUserInfo(data);
          let that =this;
          console.log(e)
          wx.showLoading({
            title: '正在登录中...',
          })
<<<<<<< HEAD
          request.post('/customer/bindWxUserInfo',{
              headImg:e.detail.userInfo.avatarUrl,
              nickName:e.detail.userInfo.nickName,
              sex:e.detail.userInfo.gender
          }).then(function (res) {
            console.log(res)
              wx.hideLoading();
              let userData = {
                userName:res.nickname,
                userHeader:res.headImgUrl,
                sexIndex:res.sex,
                birthDay:res.birthday,
                signature:res.sign
              }
              updateUserInfo(userData);
              that.initData();
              
=======
          request.post('/customer/getCustomerInfo').then(function (res) {
            console.log(res)
            wx.hideLoading();
            if(res.errcode==0){
              let userData = {
                userName:res.data.nickname,
                userHeader:res.data.headImgUrl,
                sexIndex:res.data.sex,
                birthDay:res.data.birthday,
                signature:res.data.sign
              }
              updateUserInfo(userData);
              that.initData();
            }
>>>>>>> 8aabee5136ce4408a2c3a70abbac19730bd6946c
          }).catch(function(err){
            wx.hideLoading();
          })
        }
      }else{
        if(this.properties.headerType=='me'){
          this.setData({
            offsetOne:false
          })
            wx.navigateTo({
              url:'/pages/me/edit_profile/edit_profile'
            })
        }else{
          this.setData({
            offsetOne:true,
            offsetTwo:true
          })
        }
      }
      
      
    },
    navigateTo(e){
      if(!checkLogin(false,true)){
        return;
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.url + "?" +'pageType='+e.currentTarget.dataset.type + "&" + 'isMe=' + this.properties.headerType + '&userId' + this.properties.userId
      });
    },
    initData(){
      this.setData({
        ['userInfo.userName']:wx.getStorageSync('userName'),
        ['userInfo.userHeader']:wx.getStorageSync('userHeader'),
        ['userInfo.signature']:wx.getStorageSync('signature')
      })
      this.triggerEvent('refreshMenu', {}, {bubbles: false, composed: true})
    }
  }
})
