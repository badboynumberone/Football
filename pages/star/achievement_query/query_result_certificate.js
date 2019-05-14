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
      ratingCertImg:'',//证书图片
      fullControl:false,//全屏控制
      videoOffset:false,
      imgArr:[],//图片集合
      username:"",
      inchimg:"",
      score:""//考试分数
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
    onReady:function(){
      this.videoContext = wx.createVideoContext('myVideo')
    },
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
          score:res.score,
          level:res.level,
          number:res.certNum,
          levelTime:mapTime(res.creatime),
          nowImg:res.imgUrl,
          nowVideo:res.voidUrl,
          ratingCertImg:[res.ratingCert],
          username:res.userName,
          inchimg:res.inchimg,
        })
        console.log(that.data.score)
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
      let arr= [];
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
          username:res.userName,
          inchimg:res.inchimg,
          score:res.score
        })
        that.data.nowImg.forEach(function(item){
          arr.push(item.value)
        })
        that.setData({
          imgArr:arr
        })
        console.log(that.data.nowImg)
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
    //查看电子证书
    toElectrical(){
      wx.navigateTo({
        url: '/pages/star/achievement_query/query_result_electrical?name='+this.data.username+'&photo='+this.data.inchimg+'&num='+this.data.number+'&level='+this.data.level
      });
    }
  })