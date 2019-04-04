const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentInfo:Array,
    navIndex:Number || String
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
    navigateTo(e){
      console.log(e)
      wx.navigateTo({
        url: `/pages/index/home_page/home_page?userId=${e.currentTarget.dataset.url}`
      });
    }
  }
})
