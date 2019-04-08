import {requestTest} from '../../../utils/request';
import Dialog from '../../../miniprogram_npm/vant-weapp/dialog/dialog'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userId:'',
      navIndex:0,//内容选择
      personalInfo:[
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'关注',typeNum:0},
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'粉丝',typeNum:20},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'获赞',typeNum:25},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'赞过',typeNum:99},
      ],
      singleInfo:{},//个人信息
      pageInfo:[
        {dynaicInfo:[],nowPageIndex:1,totalPage:2,totalSize:0,bottomFont:'Loading'},
        {dynaicInfo:[],nowPageIndex:1,totalPage:2,totalSize:0,bottomFont:'Loading'}
      ],
      isLoading:false
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options){
        this.setData({
          userId:options.userId
        })
        this.getUserInfo(options.userId)
        this.getDynaic(options.userId)
      }
      console.log(options)
    },
    //关心
    handleConcern(){
      let api = '';
      let that = this;
      if(this.data.singleInfo.isFollow){
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
    setConcern(api){
      let that = this;
      requestTest(api,{
        method:"POST",
        data:{
          id:that.data.userId
        }
      }).then(function(res){
        if(api=='/produtionComment/flow/insert'){
          that.setData({
            ["singleInfo.isFollow"]:true
          })
        }else{
          that.setData({
            ["singleInfo.isFollow"]:false
          })
        }
      }).catch(function(err){
      })
    },
    //获取用户信息
    getUserInfo(id){
      let that = this;
      requestTest("/costomerHomePage/headInfo",{
        method:"POST",
        data:{
          cosId:id
        }
      }).then(function(res){
        that.setData({
          singleInfo:res
        })
        that.setData({
          ['personalInfo[0].typeNum']:res.gaunZhu,
          ['personalInfo[1].typeNum']:res.fenSiNum,
          ['personalInfo[2].typeNum']:res.huoZan,
          ['personalInfo[3].typeNum']:res.zanGuo
        })
      }).catch(function(){
        console.log("获取菜单数量失败")
      })
    },
    onChange(e){
      console.log(e)
      
      this.setData({
        navIndex:e.detail.index
      })
      if(this.data.pageInfo[this.data.navIndex].dynaicInfo != false){
        return;
      }
      this.getDynaic(this.data.userId,e.detail.index+1,1,20)
    },
    //获取用户动态信息
    getDynaic(userId='',type=1,pageNo=1,pageSize=6){
      let that = this;
      requestTest("/costomerHomePage/costomerPageList",{
        method:"POST",
        data:{
          type,
          cosId:userId,
          pageNo,
          pageSize
        }
      }).then(function(res){
          type-=1;
          that.setData({
            ["pageInfo["+type+"].dynaicInfo"]:that.data.pageInfo[that.data.navIndex].dynaicInfo.concat(res.dataList),
            ["pageInfo["+type+"].totalPage"]:res.totalPage,
            ["pageInfo["+type+"].totalSize"]:res.totalSize
          })
          console.log(that.data.pageInfo[that.data.navIndex].dynaicInfo.length)
          
          console.log(that.data.pageInfo[that.data.navIndex].nowPageIndex)
          if(that.data.pageInfo[that.data.navIndex].nowPageIndex >=that.data.pageInfo[that.data.navIndex].totalPage){
            that.setData({
              ['pageInfo['+that.data.navIndex+"].bottomFont"]:'~THE ENDING~'
            })
          }
          if(!that.data.pageInfo[that.data.navIndex].dynaicInfo.length){
            that.setData({
              ['pageInfo['+that.data.navIndex+"].bottomFont"]:'~NOTHING~'
            })
          }
      }).catch(function(){
        console.log("获取菜单数量失败")
      })
    },
    navigateTo(e){
      wx.navigateTo({
        url: e.currentTarget.dataset.url + "?" +'pageType='+e.currentTarget.dataset.type + "&" + 'isMe=home&userId=' + this.data.userId
      });
    },
    onReachBottom(){
      if(this.data.pageInfo[this.data.navIndex].bottomFont=="~THE ENDING~" || this.data.pageInfo[this.data.navIndex].bottomFont=="~NOTHING~"){
        return;
      }
      try{
        this.getDynaic(this.data.userId,this.data.navIndex+1,this.data.pageInfo[this.data.navIndex].nowPageIndex+1,6)
      }catch(e){
        return;
      }
      this.setData({
        ["pageInfo["+this.data.navIndex+"].nowPageIndex"]:this.data.pageInfo[this.data.navIndex].nowPageIndex+1,
      })
    }
  })