Page({

    /**
     * 页面的初始数据
     */
    data: {
      videoOrImg:true,
      worksIndex:0,//内容选择
      hotItem:[
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'关注',typeNum:0},
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'粉丝',typeNum:20},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'获赞',typeNum:25},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'赞过',typeNum:99},
      ]
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    }
  })