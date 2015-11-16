var playerTimer,
	$progressBar = jQuery('.js-playerProgress'),
	$player = jQuery(".js-player"),
    isPlayerReady = false,
    isPlayerLoading = false,
    isPlayerPlaying = false,
    isPlayerPausing = false;

var setProgressBar = function () {
	clearInterval(playerTimer);
	playerTimer = setInterval(function() {
		var duration = playerGetDuration();
		var currentTime = playerGetCurrentTime();
		playerProgression = currentTime * 100 / duration;
		$progressBar.css({ width: playerProgression + '%' });
	}, 200);
};

var unsetProgressBar = function () {
	clearInterval(playerTimer);
	playerProgression = 0;
	$progressBar.css({ width: playerProgression + '%' });
};

var seek = function (e) {
	var clicPosition = e.pageX;
	var $element = jQuery(e.currentTarget);
	var elementPosition = $element.offset().left;
	var elementSize = $element.width();
	var clicRelativePosition = clicPosition - elementPosition;
	var percentage = Math.round(clicRelativePosition * 100 / elementSize);
	playerSeekTo(percentage);
};

var setClass = function (status) {
	$player.removeClass("is-loading is-playing is-paused is-ended");
	$player.addClass(status);
};

var getUrlParam = function (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
        	var value = '';
        	for (j = 1; j < sParameterName.length; j++) {
				if (j > 1)
					value += '=';
				value += sParameterName[j];
        	}
            return value === undefined ? true : value;
        }
    }
};

var sourceUrl = getUrlParam('url');
if (sourceUrl.indexOf("youtube.com") != -1) {
	jQuery.getScript("./js/api/youtube-v3.js", function( data, textStatus, jqxhr ) {
		playerInit();
	});
}
