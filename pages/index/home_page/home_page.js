Page({

    /**
     * 页面的初始数据
     */
    data: {
      videoOrImg:true,
      worksIndex:0,//内容选择
      hotItem:[
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'关注',typeNum:0},
        {typeUrl:"/pages/me/show_fans_concern/show_fans_concern",typeName:'粉丝',typeNum:20},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'获赞',typeNum:25},
        {typeUrl:"/pages/me/my_praise/my_praise",typeName:'赞过',typeNum:99},
      ]
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
    },
    //获取用户信息
    getUserInfo(){

    }
  })