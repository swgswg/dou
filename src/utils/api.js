import { wxRequest } from '@/utils/wxRequest';

// let env = "-test" //-dev 或者 -test
const apiMall = 'https://sujiefs.com/';

/**
 * 接口
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */

//微信的jscode换取sessionKey
const wxJsCode2Session = (params) => wxRequest(params, apiMall + '/api/wechat/jscode2session');
const user2session = (params) => wxRequest(params, apiMall + '/api/wechat/user2session?jsoncallback=?');

export default {
    wxJsCode2Session,
    user2session,

};
