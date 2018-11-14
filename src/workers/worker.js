worker.onMessage(function (res) {

    let clear_set = null;
    let timeInit = res.time;
    let timeArr = timeInit.split(':');
    let hour = parseInt(timeArr[0]);
    let min = parseInt(timeArr[1]);
    let sec = parseInt(timeArr[2]);
    let newTime = hour * 3600 + min * 60 + sec;

    clear_set = setInterval(function() {
        // let newTime = 0;
        // let timeArr = res.time.split(':');
        // let hour = null;
        // let min = null;
        // let sec = null;
        // if(timeArr.length === 1){
        //     newTime = timeArr[0];
        // } else if(timeArr.length === 2){
        //     min = parseInt(timeArr[0]);
        //     sec = parseInt(timeArr[1]);
        //     newTime = min * 60 + sec;
        // } else if(timeArr.length === 3){
        //     hour = parseInt(timeArr[0]);
        //     min = parseInt(timeArr[1]);
        //     sec = parseInt(timeArr[2]);
        //     newTime = hour * 3600 + min * 60 + sec;
        // }


        if(newTime <= 0){
            clearInterval(clear_set);
            worker.postMessage({time: '00:00:00'});
            return;
        }
        --newTime;
        let hour2 = Math.floor(newTime / 3600);
        let second2 = newTime % 3600;

        let minute2 = Math.floor(second2 / 60);
        second2 = second2 % 60;
        if(hour2 < 10){
            hour2 = '0' + hour2;
        }
        if(minute2 < 10){
            minute2 = '0' + minute2;
        }
        if(second2 < 10){
            second2 = '0' + second2;
        }
        let time = hour2+':'+minute2+':'+second2;
        worker.postMessage({time: time});
    },1000);

});