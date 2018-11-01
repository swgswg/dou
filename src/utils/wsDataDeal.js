// websocket数据处理
import util from '@/utils/util';


const ty0 = 0; // 刚进去房间
const ty1 = 1; // 组员退出
const ty2 = 2; // 房主退出
const ty3 = 3; // 游戏时间
const ty4 = 4; // 修改状态(准备/未准备)
const ty5 = 5; // 开始游戏
const ty6 = 6; // 同步计数
const ty7 = 7; // 断开重连

/**
 *  解析 WS 数据
 * @param data
 * @param that
 */
function wsDeal(data, that, userId, shareId, isMaster) {
    console.log('wsDataDeal==========');
    console.log(data);
    let res = data;
    let ty = res.pop().type;
    // console.log(typeof ty);
    // console.log('ty===========');
    // console.log(ty);
    switch (ty){
        case ty0: slaveEnter(res, that, userId, shareId, isMaster);
            break;
        case ty1: slaveOut(res,that);
            break;
        case ty2: masterOut(res,that);
            break;
        case ty3: gameTimeE(res,that);
            break;
        case ty4: slaveReady(data,that);
            break;
        case ty5: slaveStart(data,that);
            break;
        case ty6: getNumber(data,that);
            break;
        case ty7: slaveEnter(res, that, userId, shareId, isMaster);
            break;
        default: console.log(ty);
            break;
    }
}


/**
 *  组员加入
 * @param data
 * @param that
 * @param userId
 * @param shareId
 * @param isMaster (房主true, 组员false)
 */
function slaveEnter(data, that, userId, shareId,isMaster = true) {
    let arrs = dealGroupDataE(data,userId);
    // console.log('组员加入==============')
    // console.log(arrs)
    // console.log('isMaster==========');
    // console.log(isMaster);
    if(isMaster){
        if(!util.isEmpty(arrs[0])){
           updateStageLeftDateE(arrs[0],that);
        }
        // console.log('a1',util.isEmpty(arrs[1]));
        // console.log(arrs[1]);
        if(!util.isEmpty(arrs[1])){
            updateStageRightDateE(arrs[1],that);
        }
    } else {
        arrs.forEach(function(item) {
            // console.log('shareId============');
            // console.log(shareId);
            if(item.userId == shareId){
                updateStageLeftDateE(item, that);
            } else {
                updateStageRightDateE(item, that);
            }
        });
    }
}


/**
 *  组员退出
 * @param arr
 * @param that
 */
function slaveOut(arr,that) {
    console.log('组员退出============');
    console.log(arr);
    let groupId = [];
    arr.forEach(function(item) {
        groupId.push(item.userId);
    });
    // console.log('stageDataLeft');
    // console.log(that.stageDataLeft.userId);
    // console.log(groupId.includes(that.stageDataLeft.userId));
    if(!groupId.includes(that.stageDataLeft.userId)){
        that.stageDataLeft = {userId:'', roomId:'', legOrHand:'', logo:'', photo:'', isLight:1, shakeHandNum:'邀请好友'};
        that.$apply();
        // console.log(that.stageDataLeft);
    }
    // console.log('stageDataRight');
    // console.log(that.stageDataRight.userId);
    console.log(groupId.includes(that.stageDataRight.userId));
    if(!groupId.includes(that.stageDataRight.userId)){
        that.stageDataRight = {userId:'', roomId:'', legOrHand:'', logo:'', photo:'', isLight:1, shakeHandNum:'邀请好友'};
        that.$apply();
        // console.log(that.stageDataRight);
    }
}

/**
 *  房主退出
 * @param data
 * @param that
 */
function masterOut(data,that){
    // console.log('房主退出===================')
    // console.log(data)
    let out = data[0].out;
    if(out == 2){
        that.masterOut();
    }
}


/**
 *  游戏时间
 * @param data
 * @param that
 */
function gameTimeE(data,that){
    // console.log('游戏时间======================');
    // console.log(data);
    let time = data[0].time;
    that.time = time;
    that.$apply();
}


/**
 *  同步组员准备/未准备
 * @param data
 * @param that
 */
function slaveReady(data,that){
    // console.log('ready===============')
    // console.log(data)
    data.forEach(function(item) {
        if(item.userId == that.stageDataRight.userId){
            that.stageDataRight.isLight = item.status;
        } else if(item.userId == that.stageDataLeft.userId){
            that.stageDataLeft.isLight = item.status;
        } else if(item.userId == that.stageDataCenter.userId){
            that.stageDataCenter.isLight = item.status;
        }
        that.$apply();
    });
}


/**
 *  同步开始游戏
 * @param data
 * @param that
 */
function slaveStart(data,that){
    // console.log('start=======================')
    // console.log(data);
    let isUse = data[0].is_use;
    if(isUse == 2){
        that.start(data);
    }
}


/**
 *  同步计数
 * @param data
 * @param that
 */
function getNumber(data,that) {
    // console.log('number=================');
    // console.log(data);
    data.forEach(function(item) {
        if(item.userId == that.stageDataLeft.userId){
            that.stageDataLeft.shakeHandNum = item.num;
        } else if(item.userId == that.stageDataRight.userId){
            that.stageDataRight.shakeHandNum = item.num;
        }
        that.$apply();
    });
}


// 去掉用户组里自己的信息并去重
function dealGroupDataE(arrayData,userId){
    let data = [];
    let dataId = [];
    let len = arrayData.length;
    for(let i = 0; i < len; i++){
        let id  = arrayData[i].userId;
        if(id != userId){
            if(!dataId.includes(id)){
                dataId.push(id);
                data.push(arrayData[i]);
            }
        }
    }
    return data;
}


// 把房间人物信息绑定到左边舞台
function updateStageLeftDateE(groupInfo,that){
    that.stageDataLeft.userId = groupInfo.userId;
    that.stageDataLeft.roomId = groupInfo.id;
    that.stageDataLeft.logo = groupInfo.logo;
    that.stageDataLeft.name = groupInfo.name;
    that.stageDataLeft.photo = groupInfo.photo;
    that.stageDataLeft.shakeHandNum = groupInfo.name;
    that.stageDataLeft.isLight = groupInfo.status;
    if(!util.isEmpty(groupInfo.time)){
        gameTimeE([{time:groupInfo.time}],that);
    }
    that.$apply();
    // console.log('stageDataLeft==========')
    // console.log(that.stageDataLeft);
}

// 把房间人物信息绑定到右边舞台
function updateStageRightDateE(groupInfo,that){
    console.log(groupInfo);
    that.stageDataRight.userId = groupInfo.userId;
    that.stageDataRight.roomId = groupInfo.id;
    that.stageDataRight.logo = groupInfo.logo;
    that.stageDataRight.name = groupInfo.name;
    that.stageDataRight.photo = groupInfo.photo;
    that.stageDataRight.shakeHandNum = groupInfo.name;
    that.stageDataRight.isLight = groupInfo.status;
    if(!util.isEmpty(groupInfo.time)){
        gameTimeE([{time:groupInfo.time}],that);
    }
    that.$apply();
}

module.exports = {
    wsDeal:wsDeal
};