
var rightBar = document.querySelector('.rightBar');
var rightBarList = document.querySelector('.rightBar-List');
rightBarList.onclick = function (){
    rightBar.classList.toggle('rightBarOpen');
};

//实时获取侧边栏高度
var musicListHight =document.querySelector('.musicList');
//初始化侧边栏高度
setTimeout(function(){
    rightBarList.style.height = document.documentElement.clientHeight+'px';
    musicListHight.style.height = document.documentElement.clientHeight - 160 +'px';
},100);
//根据窗口大小自适应侧边栏高度
window.onresize = function(){
    rightBarList.style.height = document.documentElement.clientHeight+'px';
    musicListHight.style.height = document.documentElement.clientHeight - 160 +'px';
};

var musicCanvas = document.querySelector('#musicCanvas');

//画出播放器的背景 中心点是118
if(musicCanvas.getContext){
    var paint = musicCanvas.getContext('2d');
    paint.lineWidth = 1;
    paint.strokeStyle = '#ea5965';
    paint.fillStyle = '#ea5965';
    paint.fillRect(0, 0, 235, 45);

    //画背景大圆
    paint.beginPath();
    paint.strokeStyle = '#fff';
    paint.fillStyle = '#fff';
    paint.arc(118, 63, 55, 0, 2*Math.PI, false);
    paint.closePath();
    paint.fill();
    //画背景小圆
    paint.beginPath();
    paint.strokeStyle = '#ea5965';
    paint.fillStyle = '#ea5965';
    paint.arc(118, 63, 44, 0, 2*Math.PI, false);
    paint.closePath();
    paint.fill();
    //画背景指针
    paint.fillRect(117, 11, 3, 5);


    //画出播放按钮的icon
    var musicPlayCanvas = document.querySelector('#musicPlayCanvas');
    var paintMusicPlay = musicPlayCanvas.getContext('2d');
    paintMusicPlay.lineWidth = 1;
    paintMusicPlay.strokeStyle = '#fff';
    paintMusicPlay.fillStyle = '#fff';
    drawTriangle(paintMusicPlay, 16, 0, 0);

    //画出后一首歌的icon
    var musicNextCanvas = document.querySelector('#musicNextCanvas');
    var paintMusicNext = musicNextCanvas.getContext('2d');
    paintMusicNext.lineWidth = 1;
    paintMusicNext.strokeStyle = '#ea5965';
    paintMusicNext.fillStyle = '#ea5965';
    drawTriangle(paintMusicNext, 12, 0, 0);
    paintMusicNext.fillRect(Math.cos(30/180 * Math.PI)*12, 0, 3, 12);

    //画出前一首歌的icon
    var musicPrevCanvas = document.querySelector('#musicPrevCanvas');
    var paintMusicPrev = musicPrevCanvas.getContext('2d');
    paintMusicPrev.lineWidth = 1;
    paintMusicPrev.strokeStyle = '#ea5965';
    paintMusicPrev.fillStyle = '#ea5965';
    drawTriangle(paintMusicPrev, -12, 15, 0, 14);
    paintMusicPrev.fillRect(11-Math.cos(30/180 * Math.PI)*12, 0, 3, 12);


    //播放器逻辑
    var audio = document.querySelector('#audio');
    musicPlayCanvas.onclick = function(){
        paintMusicPlay.clearRect(0, 0, 16, 16);
        if(audio.paused || audio.ended){
            audio.play();
            paintMusicPlay.fillRect(0, 0, 3, 16);
            paintMusicPlay.fillRect(9, 0, 3, 16);
        }else {
            audio.pause();
            drawTriangle(paintMusicPlay, 16, 0, 0);
        }
    };

    //画出进度条指针小圆
    var musicProgressCanvas = document.querySelector('#musicProgressCanvas');
    var paintMusicProgress = musicProgressCanvas.getContext('2d');
    paintMusicProgress.lineWidth = 2;
    paintMusicProgress.strokeStyle = '#ea5965';
    paintMusicProgress.fillStyle = '#ea5965';
    paintMusicProgress.beginPath();
    paintMusicProgress.arc(52, 3, 3, 0, 2*Math.PI, false);
    paintMusicProgress.closePath();
    paintMusicProgress.fill();
}else {
    document.write('您的浏览器不支持Canvas');
}

//监视播放器播放的时间
var duration = document.querySelector('#duration');

audio.addEventListener("loadedmetadata", function(){
    duration.innerHTML = '0:00/'+timeFormatter(audio.duration);
}, false);

audio.addEventListener("timeupdate", function(){
    var durationTime = timeFormatter(audio.duration);
    var currentTime = timeFormatter(audio.currentTime);
    var playTimePercentage = audio.currentTime/audio.duration*2;
    dragCircle(1.5,playTimePercentage+1.5);
    function dragCircle(angleBegin, angleEnd){
        paintMusicProgress.clearRect(0, 0, 104, 104);
        paintMusicProgress.beginPath();
        paintMusicProgress.arc(52, 52, 49, angleBegin*Math.PI, angleEnd*Math.PI, false);
        paintMusicProgress.stroke();
        paintMusicProgress.closePath();

        paintMusicProgress.beginPath();
        paintMusicProgress.arc(Math.sin((playTimePercentage) * Math.PI)*49+52, -Math.cos((playTimePercentage) * Math.PI)*49+52, 3, 0, 2*Math.PI, false);
        paintMusicProgress.closePath();
        paintMusicProgress.fill();
    }

    duration.innerHTML = currentTime+'/'+durationTime;
}, false);


//画躺着的三角形
function drawTriangle(obj, r, x, y, w){
    if(r>0){
        obj.beginPath();
        obj.moveTo(x, y);
        obj.lineTo(x, r+y);
        obj.lineTo(Math.cos(30/180 * Math.PI)*r+x, r/2+y);
        obj.closePath();
        obj.fill();
    }else {
        r = -r;
        obj.beginPath();
        obj.moveTo(x, y);
        obj.lineTo(x, r+y);
        obj.lineTo(w - Math.cos(30/180 * Math.PI)*r, r/2);
        obj.closePath();
        obj.fill();
    }
}

/**
 * 音频的播放时间 -- 格式化时间(秒 --> 000:00)
 * @param seconds
 */
function timeFormatter(seconds){
    function zeroPad(str){
        if(str.length > 2) return str;
        for(var i=0; i<(2 - str.length); i++){
            str = "0" + str;
        }
        return str;
    }
    var minute = 60;
    var m = Math.floor(seconds / minute);
    var s = Math.floor(seconds % 60);
    var mStr = String(m);
    var sStr = zeroPad(String(s));
    return (mStr + ":" + sStr);
}