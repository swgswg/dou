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

/**
 *  解析 WS 数据
 * @param data
 * @param that
 */
function wsDeal(data, that, userId) {
    console.log('wsDataDeal==========');
    // console.log(data);
    let ty = data.type;
    console.log(ty);
    switch (ty){
        case ty0: addSelf(data, that, userId);
            break;
        case ty1:
            break;
        case ty2:
            break;
        case ty3:
            break;
        case ty4:
            break;
        case ty5:
            break;
        case ty6:
            break;
    }
}


/**
 *  组员加入
 * @param data
 * @param that
 */
function addSelf(data, that, userId){
    data.user.forEach(function (item,index) {
        if(index === 0){
            updateStageLeftDateE(item, that);
        } else if(index === 1){
            updateStageCenterDateE(item, that);
        } else if(index === 2){
            updateStageRightDateE(item, that);
        }
        if(item.userId == userId){
            updateStageCenterDateE(item, that);
        }

    });

    if(!util.isEmpty(data.time)){
        that.time = data.time;
    }

}

function add(data, that) {

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
    that.stageDataCenter.name = groupInfo.name;
    that.stageDataCenter.photo = groupInfo.photo;
    that.stageDataCenter.shakeHandNum = groupInfo.name;
    that.stageDataCenter.isLight = groupInfo.ready;
    that.$apply();
}

// 把房间人物信息绑定到左边舞台
function updateStageLeftDateE(groupInfo,that){
    that.stageDataLeft.userId = groupInfo.userId;
    that.stageDataLeft.logo = groupInfo.logo;
    that.stageDataLeft.name = groupInfo.name;
    that.stageDataLeft.photo = groupInfo.photo;
    that.stageDataLeft.shakeHandNum = groupInfo.name;
    that.stageDataLeft.isLight = groupInfo.ready;
    that.$apply();
}

// 把房间人物信息绑定到右边舞台
function updateStageRightDateE(groupInfo,that){
    that.stageDataRight.userId = groupInfo.userId;
    that.stageDataRight.logo = groupInfo.logo;
    that.stageDataRight.name = groupInfo.name;
    that.stageDataRight.photo = groupInfo.photo;
    that.stageDataRight.shakeHandNum = groupInfo.name;
    that.stageDataRight.isLight = groupInfo.ready;
}

module.exports = {
    wsDeal:wsDeal
};