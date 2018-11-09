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
 * @param roomId
 */
function wsConnect (userId, roomId) {
    user_id = userId;
    room_id = roomId;
    if(!isOpen){
        SocketTask = wx.connectSocket({
            url: wsHost,
            success: function(res) {
                console.log('WebSocket连接创建connectSocket', res);

            }
        });
    }
}

/**
 * 监听WebSocket 连接打开
 */
function wsOnOpen(openFun){
    SocketTask.onOpen( (res) => {
        isOpen = true;
        console.log('监听 WebSocket 连接打开事件onOpen。', res);
        openFun();
    });
}

/**
 *  通过 WebSocket 连接发送数据
 * @param receiveId
 * @param message
 */
function wsSend(message){

    console.log('sendMessage===================');
    // console.log(typeof sendMessage)
    console.log(message);
    SocketTask.send({
        data: JSON.stringify(message),
    });
}


/**
 * 监听WebSocket 接受到服务器的消息事件
 * @param mFun
 */
function wsOnMessage(mFun) {
    SocketTask.onMessage((res)=>{
        let data = res.data;
        let newData = JSON.parse(data);
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
    });
}


/**
 * 监听 WebSocket 错误
 */
function wsOnError(){
    SocketTask.onError( (res) => {
        console.log('监听 WebSocket 错误。错误信息onError', res);
        isOpen = false;
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


function wsInit(userId,roomId, openFun,mFun,closeFlag){
    wsConnect(userId, roomId);
    wsOnOpen(openFun);
    wsOnMessage(mFun);
    wsOnClose(closeFlag);
    wsOnError();
}


module.exports = {
    wsInit:wsInit,
    wsSend:wsSend,
    wsClose:wsClose,
};