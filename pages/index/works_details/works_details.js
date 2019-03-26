Page({

    /**
     * 页面的初始数据
     */
    data: {
      authorInfo:[],//用户信息
      isMyWorks:true,//true代表是自己
      bannerIndex:1
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