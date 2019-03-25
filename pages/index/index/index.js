//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    bannerInfo:[],//导航栏信息
    bannerId:"zcx",//baanner信息
    navIndex:0,//导航地址
    isrefresh:false,//刷新控制
    dynaicInfo:[]//动态信息
  },
  onLoad(){
    this.initData();
  },
  //搜索栏跳转
  onFocus(){
    wx.navigateTo({
      url: "/pages/index/search/search"
    });
  },
  //banner页面跳转
  navigateTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.item+"?bannerId="+this.data.bannerId
    });
  },
  //点击导航栏
  onChange(){

  },
  //初始化数据
  initData(){

  },
  //下拉刷新
  onPullDownRefresh(){
    if(isrefresh){
      return;
    }
  },
  //发布作品
  navigateToPublic(){
    wx.navigateTo({
      url: '/pages/index/public_works/public_works'
    });
  }
})
