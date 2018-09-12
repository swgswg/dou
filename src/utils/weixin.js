// const utils = require('@/utils/util.js');
const tip = require('@/utils/tip.js');
const env = require('@/utils/weixinFileToaliyun/env.js');
const uploadAliyun = require('@/utils/weixinFileToaliyun/uploadAliyun.js');
import api from '@/utils/api';

module.exports = {

    /**
     *  多图片保存至手机相册
     * @param urls 多图片地址
     */
    downloadSaveFiles: function(urls) {
        let len = urls.length;
        // 获取保存至手机相册的权限
        wepy.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    wepy.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            // 用户已经同意小程序使用该功能，后续调用接口不会弹窗询问
                            for (let i = 0; i < len; i++) {
                                // 下载图片
                                wepy.downloadFile({
                                    url: urls[i],
                                    header: {},
                                    success: function(res) {
                                        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                        if (res.statusCode === 200) {
                                            // 保存图片
                                            wepy.saveImageToPhotosAlbum({
                                                filePath: res.tempFilePath,
                                                success(res) {

                                                }
                                            });
                                        }
                                    }
                                });
                            }
                            wepy.showToast({
                                title: '保存成功',
                                icon: 'success',
                                duration: 500
                            });
                        },
                        fail: function() {
                            wepy.showModal({
                                title: '温馨提示',
                                content: '取消授权将无法保存至手机',
                                showCancel: false
                            });
                        }
                    });
                }
            }
        });
    },

    /**
     *  上传图片到阿里云
     * @param filePath 图片路径
     * @param sufun  上传成功执行的方法
     */
    uploadFiveToAliyunOOS: function(filePath, sufun) {
        // console.log(filePath);
        let ext = filePath.slice(filePath.lastIndexOf('.') + 1);
        let extArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
        // console.log(extArr.indexOf(ext));
        if (extArr.indexOf(ext) != -1) {
            // 上传文件
            uploadAliyun(filePath, function(fileNmae) {
                let newsrc = env.aliyunServerURL + env.dir + fileNmae;
                // console.log(env.aliyunServerURL);
                console.log(newsrc);
                sufun(fileNmae);
            }, function() {

            });
        } else {
            tip.error('网络错误');
        }

    },

    /**
     * webSocket
     */
    weixinWebSocket(){

        let socketOpen = false;
        let socketMsgQueue = [];

        //建立连接
        wx.connectSocket({
            url: api.wshost +_this.data.openid+"/"+options.to,
        });

        //连接成功
        wx.onSocketOpen(function () {
            console.log('连接成功');
            socketOpen = true;
            for (var i = 0; i < socketMsgQueue.length; i++){
                // sendSocketMessage(socketMsgQueue[i]);
                if (socketOpen) {
                    // 发送webSocket信息
                    wx.sendSocketMessage({
                        data:socketMsgQueue[i]
                    })
                } else {
                    socketMsgQueue.push(socketMsgQueue[i]);
                }
            }
            socketMsgQueue = [];
        });

        wx.onSocketError(function(res){
            console.log('WebSocket连接打开失败，请检查！')
        });

        // 接收webSocket信息
        wx.onSocketMessage(function(res){
            // var list = [];
            // list = _this.data.newsList;
            var  _data = JSON.parse(res.data);
            // list.push(_data);
            // console.log(list);
            // _this.setData({
            //     newsList:list
            // })
        });

    },

    /**
     *  付款
     * @param suFun 成功执行的方法
     * @param errFun 失败执行的方法
     */
    weixinPay:function(suFun,errFun){
        wx.requestPayment({
            'timeStamp': '',
            'nonceStr': '',
            'package': '',
            'signType': 'MD5',
            'paySign': '',
            'success':function(res){
                suFun(res)
            },
            'fail':function(res){
                wx.showToast({
                    title: '支付失败',
                    image: "../static/images/error.png",
                    mask: true,
                    duration: 500
                });
                errFun();
            }
        })
    },

    /***
     * 按照显示图片的宽等比例缩放得到显示图片的高
     * @params originalWidth  原始图片的宽
     * @params originalHeight 原始图片的高
     * @params imageWidth     显示图片的宽，如果不传就使用屏幕的宽
     * 返回图片的宽高对象
     ***/
    imageZoomHeightUtil: function(originalWidth,originalHeight,imageWidth){
        let imageSize = {};
        if(imageWidth){
            imageSize.imageWidth = imageWidth;
            imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
        }else{
            //如果没有传imageWidth,使用屏幕的宽
            wx.getSystemInfo({
                success: function (res) {
                    imageWidth = res.windowWidth;
                    imageSize.imageWidth = imageWidth;
                    imageSize.imageHeight = (imageWidth * originalHeight) / originalWidth;
                }
            });
        }
        return imageSize;
    },

    /***
     * 按照显示图片的高等比例缩放得到显示图片的宽
     * @params originalWidth  原始图片的宽
     * @params originalHeight 原始图片的高
     * @params imageHeight    显示图片的高，如果不传就使用屏幕的高
     * 返回图片的宽高对象
     ***/
    imageZoomWidthUtil: function(originalWidth,originalHeight,imageHeight){
        let imageSize = {};
        if(imageHeight){
            imageSize.imageWidth = (imageHeight *originalWidth) / originalHeight;
            imageSize.imageHeight = imageHeight;
        }else{
            //如果没有传imageHeight,使用屏幕的高
            wx.getSystemInfo({
                success: function (res) {
                    imageHeight = res.windowHeight;
                    imageSize.imageWidth = (imageHeight *originalWidth) / originalHeight;
                    imageSize.imageHeight = imageHeight;
                }
            });
        }
        return imageSize;

        // <image bindload="imageLoad" style="width:{{imageWidth}}px;;height:{{imageHeight}}px;" src="../pro.png"/>
        // data:{
        //     imageWidth:0,
        //     imageHeight:0
        // },
        // imageLoad: function (e) {
        //     //获取图片的原始宽度和高度
        //     let originalWidth = e.detail.width;
        //     let originalHeight = e.detail.height;
        //     //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight);
        //     //let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight,375);
        //     let imageSize = Util.imageZoomWidthUtil(originalWidth,originalHeight,145);
        //     this.setData({imageWidth:imageSize.imageWidth,imageHeight:imageSize.imageHeight});
        // }
    },


};