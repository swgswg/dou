// websocket数据处理
import util from '@/utils/util';


// const ty0 = 0; // 刚进去房间
// const ty1 = 1; // 组员退出
// const ty2 = 2; // 房主退出
// const ty3 = 3; // 游戏时间
// const ty4 = 4; // 修改状态(准备/未准备)
// const ty5 = 5; // 开始游戏
// const ty6 = 6; // 同步计数
// const ty7 = 7; // 断开重连
// const ty8 = 8; // 接收成功给服务器返回消息

const ty0 = 'addSelf';  // 进入房间传给自己的信息
const ty1 = 'add';      // 进入房间传给队友的信息
const ty2 = 'ready';    // 准备
const ty3 = 'time';     // 时间
const ty4 = 'start';    // 开始
const ty5 = 'num';      // 次数
const ty6 = 'out';      // 退出
const ty7 = 'stop';     // 结束
const ty8 = 'masterOut'; // 房主退出
/**
 *  解析 WS 数据
 * @param data
 * @param that
 */
function wsDeal(data, that, userId) {
    console.log('wsDataDeal==========');
    console.log(data);
    let ty = data.type;
    console.log(ty);
    switch (ty){
        case ty0: addSelf(data, that, userId);
            break;
        case ty1: add(data, that);
            break;
        case ty2: ready(data, that);
            break;
        case ty3: time(data, that);
            break;
        case ty4: start(data, that);
            break;
        case ty5: num(data, that);
            break;
        case ty6: out(data, that, userId);
            break;
        case ty7 : stop(data, that);
            break;
        case ty8: masterOutGame(that);
    }
}


/**
 *  自己加入房间
 * @param data
 * @param that
 */
function addSelf(data, that, userId){
    let user  = data.user;
    let i = 0;
    for(let k in user){
        ++i;
        if(k == userId){
            updateStageCenterDateE(user[k], that);
        } else {
            if(i=== 2){
                updateStageLeftDateE(user[k], that);
            } else {
                updateStageRightDateE(user[k], that);
            }
        }
    }
    
    if(!util.isEmpty(data.time)){
        that.time = data.time;
    }
    that.$apply();

}


/**
 *  组员加入房间
 * @param data
 * @param that
 */
function add(data, that) {
    let user = data.user;
    if(that.stageDataLeft.userId == ''){
        updateStageLeftDateE(user, that);
    } else if(that.stageDataRight.userId == ''){
        updateStageRightDateE(user, that);
    }
    that.$apply();
}


/**
 *  准备
 * @param data
 * @param that
 */
function ready(data, that) {
    let ready = data.ready;
    let userId = data.userId;
    if(that.stageDataLeft.userId == userId){
        that.stageDataLeft.isLight = ready;
    } else if(that.stageDataRight.userId == userId){
        that.stageDataRight.isLight = ready;
    }
    that.$apply();
}


/**
 *  时间
 * @param data
 * @param that
 */
function time(data, that) {
    that.time = data.time;
    that.$apply();
}


/**
 *  开始
 * @param data
 * @param that
 */
function start(data, that) {
    if(data.start == 1){
        that.start();
    }
    console.log('start=============');
    console.log(start);
    that.$apply();
}


/**
 *  点击次数
 * @param data
 * @param that
 */
function num(data, that) {
    if(data.userId == that.stageDataLeft.userId){
        that.stageDataLeft.shakeHandNum = data.num;
    } else if(data.userId == that.stageDataRight.userId) {
        that.stageDataRight.shakeHandNum = data.num;
    }
    that.$apply();
}


/**
 *  游戏结束
 * @param data
 * @param that
 */
function stop(data, that) {
    that.ranking = data.ranking;
    that.$apply();
}


/**
 *  组员退出
 * @param data
 * @param that
 * @param userId
 */
function out(data, that, userId) {
    
    if(data.userId == that.stageDataLeft.userId){
        that.stageDataLeft = {userId:'', roomId:'', legOrHand:'', logo:'', photo:'', isLight:1, shakeHandNum:'邀请好友'};
        that.$apply();
    } else if(data.userId == that.stageDataRight.userId){
        that.stageDataRight = {userId:'', roomId:'', legOrHand:'', logo:'', photo:'', isLight:1, shakeHandNum:'邀请好友'};
        that.$apply();
    }
    that.$apply();
}


/**
 *  房主退出
 * @param that
 */
function masterOutGame(that) {
    that.masterOut();
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

    // 接收到信息后给服务器返回接收成功信息
    // that.receiveSuccess();
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

    // 接收到信息后给服务器返回接收成功信息
    // that.receiveSuccess();
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

    // 接收到信息后给服务器返回接收成功信息
    // that.receiveSuccess();
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

    // 接收到信息后给服务器返回接收成功信息
    // that.receiveSuccess();
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

    // 接收到信息后给服务器返回接收成功信息
    // that.receiveSuccess();
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
// 把房间人物信息绑定到中间
function updateStageCenterDateE(groupInfo,that){
    that.stageDataCenter.userId = groupInfo.userId;
    that.stageDataCenter.logo = groupInfo.logo;
    that.stageDataCenter.photo = groupInfo.photo;
    that.stageDataCenter.shakeHandNum = groupInfo.num;
    that.stageDataCenter.isLight = groupInfo.ready;
    that.$apply();
}

// 把房间人物信息绑定到左边舞台
function updateStageLeftDateE(groupInfo,that){
    that.stageDataLeft.userId = groupInfo.userId;
    that.stageDataLeft.logo = groupInfo.logo;
    that.stageDataLeft.photo = groupInfo.photo;
    that.stageDataLeft.shakeHandNum = groupInfo.num;
    that.stageDataLeft.isLight = groupInfo.ready;
    that.$apply();
}

// 把房间人物信息绑定到右边舞台
function updateStageRightDateE(groupInfo,that){
    that.stageDataRight.userId = groupInfo.userId;
    that.stageDataRight.logo = groupInfo.logo;
    that.stageDataRight.photo = groupInfo.photo;
    that.stageDataRight.shakeHandNum = groupInfo.num;
    that.stageDataRight.isLight = groupInfo.ready;
    that.$apply();
}

module.exports = {
    wsDeal:wsDeal
};