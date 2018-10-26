// 背景音乐
import api from '@/utils/api';

const backgroundAudioManager = wx.getBackgroundAudioManager();
let i = 0;

/**
 * 后台播放音乐
 */
async function backgroundMusic(){
    let res = await api.getMusic({
        query:{}
    });
    if(res.data.state != 1) {
        return;
    }
    let music = res.data.data;

    prevOrNextMusic(music, 'next');

    backgroundAudioManager.onEnded(function (){
        // console.log('循环播放',i);
        prevOrNextMusic(music, 'next');
    });

    backgroundAudioManager.onError(function(res){
        console.log('error===========');
        console.log(res);
    });

    backgroundAudioManager.onPrev(function(res) {
        console.log('prev==============')
        console.log(res);
        prevOrNextMusic(music, 'next');
    });
    backgroundAudioManager.onNext(function(res) {
        console.log('next===========')
        console.log(res)
        prevOrNextMusic(music, 'prev');
    });
}


/**
 *  播放音乐
 * @param musicTitle 音乐标题
 * @param musicSrc   音乐链接
 */
function playMusic(musicTitle,musicSrc){

    backgroundAudioManager.title = musicTitle;
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src = musicSrc;
    backgroundAudioManager.play();
}


/**
 *  停止播放音乐
 */
function stopMusic(){
    backgroundAudioManager.stop();
}


/**
 *  上一首歌/下一首歌
 * @param music  歌曲的数组
 * @param prevOrNext  prev上一首/next下一首
 */
function prevOrNextMusic(music, prevOrNext = 'next'){
    let musicTitle = music[i].title;
    let musicSrc = api.uploadFileUrl +  music[i].url;
    playMusic(musicTitle,musicSrc);

    let len = music.length;
    if(prevOrNext === 'prev'){
        --i;
        if(i <= 0){
            i = 0;
        }
    } else {
        ++i;
        if(i >= len){
            i = 0;
        }
    }
}

module.exports = {
    backgroundMusic:backgroundMusic,
    stopMusic:stopMusic,
};