import {requestTest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      contentList:[],//关注粉丝列表
      totalPage:1,//总页数
      totalSize:1,//总数
      nowPageIndex:1,//当前页数
      api:'',//当前请求接口
      bottomFont:'Loading',//到底了
      nothingImg:'',//空缺图片
      text:''//空缺文字
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options.pageType==0 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '关注',
        });
        this.setData({
          nothingImg:'../../images/gz.png',
          api:"/costomerProdutions/getFollow",
          text:'还没有关注，赶紧去首页看看吧！',
          userId:wx.getStorageSync("userId")
        })
        this.getData("/costomerProdutions/getFollow",wx.getStorageSync("userId"),1,20);
          //根据options.userId请求获取数据
      }else if(options.pageType==1 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '粉丝',
          
        });
        this.setData({
          api:"/costomerProdutions/getCostomerFenSi",
          nothingImg:'../../images/fs.png',
          text:'还没有粉丝，赶紧去首页看看吧！',
          userId:wx.getStorageSync("userId")
        })
        this.getData("/costomerProdutions/getCostomerFenSi",wx.getStorageSync("userId"),1,20);
      }else if(options.pageType==0 && options.isMe=='home'){
        wx.setNavigationBarTitle({
          title: '关注'
        });
        this.setData({
          api:"/costomerProdutions/getFollow",
          userId:options.userId
        })
        this.getData("/costomerProdutions/getFollow",options.userId,1,20);
      }else if(options.pageType==1 && options.isMe=='home'){
        wx.setNavigationBarTitle({
          title: '粉丝'
        });
        this.setData({
          api:"/costomerProdutions/getCostomerFenSi",
          userId:options.userId
        })
        this.getData("/costomerProdutions/getCostomerFenSi",options.userId,1,20);
      }
    },
    toHome(e){
      wx.navigateTo({
        url: '/pages/index/home_page/home_page?userId='+e.currentTarget.dataset.customer
      });
        
    },
    //获取数据
    getData(api,userId,pageNo,pageSize){
      let that = this;
      requestTest(api,{
        method:"POST",
        data:{
          cosId : userId,
          pageNo,
          pageSize
        }
      }).then(function(res){
        console.log()
        that.setData({
          contentList:that.data.contentList.concat(res.dataList),
          totalPage:res.totalPage,
          totalSize:res.totalSize,
        })
        if(!that.data.contentList.length){
          that.setData({
            bottomFont:"~NOTHING~"
          })
          return;
        }
        if(that.data.nowPageIndex>=that.data.totalPage){
          that.setData({
            bottomFont:"~THE ENDING~"
          })
        }
        
      }).catch(function(err){
        console.log("获取数据失败")
      })
    },
    //下拉加载
    onReachBottom(){
      if(this.data.bottomFont=="~THE ENDING~" || this.data.bottomFont=="~NOTHING~"){
        return;
      }
      try{
        this.getData(this.data.api,this.data.userId,this.data.pageNo+1,20)
      }catch(e){
        return;
      }
      this.setData({
        pageNo:this.data.pageNo+1
      })
    }
  })