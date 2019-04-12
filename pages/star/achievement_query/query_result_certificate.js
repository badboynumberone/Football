// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';
import {request} from '../../../utils/request';
import {mapTime} from '../../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      level:'',//等级
      levelTime:'',//等级时间
      number:'',//证书号
      ratingCertImg:'',//证书
      nowVideo:[],//现场视频
      nowImg:[],//现场照片
      ratingCertImg:''//证书图片
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      if(options.card){
        this.getStarInfo(options.card)
      }
      if(options.id){
        this.getStar(options.id)
      }
      
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
    //获取星级信息
    getStarInfo(card){
      let that=this;
      request('/userSign/getUserSign',{
        method:"POST",
        data:{
          type:1,
          cardNum:card
        }
      }).then(function(res){
        console.log(res)
        that.setData({
          level:res.level,
          number:res.certNum,
          levelTime:mapTime(res.creatime),
          nowImg:res.imgUrl,
          nowVideo:res.voidUrl,
          ratingCertImg:[res.ratingCert]
        })
        if(res.imgUrl.constructor== String){
          that.setData({
            nowImg:[res.imgUrl]
          })
        }
        if(res.voidUrl.constructor == String){
          that.setData({
            nowVideo:[res.voidUrl]
          })
        }
        console.log(that.data.nowVideo)
        
      }).catch(function(err){
        console.log("获取用户评级信息失败")
      })
    },
    //获取星级信息
    getStar(id){
      let that = this;
      request('/userSign/getUserSignInfoById/',{
        method:"POST",
        data:{
          id
        }
      }).then(function(res){
        that.setData({
          level:res.level,
          number:res.certNum,
          levelTime:mapTime(res.creatime),
          nowImg:res.imgUrl,
          nowVideo:res.voidUrl,
          ratingCertImg:[res.ratingCert]
        })
        if(res.imgUrl.constructor== String){
          that.setData({
            nowImg:[res.imgUrl]
          })
        }
        
      }).catch(function(err){
        console.log("获取用户评级信息失败")
      })
    },
    //查看照片
    lookingPhoto(e){
      wx.previewImage({
        current: e.currentTarget.dataset.src,
        urls: e.currentTarget.dataset.urls,
      });
    },
    lookingVideo(e){
      var audioContext = wx.createAudioContext("myVideo", this);
      audioContext.play();
      
      
      console.log("haha")
    }
  })