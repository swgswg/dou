/**
 * 返回任意时间的时间戳
 */
function timeStamp(flag, mytimer){
    // mytimer = '2015/06/23 08:00:20'
    let _time = null;
    if(flag == 1){
        // 当前时间 秒数
       _time = String(Date.parse(new Date())).slice(0, -3);
    } else if(flag == 2){
        // 当前时间 毫秒数
        _time = (new Date()).getTime();
    } else if(flag == 3){
        // 任意时间时间戳 毫秒数
        _time = (new Date(mytimer)).getTime();
    } else if (flag == 4){
        // 任意时间时间戳 秒数
        _time = ( (new Date(mytimer)).getTime() ) / 1000;
    }
    return _time;
}

/**
* 格式化时间戳 
*/
function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
    var date = new Date(time);

    var year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index;
    });////开个长度为10的数组 格式为 00 01 02 03

    var newTime = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

    return newTime;
    // console.log(formatDate(new Date().getTime()));//2017-05-12 10:05:44
    // console.log(formatDate(1527253460000, 'YY年MM月DD日'));//2017年05月12日
    // console.log(formatDate(1527253460000, '今天是YY/MM/DD hh:mm:ss'));//今天是2017/05/12 10:07:45
}

/**
 * 格式化日期
 */
function format(time, fmt) {
    time = time instanceof Date ? time : new Date(time);
    var o = {
        "M+": time.getMonth() + 1,                 //月份 
        "d+": time.getDate(),                    //日 
        "h+": time.getHours(),                   //小时 
        "m+": time.getMinutes(),                 //分 
        "s+": time.getSeconds(),                 //秒 
        "q+": Math.floor((time.getMonth() + 3) / 3), //季度 
        "S": time.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 格式化日期 - （人性化）(附加时间)
 * @param {Number|Date} time
 * @return {string}
 */
function formatSmartTime(time) {
    time = time instanceof Date ? time.getTime() : new Date(time);
    var diffTime = new Date().getTime() - time;
    // console.log(diffTime);
    //今天凌晨时间戳
    const toDayTime = new Date().setHours(0, 0, 0);
    //昨天凌晨时间戳
    const yesterDayTime = toDayTime - 86400000;
    //明天凌晨时间戳
    const tomorrowTime = toDayTime + 86400000;
    //前天凌晨时间戳
    const beforeYesterdayTime = yesterDayTime - 86400000;
    //后天凌晨时间戳
    const afterTomorrowTime = tomorrowTime + 86400000;

    if (diffTime < 0) {

        diffTime = Math.abs(diffTime);
        //大于一分钟
        if (diffTime < 60000) return "一会儿";
        //大于一分钟小于一小时
        if (diffTime >= 60000 && diffTime < 3600000) return parseInt(diffTime / 60000) + "分钟后";
        //今天
        if (time < tomorrowTime) return "今天" + format(time, "hh:mm");
        //明天
        if (time < afterTomorrowTime) return "明天" + format(time, "hh:mm");
        //后天
        if (time < afterTomorrowTime + 86400000) return "后天" + format(time, "hh:mm");
    } else {
        //小于一分钟
        if (diffTime < 60000) return "刚刚";
        //大于一分钟小于一小时
        if (diffTime >= 60000 && diffTime < 3600000) return parseInt(diffTime / 60000) + "分钟前";
        //今天
        if (time > toDayTime) return "今天" + format(time, "hh:mm");
        //昨天
        if (time > yesterDayTime) return "昨天" + format(time, "hh:mm");
        //前天
        if (time > beforeYesterdayTime) return "前天" + format(time, "hh:mm");
    }
    //月份/日 大于今年开始时间
    const toYearTime = new Date();
    toYearTime.setMonth(0, 0);
    toYearTime.setHours(0, 0, 0, 0);
    const toYearTime2 = new Date(time);
    toYearTime2.setMonth(0, 0);
    toYearTime2.setHours(0, 0, 0, 0);
    if (toYearTime.getTime() == toYearTime2.getTime())
        return format(time, "M月d日 hh:mm");
    return format(time, "yyyy年M月d日 hh:mm");
}

/**
 * m-n之间的随机数(包含m,n)
 * @param m
 * @param n
 * @returns {number}
 */
function rand(m, n) {
    return Math.ceil(Math.random() * (n - m + 1)) + (m - 1);
}

/**
 *  数组排序
 * @param arr
 * @param ascOrDesc asc升序 desc降序
 * @returns {*} 排序后的数组
 */
function sorting(arr, ascOrDesc = 'asc', field = null) {
    function info(a,b) {
        if(field){
            if(ascOrDesc === 'asc'){
                if(a[field] > b[field]){
                    return 1;
                } else if(a[field] < b[field]){
                    return -1;
                } else {
                    return 0;
                }
            } else if(ascOrDesc === 'desc') {
                if(a[field] < b[field]){
                    return 1;
                } else if(a[field] > b[field]){
                    return -1;
                } else {
                    return 0;
                }
            }
        } else {
            if(ascOrDesc === 'asc'){
                if(a > b){
                    return 1;
                } else if(a < b){
                    return -1;
                } else {
                    return 0;
                }
            } else if(ascOrDesc === 'desc'){
                if(a < b){
                    return 1;
                } else if(a > b){
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    }
    return arr.sort(info);
}

/**
 * 验证正则
 */
function checkReg(flag, data) {
    let reg = null;
    switch (flag) {
        case 1:
            // 手机号
            reg = /^1[34578]\d{9}$/;
            break;
        case 2:
            // 身份证号
            reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
            break;
        case 3:
            // 银行卡号
            reg = /^([1-9]{1})(\d{15}|\d{18})$/;
        case 4:
            // 带小数的金额
            reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            break;
        case 5:
            // 折扣正则(如8.8)
            reg = /[1-9](\.[1-9])?|0\.[1-9]/;
            break;
        case 6:
            // 非零的正整数
            reg = /^[1-9]\d*$/;
            break;
    }
    return reg.test(data);
}

/**
 * 根据范围创建数组，包含指定的元素
 * @param start {Number}
 * @param end {Number}
 * @param zeroFill 是否需要签到零 {Boolean}
 * @returns {Array}
 */
function arrRange(start, end, zeroFill) {
    let arr = [];
    let len = end - start;
    for (let i = start; i <= len; i++) {
        if(zeroFill){
            if(i < 10){
                i = '0'+i;
            }
        }
        arr.push(String(i));
    }
    return arr;
}

/**
 * 指定数组有指定个数的相同元素 [1,1,1,1]
 * @param myvalue
 * @param mylength
 * @returns {Array}
 */
function repeatArr(myvalue, mylength) {
    let arr = [];
    for (let i = 0; i < mylength; i++) {
        arr[i] = myvalue;
    }
    return arr;
}

/**
 * 处理银行卡号显示* 中间用*表示
 * @param data
 * @returns {string}
 */
function bankCardByStar(data) {
    let newdata = String(data);
    let len = newdata.length;
    return ('*'.repeat(len - 4) + newdata.slice(len - 4));
}

/**
 * 获取当前页url
 * @returns {*}
 */
function getCurrentPageUrl() {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    return url
}

/**
 * 获取当前页带参数的url
 * @returns {string}
 */
function getCurrentPageUrlWithArgs() {
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    let options = currentPage.options; //如果要获取url中所带的参数可以查看options

    //拼接url的参数
    let urlWithArgs = url + '?';
    for (let key in options) {
        let value = options[key];
        urlWithArgs += key + '=' + value + '&';
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);

    return urlWithArgs;
}

/**
 * 获取上一页url
 * @returns {*}
 */
function getPrevPageUrl() {
    let pages = getCurrentPages(); //获取加载的页面
    let prevPage = pages[pages.length - 2]; //获取上一级页面的对象
    let url = prevPage.route; //上一个页面url
    return url;
}

/**
 * 倒计时
 * @param endTime
 */
function mytimer(endTime, that) {
    let EndTime = new Date(endTime);
    let clear_set = null;
    // console.log(EndTime);
    clear_set = setInterval(function () {
        let NowTime = new Date();
        let t = EndTime.getTime() - NowTime.getTime();
        let d = 0;
        let h = 0;
        let m = 0;
        let s = 0;
        if (t >= 0) {
            d = Math.floor(t / 1000 / 60 / 60 / 24);
            if (d < 10) {
                d = '0' + d;
            }
            h = Math.floor(t / 1000 / 60 / 60 % 24);
            if (h < 10) {
                h = '0' + h;
            }
            m = Math.floor(t / 1000 / 60 % 60);
            if (m < 10) {
                m = '0' + m;
            }
            s = Math.floor(t / 1000 % 60);
            if (s < 10) {
                s = '0' + s;
            }
            that.setData({
                timer: d + '天' + h + '时' + m + '分' + s + '秒'
            });
        } else {
            that.setData({
                timer: '已结束'
            });
            clearInterval(clear_set);
        }
    }, 1000);
}

/**
 *  将秒数转化为时分秒
 * @param sec
 * @returns {string}
 */
function secondToHMS(sec) {
    let second = sec;
    let hour = Math.floor(second / 3600);
    second = second % 3600;
    let minute = Math.floor(second / 60);
    second = second % 60;
    if(hour > 0){
        return hour + '时' + minute + '分' + second + '秒';
    }
    if(minute > 0){
        return minute + '分' + second + '秒';
    }
    if(second > 0){
        return second + '秒';
    }
}

/**
 *  将秒数转化为天时分秒
 * @param sec
 * @returns {string}
 */
function secondToDHMS(sec) {
    let second = sec;
    let day = Math.floor(second / 86400);
    let hour = Math.floor(second / 3600);
    second = second % 3600;
    let minute = Math.floor(second / 60);
    second = second % 60;
    if(day > 0){
        return day + '天' + hour + '时' + minute +'分' +second+'秒';
    }
    if(hour > 0){
        return hour + '时' + minute + '分' + second+'秒';
    }
    if(minute > 0){
        return minute + '分' + second+'秒';
    }
    if(second > 0){
        return second+'秒';
    }
}

/**
 * 判断值是否为空
 * @param data
 * @returns {boolean}
 */
function isEmpty(data) {
    if (data === "" || data === 0 || data === "0" || data === null || data === false || typeof data === 'undefined') {
        return true;
    }
    if (typeof data == 'object') {
        for (let key in data) {
            return false;
        }
        return true;
    }
    return false;
}

/**
 * 删除数组指定的下标元素(从0开始)
 * @param arr  数组
 * @param n    删除数组的下标
 * @returns {arr}
 */
function arrDelete(arr, n) {
    if (n < 0) 　{
        //如果n<0，则不进行任何操作。
        return arr;
    } else {
        return arr.slice(0, n).concat(arr.slice(n + 1, arr.length));
    }
}

/**
 * 产生任意长度随机字母数字组合
 * @param randomFlag 是否任意长度(任意true,不任意false)
 * @param min min-任意长度最小位[固定位数]
 * @param max max-任意长度最大位
 * @returns {string}
 */
function randomWord(randomFlag, min, max) {
    let str = "";
    let range = min;
    let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // 随机产生
    if (randomFlag) {
        // range = Math.round(Math.random() * (max - min)) + (min+1);
        range = Math.ceil(Math.random() * (max-min+1)) + (min-1);
    }
    for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
    // 生成3-32位随机串：randomWord(true, 3, 32)
    // 生成43位随机串：randomWord(false, 43)
}

/**
 * 将时分秒转化为秒数
 * @param time
 */
function timeToSecond(time) {
    let timeArr = time.split(':');
    let hour = null;
    let min = null;
    let sec = null;
    if(timeArr.length === 1){
        return timeArr[0];
    } else if(timeArr.length === 2){
        min = parseInt(timeArr[0]);
        sec = parseInt(timeArr[1]);
        return min * 60 + sec;
    } else if(timeArr.length === 3){
        hour = parseInt(timeArr[0]);
        min = parseInt(timeArr[1]);
        sec = parseInt(timeArr[2]);
        return hour * 3600 + min * 60 + sec;
    }
}

/**
 * 将秒数转化为时分秒
 * @param time 秒数
 * @param format 转化的格式
 * @returns {string}
 */
function SecondFormat(time,format='hh:mm:ss') {
    // 将秒数转化为 hh:mm:ss/ mm:ss/ hh-mm-ss/ mm-ss/ ss
    let second = time;
    let day = Math.floor(second / 86400);
    second = second % 86400;

    let hour = Math.floor(second / 3600);
    second = second % 3600;

    let minute = Math.floor(second / 60);
    second = second % 60;
    if(hour < 10){
        hour = '0' + hour;
    }
    if(minute < 10){
        minute = '0' + minute;
    }
    if(second < 10){
        second = '0' + second;
    }

    let newTime = format.replace(/d/g, day)
        .replace(/hh/g, hour)
        .replace(/mm/g, minute)
        .replace(/ss/g, second);

    return newTime;
}

/**
 * ArrayBuffer转16进度字符串
 * @param buffer
 * @returns {string}
 */
function ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2);
        }
    );
    return hexArr.join('');
}

/**
 * 16进制字符串转ArrayBuffer
 */
function hex2ab(str) {
    if (!str) {
        return new ArrayBuffer(0);
    }
    let typedArray = new Uint8Array(str.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }));
    let buffer1 = typedArray.buffer;
    // console.log(buffer1);
    return buffer1;
}

module.exports = {
    format: format,
    formatSmartTime: formatSmartTime,
    formatDate: formatDate,
    rand: rand,
    sorting:sorting,
    arrRange: arrRange,
    checkReg: checkReg,
    repeatArr: repeatArr,
    bankCardByStar: bankCardByStar,
    getCurrentPageUrl: getCurrentPageUrl,
    getPrevPageUrl: getPrevPageUrl,
    getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
    mytimer: mytimer,
    secondToHMS:secondToHMS,
    secondToDHMS:secondToDHMS,
    isEmpty: isEmpty,
    arrDelete: arrDelete,
    randomWord: randomWord,
    timeStamp: timeStamp,
    timeToSecond:timeToSecond,
    SecondFormat:SecondFormat,
    ab2hex:ab2hex,
    hex2ab:hex2ab,

};
