// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
      text:"",
			currentidentity:''//当前查询身份证号
    },
    
    onLoad: function (options) {
      this.setData({
        text:options.information,
				currentidentity:options.identity
      })
    },
		//查看历史成绩
    lookingHistory(){
			wx.navigateTo({
				url:'/pages/star/achievement_query/query_result_identity?identity='+this.data.currentidentity
			})
		}
  })