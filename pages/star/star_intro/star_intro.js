import {request} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      bannerId:'',
      describesd:'',
      bannerImg:''
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
      request("/startLevelIntrod/getById",{
        method:"POST",
        data:{
          id
        }
      }).then(function(res){
        var regex = new RegExp('<img', 'gi');
        
        that.setData({
          describesd:res.describesd.replace(regex, '<img style="max-width: 100%;"'),
          bannerImg:res.imgUrl
        })
      }).catch(function(err){
        console.log("获取星级介绍失败")
      })
    }
  
    
  })