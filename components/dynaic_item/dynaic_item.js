const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dynaicInfo:Array,
    navIndex: String || Number,
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行
      console.log(this.properties.dynaicInfo)
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
    },
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
      let that = this;
      if(e.currentTarget.dataset.produtionid){
        wx.navigateTo({
          url: '/pages/index/works_details/works_details?worksId='+e.currentTarget.dataset.produtionid+'&navIndex='+ that.properties.navIndex+'&index='+e.currentTarget.dataset.index
        });
      }
    },
  },
  
})
