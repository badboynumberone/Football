// import Toast from './../../../miniprogram_npm/vant-weapp/toast/toast.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        availHeight:"asd",
        saveOffset:false,
        username:"",
        photo:"",
        num:"",
        level:"",
        back:"",
        localphotourl:''
    },
    // onChange(event) {
    //   const { picker, value, index } = event.detail;
    //   Toast(`当前值：${value}, 当前索引：${index}`);
    // },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let level = parseInt(options.level);
      let back="";
      if(level<=5){
        back="/images/model02.jpg"
      }else if(level>5 && level<=7){
        back="/images/model01.jpg"
      }else{
        back="/images/model03.jpg"
      }
      switch(level){
        case 1:level = "一";break;
        case 2:level = "二";break;
        case 3:level = "三";break;
        case 4:level = "四";break;
        case 5:level = "五";break;
        case 6:level = "六";break;
        case 7:level = "七";break;
        case 8:level = "八";break;
      }
      console.log(options)
      let deviceHeight = wx.getSystemInfoSync().windowHeight;
      this.setData({
        availHeight:deviceHeight - 50,
        back,
        level,
        username:options.name,
        num:options.num,
        photo:options.photo
      })
      let that = this;
      console.log(options.photo)
      wx.getImageInfo({
        src: options.photo,//服务器返回的图片地址
        success: function (res) {
          //res.path是网络图片的本地地址
          let Path = res.path;
          console.log(Path)
          that.setData({
            localphotourl:Path
          })
          that.drawImg();  
        },
        fail: function (res) {
          console.log(res)
          //失败回调
        }
      });
      
      
    },
    //写字
    drawText(obj) {   this.ctx.save();        this.ctx.setFillStyle(obj.color);        this.ctx.setFontSize(obj.size);        this.ctx.setTextAlign(obj.align);        this.ctx.setTextBaseline(obj.baseline);        if (obj.bold) {                       this.ctx.fillText(obj.text, obj.x, obj.y - 0.5);            this.ctx.fillText(obj.text, obj.x - 0.5, obj.y);
        }        this.ctx.fillText(obj.text, obj.x, obj.y);        if (obj.bold) {            this.ctx.fillText(obj.text, obj.x, obj.y + 0.5);            this.ctx.fillText(obj.text, obj.x + 0.5, obj.y);
        }        this.ctx.restore();
    },
    //画图
    drawImg(){
      this.ctx =  wx.createCanvasContext('share')
      this.ctx.drawImage(this.data.back, 0, 0, 375, 545);
      this.drawText({    x: 20,    y: 332,    color: '#4B76E1',    size: 18,    align: 'left',    baseline: 'middle',    text: this.data.username,    bold: true})
      this.drawText({    x: 93,    y: 362,    color: '#4B76E1',    size: 17,    align: 'left',    baseline: 'middle',    text: this.data.level,    bold: true})
      this.drawText({    x: 50,    y: 512,    color: '#333',    size: 13,    align: 'left',    baseline: 'middle',    text: this.data.num,    bold: false})
      this.ctx.drawImage(this.data.localphotourl, 255, 180, 90, 110);
      this.ctx.draw();
    },
    //保存图片
    perserve(){
      let that = this;
      if(that.data.saveOffset){
        wx.showToast({
          title: '您已保存成功，请勿重复操作!',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return;
      }
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: this.data.availHeight,
        canvasId: "share",
        fileType: "jpg",
        quality: 1.0,
        success: (result) => {
          console.log(result.tempFilePath)
          wx.saveFile({
            tempFilePath: result.tempFilePath,
            success: (res) => {
              const savedFilePath = res.savedFilePath
              console.log(savedFilePath)
              wx.saveImageToPhotosAlbum({
                filePath: savedFilePath,
                success: (result) => {
                  that.setData({
                    saveOffset:true
                  })
                  wx.showToast({
                    title: '保存成功',
                    icon: 'none',
                    duration: 1500,
                    mask: false,
                  });
                },
              });   
            },
          });
        },
      }, this);
        
    },
    //分享
    onShareAppMessage: function( options ){
      　　return {
            title: "娃娃足球工程",  
            path: "pages/index/index/index",
            imageUrl:"/images/logo.jpg",
            success(res){
              if(res.errMsg == 'shareAppMessage:ok'){
                console.log(res)
              }
              
            }
          }
    }
  })