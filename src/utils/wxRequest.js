import wepy from 'wepy';
// import util from './util';
import tip from './tip'

// const API_SECRET_KEY = 'www.mall.cycle.com';
// const TIMESTAMP = util.getCurrentTime()

const wxRequest = async(params = {}, url) => {
    tip.loading();
    let data = params.query || {};
    // data.time = TIMESTAMP;
    let res = await wepy.request({
        url: url,
        method: params.method || 'POST',
        data: data,
        header: { 'Content-Type': 'application/json' },
    });
    tip.loaded();
    return res;
};


module.exports = {
    wxRequest
}
