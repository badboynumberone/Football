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
            'sex':e.detail.userInfo.gender,
            
          }
          updateUserInfo(data);
          let that =this;
          console.log(e)
          wx.showLoading({
            title: '正在登录中...',
          })
          request.post('/customer/bindWxUserInfo',{
              headImg:e.detail.userInfo.avatarUrl,
              nickName:e.detail.userInfo.nickName,
              sex:e.detail.userInfo.gender
          }).then(function (res) {
            console.log(res.sign)
              wx.hideLoading();
              wx.showToast({
                title: '登录成功',
                icon: 'success'
              });
              let userData = {
                userName:res.nickname,
                userHeader:res.headImgUrl,
                sexIndex:parseInt(res.sex)-1,
                birthDay:res.birthday,
                signature:res.constoSign
              }
              updateUserInfo(userData);
              
              that.initData();
              that.triggerEvent('refreshMenu', {}, {bubbles: false, composed: true})
              that.triggerEvent('refreshOrder', {}, {bubbles: false, composed: true})
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
