import { wxRequest } from '@/utils/wxRequest';

// 域名
const host = 'http://39.107.70.80:8080/';
// const host = 'http://192.168.3.56:8080/';
// webScocket
const wshost = 'ws://192.168.3.52:8080/MicroPlatform/websocket/';
// 上传文件/解析图片 地址
const uploadFileUrl = 'http://jiaoyuvideo.oss-cn-beijing.aliyuncs.com/';

/**
 * 接口
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
// 多图片保存至手机相册
const downloadSaveFiles = function(urls) {
    let len = urls.length;
    // 获取保存至手机相册的权限
    wepy.getSetting({
        success(res) {
            if (!res.authSetting['scope.writePhotosAlbum']) {
                wepy.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success() {
                        // 用户已经同意小程序使用该功能，后续调用接口不会弹窗询问
                        for(let i = 0; i < len; i++){
                            // 下载图片
                            wepy.downloadFile({
                                url: urls[i],
                                header:{},
                                success: function(res) {
                                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                                    if (res.statusCode === 200) {
                                        // 保存图片
                                        wepy.saveImageToPhotosAlbum({
                                            filePath:res.tempFilePath,
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
                    fail:function(){
                        wepy.showModal({
                            title: '温馨提示',
                            content: '取消授权将无法保存至手机',
                            showCancel:true,
                        });
                    },
                });
            }
        }
    });
};

//微信的jscode换取sessionKey
// const wxJsCode2Session = (params) => wxRequest(params, apiMall + '/api/wechat/jscode2session');
// const user2session = (params) => wxRequest(params, apiMall + '/api/wechat/user2session?jsoncallback=?');
// 登录
const myLogin = (params) => wxRequest(params, host + 'shakeLeg/user/userLogin');
// 选择性别
const updateSex = (params) => wxRequest(params, host + 'shakeLeg/user/updateSex');
// 添加游戏记录
const addRecord = (params) => wxRequest(params, host + 'shakeLeg/user/addRecord');
// 查询个人信息
const getOneUserInfo = (params) => wxRequest(params, host + 'shakeLeg/user/getUsers');
// 好友总排行榜
const getFriend = (params) => wxRequest(params, host + 'shakeLeg/user/getFriend');
// 世界总排行榜
const worldRankings = (params) => wxRequest(params, host + 'shakeLeg/user/worldRankings');
//世界总排名个人名次
const myWorldRankings = (params) => wxRequest(params, host + 'shakeLeg/user/myWorldRankings');
// 用户拥有礼物数
const getUserGift = (params) => wxRequest(params, host + 'shakeLeg/user/getUserGift');
// 查询未完成礼物墙
const getPresentsWall = (params) => wxRequest(params, host + 'shakeLeg/user/getPresentsWall');
// 查询完成的礼物墙
const getPresentsWalls = (params) => wxRequest(params, host + 'shakeLeg/user/getPresentsWalls');

export default {
    host,
    wshost,
    uploadFileUrl,
    downloadSaveFiles,
    myLogin,
    updateSex,
    addRecord,
    getOneUserInfo,
    getFriend,
    worldRankings,
    myWorldRankings,
    getUserGift,
    getPresentsWall,
    getPresentsWalls,

};
