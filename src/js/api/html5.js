var player,
    sourceId,
    sourceInfos;

player = $("#player")[0];

player.oncanplay = function() {
    setTiming();
};

player.onplay = function() {
    isPlayerLoading = false;
    isPlayerPlaying = true;
    isPlayerPaused = false;
    setProgressBar();
    setClass("is-playing");
};

player.onpause = function() {
    isPlayerLoading = false;
    isPlayerPlaying = false;
    isPlayerPaused = true;
    setClass("is-paused");
};

player.onended = function() {
    isPlayerLoading = false;
    isPlayerPlaying = false;
    isPlayerPaused = false;
    unsetProgressBar();
    setClass("is-ended");
};

var playerGetDuration = function () {
    return player.duration;
};

var playerGetCurrentTime = function () {
    return player.currentTime;
};

var playerPlay = function () {
    player.play();
};

var playerPause = function () {
    player.pause();
};

var playerSeekTo = function (value) {
    var duration = playerGetDuration();
    var seekTo = duration * value / 100;
    player.play();
    player.currentTime = seekTo;
};
