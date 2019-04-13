// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';
import {upLoadFile} from '../../../utils/request';
import {request} from '../../../utils/request';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      Name:'',
      identityNum:'',
      motherName:'',
      motherPhone:'',
      dadName:'',
      dadPhone:'',
      address:'',
      emailNum:'',
      email:'',
      photoUrl:'',
      pageIndex:1,//当前页面
      sexArray:['男','女'],
      sexIndex:-1,//男女性别
      nowDate:'',//当前时间
      birthDay:'',//生日
      city:[],
      isSign:false,//是否可报名
      starInfo:[]//星级评定信息
    },
    onLoad: function (options) {
      this.getNowDate();
      this.getParticipantInfo();
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
      })
    },
    onChange(e){
      let name = e.currentTarget.dataset.name;
      this.setData({
        [name]: e.detail
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
    //下一步
    nextStep(){
      if(!/^[\u4e00-\u9fa5]{2,4}$/.test(this.data.Name)){wx.showToast({title: '姓名格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.identityNum)){wx.showToast({title: '身份号码格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(this.data.sexIndex==-1){wx.showToast({title: '请选择性别',icon: 'none',duration: 1500}); return;}
      if(!this.data.birthDay){wx.showToast({title: '请选择生日',icon: 'none',duration: 1500}); return;}
      if(!this.data.city.length){wx.showToast({title: '请选择城市',icon: 'none',duration: 1500}); return;}
      if(!this.data.photoUrl){wx.showToast({title: '请上传一寸照片',icon: 'none',duration: 1500}); return;}
      this.setData({
        pageIndex:2
      })
    },
    // 上传图片
    uploadImg:function(){
      let that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original','compressed'],
        sourceType: ['album','camera'],
        success: (res)=>{
          var tempFilesSize = res.tempFiles[0].size;  //获取图片的大小，单位B
            if(tempFilesSize <= 2000000){   //图片小于或者等于2M时 可以执行获取图片
                upLoadFile(res.tempFilePaths).then(function(result){
                  that.setData({
                    photoUrl:result
                  })
                }).catch(function(err){
                  console.log("上传失败")
                })
            }else{    //图片大于2M，弹出一个提示框
                wx.showToast({
                    title:'上传图片不能大于2M!',  //标题
                    icon:'none'       //图标 none不使用图标，详情看官方文档
                })
                return;
            }
          }
        });
    },
    //返回
    goBack(){
      this.setData({
        pageIndex:1
      })
    },
    //提交
    submit(){
      if(!/[\u4e00-\u9fa5]{2,4}$/.test(this.data.motherName)){wx.showToast({title: '妈妈姓名格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.motherPhone)){wx.showToast({title: '妈妈手机号格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(!/[\u4e00-\u9fa5]{2,4}$/.test(this.data.dadName)){wx.showToast({title: '爸爸姓名格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.dadPhone)){wx.showToast({title: '爸爸手机号格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(!this.data.address){wx.showToast({title: '通讯地址不能为空',icon: 'none',duration: 1500}); return;}
      if(!this.data.emailNum.length==6){wx.showToast({title: '邮编格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(!/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(this.data.email)){wx.showToast({title: '邮箱格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      if(!this.data.isSign){
        wx.showToast({
          title: '还有星级成绩无结果，暂无法报名哦~',
          icon: 'none',
          duration: 3000
        });
        return;
      }
      try{
        this.sendParticipantInfo();
      }catch(err){
        console.log("请求失败")
        wx.hideLoading();
      }
      
    },
    //获取参加者信息
    getParticipantInfo(){
      let that = this;
      request("/userSign/getUserSignInfo",{
        method:"POST",
        data:{}
      }).then(function(res){
        console.log(res.userSignInfo.userSex)
        that.setData({
          starInfo:res.dataList.reverse(),
          Name:res.userSignInfo.userName,
          sexIndex:parseInt(res.userSignInfo.userSex-1),
          identityNum:res.userSignInfo.cerdCard,
          motherName:res.userSignInfo.motherName,
          motherPhone:res.userSignInfo.motherPhone,
          dadName:res.userSignInfo.fatherName,
          dadPhone:res.userSignInfo.fatherPhone,
          address:res.userSignInfo.commuAddress,
          emailNum:res.userSignInfo.postalCode,
          email:res.userSignInfo.email,
          photoUrl:res.userSignInfo.imgUrl,
          birthDay:res.userSignInfo.birthday,//生日
          city:res.userSignInfo.cityAdress.split(","),
          isSign:res.flg
        })
        if(!that.data.isSign){
          that.setData({
            ["starInfo["+that.data.starInfo.length-1+"].notice"]:"未报名",
          })
        }
      }).catch(function(err){
        console.log("获取参加者信息失败")
      })
    },
    //用户报名
    sendParticipantInfo(){
      
      let that = this;
      wx.showLoading({title:"报名中..."});
      request("/userSign/creatSign",{
        method:"POST",
        data:{
          userName:that.data.Name,
          userSex:parseInt(that.data.sexIndex)+1,
          birthday:that.data.birthDay,
          cerdCard:that.data.identityNum,
          cityAdress:that.data.city.join(','),
          imgUrl:that.data.photoUrl,
          motherName:that.data.motherName,
          motherPhone:that.data.motherPhone,
          fatherName:that.data.dadName,
          fatherPhone:that.data.dadPhone,
          commuAddress:that.data.address,
          postalCode:that.data.emailNum,
          email:that.data.email
        }
      }).then(function(res){
        if(res.flg==true && res.message=="报名成功"){
          wx.hideLoading();
          wx.navigateTo({
            url: '/pages/star/sign_up/sign_up_success'
          });
        }
      }).catch(function(err){
        console.log("获取参加者信息失败")
      })
    }
  })