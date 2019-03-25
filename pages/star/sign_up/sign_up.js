// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
      pageIndex:2,//当前页面
      sexArray:['男','女'],
      sexOffset:false,
      sexIndex:0,//男女性别
      nowDate:'',//当前时间
      birthDay:'',//生日
      city:[],

    },
    // onChange(event) {
    //   const { picker, value, index } = event.detail;
    //   Toast(`当前值：${value}, 当前索引：${index}`);
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getNowDate();
    },
    getNowDate(){
      let now = new Date();
      let month=now.getMonth()<10 ? '0'+(now.getMonth()+1): now.getMonth();
      let date =now.getDate()<10 ? '0'+now.getDate() : now.getDate();
      this.setData({
        nowDate :now.getFullYear() + '-' + month + '-' + date
      })
      console.log(this.data.nowDate)
    },
    bindSexChange(e){
      console.log(e.detail.value)
      this.setData({
        sexIndex: e.detail.value,
        sexOffset:true
      })
    },
    bindDateChange:function(e){
      this.setData({
        birthDay: e.detail.value,
      })
    },
    bindRegionChange:function(e){
      this.setData({
        city: e.detail.value
      })
    },
    // 上传图片
    uploadImg:function(){
      wx.chooseImage({
        count: 3,
        sizeType: ['original','compressed'],
        sourceType: ['album','camera'],
        success: (result)=>{
          console.log(result)
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  })