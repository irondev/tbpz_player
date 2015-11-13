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
                    case YT.PlayerState.PLAYING:
                        isPlayerLoading = false;
                        isPlayerPlaying = true;
                        isPlayerPausing = false;
                        setProgressBar();
                    break;
                    case YT.PlayerState.PAUSED:
                        isPlayerLoading = false;
                        isPlayerPlaying = false;
                        isPlayerPausing = true;
                    break;
                    case YT.PlayerState.ENDED:
                        isPlayerLoading = false;
                        isPlayerPlaying = false;
                        isPlayerPausing = false;
                        unsetProgressBar();
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
        id = url.substr((url.indexOf('/v/') + 3));
    } else if (url.indexOf('?v=') != -1) {
        id = url.substr((url.indexOf('?v=') + 3));
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
};

var playerPause = function () {
    player.pauseVideo();
};

var playerStop = function () {
	player.stopVideo();
};

var playerSeekTo = function (value) {
    var duration = playerGetDuration();
    var seekTo = duration * value / 100;
    player.playVideo();
    player.seekTo(seekTo);
};
