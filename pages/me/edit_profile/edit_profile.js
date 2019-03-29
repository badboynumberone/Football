import {upLoadFile,requestTest} from '../../../utils/request';
import {updateUserInfo,getUserInfo} from '../../../utils/util'
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
        isClearShow:true,
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
      this.setData({
        isClearShow:false
      })
    },
    onShow(){
      this.initData();
      this.getNowDate();
    },
    //初始化数据
    initData(){
      let result=getUserInfo(['userName','userHeader','sixIndex','birthDay','signature']);
      this.setData(result);
      this.setData({
        sexIndex:wx.getStorageSync('sexIndex') || 0
      })
    },
    //清空
    clear(){
      this.setData({
        userName:''
      })
    },
    //选择头像
    chooseImage(){
      let that =this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          if(res.errMsg=="chooseImage:ok"){
            upLoadFile(res.tempFilePaths).then(function(res){
              console.log(res)
              that.setData({
                userHeader:res
              })
              
            }).catch(function(err){
              console.log('上传图片失败')
            })
          }
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
        signature:e.detail
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