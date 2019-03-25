// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
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
  
    navigateTo(){
      wx.switchTab({
        url: '/pages/star/index/index',
      });
    }
  })