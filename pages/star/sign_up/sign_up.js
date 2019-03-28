// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';
import {starRequest,upLoadFile} from '../../../utils/request';
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
      pageIndex:2,//当前页面
      sexArray:['男','女'],
      sexOffset:false,
      sexIndex:-1,//男女性别
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
      console.log(this.data.motherName)
      starRequest("/area/getCityTree",{
        method:"POST"
      }).then(function(res){console.log(res)}).catch(function(err){
        console.log(err)
      })
      // if(!/[\u4e00-\u9fa5]{2,4}$/.test(this.data.motherName)){wx.showToast({title: '妈妈姓名格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      
      // if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.motherPhone)){wx.showToast({title: '妈妈手机号格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      // if(!/[\u4e00-\u9fa5]{2,4}$/.test(this.data.dadName)){wx.showToast({title: '爸爸姓名格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      // if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.data.dadPhone)){wx.showToast({title: '爸爸手机号格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      // if(!this.data.address){wx.showToast({title: '通讯地址不能为空',icon: 'none',duration: 1500}); return;}
      // if(!this.data.emailNum.length==6){wx.showToast({title: '邮编格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      // if(!/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(this.data.email)){wx.showToast({title: '邮箱格式不正确，请修改',icon: 'none',duration: 1500}); return;}
      // wx.showLoading({title:"报名中..."});
      starRequest("/signUp/addSignUp",{
        method:"POST",
        // data:{
        //   params:{
        //     'name': this.data.Name,
        //     'registerNo': '',
        //     'sex': this.data.sexIndex,
        //     'sexName': '请选择性别',
        //     'birthday': this.data.birthDay,
        //     'photo': this.data.photoUrl,
        //     'identityNo': this.data.identityNum,
        //     'provinceCode': '',
        //     'provinceName': '',
        //     'cityCode': '',
        //     'cityName': this.data.city,
        //     'motherName': this.data.motherName,
        //     'motherPhone': this.data.motherPhone,
        //     'fatherName': this.data.dadName,
        //     'fatherPhone': this.data.dadPhone,
        //     'address': this.data.address,
        //     'postalCode': '',
        //     'email': this.data.email
        //   }
        // }
      }).then(function(res){
        console.log(haha)
        console.log(res)
      }).catch(function(err){
        console.log(err)
        wx.hideLoading();
        wx.showToast({title: '提交失败,请稍后重试',duration: 1500,});
      })
    }
  })