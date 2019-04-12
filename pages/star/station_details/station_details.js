import {request} from '../../../utils/request'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      stationInfo:{},//站点信息
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
      this.getStationInfo(options.id)
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
    },
    //获取站点信息
    getStationInfo(id){
      let that = this;
      request("/startLevelIntrod/stationInfo",{
        method:"POST",
        data:{
          id
        }
      }).then(function(res){
        that.setData({
          stationInfo:res
        })
        console.log(res)
      }).catch(function(err){
        console.log("获取站点信息失败")
      })
    }
    
  })