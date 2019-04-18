import {checkLogin} from '../../utils/util'
const app =getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dynaicInfo:Array,
    navIndex: String || Number,
  },
  data:{
    info:[]
  },
  lifetimes: {
    ready() {
      console.log(this.properties.dynaicInfo)
      // 在组件实例进入页面节点树时执行
      this.setData({
        info:this.properties.dynaicInfo
      })
    },
    detached() {
      // 在组件实例被从页面节点树移除时执行
      console.log(this.properties.dynaicInfo)
    },
  },
  observers:{
    'dynaicInfo' :function(dynaicInfo){
      this.setData({
        info:this.properties.dynaicInfo
      })
      console.log(dynaicInfo)
    }
  },
  pageLifetimes: {
    show() {
      console.log("sad")
      if(app.globalData.isDelete && app.globalData.produtionId){
        console.log(app.globalData.produtionId)
        let idx = '';
        let dynaicInfo = this.properties.dynaicInfo;
        this.properties.dynaicInfo.forEach((item,index) => {
          if(item.produtionId == app.globalData.produtionId){
            idx = index;
            console.log(idx)
          }
        });
        dynaicInfo.splice(idx,1)
        console.log(dynaicInfo)
        this.setData({
          info:dynaicInfo
        })
        
      }else{
        this.setData({
          info:this.properties.dynaicInfo
        })
      }
      
    }
  },
  methods: {
    navigateTo(e){
      let that = this;
      if(!checkLogin(true,false)){
        return;
      }
      if(e.currentTarget.dataset.produtionid){
        wx.navigateTo({
          url: '/pages/index/works_details/works_details?worksId='+e.currentTarget.dataset.produtionid+'&navIndex='+ that.properties.navIndex+'&index='+e.currentTarget.dataset.index
        });
      }
    },
  },
  
})
