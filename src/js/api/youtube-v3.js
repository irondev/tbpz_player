var player,
    sourceId,
    sourceInfos;

var onYouTubeIframeAPIReady = function () {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        loop: 0,
        events: {
            'onReady': function(event) {
                isPlayerReady = true;
                sourceId = playerUrl2Id(sourceUrl);
                playerLoadById(sourceId);
            },
            'onStateChange': function(event) {
                switch (event.data) {
                    case YT.PlayerState.CUED:
                        setTiming();
                    break;
                    case YT.PlayerState.PLAYING:
                        isPlayerLoading = false;
                        isPlayerPlaying = true;
                        isPlayerPaused = false;
                        setProgressBar();
                        setClass("is-playing");
                    break;
                    case YT.PlayerState.PAUSED:
                        isPlayerLoading = false;
                        isPlayerPlaying = false;
                        isPlayerPaused = true;
                        setClass("is-paused");
                    break;
                    case YT.PlayerState.ENDED:
                        isPlayerLoading = false;
                        isPlayerPlaying = false;
                        isPlayerPaused = false;
                        unsetProgressBar();
                        setClass("is-ended");
                    break;
                }
            }
        }
    });
};

var playerInit = function () {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

var playerUrl2Id = function (url) {
    var id = null;
    if (url.indexOf('youtube.com/v/') != -1) {
        id = url.substr(url.indexOf('/v/') + 3);
    } else if (url.indexOf('?v=') != -1) {
        id = url.substr(url.indexOf('?v=') + 3);
    }
    return id;
};

var playerLoadById = function (id) {
    player.cueVideoById(id);
};

var playerGetDuration = function () {
    return player.getDuration();
};

var playerGetCurrentTime = function () {
    return player.getCurrentTime();
};

var playerPlay = function () {
    player.playVideo();
    setClass("is-loading");
};

var playerPause = function () {
    player.pauseVideo();
};

var playerSeekTo = function (value) {
    var duration = playerGetDuration();
    var seekTo = duration * value / 100;
    if (!isPlayerPlaying) {
        playerPlay();
    }
    player.seekTo(seekTo);
};
