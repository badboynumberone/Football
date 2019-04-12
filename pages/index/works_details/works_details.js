import {request} from '../../../utils/request';
import {mapTime,getNowTime} from '../../../utils/util';
import {checkLogin} from '../../../utils/util';
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      isAnswer:true,
      currentReplyId:'',//当前评论id
      isPop:false,//是否弹出选择框
      userId:wx.getStorageSync("userId"),//当前userId
      currentProductionId:'',
      currentNavIndex:'',//当前索引
      worksId:'',//作品Id
      worksInfo:{},//作品信息
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
      bottomFont:'Loading',//底部信息
      currentE:null,//当前指针
      currentContent:''//当前评论内容
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options.worksId){
        app.globalData.currentWorksId=options.worksId
      }
      
      this.setData({
        worksId:options.worksId || app.globalData.currentWorksId,//作品ID
       
      })
      if(options.navIndex || options.index){
        this.setData({
          currentNavIndex:options.navIndex,//导航栏id
          currentProductionId:options.index//作品所在id
        })
      }
      
      
      this.getRating(options.worksId,1,20);
      console.log(options)
    },
    onShow(){
      this.getData();
    },
    
    //触底加载更多评论
    onReachBottom(){
      if(this.data.bottomFont=="~THE ENDING~" || this.data.bottomFont=="~NOTHING~"){
        return;
      }
      try{
        this.getRating(this.data.worksId,this.data.nowCommentPageIndex+1,20)
      }catch(e){
        return;
      }
      this.setData({
        nowCommentPageIndex:this.data.nowCommentPageIndex+1
      })
    },
    //获取评论
    getRating(produtionId,pageNo,pageSize=20){
      let that = this;
      this.setData({isLoading:true})
      request('/publishProdution/getProdutionComment',{
        method:"POST",
        data:{
          produtionId,
          pageNo,
          pageSize,
        }
      }).then(function(res){
        that.setData({
          rating:that.data.rating.concat(mapTime(res.dataList,'creatTime')),
          totalPage:parseInt(res.totalPage),
          totalSize:parseInt(res.totalSize),
        })
        if(!that.data.rating.length){
          that.setData({
            bottomFont:'~NOTHING~'
          })
          return;
        }
        if(that.data.nowCommentPageIndex>=that.data.totalPage){
          that.setData({
            bottomFont:'~THE ENDING~'
          })
          return;
        }
        
        
      }).catch(function(err){
        console.log("获取评论列表失败")
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
    onClose(){
      this.setData({
        isPop:false
      })
    },
    //处理用户本人点击
    handleItem(e){
      console.log(e)
      if(this.data.userId !=this.data.worksInfo.coustmoerId){
        return;
      }
      this.setData({
        isPop:true,
        currentE:e,
        currentReplyId:e.currentTarget.dataset.customer,
        currentContent:e.currentTarget.dataset.content
      })
    },
    //回复
    answerItem(){
      this.setData({
        isPop:false
      })
      this.setReplyInfo(this.data.currentE)
    },
    //删除
    deleteItem(){
      let that = this;
      this.setData({
        isPop:false
      })
      //当前本地位置
      let firstIndex =  this.data.currentE.currentTarget.dataset.index;
      let secondIndex =  this.data.currentE.currentTarget.dataset.idx;
      //线上位置
      console.log(secondIndex)
      console.log(firstIndex)
      let commentId = this.data.currentE.currentTarget.dataset.secondid;
      
      //先发请求请求成功后再删啊
      Dialog.confirm({
        title: '确定删除评论？',
          message: ' ',
          cancelButtonText: '取消',
          confirmButtonText: '确定'
      }).then(() => {
        request("/produtionComment/comment/delete",{
          method:"POST",
          data:{
            produtionId:that.data.worksId,
            commentId:commentId
          }
        }).then(function(res){
          let rating = that.data.rating;
          if(secondIndex == undefined){
            rating.splice(parseInt(firstIndex),1);
            that.setData({
              rating:rating
            })
            return;
          }
          
          rating[firstIndex].commentChild.splice(secondIndex,1);
          that.setData({
            rating
          })
        }).catch(function(err){
          console.log("上传有误")
        })
      }).catch(()=>{
        return;
      });
      
    },
    cancelItem(){
      this.setData({
        isPop:false
      })
    },
    //回复用户
    replyUser(e){
      this.setReplyInfo(e)
    },
    //设置回复信息
    setReplyInfo(e){
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
      
      if(!checkLogin(true,false)){
        return;
      }
      let that =this;
      let nowTime = getNowTime();
      let firstContent={
        commentHeadImg:wx.getStorageSync("userHeader"),
        commentNickName:wx.getStorageSync("userName"),
        costomerId:wx.getStorageSync('costomerId'),
        content:that.data.ratingContent,
        creatTime:nowTime,
        costomerId:wx.getStorageSync("userId"),
        newComment:true
      }
      let SecondContent={
        costomerId:wx.getStorageSync('costomerId'),
        commentHeadImg:wx.getStorageSync("userHeader"),
        commentNickName:wx.getStorageSync("userName"),
        content:that.data.ratingContent,
        creatTime:nowTime,
        childCommentNickName:that.data.nowReplyUser,
        costomerId:wx.getStorageSync("userId"),
        newComment:true
      }
      request('/produtionComment/comment/insert',{
        method:"POST",
        data:{
          produtionId:that.data.worksId,
          content:that.data.ratingContent,
          pid,
          commentId
        }
      }).then(function(res){
        console.log(res)
        if(res){
          if(!pid){
            let addInfo = that.data.rating;
            firstContent.id = res;
            addInfo.unshift(firstContent)
            that.setData({
              showTitle:"添加成功",
              rating:addInfo,
              ['worksInfo.produtionNum']:parseInt(that.data.worksInfo.produtionNum)+1,
              ratingContent:''
            })
          }else{
            console.log(that.worksInfo)
            SecondContent.id = res;
            that.setData({
              showTitle:"回复成功",
              ['worksInfo.produtionNum']:parseInt(that.data.worksInfo.produtionNum)+1,
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
        request("/publishProdution/info",{
          method:"POST",
          data:{
            id:app.globalData.currentWorksId
          }
        }).then(function(res){
          console.log("作品信息")
          console.log(res)
          if(res){
            that.setData({
              worksInfo:mapTime(res,'produtionCreatTime')
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
    navigateToIndex(){
      wx.switchTab({
        url: '/pages/index/index/index'
      });
    },
    //去个人首页
    toHomePage(e){
      if(!checkLogin(true,false)){
        return;
      }
      wx.navigateTo({
        url: '/pages/index/home_page/home_page?userId='+e.currentTarget.dataset.customer
      });
    },
    //处理关注
    handleConcern(e){
      if(!checkLogin(true,false)){
        return;
      }
      let api = '';
      let that = this;
      if(this.data.worksInfo.isFollow){
        api='/produtionComment/cancleFllow';
        Dialog.confirm({
          title: '确定不再关注？',
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
      request(api,{
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
      if(!checkLogin(true,false)){
        return;
      }
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
      request(api,{
        method:"POST",
        data:{
          id:that.data.worksId
        }
      }).then(function(res){
        switch(type){
          case 1: that.setData({['worksInfo.isPraise']:false,['worksInfo.produtionAssist']:parseInt(that.data.worksInfo.produtionAssist)-1});app.globalData.num=parseInt(that.data.worksInfo.produtionAssist);app.globalData.isPraise = false;app.globalData.index = that.data.currentProductionId;app.globalData.NavIndex=that.data.currentNavIndex;break;
          case 2: that.setData({['worksInfo.isPraise']:true,['worksInfo.produtionAssist']:parseInt(that.data.worksInfo.produtionAssist)+1});app.globalData.num=parseInt(that.data.worksInfo.produtionAssist);app.globalData.isPraise = true;app.globalData.index = that.data.currentProductionId;app.globalData.NavIndex=that.data.currentNavIndex;break;
          case 3: that.setData({['worksInfo.isCollection']:false,['worksInfo.productionCollection']:parseInt(that.data.worksInfo.productionCollection)-1});break;
          case 4: that.setData({['worksInfo.isCollection']:true,['worksInfo.productionCollection']:parseInt(that.data.worksInfo.productionCollection)+1});break;
        }
      }).catch(function(err){
      })
    },
    //用户分享
    onShareAppMessage(res){
      return {
        title:"娃娃足球工程"
      }
    }
  })