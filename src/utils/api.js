import { wxRequest } from '@/utils/wxRequest';

// 域名
const host = 'http://39.107.70.80:8080/';
// const host = 'http://192.168.1.153:8080/';
// webScocket
const wshost = 'ws://192.168.3.52:8080/MicroPlatform/websocket/';
// 上传文件/解析图片 地址
// const uploadFileUrl = 'http://jiaoyuvideo.oss-cn-beijing.aliyuncs.com/';
const uploadFileUrl = 'http://doutui.oss-cn-beijing.aliyuncs.com/';

// 订单状态 全部'' 0（未支付）1（待发货）2（待接收）3（完成）4（退）5（换）6(订单取消)
const all = '';
const unpaid = 0;
const notDelivered = 1;
const notReceived = 2;
const accomplish = 3;
const returnGoods = 4;
const exchangeGoods = 5;
const cancelOrder = 6;
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
// 查询公共墙
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
//  游戏历史记录
const getRecord = (params) => wxRequest(params, host + 'shakeLeg/user/getRecord');
// 送礼物人的头像
const getGiveGiftUserPhoto = (params) => wxRequest(params, host + 'shakeLeg/user/getUserPhoto');
// 商品列表
const getGoods = (params) => wxRequest(params, host + 'shakeLeg/admin/getGoods');
// 商品详情
const getGoodsDetails = (params) => wxRequest(params, host + 'shakeLeg/admin/getGoodsDetails');
// 地址列表
const getAddress = (params) => wxRequest(params, host + 'shakeLeg/user/getAddress');
// 查询默认地址
const getMoRen = (params) => wxRequest(params, host + 'shakeLeg/user/getMoRen');
// 根据id查询地址
const getAddressId = (params) => wxRequest(params, host + 'shakeLeg/user/getAddressId');
// 添加地址
const addAddress = (params) => wxRequest(params, host + 'shakeLeg/user/addAddress');
// 设为默认地址
const updateStatus = (params) => wxRequest(params, host + 'shakeLeg/user/updateStatus');
// 修改地址
const updateAddress = (params) => wxRequest(params, host + 'shakeLeg/user/updateAddress');
// 删除地址
const deleteAddress = (params) => wxRequest(params, host + 'shakeLeg/user/deleteAddress');
// 添加订单
const addOrders = (params) => wxRequest(params, host + 'shakeLeg/user/addOrders');
// 修改订单状态
const updateOrdersStatus = (params) => wxRequest(params, host + 'shakeLeg/admin/updateOrdersStatus');
// 订单列表
const getOrders = (params) => wxRequest(params, host + 'shakeLeg/user/getOrders');
//  订单详情
const getOrdersDetails = (params) => wxRequest(params, host + 'shakeLeg/user/getOrdersDetails');
// 获取物流信息
const getTransInfo = (params) => wxRequest(params, host + 'shakeLeg/user/getTransInfo');
// 删除订单
const delOrders = (params) => wxRequest(params, host + 'shakeLeg/user/delOrders');
// 查询七天签到礼物
const getSignGift = (params) => wxRequest(params, host + 'shakeLeg/admin/getSignGift');
// 用户签到
const updateSignDays = (params) => wxRequest(params, host + 'shakeLeg/user/updateSignDays');
//  获取最新签到日期
const getRecordTime = (params) => wxRequest(params, host + 'shakeLeg/user/getRecordTime');
//  查询私墙排行榜
const getSPresentWallall = (params) => wxRequest(params, host + 'shakeLeg/user/getSPresentWallall');
// 查看单个礼物墙
const getSPresentsWallOne = (params) => wxRequest(params, host + 'shakeLeg/user/getSPresentsWallOne');
// 查询公共墙周记录
const getPresentWallallScore = (params) => wxRequest(params, host + 'shakeLeg/user/getPresentWallallScore');
// 查询收到的礼物墙
const qSPresentsWall = (params) => wxRequest(params, host + 'shakeLeg/user/qSPresentsWall');
// 查询送出的礼物墙
const qSPresentsWalls = (params) => wxRequest(params, host + 'shakeLeg/user/qSPresentsWalls');

export default {
    host,
    wshost,
    uploadFileUrl,
    all,
    unpaid,
    notDelivered,
    notReceived,
    accomplish,
    returnGoods,
    exchangeGoods,
    cancelOrder,
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
    getRecord,
    getGiveGiftUserPhoto,
    getGoods,
    getGoodsDetails,
    getAddress,
    getMoRen,
    getAddressId,
    addAddress,
    updateStatus,
    updateAddress,
    deleteAddress,
    addOrders,
    updateOrdersStatus,
    getOrders,
    getOrdersDetails,
    getTransInfo,
    delOrders,
    getSignGift,
    updateSignDays,
    getRecordTime,
    getSPresentWallall,
    getSPresentsWallOne,
    getPresentWallallScore,
    qSPresentsWall,
    qSPresentsWalls,
};
