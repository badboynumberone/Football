import {checkLogin} from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dynaicInfo:Array,
    navIndex: String || Number,
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
