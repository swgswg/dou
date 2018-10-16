import wepy from 'wepy';
const util = require('@/utils/util.js');
const env = require('@/utils/weixinFileToaliyun/env.js');
const uploadAliyun = require('@/utils/weixinFileToaliyun/uploadAliyun.js');
import api from '@/utils/api';
import tip from '@/utils/tip';
import {USER_INFO,SHAKE_LEG_TIME,SHAKE_LEG_NUMBER} from '@/utils/constant';

// 创建内部 audio 上下文 InnerAudioContext 对象
// const innerAudioContext = wx.createInnerAudioContext();
const backgroundAudioManager = wx.getBackgroundAudioManager();

// 蓝牙通讯
const zeroClearingHex   = 'FE08010000000000000108'; // 清零
const noZeroClearingHex = 'FE08010000000000000007'; // 不清零

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
     * 上传图片到服务器
     * @param successFun
     */
    uploadFileToHost(suFun){
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const filePaths = res.tempFilePaths[0];
                let ext = filePaths.slice(filePaths.lastIndexOf('.') + 1);
                let extArr = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'];
                if (extArr.indexOf(ext) != -1) {
                    tip.loading();
                    // 上传文件
                    wx.uploadFile({
                        url: api.UploadFiles,
                        filePath: filePaths,
                        method:'POST',
                        header: {
                            "Content-Type": "multipart/form-data",
                        },
                        name: 'file',
                        formData: {
                            'user': 'test'
                        },
                        success(res) {
                            console.log(res);
                            // 获取服务器返回的图片名称
                            let data = res.data;
                            suFun(data);
                        }
                    });
                    tip.loaded();
                } else {
                    tip.error('上传的不是图片');
                }
            }
        });
    },

    /**
     * 建立webSocket连接
     */
    weixinConnectSocket(userId){
        wx.connectSocket({
            url: api.wshost +userId,
        });
    },

    /**
     * webSocket发送数据
     * @param receiveId  接收人id
     * @param message 发送消息
     */
    weixinsendSocketMessage(receiveId,message){
        let sendMessage = message + '|' + receiveId;
        //连接成功
        wx.onSocketOpen(function () {
            console.log('连接成功');
            wx.sendSocketMessage({
                data: sendMessage
            });
        });
        wx.onSocketError(function(res){
            console.log(res);
            console.log('WebSocket连接打开失败，请检查！');
        });
    },

    /**
     * 接收webSocket信息
     */
    weixinOnSocketMessage(fun){
        wx.onSocketMessage(function(res){
            let data = JSON.parse(res.data);
            fun(data);
        });
    },

    // 关闭webSocket
    weixinCloseWebSocket(){
        wx.closeSocket({
            success: function(){
                console.log("关闭成功...")
            },
            fail: function(){
                console.log("关闭失败...")
            }
        });
        wx.onSocketClose(function(res) {
            console.log("WebSocket连接已关闭")
        })

    },

    /**
     * 微信支付
     * @param money     订单的金额
     * @param orderUUID 订单orderUUID
     * @param openid    用户的openid
     * @param body      显示的信息
     * @param suFun     成功执行的方法
     * @param errFun    失败执行的方法
     * @returns {Promise<void>}
     */
    async weixinPay(money,orderUUID,openid,body,suFun,errFun){
        let res = await api.wxPay({
            query:{
                money:money,
                orderUUID:orderUUID,
                openid:openid,
                body:body,
            }
        });
        if(res.data.state == 1){
            let data = res.data.data;
            wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': data.signType,
                'paySign': data.paySign,
                'success':function(res){
                    suFun(res);
                },
                'fail':function(res){
                    console.log('支付失败');
                    console.log(res);
                    tip.error('支付失败');
                    errFun();
                }
            });
        } else {
            tip.error('支付失败');
        }
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

    /**
     * 后台播放音乐
     */
    async backgroundMusic(){
        let that = this;
        let res = await api.getMusic({
            query:{}
        });
        if(res.data.state != 1) {
           return;
        }
        let music = res.data.data;
        let len = music.length;
        let i = 0;
        let musicTitle = music[i].title;
        let musicSrc = api.uploadFileUrl +  music[i].url;

        // innerAudioContext.autoplay = true;
        // innerAudioContext.loop = true;
        // innerAudioContext.obeyMuteSwitch = true;
        // innerAudioContext.src = musicSrc;
        // innerAudioContext.play();

        // that.playMusic();
        that.playMusic(musicTitle,musicSrc);
        console.log('播放音乐');
        backgroundAudioManager.onEnded(function (){
            console.log('循环播放',i);
            i++;
            musicTitle = music[i].title;
            musicSrc = api.uploadFileUrl +  music[i].url;
            that.playMusic(musicTitle,musicSrc);
            if(i >= len){
                i = -1;
            }
        });

        backgroundAudioManager.onError(function(res){
            console.log(res);
        })
    },

    // 播放音乐
    playMusic(musicTitle,musicSrc){
        console.log('播放音乐');
        console.log('musicTitle',musicTitle);
        console.log('musicSrc',musicSrc);
        backgroundAudioManager.title = musicTitle;
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = musicSrc;
        backgroundAudioManager.play();

    },

    // 停止播放音乐
    stopMusic(){
        // innerAudioContext.stop();
        // innerAudioContext.destroy();
        backgroundAudioManager.stop();
    },

    // 更新用户缓存
    async updateStorage(mykey,myvalue){
        let userInfo = wepy.getStorageSync(USER_INFO);
        for(let k in userInfo){
            if(k == mykey){
                userInfo[k] = myvalue;
            }
        }
        wepy.setStorageSync(USER_INFO, userInfo);
    },

    // 从服务器更新个人缓存
    async updateUserInfo(){
        let userInfo = wepy.getStorageSync(USER_INFO);
        // 获取个人信息
        let OneUserInfo = await api.getOneUserInfo({
            query:{
                userId:userInfo.id
            }
        });
        if(OneUserInfo.data.state == 1){
            // 更新缓存
            wepy.setStorageSync(USER_INFO, OneUserInfo.data.data);
        }
    },

    // 把上次的脚动记录存入数据库(个人记录不需要房间号)
    async addLegRecord(num){
        let userInfo = wepy.getStorageSync(USER_INFO);
        let prevShakeLegTime = wepy.getStorageSync(SHAKE_LEG_TIME);
        let prevShakeLegNumber = num;
        if(!util.isEmpty(prevShakeLegTime)){
            prevShakeLegTime = util.secondToDHMS(prevShakeLegTime);

            if(util.isEmpty(prevShakeLegNumber)){
                prevShakeLegNumber = 0;
            }

            let res = await api.addRecord({
                query:{
                    userId: userInfo.id,
                    time: prevShakeLegTime,
                    shakeNum: prevShakeLegNumber,
                    type:0, // 0自己,1好友
                    status: 1,// 0手动,1脚动
                }
            });
            if(res.data.state == 1){
                wepy.setStorageSync(SHAKE_LEG_TIME, 0);
                wepy.setStorageSync(SHAKE_LEG_NUMBER, 0);
            }
        }
    },

    // 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值
    notifyValueChange(connectingDeviceId,services_UUID,characteristic_UUID,sunFun){
        let that = this;
        wx.notifyBLECharacteristicValueChange({
            deviceId:connectingDeviceId,
            serviceId:services_UUID,
            characteristicId:characteristic_UUID,
            state:true,
            success(res){
                console.log('启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值: 成功---');
                console.log(res);
                that.onValueChange(sunFun);
                setTimeout(function () {
                    that.writeValue(connectingDeviceId,services_UUID,characteristic_UUID,zeroClearingHex);
                },1000);
            },
            fail(res){
                console.log('启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值: 失败---');
                console.log(res);
            },
        });
    },

    // 监听低功耗蓝牙设备的特征值变化
    // 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
    onValueChange(sunFun){
        let that = this;
        wx.onBLECharacteristicValueChange(function(res){
            console.log('监听低功耗蓝牙设备的特征值变化');
            console.log(res);
            console.log(util.ab2hex(res.value));
            // 获取设备返回的数据
            let hex = util.ab2hex(res.value);
            console.log(hex);
            // 获取总次数
            let num = that.hexSlice(hex);
            if(hex.length > 22){
                console.log('清零数据',num);
                // fe080100010000 d400 00dc fe08010001000000000008
                // 上次的抖腿数存入数据库
                that.addLegRecord(num);
                num = 0;
            }
            // setTimeout(function() {
                sunFun(num);
            // },1000);
        });

    },

    // 向低功耗蓝牙设备特征值中写入二进制数据 建议每次写入不超过20字节
    writeValue(deviceId,services_UUID,characteristic_UUID,value){
        let that = this;
        that.writeToBluetoothValue(deviceId,services_UUID,characteristic_UUID,value);
    },

    // 蓝牙写数据
    writeToBluetoothValue(deviceId,services_UUID,characteristic_UUID,buffer){
        let value = util.hex2ab(buffer);
        wx.writeBLECharacteristicValue({
            deviceId:deviceId,
            serviceId:services_UUID,
            characteristicId:characteristic_UUID,
            value:value,
            success(res){
                console.log('向低功耗蓝牙设备特征值中写入二进制数据: 成功---');
                console.log(res);
            },
            fail(res){
                console.log('向低功耗蓝牙设备特征值中写入二进制数据: 失败---');
                console.log(res);
            }
        })
    },

    // 读取低功耗蓝牙设备的特征值的二进制数据值
    // 接口读取到的信息需要在 onBLECharacteristicValueChange 方法注册的回调中获取
    readValue(){
        wx.readBLECharacteristicValue({
            deviceId:connectingDeviceId,
            serviceId:services_UUID,
            characteristicId:characteristic_UUID,
            success(res){
                console.log('读取低功耗蓝牙设备的特征值的二进制数据值: 成功---');
                console.log(res);
            },
            fail(res){
                console.log('读取低功耗蓝牙设备的特征值的二进制数据值: 失败---');
                console.log(res);
            }
        });
    },

    // 关闭蓝牙模块
    closeBluetooth(){
        wx.closeBluetoothAdapter({
            success(){
                tip.toast('蓝牙关闭');
            },
            fail(){
                // tip.error('关闭失败');
            }
        });
    },

    /**
     * 16进制字符串取需要的字节(fe 08 01 00 01 01 01 7a0b 008f)
     * @param hex
     * @returns {number}
     */
    hexSlice(hex) {
        // 取k8位
        let k8 = hex.slice(14,16);
        //取k9位
        let k9 = hex.slice(16,18);
        return parseInt(k9+k8,16);
    },
};