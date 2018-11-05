/**
 * webSocket 封装
 */

import config from '@/utils/config_local';
import api from '@/utils/api';
const wsHost = config.webSocketHost;
var SocketTask = null;
var isOpen = false;
var user_id = null;
var room_id = null;

/**
 *  连接webSocket
 * @param userId
 */
function wsConnect (userId,roomId) {
    user_id = userId;
    room_id = roomId;
    if(!isOpen){
        SocketTask = wx.connectSocket({
            url: wsHost + userId,
            success: function(res) {
                disconnectAndReconnect();
                console.log('WebSocket连接创建connectSocket', res);
            }
        });
    }
}

/**
 * 监听WebSocket 连接打开
 */
function wsOnOpen(heartbeat){
    SocketTask.onOpen( (res) => {
        isOpen = true;
        console.log('监听 WebSocket 连接打开事件onOpen。', res);
        // disconnectAndReconnect();
        // 添加心跳
        heartbeat()
    });
}

/**
 *  通过 WebSocket 连接发送数据
 * @param receiveId
 * @param message
 */
function wsSend(receiveId, message){
    let jsonMessage = JSON.stringify(message);
    let sendMessage = jsonMessage + '|' + receiveId;
    console.log('sendMessage===================');
    // console.log(typeof sendMessage)
    console.log(sendMessage);
    SocketTask.send({
        data: sendMessage,
        fail:function() {
            isOpen = false;
            wsConnect(user_id, room_id);
        }
    });
}


/**
 * 监听WebSocket 接受到服务器的消息事件
 * @param fun
 */
function wsOnMessage(mFun) {
    SocketTask.onMessage((res)=>{
        let data = res.data;
        let newData = JSON.parse(data);
        // console.log('websocket==============')
        // console.log(newData);
        mFun(newData);
    });
}


/**
 * 监听WebSocket 连接关闭
 */
function wsOnClose(closeFlag){
    SocketTask.onClose( (res) => {
        console.log('监听 WebSocket 连接关闭事件onClose。', res);
        isOpen = false;
        if(closeFlag){
            wsConnect(user_id, room_id);
        } else {
            if(res.code != 1000){
                // 1000代表正常关闭
                // 重新连接
                wsConnect(user_id, room_id);
            }
        }
    });
}


/**
 * 监听 WebSocket 错误
 */
function wsOnError(){
    SocketTask.onError( (res) => {
        console.log('监听 WebSocket 错误。错误信息onError', res);
        isOpen = false;
        wsConnect(user_id, room_id);
    });
}


/**
 * 监听 WebSocket 关闭
 */
function wsClose(){
    if(SocketTask){
        SocketTask.close({
            success: function(){
                isOpen = false;
                console.log("关闭成功close...")
            },
            fail: function(){
                console.log("关闭失败close...")
            }
        });
    }
}

/**
 *  断开重连
 * @param roomId
 */
async function disconnectAndReconnect(){
    console.log('断开重连==================');
    await api.getRoomUserData({
        query:{
            roomId:room_id
        }
    });
}

function wsInit(userId,roomId,heartbeat,mFun,closeFlag){
    wsConnect(userId,roomId);
    wsOnOpen(heartbeat);
    wsOnMessage(mFun);
    wsOnClose(closeFlag);
    wsOnError();
}


module.exports = {
    wsInit:wsInit,
    wsSend:wsSend,
    wsClose:wsClose,
};