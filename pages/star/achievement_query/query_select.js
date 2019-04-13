// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';
import {request} from '../../../utils/request';
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
const app=getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
      active:0,
      certificateNum:'',
      indentityNum:'',
    },
    // onChange(event) {
    //   const { picker, value, index } = event.detail;
    //   Toast(`当前值：${value}, 当前索引：${index}`);
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    //输入框实现数据双向绑定
    numChange(e){
      if(e.currentTarget.dataset.type==1){
        this.setData({
          certificateNum:e.detail
        })
      }else{
        this.setData({
          indentityNum:e.detail
        })
      }
      
    },
    onOptionsChange(e){
      this.setData({
        active:e.detail.index
      })
    },
    queryResult(){
      console.log(this.data.certificateNum)
      let type = null;
      let that = this;
      if(!this.data.active){//证书查询
        type=1;
        if(!this.data.certificateNum.length){
          wx.showToast({title: '证书号码格式不正确，请重新输入',icon: 'none',duration: 1500});
          return;
        }
        console.log(this.data.certificateNum)
      }else{//身份证查询
        type=2;
        if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.indentityNum)){
          wx.showToast({title: '身份证号码格式不正确，请重新输入',icon: 'none',duration: 1500});
          return;
        }
      }
      request('/userSign/getUserSign',{
        method:"POST",
        data:{
          type,
          cardNum:type=="1" ? that.data.certificateNum : that.data.indentityNum
        }
      }).then(function(res){
        console.log(res)
        if(!res.flg){
          wx.showToast({title: res.flgmsg,icon: 'none',duration: 1500});
          return;
        }
        if(res.status==1){
          wx.navigateTo({
            url: '/pages/star/achievement_query/fail?information='+res.statusmsg
          }); 
        }else if(res.status==2){
          wx.navigateTo({
            url: '/pages/star/achievement_query/fail?information='+res.statusmsg
          }); 
        }else{
          if(type==1){
            wx.navigateTo({
              url: '/pages/star/achievement_query/query_result_certificate?card='+that.data.certificateNum
            });
          }else{
            wx.navigateTo({
              url: '/pages/star/achievement_query/query_result_identity?identity='+that.data.indentityNum
            }); 
          }
          
        }
        //需要处理返回来的错误消息
        // 得到用户信息之后走本地存储
        //最后跳转页面
      }).catch(function(err){
        console.log(err)
      })
    }
  })