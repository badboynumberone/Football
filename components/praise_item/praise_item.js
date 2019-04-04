const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    contentList:Array
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
   navigateToHome(e){
      wx.navigateTo({
        url: `/pages/index/home_page/home_page?userId=${e.currentTarget.dataset.id}`
      });  
   },
   navigateToWork(e){
    wx.navigateTo({
      url: `/pages/index/works_details/works_details?worksId=${e.currentTarget.dataset.productionid}`
    }); 
   }
  }
})
