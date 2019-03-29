Page({

    /**
     * 页面的初始数据
     */
    data: {
      videoOrImg:true,
      worksId:'',//作品ID
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      this.setData({
        worksId:options.worksId
      })
    },
  
    toIndex(){
      wx.switchTab({
        url: '/pages/index/index/index'
      });
    },
    toWorkDetails(){
      wx.redirectTo({
        url: '/pages/index/works_details/works_details?worksId='+this.data.worksId
      });
    }
  })