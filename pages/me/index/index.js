import request from '../../../utils/request';
import {checkLogin} from '../../../utils/util';
import {requestTest} from '../../../utils/request';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      headerType:'me',//页面内型
      isLogin:false,//是否登录
      functionList:[
        {iconSrc:"../../../images/wdzp@2x.png",text:"我的作品",linkAddress:""},
        {iconSrc:"../../../images/plscxz@2x.png",text:"我的收藏",linkAddress:""},
        {iconSrc:"../../../images/wdpl@2x.png",text:"我的评论",linkAddress:"",isNew:false},
        {iconSrc:"../../../images/wddd@2x.png",text:"我的订单",linkAddress:"",isAll:true},
      ],//用户功能列表
      pay_list:[
        {iconSrc:"../../../images/dfk.png",text:"待付款",messageNum:0},
        {iconSrc:"../../../images/dfh.png",text:"待发货",messageNum:0},
        {iconSrc:"../../../images/dsh.png",text:"待收货",messageNum:0},
        {iconSrc:"../../../images/ywc.png",text:"已完成"},
        {iconSrc:"../../../images/thtk.png",text:"退货退款"},
      ],//付款流程列表
      userInfo:{},//用户信息
      personalInfo:[
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'关注',typeNum:0},
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'粉丝',typeNum:0},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'获赞',typeNum:0},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'赞过',typeNum:0},
      ],
      userInfo:{nickName:undefined,avatarUrl:undefined},
      waitingPaymentCount: '',
      waitingShipmentCount: '',
      waitingReceiveCount: '',
      completedCount: '',
      refundCount: '',
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    onShow(){
      this.getMenuCount();
      this.selectComponent("#profile-header").initData();
      this.getOrderCount();
    },
    getMenuCount(){
      let that = this;
      if(wx.getStorageSync("userId") && wx.getStorageSync('userName')){
        requestTest("/costomerHomePage/headInfo",{
          method:"POST",
          data:{
            cosId:wx.getStorageSync("userId")
          }
        }).then(function(res){
          console.log(res)
          that.setData({
            ["personalInfo[0].typeNum"]:res.gaunZhu,
            ["personalInfo[1].typeNum"]:res.fenSiNum,
            ["personalInfo[2].typeNum"]:res.huoZan,
            ["personalInfo[3].typeNum"]:res.zanGuo,
            ["functionList[2].isNew"]:res.isLook
          })
        }).catch(function(err){

        })
      }
    },
    buyProcess(e){
      if(!checkLogin(false,true)){
        return;
      }
      switch (e.currentTarget.dataset.type) {
        case 0:{wx.navigateTo({url: '/pages/purchase/order/list?orderStatus=0'});break;}
        case 1:{wx.navigateTo({url: '/pages/purchase/order/list?orderStatus=1'});break;} 
        case 2:{wx.navigateTo({url: '/pages/purchase/order/list?orderStatus=2'});break;}
        case 3:{wx.navigateTo({url: '/pages/purchase/order/list?orderStatus=3'});break;}
        case 4:{wx.navigateTo({url: '/pages/purchase/refund/list'});break;}
        default:
          break;
      }  
    },
    navigateTo(e){
      if(!checkLogin(false,true)){
        return;
      }
      if(e.currentTarget.dataset.type==4){
        wx.navigateTo({url: '/pages/purchase/address/list'});
      }
      switch (e.currentTarget.dataset.type) {
        case 0:{wx.navigateTo({url: "/pages/me/my_collection_works/my_collection_works?title=myWorks"});break;}
        case 1:{wx.navigateTo({url: "/pages/me/my_collection_works/my_collection_works?title=myCollections"});break;} 
        case 2:{wx.navigateTo({url: '/pages/me/comment/comment'});break;}
        case 3:{wx.navigateTo({url: '/pages/purchase/order/list'});break;}
        default:
          break;
      }  
    },
    getOrderCount(){
      let that = this;
      if(wx.getStorageSync("userId") && wx.getStorageSync('userName')){
        request.post('/order/getOrderCount').then(function (data) {
          that.setData({
            ["pay_list[0].messageNum"]: data.waitingPaymentCount,
            ["pay_list[1].messageNum"]: data.waitingShipmentCount,
            ["pay_list[2].messageNum"]: data.waitingReceiveCount
          })
        })
      }
    }
  })