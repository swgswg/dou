/**
 * webSocket 封装
 */

import config from '@/utils/config_local';
const wsHost = config.webSocketHost;
var SocketTask = null;
var isOpen = false;
var user_id = null;

/**
 *  连接webSocket
 * @param userId
 */
function wsConnect (userId) {
    user_id = userId;
    if(!isOpen){
        SocketTask = wx.connectSocket({
            url: wsHost + userId,
            success: function(res) {

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
    // console.log('sendMessage===================')
    // console.log(typeof sendMessage)
    console.log(sendMessage);
    SocketTask.send({
        data: sendMessage,
    });
}


/**
 * 监听WebSocket 接受到服务器的消息事件
 * @param fun
 */
function wsOnMswwage(fun) {
    SocketTask.onMessage((res)=>{
        let data = res.data;
        let newData = JSON.parse(data);
        // console.log('websocket==============')
        // console.log(newData);
        fun(newData);
    });
}


/**
 * 监听WebSocket 连接关闭
 */
function wsOnClose(){
    SocketTask.onClose( (res) => {
        console.log('监听 WebSocket 连接关闭事件onClose。', res);
        // 1000代表正常关闭
        // if(res.code != 1000){
        //     isOpen = false;
        //     // 重新连接
        //     wsConnect(user_id);
        // }
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
    SocketTask.close({
        success: function(){
            console.log("关闭成功close...")
        },
        fail: function(){
            console.log("关闭失败close...")
        }
    });
}

function wsInit(userId,heartbeat,fun){
    wsConnect(userId);
    wsOnOpen(heartbeat);
    wsOnMswwage(fun);
    wsOnClose();
    wsOnError();
}


module.exports = {
    wsInit:wsInit,
    wsSend:wsSend,
    wsClose:wsClose,
};