var playerTimer,
	$player = jQuery(".js-player"),
	$progressBar = jQuery('.js-playerProgress'),
	$playerTimeElapsed = jQuery('.js-playerTimeElapsed'),
	$playerTimeTotal = jQuery('.js-playerTimeTotal'),
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
		$playerTimeTotal.text(secToTime(duration));
		$playerTimeElapsed.text(secToTime(currentTime));
	}, 200);
};

var setProgressBar = function () {
	clearInterval(playerTimer);
	playerTimer = setInterval(function() {
		var duration = playerGetDuration();
		var currentTime = playerGetCurrentTime();
		playerProgression = currentTime * 100 / duration;
		$progressBar.css({ width: playerProgression + '%' });
		$playerTimeTotal.text(secToTime(duration));
		$playerTimeElapsed.text(secToTime(currentTime));
	}, 200);
};

var setTiming = function () {
	var duration = playerGetDuration();
	$playerTimeTotal.text(secToTime(duration));
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

var secToTime = function (sec) {
	var sec_num = parseInt(sec, 10);
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);
	var time = ''
	if (hours) { 
		time += hours + ':';
	}
	if (hours && minutes && minutes < 10) {
		minutes = '0' + minutes;
	}
	time += minutes + ':';
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	time += seconds;
	return time;
}

var sourceUrl = getUrlParam('url');
if (sourceUrl && sourceUrl.indexOf("youtube.com") != -1) {
	jQuery.getScript("./js/api/youtube-v3.js", function( data, textStatus, jqxhr ) {
		playerInit();
	});
}
