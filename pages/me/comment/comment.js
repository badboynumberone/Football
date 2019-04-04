import {requestTest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      navIndex:0,//评论选择
      pageInfo:[{commentInfo:[],nowPageIndex:1,totalPage:1,totalSize:0,bottomFont:'Loading',nothingImg:'../../../images/pl.png',text:'您还没有评论哦~去首页看看吧'},
              {commentInfo:[],nowPageIndex:1,totalPage:1,totalSize:0,bottomFont:'Loading',nothingImg:'../../../images/pl.png',text:'您还没有评论哦~去首页看看吧'}]
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
      this.getData(1,1,20)
    },
    onChange:function(e){
      this.setData({
        navIndex:e.detail.index
      })
      if(this.data.pageInfo[this.data.navIndex].commentInfo!=false){return;}
      this.getData(this.data.navIndex+1,1,20)
    },
    //获取数据
    getData(type,pageNo,pageSize){
      let that = this;
      requestTest("/costomerProdutions/getCostomerCommentPage",{method:"POST",data:{
        type:type,
        pageNo:pageNo,
        pageSize
      }}).then(function(res){
        that.setData({
          ["pageInfo["+that.data.navIndex+"].commentInfo"]:that.data.pageInfo[that.data.navIndex].commentInfo.concat(res.dataList),
          ["pageInfo["+that.data.navIndex+"].totalPage"]:res.totalPage,
          ["pageInfo["+that.data.navIndex+"].totalSize"]:res.totalSize
        })
        console.log(that.data.pageInfo[that.data.navIndex].commentInfo)
        if(!that.data.pageInfo[that.data.navIndex].commentInfo.length){
          that.setData({
            ['pageInfo['+that.data.navIndex+"].bottomFont"]:'~NOTHING~'
          })
        }
        console.log(that.data.pageInfo[that.data.navIndex].nowPageIndex)
        if(that.data.pageInfo[that.data.navIndex].nowPageIndex >=that.data.pageInfo[that.data.navIndex].totalPage){
          that.setData({
            ['pageInfo['+that.data.navIndex+"].bottomFont"]:'~THE ENDING~'
          })
        }
      }).catch(function(err){
        wx.showToast({
          title: '加载失败请稍后重试！',icon: 'none',duration: 1500,mask: false,
        });
        return;
      }) 
    },
    //下拉加载
    onReachBottom(){
      if(this.data.pageInfo[this.data.navIndex].bottomFont=="~THE ENDING~" || this.data.pageInfo[this.data.navIndex].bottomFont=="~NOTHING~"){
        return;
      }
      try{
        this.getDynaicList(this.data.navIndex+1,this.data.pageInfo[this.data.navIndex].nowPageIndex+1,6)
      }catch(e){
        return;
      }
      this.setData({
        ["pageInfo["+this.data.navIndex+"].nowPageIndex"]:this.data.pageInfo[this.data.navIndex].nowPageIndex+1
      })
    }
  })