// websocket数据处理
import util from '@/utils/util';

const ty0 = 0; // 刚进去房间
const ty1 = 1; // 组员退出
const ty2 = 2; // 房主退出
const ty3 = 3; // 游戏时间
const ty4 = 4; // 修改状态(准备/未准备)
const ty5 = 5; // 开始游戏
const ty6 = 6; // 同步计数
/**
 *  解析 WS 数据
 * @param data
 * @param that
 */
function wsDeal(data, that, userId, shareId, isMaster) {
    let res = data;
    let ty = res.pop().type;
    // console.log(typeof ty);
    console.log('ty===========');
    console.log(ty);
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
        default: console.log(ty);
            break;
    }
}


/**
 *  组员加入
 * @param res
 * @param that
 * @param userInfo
 * @param shareId
 * @param isMaster
 */
function slaveEnter(data, that, userId, shareId,isMaster = true) {
    // console.log('enter============');
    // console.log(data);
    let arrs = dealGroupDataE(data,userId);
    // console.log('arrs===============');
    // console.log(arrs);
    if(isMaster){
        if(arrs[0]){
           updateStageLeftDateE(arrs[0],that);
        }
        if(arrs[1]){
            updateStageRightDateE(arrs[1],that);
        }
    } else {
        arrs.forEach(function(item) {
            if(item.userId != shareId){
                updateStageRightDateE(item,that);
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
    let groupId = [];
    arr.forEach(function(item) {
        groupId.push(item.userId);
    });
    if(!groupId.includes(that.stageDataLeft.userId)){
        that.stageDataLeft = {userId:'', roomId:'', legOrHand:'', logo:'', photo:'', isLight:1, shakeHandNum:'邀请好友'};
        that.$apply();
    }
    if(!groupId.includes(that.stageDataRight.userId)){
        that.stageDataRight = {userId:'', roomId:'', legOrHand:'', logo:'', photo:'', isLight:1, shakeHandNum:'邀请好友'};
        that.$apply();
    }
}

/**
 *  房主退出
 * @param data
 * @param that
 */
function masterOut(data,that){
    console.log('out===================')
    console.log(data)
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
    // console.log('time======================')
    // console.log(data)
    let time = data[0].time.split('#');
    that.selectTimeIndex = [time[0], time[1], time[2]];
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
    let isUse = data.shift().is_use;
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
    console.log('number=================');
    console.log(data);
    data.forEach(function(item) {
        if(item.userId == that.stageDataLeft.userId){
            that.stageDataLeft.shakeHandNum = item.num;
        } else if(item.userId == that.stageDataRight.userId){
            that.stageDataRight.shakeHandNum = item.num;
        }
        that.$apply();
    });
}


// 去掉用户组里自己的信息
function dealGroupDataE(arrayData,userId){
    let data = [];
    let len = arrayData.length;
    for(let i = 0; i < len; i++){
        if(arrayData[i].userId != userId){
            data.push(arrayData[i]);
        }
    }
    return data;
}

// 把房间人物信息绑定到左边舞台
function updateStageLeftDateE(groupInfo,that){
    for(let k in groupInfo){
        that.stageDataLeft[k] = groupInfo[k];
    }
    that.stageDataLeft.shakeHandNum = groupInfo.name;
    that.stageDataLeft.isLight = groupInfo.status;
    console.log(groupInfo.time);
    if(groupInfo.time){
        gameTimeE([{time:groupInfo.time}],that);
    }
    that.$apply();
}

// 把房间人物信息绑定到右边舞台
function updateStageRightDateE(groupInfo,that){
    for(let k in groupInfo){
        that.stageDataRight[k] = groupInfo[k];
    }
    that.stageDataRight.shakeHandNum = groupInfo.name;
    that.stageDataRight.isLight = groupInfo.status;
    console.log(groupInfo.time)
    if(groupInfo.time){
        gameTimeE([{time:groupInfo.time}],that);
    }
    that.$apply();
}

module.exports = {
    wsDeal:wsDeal,
}