import {requestTest} from '../../../utils/request';
import {getNowTime} from '../../../utils/util';
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      worksId:'',//作品Id
      worksInfo:[],//作品信息
      isMyWorks:true,//true代表是自己
      ratingContent:'',//评论内容
      rating:[],//评论信息
      totalPage:null,//总页数
      totalSize:null,//评论总条数数
      placeHoderValue:'添加评论',//默认输入框字段
      isFocus:false,//是否有光标
      firstUserId:0,//一级评论用户id
      secondUserId:0,//二级用户评论id
      showTitle:'添加成功',//提示内容
      nowCommentPageIndex:1,//当前评论页数
      nowCommentIndex:0,//当前评论的下标
      nowReplyUser:'',//当前回复用户
      isLoading:false,//是否正在加载
      bottomFont:'Loading',
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.setData({
        worksId:options.worksId
      })
      
      this.getRating(this.data.nowCommentPageIndex);
    },
    onShow(){
      this.getData();
    },
    //触底加载更多评论
    onReachBottom(){
      if(this.data.nowCommentPageIndex>=this.data.totalPage || this.data.isLoading){
        this.setData({
          bottomFont:'~THE ENDING~'
        })
        return;
      }
      this.getRating(this.data.nowCommentPageIndex+1)
     
      this.setData({
        nowCommentPageIndex:this.data.nowCommentPageIndex+1
      })
    },
    //获取评论
    getRating(pageNo){
      let that = this;
      console.log(pageNo)
      this.setData({isLoading:true})
      requestTest('/publishProdution/getProdutionComment',{
        method:"POST",
        data:{
          produtionId:that.data.worksId,
          pageNo,
          pageSize:10
        }
      }).then(function(res){
        that.setData({
          rating:that.data.rating.concat(res.dataList),
          totalPage:parseInt(res.totalPage),
          totalSize:parseInt(res.totalSize),
          isLoading:false
        })
        console.log(res.totalPage)
      }).catch(function(err){
        console.log("获取评论列表失败")
        that.setData({
          isLoading:false
        })
        return;
      })
    },
    //用户离开输入框
    blurRating(e){
      if(!e.detail.value){
        this.setData({
          placeHoderValue:'添加评论',
          firstUserId:0,
          secondUserId:0
        })
      }
    },
    //回复用户
    replyUser(e){
      this.setData({
        isFocus:true,
        placeHoderValue:'回复用户'+e.currentTarget.dataset.name,
        nowReplyUser:e.currentTarget.dataset.name,
        firstUserId:e.currentTarget.dataset.firstid,
        secondUserId:e.currentTarget.dataset.secondid,
        nowCommentIndex:e.currentTarget.dataset.index
      })
    },
    //添加评论
    addRating(e){
      let that = this;
      if(e.detail){
        this.sendRating(this.data.firstUserId,this.data.secondUserId)
      }
    },
    //发送评论
    sendRating(pid,commentId){
      let that =this;
      let nowTime = getNowTime();
      let firstContent={
        commentHeadImg:wx.getStorageSync("userHeader"),
        commentNickName:wx.getStorageSync("userName"),
        costomerId:wx.getStorageSync('costomerId'),
        content:that.data.ratingContent,
        creatTime:nowTime
      }
      let SecondContent={
        costomerId:wx.getStorageSync('costomerId'),
        commentHeadImg:wx.getStorageSync("userHeader"),
        commentNickName:wx.getStorageSync("userName"),
        content:that.data.ratingContent,
        creatTime:nowTime,
        childCommentNickName:that.data.nowReplyUser
      }
      requestTest('/produtionComment/comment/insert',{
        method:"POST",
        data:{
          produtionId:that.data.worksId,
          content:that.data.ratingContent,
          pid,
          commentId
        }
      }).then(function(res){
        if(res==1){
          if(!pid){
            that.setData({
              showTitle:"添加成功",
              rating:that.data.rating.concat([firstContent]),
              ratingContent:''
            })
          }else{
            that.setData({
              showTitle:"回复成功",
              ['rating['+that.data.nowCommentIndex+'].commentChild']:that.data.rating[that.data.nowCommentIndex].commentChild.concat([SecondContent]),
              ratingContent:''
            })
          }
          wx.showToast({
            title: that.data.showTitle,icon: 'none',duration: 1500
          });
          console.log("发布成功")
        }
        console.log(res)
      }).catch(function(err){
        console.log('评论失败')
      })
    },
    //数据绑定
    onChange(e){
      let name = e.currentTarget.dataset.bind;
      this.setData({
        [name]:e.detail.trim()
      })
    },
    //初始化化数据
    getData(){
      let that = this;
      if(this.data.worksId){
        requestTest("/publishProdution/info",{
          method:"POST",
          data:{
            id:that.data.worksId
          }
        }).then(function(res){
          console.log("作品信息")
          console.log(res)
          if(res){
            that.setData({
              worksInfo:res
            })
          }
        }).catch(function(err){
          wx.showToast({
            title: '页面加载失败,请稍后重试',icon: 'none',duration: 1500,mask: false
          });
        })
      }
    },
    //处理banner滚动
    bannerChange(e){
      this.setData({
        bannerIndex:e.detail.current+1
      })
    },
    //去个人首页
    toHomePage(e){
      wx.navigateTo({
        url: '/pages/index/home_page/home_page?userId='+e.currentTarget.dataset.customer
      });
    },
    //处理关注
    handleConcern(e){
      let api = '';
      let that = this;
      if(this.data.worksInfo.isFollow){
        api='/produtionComment/cancleFllow';
        Dialog.confirm({
          title: '确定不在关注？',
          message: ' ',
          cancelButtonText: '取消',
          confirmButtonText: '确定'
        }).then(() => {
          that.setConcern(api);
        }).catch(()=>{
          return;
        });
      }else{
        api='/produtionComment/flow/insert'; 
        that.setConcern(api);
      }
    },
    //设置关注
    setConcern(api){
      let that = this;
      requestTest(api,{
        method:"POST",
        data:{
          id:that.data.worksInfo.coustmoerId
        }
      }).then(function(res){
        if(api=='/produtionComment/flow/insert'){
          that.setData({
            ['worksInfo.isFollow']:true
          })
        }else{
          that.setData({
            ['worksInfo.isFollow']:false
          })
        }
      }).catch(function(err){
      })
    },
    //处理赞和收藏
    handleClick(e){
      let that = this;
      let api='';
      let type=1;
      if(e.currentTarget.dataset.type==1){
        if(that.data.worksInfo.isPraise){
          api='/produtionComment/cancel/praise';type=1;
        }else{
          api='/produtionComment/praise';type=2;
        }
      }else{
        if(that.data.worksInfo.isCollection){
          api='/produtionComment/cancel/collection';type=3;
        }else{
          api='/produtionComment/collection';type=4;
        }
      }
      that.setLike(api,type)
    },
    //发送请求
    setLike(api,type){
      let that = this;
      requestTest(api,{
        method:"POST",
        data:{
          id:that.data.worksId
        }
      }).then(function(res){
        switch(type){
          case 1: that.setData({['worksInfo.isPraise']:false,['worksInfo.produtionAssist']:parseInt(that.data.worksInfo.produtionAssist)-1});break;
          case 2: that.setData({['worksInfo.isPraise']:true,['worksInfo.produtionAssist']:parseInt(that.data.worksInfo.produtionAssist)+1});break;
          case 3: that.setData({['worksInfo.isCollection']:false,['worksInfo.productionCollection']:parseInt(that.data.worksInfo.productionCollection)-1});break;
          case 4: that.setData({['worksInfo.isCollection']:true,['worksInfo.productionCollection']:parseInt(that.data.worksInfo.productionCollection)+1});break;
        }
      }).catch(function(err){
      })
    }
  })