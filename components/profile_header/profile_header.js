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
    },
    isLogin:Boolean,
  },
  /**
   * 组件的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    offsetOne:false,
    offsetTwo:true,
    userInfo:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    login(e){
      if(!wx.getStorageSync('nickName') && this.properties.headerType=='me'){
        //登录流程
        var that = this
        if (e.detail.errMsg === 'getUserInfo:ok') {
          let data = {
            'nickName': e.detail.userInfo.nickName,
            'avatarUrl': e.detail.userInfo.avatarUrl,
          }
          updateUserInfo(data);
          let that =this;
          console.log(e)
          wx.showLoading({
            title: '正在登录中...',
          })
          request.post('/customer/bindWechatUserInfo', {
            rawData: e.detail.rawData,
            signature: e.detail.signature,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv
          }).then(function (data) {
            console.log(data)
            wx.hideLoading();
            let userData = {
              userName:data.nickname,
              userHeader:data.headImgUrl
            }
            updateUserInfo(userData);
            that.initData();
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
    }
  }
})
