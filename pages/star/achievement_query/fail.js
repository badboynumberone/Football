// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
      text:""
    },
    
    onLoad: function (options) {
      this.setData({
        text:options.information
      })
    },
    
  })