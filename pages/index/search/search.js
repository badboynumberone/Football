const app = getApp();
import {requestTest} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      searchValue:'',//搜索的值
      searchHistory:[],//历史搜索记录
      isHistory:false,//是否显示历史搜索
      worksContent:[],//作品内容
      worksIndex:0,//当前导航索引
      pageInfo:[{dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0},
              {dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0},
              {dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0},
              {dynaicInfo:[],nowPageIndex:0,totalPage:1,totalSize:0}]//分页信息
    },
    //绑定搜索的值
    getSearchValue(e){
      this.setData({
        searchValue:e.detail
      })
      if(!e.detail){
        this.setData({
          isHistory:false
        })
      }
    },
    onShow(){
      this.initData();
    },
    //初始化数据
    initData(){
      this.setData({
        searchHistory:wx.getStorageSync('searchHistory')
      })
    },
    //搜索内容
    searchValue(e){
      if(!e.detail){
        return;
      }
      let _this = this;
      //发送请求成功后将记录存入缓存中去
      this.getDynaicList(e.detail,0,20);
      let result = wx.getStorageSync('searchHistory') || [];
      if(!result.includes(e.detail)){
        result.push(e.detail);
        wx.setStorageSync('searchHistory',result)
      }
      _this.setData({
          isHistory:true
      })
      _this.initData();
    },
    onChange(e){
      this.setData({
        worksIndex:e.detail.index
      })
      if(this.data.pageInfo[e.detail.index].dynaicInfo.length || this.data.pageInfo[e.detail.index].nowPageIndex >=this.data.pageInfo[e.detail.index].totalPage){
        return;
      }
      this.getDynaicList(this.data.searchValue,this.data.worksIndex,20)
    },
    getDynaicList(content,index,pageNo){
      let that = this;
      requestTest("/appIndex/pageList",{method:"POST",data:{
        searchContent:content,
        type:index+1,
        pageNo:pageNo,
        pageSize:20
      }}).then(function(res){
        that.setData({
          ["pageInfo["+index+"].dynaicInfo"]:res.dataList,
          ["pageInfo["+index+"].nowPageIndex"]:that.data.pageInfo[index].nowPageIndex+1,
          ["pageInfo["+index+"].totalPage"]:res.totalPage,
          ["pageInfo["+index+"].totalSize"]:res.totalSize
        })
        console.log(that.data.pageInfo)
      }).catch(function(err){
        wx.showToast({
          title: '搜索失败,请稍后重试',icon: 'none',duration: 1500,mask: false
        });
        return;
      }) 
    },
    //清空内容
    clearContent(){
      this.setData({
        searchValue:''
      });
    },
    //清空缓存
    clearHistory(){
      console.log(1)
      wx.setStorageSync('searchHistory', []);
      this.initData();
    },
    //根据标签搜索内容
    searchTag(e){
      this.setData({
        searchValue:e.currentTarget.dataset.value,
        isHistory:true
      });
      this.getDynaicList(this.data.searchValue,0,20)
    }
  })