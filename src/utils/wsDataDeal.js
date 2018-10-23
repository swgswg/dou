// websocket数据处理
import util from '@/utils/util';

const ty0 = '0'; // 刚进去房间
const ty1 = '1'; // 组员退出
const ty2 = '2'; // 房主退出
const ty3 = '3'; // 游戏时间
const ty4 = '4'; // 修改状态(准备/未准备)
const ty5 = '5'; // 开始游戏

function wsDeal(data, that, groupFun, timeFun, readyFun) {
    let arr = data.split('@');
    let last = arr.pop();
    let ty = last.split('=')[1];
    console.log('ty================');
    console.log(typeof ty);
    console.log(ty);
    // if(ty == ty0 || ty == ty1){
    //      getGroupInfo(arr,groupFun);
    // } else if(ty == ty2){
    //      masterOut(that);
    // } else if(ty == ty3){
    //      gameTime(arr,timeFun);
    // } else if(){
    //
    // }
    switch (ty){
        case ty0:
        case ty1: getGroupInfo(arr,groupFun);
            break;
        case ty2: masterOut(that);
            break;
        case ty3: gameTime(arr,timeFun);
            break;
        case ty4: slaveReady(arr,readyFun);
            break;
        case ty5: startGame(arr,startFun);
            break;
    }
}

/**
 *  组员加入/组员退出
 * @param arr
 * @returns {Array}
 */
function getGroupInfo(arr,groupFun) {
    let newArr = [];
    arr.forEach(function(item,index) {
        newArr[index] = [];
        newArr[index] = item.split(',');
        if( util.isEmpty(newArr[newArr.length-1])) {
            newArr.pop();
        }
    });
    console.log('newArr=================');
    console.log(newArr);
    let group = [];
    let len = newArr.length;
    for(let i = 0; i < len; i++){
        let len2 = newArr[i].length;
        let b = {};
        for(let j = 0; j < len2; j++){
            let c = newArr[i][j].split('=');
            b[c[0]] = c[1];
        }
        group.push(b);
    }
    groupFun(group);
}


/**
 *  房主退出
 * @param that
 */
function masterOut(that){
    that.$broadcast('outEvents');
}


/**
 *  游戏时间
 * @param arr
 * @param timeFun
 */
function gameTime(arr,timeFun) {
    console.log(arr);
    let time = arr[0].split('=')[1].split('#');
    let newTime = [time[0], time[1], time[2]];
    console.log('newTime================');
    console.log(newTime);
    timeFun(newTime);
}

// 组员确定
function slaveReady(arr,readyFun) {
    let newArr = [];
    arr.forEach(function(item,index) {
        newArr[index] = [];
        newArr[index] = item.split(',');
    });
    console.log('ready===========');
    console.log(newArr);
    let ready = [];
    let len = newArr.length;
    for(let i = 0; i < len; i++){
        let len2 = newArr[i].length;
        let b = {};
        for(let j = 0; j < len2; j++){
            let c = newArr[i][j].split('=');
            b[c[0]] = c[1];
        }
        ready.push(b);
    }
    readyFun(ready);
}


// 开始游戏
function startGame(arr,startFun){
    console.log(arr);
    let start = arr[0].split('=')[1];
    console.log('start================');
    console.log(start);
    startFun(start);
}


module.exports = {
    wsDeal:wsDeal,
}