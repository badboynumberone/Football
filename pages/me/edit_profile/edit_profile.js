import {upLoadFile,requestTest} from '../../../utils/request';
import {updateUserInfo,getUserInfo,sleep} from '../../../utils/util';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      userName:"",//用户名
      userHeader:'',//图片路径
      isClearShow:false,
      sexArray:['男','女'],
      sexOffset:false,
      sexIndex:0,//男女性别
      nowDate:'',//当前时间
      birthDay:'',//生日
      signature:'',//签名
      val:100
    },
    //数据绑定
    onChange(e){
      let name = e.currentTarget.dataset.name;
      this.setData({
        isClearShow:(e.detail.value?true : false),
        [name]:e.detail.value
      })
      console.log(this.data.userName)
    },
    onFocus(){
      this.setData({
        isClearShow:true,
      })
    },
    onBlur(){
      let that = this;
      sleep(500).then(function(res){
        that.setData({
          isClearShow:false
        })
      })
      
    },
    onShow(){
      this.initData();
      this.getNowDate();
    },
    //初始化数据
    initData(){
      let result=getUserInfo(['userName','userHeader','sixIndex','birthDay','signature']);
      this.setData(result)
      console.log(this.data.userHeader)
      this.setData({
        sexIndex:wx.getStorageSync('sexIndex') || 0
      })
      if(app.globalData.imageSrc !=false){
        this.setData({
          userHeader:app.globalData.imageSrc.join('')
        })
      }
    },
    onUnload(){
      console.log('离开了')
      getApp().globalData.imageSrc=[]
    },
    //清空
    clear(){
      this.setData({
        userName:''
      })
      console.log(this.data.userName)
    },
    //选择头像
    chooseImage(){
      let that = this;
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths[0];
          wx.navigateTo({
            url: `/pages/wx-cropper/index?imageSrc=${tempFilePaths}`,
          })
        }
      })
    },
    //失去焦点
    getUsername(e){
      this.setData({
        userName:e.detail
      })
    },
    //清空内容
    clearContent(){
      this.setData({
        userName :'',
      })
    },
    //获取当前时间
    getNowDate(){
      let now = new Date();
      let month=now.getMonth()<10 ? '0'+(now.getMonth()+1): now.getMonth();
      let date =now.getDate()<10 ? '0'+now.getDate() : now.getDate();
      this.setData({
        nowDate :now.getFullYear() + '-' + month + '-' + date
      })
    },
    //绑定性别
    bindSexChange(e){
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
    //设置签名内容
    getText(e){
      this.setData({
        signature:e.detail.value
      })

    },
    //时间代理
    handleClick(e){
      this.bindSexChange(e);
      var query = wx.createSelectorQuery();
      // query.select("#sexpicker")
     query.select("#sexpicker")._selectorQuery._defaultComponent.bindSexChange();
    },
    preserve(){
      console.log(this.data.signature)
      console.log(this.data.sexIndex)
      let obj = {
        userName : this.data.userName,
        userHeader : this.data.userHeader,
        sexIndex : this.data.sexIndex,
        birthDay : this.data.birthDay,
        signature : this.data.signature
      }
      let that = this;
      requestTest("/customer/updateCostomer",{
        method:"POST",
        data:{
          nickname : that.data.userName,
          headImgUrl : that.data.userHeader,
          sex : that.data.sexIndex,
          birthday : that.data.birthDay,
          constoSign : that.data.signature
        }
      }).then(function(res){
        console.log(res)
        
        updateUserInfo(obj)

        wx.switchTab({
          url: '/pages/me/index/index'
        })
      }).catch(function(err){
        console.log("保存失败")
      })
      
      
      
    }
  })