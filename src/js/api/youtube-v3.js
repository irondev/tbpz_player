var player,
    sourceId,
    sourceInfos,
    isPlaylist;

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
                        if (isPlaylist) {
                            var list = player.getPlaylist();
                            jQuery.get("https://www.googleapis.com/youtube/v3/videos?id="+ list.join(",") +"&key=AIzaSyB6ROFks0k_PNjdAL4wUF22YWyXLQSCal8&part=snippet&fields=items(id,snippet(title))", function(datas) {
                                setPlaylist(preparePlaylistDatas(datas));
                            });
                        }
                    break;
                    case YT.PlayerState.PLAYING:
                        isPlayerLoading = false;
                        isPlayerPlaying = true;
                        isPlayerPaused = false;
                        setProgressBar();
                        setClass("is-playing");
                        if (isPlaylist) {
                            setPlaylistIndex(player.getPlaylistIndex());
                        }
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
                        if (isPlaylist) {
                            unsetPlaylistIndex();
                        }
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
    if (sourceUrl.indexOf("youtube.com/playlist") != -1) {
        id = url.substr(url.indexOf('?list=') + 6);
        isPlaylist = true;
    } else if (url.indexOf('youtube.com/v/') != -1) {
        id = url.substr(url.indexOf('/v/') + 3);
    } else if (url.indexOf('youtube.com/watch?v=') != -1) {
        id = url.substr(url.indexOf('?v=') + 3);
    }
    return id;
};

var playerLoadById = function (id) {
    if (isPlaylist) {
        player.cuePlaylist({
            list: sourceId
        });
    } else {
        player.cueVideoById(id);
    }
};

var preparePlaylistDatas = function(ytDatas) {
    var datas = [];
    for (var i in ytDatas.items) {
        var obj = {"title": ytDatas.items[i].snippet.title};
        datas.push(obj);
    }
    return datas;
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

var playerPrev = function () {
    player.previousVideo();
};

var playerNext = function () {
    player.nextVideo();
};

var playerPlaylistAt = function (index) {
    player.playVideoAt(index);
};
