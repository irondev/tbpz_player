var player,
    infos,
    sourceId;

var playerInit = function () {
    jQuery.getScript("https://connect.soundcloud.com/sdk/sdk-3.0.0.js", function( data, textStatus, jqxhr ) {
        SC.initialize({
            client_id: 'b7124d925e27615c2963e5804fbc8f20'
        });
        isPlayerReady = true;
        playerLoadByUrl(sourceUrl);
    });
};

var playerLoadByUrl = function (url) {
    SC.resolve(url).then(function(datas){
        infos = datas;
        sourceId = datas.id;

        SC.stream('/tracks/'+ sourceId).then(function(stream){
            player = stream;

            player.on("state-change", function(state) {
                switch (state) {
                    case "canplay":
                        setTiming();
                    break;
                    case "playing":
                        isPlayerLoading = false;
                        isPlayerPlaying = true;
                        isPlayerPaused = false;
                        setProgressBar();
                        setClass("is-playing");
                    break;
                    case "paused":
                        isPlayerLoading = false;
                        isPlayerPlaying = false;
                        isPlayerPaused = true;
                        setClass("is-paused");
                    break;
                    case "ended":
                        isPlayerLoading = false;
                        isPlayerPlaying = false;
                        isPlayerPaused = false;
                        unsetProgressBar();
                        setClass("is-ended");
                    break;
                }
            });
        });
    });
};

var playerGetDuration = function () {
    return infos.duration / 1000;
};

var playerGetCurrentTime = function () {
    return player.currentTime() / 1000;
};

var playerPlay = function () {
    player.play();
    setClass("is-loading");
};

var playerPause = function () {
    player.pause();
};

var playerSeekTo = function (value) {
    var duration = playerGetDuration();
    var seekTo = duration * value / 100;
    if (!isPlayerPlaying) {
        playerPlay();
    }
    player.seek(seekTo * 1000);
};
