import config from '@/utils/config_local';
import { wxRequest, wxRequest1 } from '@/utils/wxRequest';

// 域名
// const host = 'http://www.dt.pub/';
const host = config.apiHost;
// const host = 'http://192.168.1.153:8080/';

// webScocket
const wshost = config.webSocketHost;

// 上传文件/解析图片 地址
const uploadFileUrl = config.uploadFileUrl;

// 订单状态 全部'' 0（未支付）1（待发货）2（待接收）3（完成）4（退）5（换）6(订单取消)
const all = '';
const unpaid = 0;
const notDelivered = 1;
const notReceived = 2;
const accomplish = 3;
const returnGoods = 4;
const exchangeGoods = 5;
const cancelOrder = 6;

// 礼物墙大小(px)
const canvasWidth = 325;
const canvasHeight = 430;

// 人物形象logo大小(px)
const logoWidth = 131;
const logoHeight = 234;

// 满能量才能送礼
const fullEnergy = 500;

// 模式字段数据 挑战1/故事2/PK3/休闲4
const fightModel = 1;
const storyModel = 2;
const PKModel = 3;
const arderModel = 4;


/**
 * 接口
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */

// 登录(增加获取token)
const myLogin = (params) => wxRequest1(params, host + 'shakeLeg/user/userLogin');

// 选择性别
const updateSex = (params) => wxRequest(params, host + 'shakeLeg/user/updateSex');
// 添加游戏记录
const addRecord = (params) => wxRequest(params, host + 'shakeLeg/user/addRecord');
// 查询个人信息
const getOneUserInfo = (params) => wxRequest(params, host + 'shakeLeg/user/getUsers');
// 好友总排行榜
const getFriend = (params) => wxRequest(params, host + 'shakeLeg/user/getFriend');
const getFriendP = (params) => wxRequest(params, host + 'shakeLeg/user/getFriendp');
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
const addUserGift = (params) => wxRequest(params, host + 'shakeLeg/admin/addUserGift');
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
// 查询未完成私墙
const getSPresentsWall = (params) => wxRequest(params, host + 'shakeLeg/user/getSPresentsWall');
// 修改游戏模式
const UpdatePattern = (params) => wxRequest(params, host + 'shakeLeg/user/UpdatePattern');
// 查询未送出礼物数
const getSpNum = (params) => wxRequest(params, host + 'shakeLeg/user/getSpNum');
// 上传文件
const UploadFiles = (params) => wxRequest(params, host + 'shakeLeg/user/UploadFiles');
// 用户信息数据
const getOneUserData = (params) => wxRequest(params, host + 'shakeLeg/user/getUserData');
//  小程序微信支付
const wxPay = (params) => wxRequest(params, host + 'shakeLeg/user/wxPay');
// 查询背景音乐列表
const getMusic = (params) => wxRequest(params, host + 'shakeLeg/user/getMusic');
// 获取手机验证码
const getSms = (params) => wxRequest(params, host + 'shakeLeg/user/getSms');
// 绑定手机号
const updateMobile = (params) => wxRequest(params, host + 'shakeLeg/user/updateMobile');
// 查询随机故事模式数据
const getStoryModeSJ = (params) => wxRequest(params, host + 'shakeLeg/user/getStoryModeSJ');
// 查询挑战模式数据
const getChallengeMode = (params) => wxRequest(params, host + 'shakeLeg/admin/getChallengeMode');
//  获取故事随机抖动数
const getStoryIMG = (params) => wxRequest(params, host + 'shakeLeg/user/getStoryIMG');
// 用户进入房间
const intoRoomJudge = (params) => wxRequest(params, host + 'shakeLeg/user/intoRoomJudge');
// pk退出房间接口
const updateRoomUserStatus = (params) => wxRequest(params, host + 'shakeLeg/user/updateRoomUserStatus');
// 修改pk房间时间
const updateRoomTime = (params) => wxRequest(params, host + 'shakeLeg/user/updateRoomTime');
// 修改pk用户状态
const updateRoomStatus = (params) => wxRequest(params, host + 'shakeLeg/user/updateRoomStatus');
// 开始游戏
const updateRoom = (params) => wxRequest(params, host + 'shakeLeg/user/updateRoom');
// 查询pk排名
const getUserPKRanking = (params) => wxRequest(params, host + 'shakeLeg/user/getUserPKRanking');
// 断开重连
const getRoomUserData = (params) => wxRequest(params, host + 'shakeLeg/user/getRoomUserData');
// 添加分享记录
const addShare = (params) => wxRequest(params, host + 'shakeLeg/user/addShare');
// 注册
const register = (params) => wxRequest(params, host + 'shakeLeg/user/register');

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
    canvasWidth,
    canvasHeight,
    logoWidth,
    logoHeight,
    fullEnergy,
    fightModel,
    storyModel,
    PKModel,
    arderModel,
    myLogin,
    updateSex,
    addRecord,
    getOneUserInfo,
    getFriend,
    getFriendP,
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
    getSPresentsWall,
    UpdatePattern,
    getSpNum,
    UploadFiles,
    getOneUserData,
    wxPay,
    getMusic,
    getSms,
    updateMobile,
    getStoryModeSJ,
    getChallengeMode,
    getStoryIMG,
    intoRoomJudge,
    updateRoomUserStatus,
    updateRoomTime,
    updateRoomStatus,
    updateRoom,
    getUserPKRanking,
    getRoomUserData,
    addShare,
    register,
};
