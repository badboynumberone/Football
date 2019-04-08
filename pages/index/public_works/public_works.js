import {upLoadFile} from '../../../utils/request';
import {request,post,requestTest} from '../../../utils/request';
import {showErrorToast,checkLogin} from '../../../utils/util';
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
      localContent:[],
      videoOrImg:true,//true代表上传的是图片，false代表上传的是视频
      upLoadContent:[],//已上传内容
      plusControl:true,
      title:'',//标题
      content:'',//内容
      currentFontNum:0,//当前字数
      address:"",//当前地址
      keyWords:['足球宝贝','足球小伙'],//关键词
      nowWords:'',//当前关键字
      show:false,//是否显示添加关键词的输入框
      introKey:['老大','老二']//推荐关键词
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log(options)
      if(options.activityTitle){
        this.setData({
          content:options.activityTitle,
          currentFontNum:options.activityTitle.length
        })
      }
    },
    onUnload: function(){
      app.globalData.imageSrc=[]
    },
    onShow(){
      this.setData({
        upLoadContent:getApp().globalData.imageSrc
      })
      this.getKey()
    },
    //初始化数据
    getKey(){
      //获取推荐关键词
      let that =this;
      requestTest("/contomerKeyword/getKeyWord",{method:"POST"}).then(function(res){
        try{
          res = JSON.parse(res);
        }catch(e){
          res =res
        }
        let keyWords = [];
        res.adminKeyWordList.forEach(function(item){
          keyWords.push(item.content)
        })
        that.setData({
          introKey:keyWords
        })
      })
    },

    //添加图片
    addImg(){
      let _this =this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original','compressed'],
        sourceType: ['album','camera'],
        success: (res)=>{
          if(res.errMsg=="chooseImage:ok"){
            var tempFilePaths = res.tempFilePaths[0];
            wx.navigateTo({
              url: `/pages/wx-cropper/index?imageSrc=${tempFilePaths}`,
            })
          }
        }
      });
    },
    //添加视频
    addVideo(){
      let _this =this;
      wx.chooseVideo({
        sourceType:['album', 'camera'],
        compressed: true,
        maxDuration:30,
        success: (result)=>{
          console.log(result) 
          if(result.errMsg=="chooseVideo:ok"){
              upLoadFile([result.tempFilePath]).then(function(res){
                console.log(res)
                _this.setData({upLoadContent:res,plusControl:false,videoOrImg:false})
                console.log("上传视频成功")
              }).catch(function(err){
                console.log("上传视频失败")
              })
          }
        }
      });
    },
    //添加内容
    addItem(){
      if(this.data.videoOrImg){
        this.addImg()
      }else{
        this.addVideo()
      }
    },
    //清除内容
    clearItem(e){
      let upLoadContent = this.data.upLoadContent;
      upLoadContent.splice(e.currentTarget.dataset.num,1);
      let localContent = this.data.localContent;
      localContent.splice(e.currentTarget.dataset.num,1);
      this.setData({
        upLoadContent,
        localContent,
        plusControl:true
      })
      console.log(upLoadContent)
    },
    //title数据绑定
    onTitleChange(e){
      this.setData({
        title:e.detail
      })
      console.log(this.data.title)
    },
    //当内容发生变化
    onContentChange(e){
      this.setData({
        content:e.detail.value,
        currentFontNum:e.detail.value.length
      })
    },
    //获取位置信息
    getLocation(){
      if(this.data.address){
        return;
      }
      this.setLocation();
    },
    setLocation(){
      wx.showLoading({
        title:"正在定位中。。。",mask: true
      });
      let that = this;
      wx.getLocation({
        success: function (res) {
          console.log(res)
          //保存到data里面的location里面
          that.setData({
            location: {
              longitude: res.longitude,  
              latitude: res.latitude
            }
          })
          var qqMapApi = 'http://apis.map.qq.com/ws/geocoder/v1/' + "?location=" + that.data.location.latitude + ',' +
            that.data.location.longitude + "&key=77VBZ-CBHHR-JDYWK-WW64P-PCELK-RYBNT" + "&get_poi=1";
          wx.request({
            url: qqMapApi,
            data: {},
            method: 'GET',
            success: (res) => {
              console.log(res.data)
            //取位置名
              that.setData({
                address: res.data.result.address
              })
              wx.hideLoading();  
            },
            fail:function(){
              wx.hideLoading();
              wx.showToast({title: '定位失败请稍后重试',icon: 'none',duration: 1500});
            }
          });
        },
        fail:function(){
          wx.hideLoading();
          wx.showToast({title: '定位失败请稍后重试',icon: 'none',duration: 1500});
        }
      })
    },
    onKeyChange(e){
      this.setData({
        nowWords:e.detail
      })
    },
    addKeyWords(){
      this.setData({
        show:true
      })
    },
    onKeyBlur(){
      this.setData({
        show:false
      })
    },
    onKeyConfirm(e){
      let keyWords = this.data.keyWords;
      if(keyWords.includes(e.detail) || !e.detail){
        this.setData({
          show:false
        })
        return;
      }
      keyWords.push(e.detail);
      this.setData({
        show:false,
        keyWords
      })
      console.log(keyWords)
    },
    deleteKey(e){
      let keyWords = this.data.keyWords;
      keyWords.splice(e.currentTarget.dataset.num,1);
      this.setData({
        keyWords
      })
    },
    addIntroKey(e){
      let keyWords = this.data.keyWords;
      if(this.data.keyWords.length>=8){
        wx.showToast({
          title: '添加关键词已至8个,无法继续添加！',icon: 'none',duration: 1500,mask: false
        });
        return;
      }
      if(keyWords.includes(e.currentTarget.dataset.name)){
        wx.showToast({
          title: '已添加！',icon: 'none',duration: 1500,mask: false
        });
        return;
      }
      keyWords.push(e.currentTarget.dataset.name);
      this.setData({
        show:false,
        keyWords
      })
    },
    //提交作品
    publicWorks(){
      if(this.data.upLoadContent==false){
        wx.showToast({title: '请添加图片或视频！',icon: 'none',duration:1500});
        return;
      }
      if(this.data.title.length<4){
        wx.showToast({title: '标题不能小于4位哦！',icon: 'none',duration:1500});
        return;
      }
      if(this.data.content.length<6){
        wx.showToast({title: '作品内容不能小于6位哦哦！',icon: 'none',duration:1500});
        return;
      }
      if(this.data.keyWords.length<=0){
        wx.showToast({title: '请添加关键词！',icon: 'none',duration:1500});
        return;
      }
      
      let obj = {
        fileUrlList:this.data.upLoadContent,
        title:this.data.title,
        content:this.data.content,
        address:this.data.address,
        keywordList:this.data.keyWords
      }
      wx.showLoading({
        title: '发布中,请稍后。。。',
        mask: true
      });
        
      requestTest("/publishProdution/insert",{
        method:"POST",
        data:obj
      }).then(function(res){
        //返回作品id
        wx.hideLoading();
        if(res.produtionId){
          wx.redirectTo({
            url: '/pages/index/public_works/public_works_success?worksId='+res.produtionId
          });
        }
      }).catch(function(err){
        wx.hideLoading();
        showErrorToast("发布失败,请稍后重试")
      })
    }
  })