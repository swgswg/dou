import { wxRequest } from '@/utils/wxRequest';

// let env = "-test" //-dev 或者 -test
// const apiMall = 'https://sujiefs.com/';

// 域名
const host = 'http://192.168.3.52:8080/';
// webScocket
const wshost = 'ws://192.168.3.52:8080/MicroPlatform/websocket/';
// 上传文件/解析图片 地址
const uploadFileUrl = 'http://jiaoyuvideo.oss-cn-beijing.aliyuncs.com/';

/**
 * 接口
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */

//微信的jscode换取sessionKey
const wxJsCode2Session = (params) => wxRequest(params, apiMall + '/api/wechat/jscode2session');
const user2session = (params) => wxRequest(params, apiMall + '/api/wechat/user2session?jsoncallback=?');

export default {
    host,
    wshost,
    uploadFileUrl,
    wxJsCode2Session,
    user2session,

};
