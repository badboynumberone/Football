import {request} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      commentIndex:0,//评论选择
      contentList:[],//作品
      totalPage:'',//总页数
      totalSize:'',//作品总数
      nowPageIndex:1,//当前页数
      bottomFont:'Loading...',//底部提示信息
      type:1,//请求接口
      nothingImg:''
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      if(options.title == "myWorks"){
        wx.setNavigationBarTitle({
          title: "我的作品"
        });
        this.setData({
          type:1,
          nothingImg:'../../images/zp.png',
          text:'您还没有发布作品哦，赶紧去首页看看吧！',
        })
        this.getDynaic(wx.getStorageSync('userId'),1,1,6);
      }
      if(options.title=="myCollections"){
        wx.setNavigationBarTitle({
          title: "我的收藏"
        });
        this.setData({
          type:2,
          nothingImg:'../../images/sc.png',
          text:'您还没有收藏过作品哦，赶紧去首页看看吧！',
        })
        this.getDynaic(wx.getStorageSync('userId'),2,1,6);
      }
    },
    getDynaic(userId='',type=1,pageNo=1,pageSize=6){
      let that = this;
      request("/costomerHomePage/costomerPageList",{
        method:"POST",
        data:{
          type,
          cosId:userId,
          pageNo,
          pageSize
        }
      }).then(function(res){
          console.log(res)
          that.setData({
            contentList:that.data.contentList.concat(res.dataList),
            totalPage:res.totalPage,
            totalSize:res.totalSize
          })
          if(that.data.nowPageIndex >=that.data.totalPage){
            that.setData({
              bottomFont:'~THE ENDING~'
            })
          }
          if(!that.data.contentList.length){
            that.setData({
              bottomFont:'~NOTHING~'
            })
          }
      }).catch(function(){
        console.log("获取菜单数量失败")
      })
    },
    onReachBottom(){
      if(this.data.bottomFont=="~THE ENDING~" || this.data.bottomFont=="~NOTHING~"){
        return;
      }
      console.log("haha")
      try{
        this.getDynaic(wx.getStorageSync('userId'),this.data.type,this.data.nowPageIndex+1,6)
      }catch(e){
        return;
      }
      this.setData({
        nowPageIndex:this.data.nowPageIndex+1
      })
    }
  })