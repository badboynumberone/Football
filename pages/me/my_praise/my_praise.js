import {request} from '../../../utils/request';
import {mapTime} from '../../../utils/util';
import {clearLine} from '../../../utils/util';
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
      text:'',//空缺文字
      offset:0
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
      //获取用户id
      if(options.pageType==2 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '谁赞过我'
        });
        this.setData({
          nothingImg:'../../images/z.png',
          api:"/costomerProdutions/getCostomerBeiZan",
          text:'您还没有被别人赞过哦，赶紧去首页看看吧！',
          userId:wx.getStorageSync("userId"),
          offset:1
        })
        this.getData("/costomerProdutions/getCostomerBeiZan",wx.getStorageSync("userId"),1,20);
          //发送请求获取数据
      }else if(options.pageType==3 && options.isMe=='me'){
        wx.setNavigationBarTitle({
          title: '我赞过谁'
        });
        this.setData({
          nothingImg:'../../images/z.png',
          api:"/costomerProdutions/getCostomerZan",
          text:'您还没有赞过别人哦~赶紧去首页看看吧！',
          userId:wx.getStorageSync("userId"),
          offset:2
        })
        this.getData("/costomerProdutions/getCostomerZan",wx.getStorageSync("userId"),1,20);
      }
      else if(options.pageType==2 && options.isMe=='home'){
        wx.setNavigationBarTitle({
          title: '谁赞过TA'
        });
        this.setData({
          api:"/costomerProdutions/getCostomerBeiZan",
          userId:options.userId,
          offset:3
        })
        this.getData("/costomerProdutions/getCostomerBeiZan",options.userId,1,20);
          //发送请求获取数据
      }else if(options.pageType==3 && options.isMe=='home'){
        wx.setNavigationBarTitle({
          title: 'TA赞过谁'
        });
        this.setData({
          api:"/costomerProdutions/getCostomerZan",
          userId:options.userId,
          offset:4
        })
        this.getData("/costomerProdutions/getCostomerZan",options.userId,1,20);
      }
    },
    onShow(){
      console.log("hah")
    },
    //获取数据
    //获取数据
    getData(api,userId,pageNo,pageSize){
      let that = this;
      request(api,{
        method:"POST",
        data:{
          cosId : userId,
          pageNo,
          pageSize
        }
      }).then(function(res){
        if(that.data.offset == 1 || that.data.offset == 3 ){
          clearLine(res.dataList)
					that.setData({
						contentList:that.data.contentList.concat(mapTime(res.dataList,"creat_time"))
					})
				}else{
          that.setData({
            contentList:that.data.contentList.concat(res.dataList),
            totalPage:res.totalPage,
            totalSize:res.totalSize,
          })
        }
        
				
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