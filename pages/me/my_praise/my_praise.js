Page({

    /**
     * 页面的初始数据
     */
    data: {
      functionList:[
        {iconSrc:"../../../images/我的作品@2x.png",text:"我的作品",linkAddress:"",isNew:true},
        {iconSrc:"../../../images/评论-收藏-选中@2x.png",text:"我的收藏",linkAddress:"",isNew:false},
        {iconSrc:"../../../images/我的评论@2x.png",text:"我的评论",linkAddress:"",isNew:false},
        {iconSrc:"../../../images/我的订单@2x.png",text:"我的订单",linkAddress:"",isAll:true,isNew:false},
      ],//用户功能列表
      pay_list:[
        {iconSrc:"../../../images/待付款.png",text:"待付款",messageNum:0,linkAddress:""},
        {iconSrc:"../../../images/待发货.png",text:"代发货",messageNum:0,linkAddress:""},
        {iconSrc:"../../../images/待收货.png",text:"待收货",messageNum:0,linkAddress:""},
        {iconSrc:"../../../images/待付款.png",text:"已完成",messageNum:0,linkAddress:""},
        {iconSrc:"../../../images/退货退款.png",text:"退货退款",messageNum:10,linkAddress:""},
      ]//付款流程列表
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options.pageType==2 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '我赞过谁'
        });
          //发送请求获取数据
      }else if(options.pageType==3 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '谁赞过我'
        });
      }
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