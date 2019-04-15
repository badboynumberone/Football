// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';
import {request} from '../../../utils/request';
import {mapTime} from '../../../utils/util';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      pageIndex:1,//当前页面
      sexArray:['男','女'],
      sexOffset:false,
      sexIndex:0,//男女性别
      nowDate:'',//当前时间
      birthDay:'',//生日
      city:'',//当前城市
      identity:'',//身份证号
      name:'',//姓名
      stationName:'',//站点名称
      onePhoto:'',//一寸照片
      starInfo:[]//星级评定信息
    },
    // onChange(event) {
    //   const { picker, value, index } = event.detail;
    //   Toast(`当前值：${value}, 当前索引：${index}`);
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      this.setData({
        identity:options.identity
      })
      this.getStarInfo(options.identity)
    },
    //获取星级信息
    getStarInfo(id){
      let that = this;
      request('/userSign/getUserSign',{
        method:"POST",
        data:{
          type:2,
          cardNum:id
        }
      }).then(function(res){
        console.log(res)
        that.setData({
          identity:res.cerdCard,
          name:res.dataList.userSignInfo.userName,
          city:res.dataList.userSignInfo.cityAdress,
          stationName:res.stationName,
          onePhoto:res.dataList.userSignInfo.imgUrl,
          starInfo:mapTime(res.dataList.dataList,'creatTime').reverse()
        })
      }).catch(function(err){
        console.log("获取用户评级信息失败")
      })
    },
    queryStar(e){
      wx.navigateTo({
        url: '/pages/star/achievement_query/query_result_certificate?id='+e.currentTarget.dataset.id
      });
    },
    //查看电子证书
    toElectrical(){
      wx.navigateTo({
        url: '/pages/star/achievement_query/query_result_electrical'
      });
    }
  })