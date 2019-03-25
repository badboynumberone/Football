Page({

    /**
     * 页面的初始数据
     */
    data: {
      videoOrImg:true
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
  
    navigateToPublicSuccess(){
      wx.redirectTo({
        url: '/pages/index/public_works/public_works_success'
      });
    }
  })