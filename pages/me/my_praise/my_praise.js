import {requestTest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userId:''
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log("haha")
      console.log(options)
      //获取用户id
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
    onShow(){
      console.log("hah")
    },
    //获取获赞
    getParise(){
      requestTest('').then(function(){

      })
    },

    //赞过
    getPraised(){

    }
    
  })