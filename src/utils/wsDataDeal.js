// websocket数据处理
import util from '@/utils/util';
import tip from '@/utils/tip';

const ty0 = '0'; // 房间进不去
const ty1 = '1'; // 自己进入房间
const ty2 = '2'; // 用户准备
const ty3 = '3'; // 修改时间
const ty4 = '4'; // 开始游戏
const ty5 = '5'; // 同步计数
const ty6 = '6'; // 游戏结束
const ty7 = '7'; // 组员加入房间
const ty8 = '8'; // 组员退出
const ty9 = '9'; //
const ty10 = '10'; // 房主退出
const ty11 = '11'; // 房主游戏中退出

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
        case ty0: ban(data.message);
            break;
        case ty1: addSelf(data, that, userId);
            break;
        case ty7: add(data, that);
            break;
        case ty2: ready(data, that);
            break;
        case ty3: time(data, that);
            break;
        case ty4: start(data, that);
            break;
        case ty5: num(data, that);
            break;
        case ty6: stop(data, that, userId);
            break;
        case ty8: out(data, that, userId);
            break;
        case ty10: masterOutGame(that);
            break;
        case ty11: masterOutGameing(that);
    }
}


/**
 *  禁止进入
 */
function ban(message) {
    wx.switchTab({
        url: '/pages/select_model',
        success:function() {
            tip.longtoast(message);
        }
    })
}



/**
 *  自己加入房间
 * @param data
 * @param that
 */
function addSelf(data, that, userId){
    let user  = data.user;
    let user1 = user.pop();
    if(user1.userId == userId){
        updateStageCenterDateE(user1, that);
        user.forEach(function(item,index) {
            if(index == 0){
                updateStageLeftDateE(item, that);
            } else {
                updateStageRightDateE(item, that);
            }
        });
    } else {
        updateStageLeftDateE(user1, that);
        user.forEach(function(item) {
            if(item.userId == userId){
                updateStageCenterDateE(item, that);
            } else {
                updateStageRightDateE(item, that);
            }
        });
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
    console.log('user==============');
    console.log(user);
    if( util.isEmpty( that.stageDataLeft.userId)){
        console.log(user);
        updateStageLeftDateE(user, that);
    } else if(util.isEmpty( that.stageDataRight.userId)){
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
    let status = data.status;
    let userId = data.userId;
    if(that.stageDataLeft.userId == userId){
        that.stageDataLeft.isLight = status;
    } else if(that.stageDataRight.userId == userId){
        that.stageDataRight.isLight = status;
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
    that.start();
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
    // that.ranking = data.ranking;
    // that.$apply();
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
 * 房主在游戏中退出
 * @param that
 */
function masterOutGameing(that){
    that.masterOutGaming = 1;
    that.$apply();
}




// 把房间人物信息绑定到中间
function updateStageCenterDateE(groupInfo,that){
    that.stageDataCenter.userId = groupInfo.userId;
    that.stageDataCenter.logo = groupInfo.logo;
    that.stageDataCenter.photo = groupInfo.photo;
    that.stageDataCenter.shakeHandNum = groupInfo.name;
    that.stageDataCenter.isLight = groupInfo.status;
    that.$apply();
}

// 把房间人物信息绑定到左边舞台
function updateStageLeftDateE(groupInfo,that){
    that.stageDataLeft.userId = groupInfo.userId;
    that.stageDataLeft.logo = groupInfo.logo;
    that.stageDataLeft.photo = groupInfo.photo;
    that.stageDataLeft.shakeHandNum = groupInfo.name;
    that.stageDataLeft.isLight = groupInfo.status;
    that.$apply();
}

// 把房间人物信息绑定到右边舞台
function updateStageRightDateE(groupInfo,that){
    that.stageDataRight.userId = groupInfo.userId;
    that.stageDataRight.logo = groupInfo.logo;
    that.stageDataRight.photo = groupInfo.photo;
    that.stageDataRight.shakeHandNum = groupInfo.name;
    that.stageDataRight.isLight = groupInfo.status;
    that.$apply();
}

module.exports = {
    wsDeal:wsDeal
};