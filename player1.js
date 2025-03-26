const audio = document.getElementById("audio");
const controlPanel = document.getElementById("controlPanel");
const funcBtn = controlPanel.children[1];
const input = controlPanel.children[2];
const musicList = controlPanel.getElementsByTagName("select")[0];
const info = controlPanel.children[3];

const play = funcBtn.children[0];
const volRange = input.children[0];
const volText = input.children[2];
const progressBar = info.children[0];
const showTime = info.children[1];
const showStatus = info.children[2];
const showPlayType = info.children[3];


setVolumeByRange();//初始化音量(rangebar跟顯示)值
progressBar.style.background = "var(--grey)";

//播放
function playMusic() {
    audio.play();
    play.textContent = ";";
    play.onclick = pauseMusic;
    showStatus.textContent = audio.title + "-播放中";
    setInterval(getTime, 0.1);
    progressBar.max = audio.duration * 10000;
}
//暫停
function pauseMusic() {
    audio.pause();
    play.textContent = "4";
    play.onclick = playMusic;
    showStatus.textContent = audio.title + "-暫停中";
}
//停止
function stopMusic() {
    audio.currentTime = 0;
    pauseMusic();
    showStatus.textContent = audio.title + "-停止中";
}
//前進倒退時間
function setTime(s) {
    audio.currentTime += s;
}
//開關靜音
function setMute() {
    audio.muted = !audio.muted;
    if (audio.muted == true){
        showStatus.textContent = audio.title + "-靜音中";
    }else{
        showStatus.textContent = audio.title + "-播放中";
    }
}
//換音樂
function changeMusic(n) {
    let i = musicList.selectedIndex;
    let k = musicList.length;

    //第一首的上一首，最後一首的下一首，隨機撥放的上下一首
    if (i + n < 0) {
        changePlayMusic(k-1);
    }
    else if(k == i + n){
        changePlayMusic(0);
    }else if (showPlayType.textContent == "隨機播放") {
        let h = Math.floor(Math.random() * musicList.length);
        h -= musicList.selectedIndex;
        changePlayMusic(i + h);
    }else{
        changePlayMusic(i + n);
    }
    
}

function changePlayMusic(w){
    audio.src = musicList.children[w].value;
    musicList.children[w].selected = true;
    audio.title = musicList.children[w].textContent;
    if (play.textContent == ";")
        playMusic();
    audio.onloadeddata = playMusic;
}

//每首播放結束後
function musicEnd() {
    if (showPlayType.textContent == "單曲循環") {
        changeMusic(0);
    } else if (showPlayType.textContent == "隨機播放") {
        let h = Math.floor(Math.random() * musicList.length);
        h -= musicList.selectedIndex;
        changeMusic(h);
    } else if (showPlayType.textContent == "歌曲循環" && musicList.length == musicList.selectedIndex + 1) {
        changeMusic(0 - musicList.selectedIndex);
    }
    else if (musicList.length == musicList.selectedIndex + 1) {
        stopMusic();
    } else {
        changeMusic(1);
    }
}
//結束後接續方式
function setLoop() {
    showPlayType.textContent = showPlayType.textContent == "單曲循環" ? "一般播放" : "單曲循環";
}
function setRandom() {
    showPlayType.textContent = showPlayType.textContent == "隨機播放" ? "一般播放" : "隨機播放";
}
function setAllLoop() {
    showPlayType.textContent = showPlayType.textContent == "歌曲循環" ? "一般播放" : "歌曲循環";
}

//調整音量
function setVolume(k) {
    volRange.value = parseInt(volRange.value) + k;
    setVolumeByRange();
}
function setVolumeByRange() {
    audio.volume = volRange.value / 100;
    volText.textContent = volRange.value;
    volRange.style.background = `-webkit-linear-gradient(left,var(--main) ${volRange.value}%, var(--grey) ${volRange.value}%)`;
}
//調整、顯示時間
function formatTime(t) {
    let m = parseInt(t / 60);
    let s = parseInt(t % 60);
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return m + ":" + s;
}
function getTime() {
    showTime.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration)
    progressBar.value = audio.currentTime * 10000;
    let w = audio.currentTime / audio.duration * 100;
    progressBar.style.background = `-webkit-linear-gradient(left,var(--main) ${w}%, var(--grey) ${w}%)`;
}
function setProgress() {
    audio.currentTime = progressBar.value / 10000;
}