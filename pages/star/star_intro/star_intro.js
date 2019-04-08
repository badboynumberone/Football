import {requestTest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      bannerId:'',
      describesd:'',
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options.id){
        this.setData({
          bannerId:options.id
        })
      }
      this.getStarRules(this.data.bannerId);
    },
  
    //获取星级评定规则
    getStarRules(id){
      let that = this;
      requestTest("/startLevelIntrod/getById",{
        method:"POST",
        data:{
          id
        }
      }).then(function(res){
        that.setData({
          describesd:res.describesd
        })
      }).catch(function(err){
        console.log("获取星级介绍失败")
      })
    }
  
    
  })