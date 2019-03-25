Page({

    /**
     * 页面的初始数据
     */
    data: {
      videoOrImg:true,//图片还是视频
      bannerIndex:1,//轮播图索引
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
    },
    bannerChange(e){
      this.setData({
        bannerIndex:e.detail.current+1
      })
    },
    toHomePage(){
      wx.navigateTo({
        url: '/pages/index/home_page/home_page'
      });
    }
    
  })