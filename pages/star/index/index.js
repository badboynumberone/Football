import {checkLogin} from '../../../utils/util';
import {request} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      isreFreshing:false,
      bannerInfo:{},//轮播信息
      siteInfo:[],//站点信息
      totalPage:'',//总页数
      totalSize:'',//作品总数
      nowPageIndex:1,//当前页数
      bottomFont:'Loading...',//底部提示信息
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
			
			try{
				this.getBanner();
				this.getSiteInfo(); 
			}catch(e){
				//TODO handle the exception
				return;
			}
      
    },
    onPullDownRefresh(){
      if(this.data.isreFreshing){
        return;
      }
      // wx.startPullDownRefresh();
      this.setData({
        siteInfo:[],
        bannerInfo:[],
        isreFreshing:true
      })
      this.getSiteInfo(); 
      this.getBanner();
      wx.showToast({
        title: '刷新成功',
        icon: 'none',
        duration: 1500
      });
        
      wx.stopPullDownRefresh();
    }  
      
    ,
    //获取banner
    getBanner(){
      let that = this;
			wx.showLoading({
				title: '加载中',
				mask:true
			})
      request("/startLevelIntrod/info",{
        method:"POST",
        data:{
        }
      }).then(function(res){
        that.setData({bannerInfo:res})
				wx.hideLoading()
      }).catch(function(err){
        console.log("获取轮播图失败")
      })
    },
    navigateTo(e){
      // if(!checkLogin(true)){
      //   return;
      // }
      wx.navigateTo({
        url: `${e.currentTarget.dataset.url}?id=${e.currentTarget.dataset.id}`
      });
    },
    //获取辅导站信息
    getSiteInfo(pageNo=1,pageSize=20){
      let that = this;
      request("/startLevelIntrod/pageList",{
        method:"POST",
        data:{
          pageNo,
          pageSize
        }
      }).then(function(res){
          console.log(res)
          that.setData({
            siteInfo:that.data.siteInfo.concat(res.dataList),
            totalPage:res.totalPage,
            totalSize:res.totalSize,
            isreFreshing:false
          })
          if(!that.data.siteInfo.length){
            that.setData({
              bottomFont:'~NOTHING~'
            })
            return;
          }
          if(that.data.nowPageIndex >=that.data.totalPage){
            that.setData({
              bottomFont:'~THE ENDING~'
            })
            
          }
          
      }).catch(function(){
        console.log("获取辅导站信息失败")
      })
    },
    onReachBottom(){
      if(this.data.bottomFont=="~THE ENDING~" || this.data.bottomFont=="~NOTHING~"){
        return;
      }
      console.log("haha")
      try{
        this.getSiteInfo(this.data.nowPageIndex+1,20);
      }catch(e){
        return;
      }
      this.setData({
        nowPageIndex:this.data.nowPageIndex+1
      })
    }
  })