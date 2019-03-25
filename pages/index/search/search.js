const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      searchValue:'',//搜索的值
      searchHistory:[],//历史搜索记录
      isHistory:false,//是否显示历史搜索
      worksContent:[],//作品内容
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
      console.log(this.data.searchValue)
    },
    //搜索内容
    searchValue(e){
      if(!e.detail){
        return;
      }
      let _this = this;
      //发送请求成功后将记录存入缓存中去
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
    }
  })