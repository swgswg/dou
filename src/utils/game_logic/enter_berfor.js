// 进入之前
import api from '@/utils/api';
import util from '@/utils/util';
import {AME_USER, PAGES_PATH } from '@/utils/constant';
import wsDataDeal from '@/utils/game_logic/wsDataDeal';
import socketServer from '@/utils/game_logic/socketServer';

// 房主创建房间
async function masterBuildRoom(userId, share, mystatus = 0) {
    let res = await api.addRoom({
        query:{
            userId: userId,
            // 0手抖,1抖腿
            status: mystatus,
        }
    });
    if(res.data.state == 1){
        roomId = res.data.data.roomId;
        legOrHand = res.data.data.status;
        shareId = share;
        return {roomId: roomId, legOrHand: legOrHand};
    } else {
        wx.switchTab({
            url:'/pages/select_model'
        });
        tip.error('网络错误');
    }
}

// 组员进入房间(组员已有信息/组员初次进入)
function memberEnterRoom(userInfo, shareId, roomId, legOrHand, that) {
    // 组员判断能不能进入这个房间(满员或已经开始不能进入)
    intoRoomJudgeE(roomId, that, userInfo.id, shareId);

    // 判断组员是否是初次进来
    if(util.isEmpty(userInfo.logo)){
        let path = '/pages/PK_model_slave?share=' + shareId + '&roomId=' + roomId + '&legOrHand=' + legOrHand;
        wepy.setStorageSync(PAGES_PATH, {path: path});

        // 信息不全跳转去绑定信息
        wx.redirectTo({
            url:'/pages/mobile_verify'
        });
        return false;
    }

    // 建立还有关系
    establishFriend(userInfo.id, shareId);
}

// 判断组员能不能进入这个房间
async function intoRoomJudgeE(myroomId, that, userId, shareId){
    let res = await api.intoRoomJudge({
        query:{
            userId:userInfo.id,
            roomId:myroomId
        }
    });
    if(res.data.state == 1){
        // 把已有的房间人绑定到舞台上
        wsDataDeal.memberEnter(res.data.data, that, userId, shareId, true);
    } else {
        // 不能进入房间
        wx.switchTab({
            url:'/pages/select_model'
        });
        // 关闭webSocket
        socketServer.wsClose();
        tip.alert('房间已满');
    }
}

// 建立好友关系
async function establishFriend(userId,shareId){
    // 通过转发进来的建立好友关系
    await api.inviteFriend({
        query:{
            userId: userId,
            weChat: shareId,
        }
    });
}

module.exports = {
    masterBuildRoom:masterBuildRoom,
    memberEnterRoom:memberEnterRoom,
};