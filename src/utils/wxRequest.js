import wepy from 'wepy';
import tip from './tip';
import weixin from './weixin';
let token = null;

const wxRequest = async(params = {}, url) => {
    tip.loading();
    let data = params.query || {};
    // data.time = TIMESTAMP;
    let res = await wepy.request({
        url: url,
        method: params.method || 'POST',
        data: data,
        // header: { 'Content-Type': 'application/json' },
        header: {'content-type': 'application/x-www-form-urlencoded', token: token},
    });
    tip.loaded();

    // 重要操作验证token
    if(res.data.message == '请重新登录'){
        wx.showModal({
            title: '登录通知',
            content: '您的账号在其他端被占用, 请确认是否是本人操作, 如果不是本人请重新登录',
            confirmText:'重新登录',
            success: async (res)=> {
                if (res.confirm) {
                    weixin.weixinLogin();
                }
            }
        });
    }
    return res;
};

const wxRequest1 = async(params = {},url) => {
    tip.loading();
    let data = params.query || {};
    // data.time = TIMESTAMP;
    let res = await wepy.request({
        url: url,
        method: params.method || 'POST',
        data: data,
        // header: { 'Content-Type': 'application/json' },
        header: {'content-type': 'application/x-www-form-urlencoded'},
    });
    tip.loaded();
    token = res.data.data.token;
    return res;
};

module.exports = {
    wxRequest,
    wxRequest1
}
