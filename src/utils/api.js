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
// 修改声音/振动设置
const updateSet = (params) => wxRequest(params, host + 'shakeLeg/user/updateSet');
// 邀请好友
const inviteFriend = (params) => wxRequest(params, host + 'shakeLeg/user/inviteFriend');
// 创建房间
const addRoom = (params) => wxRequest(params, host + 'shakeLeg/user/addRoom');
// 礼物列表
const getGift = (params) => wxRequest(params, host + 'shakeLeg/admin/getGift');
// 积分兑换礼物
const convertGift = (params) => wxRequest(params, host + 'shakeLeg/user/convertGift');
// 查询可用积分
const getIntegral = (params) => wxRequest(params, host + 'shakeLeg/user/getIntegral');
// 粉丝列表
const getFans = (params) => wxRequest(params, host + 'shakeLeg/user/getFans');
// 送礼物
const addSendGifts = (params) => wxRequest(params, host + 'shakeLeg/user/addSendGifts');
// 保存礼物墙照片
const updatePresentsWall = (params) => wxRequest(params, host + 'shakeLeg/user/updatePresentsWall');
// 获取用户数据 获取手/脚的抖动的总记录数
const getUserData = (params) => wxRequest(params, host + 'shakeLeg/admin/getUserData');
// 根据礼物积分获取礼物
const getOneGiftInfoByScore = (params) => wxRequest(params, host + 'shakeLeg/user/getGift');
// 添加个人礼物
const addUserGift = (params) => wxRequest(params, host + 'shakeLeg/user/addUserGift');

export default {
    host,
    wshost,
    uploadFileUrl,
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
    updateSet,
    inviteFriend,
    addRoom,
    getGift,
    convertGift,
    getIntegral,
    getFans,
    addSendGifts,
    updatePresentsWall,
    getUserData,
    getOneGiftInfoByScore,
    addUserGift,
};
