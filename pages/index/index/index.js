import {requestTest} from '../../../utils/request';
//index.js


Page({
  data: {
    isLoading:false,//是否正在加载
    isrefresh:false,//是否正在刷新
    bannerInfo:[],//导航栏信息
    navIndex:0,//导航地址
    isrefresh:false,//刷新控制
    pageInfo:[{dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0},
              {dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0},
              {dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0},
              {dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0}]//分页信息
  },
  onLoad(){
    this.initData();
  },
  //搜索栏跳转
  toSearch(){
    wx.navigateTo({
      url: "/pages/index/search/search"
    });
  },
  //banner页面跳转
  navigateTo(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.item+"?bannerId="+e.currentTarget.dataset.type
    });
  },
  //点击导航栏
  onChange(e){
    this.setData({
      navIndex:e.detail.index
    })
    if(this.data.pageInfo[e.detail.index].dynaicInfo.length || this.data.pageInfo[e.detail.index].nowPageIndex >=this.data.pageInfo[e.detail.index].totalPage){
      return;
    }
    this.getDynaicList(this.data.navIndex,1);
  },
  getDynaicList(index,pageNo){
    let that = this;
    requestTest("/appIndex/pageList",{method:"POST",data:{
      type:index+1,
      pageNo:pageNo,
      pageSize:20
    }}).then(function(res){
      that.setData({
        ["pageInfo["+index+"].dynaicInfo"]:res.dataList,
        ["pageInfo["+index+"].nowPageIndex"]:that.data.pageInfo[index].nowPageIndex+1,
        ["pageInfo["+index+"].totalPage"]:res.totalPage,
        ["pageInfo["+index+"].totalSize"]:res.totalSize
      })
      console.log(that.data.pageInfo)
    }).catch(function(err){
      wx.showToast({
        title: '加载失败请稍后重试！',icon: 'none',duration: 1500,mask: false,
      });
      return;
    }) 
  },
  //初始化数据
  initData(){
    //获取首页轮播图
    let that =this;
    requestTest("/banner/getList",{method:"POST"}).then(function(res){
      if(res){
         let result = res;
         that.setData({bannerInfo:result});
      }
    }).catch(function(err){
      wx.showToast({
        title: '轮播图加载失败，请稍后重试',
        icon: 'none',
        duration: 1500,
      });
    })
    //获取列表
    this.getDynaicList(0,1);
  },
  //下拉刷新
  onPullDownRefresh(){
    if(this.data.isrefresh || this.data.isLoading){
      return;
    }
    this.getDynaicList(this.data.navIndex,1);
    wx.stopPullDownRefresh();
  },
  //发布作品
  navigateToPublic(){
    wx.navigateTo({
      url: '/pages/index/public_works/public_works'
    });
  },
  //触底加载
  onReachBottom(){
    let that =this;
    if(this.data.isLoading || this.data.isrefresh){
      return;
    }
    if(this.data.pageInfo[that.data.navIndex].nowPageIndex >=this.data.pageInfo[that.data.navIndex].totalPage){
      return;
    }
    this.setData({
      isLoading:true
    })
    requestTest("/appIndex/pageList",{method:"POST",data:{
      type:that.data.navIndex+1,
      pageNo:that.data.pageInfo[that.data.navIndex].nowPageIndex,
      pageSize:20
    }}).then(function(res){
      that.setData({
        isLoading:false,
        ["pageInfo["+that.data.navIndex+"].dynaicInfo"]:that.data.pageInfo[that.data.navIndex].dynaicInfo.concat(res.dataList),
        ["pageInfo["+that.data.navIndex+"].nowPageIndex"]:that.data.pageInfo[that.data.navIndex].nowPageIndex+1,
        ["pageInfo["+that.data.navIndex+"].totalPage"]:res.totalPage,
        ["pageInfo["+that.data.navIndex+"].totalSize"]:res.totalSize
      })
      console.log(that.data.pageInfo)
    }).catch(function(err){
      wx.showToast({
        title: '加载失败请稍后重试！',icon: 'none',duration: 1500,mask: false,
      });
      return;
    }) 
  }
})
