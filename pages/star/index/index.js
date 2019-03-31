import {checkLogin} from '../../../utils/util';
import {starRequest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      siteInfo:[{name:'haha'}],//站点信息
      bottomFont:'~NOTHING~',//底部加载信息
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    onShow(){
      // starRequest("/area/getCityTree",{method:"POST"}).then(function(res){
      //   console.log(res)
      // }).catch(function(err){console.log(err)})
    },
    navigateTo(e){
      if(!checkLogin(true)){
        return;
      }
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      });
    },

  })