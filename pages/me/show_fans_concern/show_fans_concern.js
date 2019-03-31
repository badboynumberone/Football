import {requestTest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      contentList:[],//关注粉丝列表
      totalPage:2,//总页数
      totalSize:2,//总数
      nowPageIndex:0,//当前页数
      isLoading:false,//判断是否正在加载
      bottomFont:'Loading'//到底了
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options.pageType==0 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '关注'
        });
        this.getConcern(1,'',this.data.nowPageIndex+1,20);
          //根据options.userId请求获取数据
      }else if(options.pageType==1 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '粉丝'
        });
        this.getFans(1,'',this.data.nowPageIndex+1,20);
      }else if(options.pageType==0 && options.isMe=='home'){
        wx.setNavigationBarTitle({
          title: '关注'
        });
        this.getConcern(2);
      }else if(options.pageType==1 && options.isMe=='home'){
        wx.setNavigationBarTitle({
          title: '粉丝'
        });
        this.getFans(2);
      }
    },
    //获取关注的人
    getConcern(type,userId,pageNo,pageSize){
      if(this.data.nowPageIndex>=this.data.totalPage || this.data.isLoading){
        return;
      }
      let that = this;
      this.setData({
        isLoading:true
      })
      requestTest("/costomerProdutions/getFollow",{
        method:"POST",
        data:{
          type,
          cosId : userId,
          pageNo,
          pageSize
        }
      }).then(function(res){
        console.log(res)
        
        that.setData({
          contentList:that.data.contentList.concat(res.dataList),
          totalPage:res.totalPage,
          totalSize:res.totalSize,
          nowPageIndex:that.data.nowPageIndex+1,
          isLoading:false
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
        console.log("获取关注失败")
      })
    },
    getFans(type,userId,pageNo){
      if(this.data.nowPageIndex>=this.data.totalPage || this.data.isLoading){
        return;
      }
      let that = this;
      this.setData({
        isLoading:true
      })
      requestTest("/costomerProdutions/getCostomerFenSi",{
        method:"POST",
        data:{
          type,
          cosId : userId,
          pageNo
        }
      }).then(function(res){
        console.log(res)        
        that.setData({
          contentList:that.data.contentList.concat(res.dataList),
          totalPage:res.totalPage,
          totalSize:res.totalSize,
          nowPageIndex:that.data.nowPageIndex+1,
          isLoading:false
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
        console.log("获取粉丝失败失败")
      })
    }
  })