import {request} from '../../../utils/request';
import {checkLogin} from '../../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      videoOrImg:true,
      bannerId:null,
      bannerDetail:{}
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      this.setData({
        bannerId:options.bannerId
      })
      this.getData();
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
  
    
    getData(){
      let that = this;
      request("/banner/getInfo",{method:"POST",data:{
        id:this.data.bannerId
      }}).then(function(res){
        if(res){
          that.setData({
            bannerDetail:res
          })
        }
      }).catch(function(err){
        console.log("数据获取失败")
        wx.showToast({
          title: '页面加载失败请稍后重试',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      })
    },
    //活动链接
    activityLink(){
      console.log(0)
      wx.navigateTo({
        url: '/pages/web/index?link='+this.data.bannerDetail.bannH5Url
      });
    },
    //去参加
    goJion(){
      if(!checkLogin(true,false)){
        return;
      }
      wx.navigateTo({
        url: '/pages/index/public_works/public_works?activityTitle=#'+this.data.bannerDetail.bannTitle
      });
    }
  })