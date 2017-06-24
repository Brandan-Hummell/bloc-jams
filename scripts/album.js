var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var playerBarPlayPauseElement = $('.main-controls .play-pause');

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;



var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">' +
        '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
        '  <td class="song-item-title">' + songName + '</td>' +
        '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>' +
        '</tr>';

    var $row = $(template);

    var clickHandler = function() {
        var songItem = $(this).find('.song-item-number');
        if (currentlyPlayingSongNumber === null) {
            $('.volume').find('.fill').width(currentVolume + "%");
            $('.volume').find('.thumb').css({ left: currentVolume + "%" });
            songItem.html(pauseButtonTemplate);
            setSong(1);
            updatePlayerBarSong();
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
        } else if (currentlyPlayingSongNumber === parseInt(songItem.attr('data-song-number'))) {
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                songItem.html(pauseButtonTemplate);
                playerBarPlayPauseElement.html(playerBarPauseButton);
                updateSeekBarWhileSongPlays();
            } else {
                currentSoundFile.pause();
                songItem.html(playButtonTemplate);
                playerBarPlayPauseElement.html(playerBarPlayButton);
            }
        } else if (currentlyPlayingSongNumber !== songItem.attr('data-song-number')) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
            songItem.html(pauseButtonTemplate);
            setSong(songItem.attr('data-song-number'));
            updatePlayerBarSong();
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
        };
    }

    var onHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songItemNumber = parseInt(songItem.attr('data-song-number'));

        // #2
        if (songItemNumber !== currentlyPlayingSongNumber) {
            songItem.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songItemNumber = parseInt(songItem.attr('data-song-number'));

        if (songItemNumber !== currentlyPlayingSongNumber) {
            songItem.html(songItemNumber);
        }
    };

    $row.click(clickHandler);

    $row.hover(onHover, offHover);

    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');


    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);


    $albumSongList.empty();

    // #4
    for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        // #10
        currentSoundFile.bind('timeupdate', function(event) {
            // #11
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');

            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({ left: percentageString });
};

var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {
        // #3
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        // #4
        var seekBarFillRatio = offsetX / barWidth;
        if ($seekBar.parent().hasClass("seek-control")) {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        // #5
        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {
        // #8
        var $seekBar = $(this).parent();

        // #9
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == "seek-control") {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio * 100);
            }

            updateSeekPercentage($seekBar, seekBarFillRatio);

        });

        // #10
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


var updatePlayerBarSong = function() {
    var barSongName = $('.currently-playing .song-name');
    var barArtistName = $('.currently-playing .artist-name');
    var barArtistSongMobile = $('.currently-playing .artist-song-mobile');
    barSongName.text(currentSongFromAlbum.title);
    barArtistName.text(currentAlbum.artist);
    barArtistSongMobile.text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.currently-playing .current-time').text(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
    $('.currently-playing .total-time').text(totalTime);
};

var filterTimeCode = function(timeInSeconds) {
    var numericValue = parseInt(timeInSeconds);
    var numberOfMinutes = Math.floor(numericValue / 60);
    var numberOfSeconds = numericValue % 60;
    if (numberOfSeconds < 10) {
        numberOfSeconds = "0" + numberOfSeconds;
    }
    return numberOfMinutes + ":" + numberOfSeconds;
};

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();


    var albumArray = [albumMarconi, albumPicasso, albumBobs];
    var albumIndex = 1;
    document.getElementsByClassName('album-cover-art')[0].addEventListener('click', function(event) {
        albumIndex++;
        if (albumIndex == (albumArray.length)) {
            albumIndex = 0;
        }
        setCurrentAlbum(albumArray[albumIndex]);


    });

    playerBarPlayPauseElement.click(togglePlayFromPlayerBar);

});

var togglePlayFromPlayerBar = function() {
    var songItem = getSongNumberCell(currentlyPlayingSongNumber);
    if (currentSoundFile.isPaused()) {
        songItem.html(pauseButtonTemplate);
        playerBarPlayPauseElement.html(playerBarPauseButton);
        currentSoundFile.play();
    } else if (currentSoundFile) {
        songItem.html(playButtonTemplate);
        playerBarPlayPauseElement.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }

    var songItem = getSongNumberCell(songNumber);
    currentlyPlayingSongNumber = parseInt(songItem.attr('data-song-number'));
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
        currentVolume = volume;
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var nextSong = function() {
    var nextSongInAlbum;
    var nextSongInAlbumNumber;
    if (currentSongFromAlbum == null) {
        nextSongInAlbum = currentAlbum.songs[0];
        nextSongInAlbumNumber = 1;
    } else if (trackIndex(currentAlbum, currentSongFromAlbum) + 1 === currentAlbum.songs.length) {
        nextSongInAlbum = currentAlbum.songs[0];
        nextSongInAlbumNumber = 1;
    } else {
        nextSongInAlbum = currentAlbum.songs[trackIndex(currentAlbum, currentSongFromAlbum) + 1];
        nextSongInAlbumNumber = trackIndex(currentAlbum, currentSongFromAlbum) + 2;
    }
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(currentlyPlayingSongNumber);
    var nextPlayingCell = getSongNumberCell(nextSongInAlbumNumber);
    nextPlayingCell.html(pauseButtonTemplate);
    setSong(nextSongInAlbumNumber);
    updatePlayerBarSong();
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
};

var previousSong = function() {
    var previousSongInAlbum;
    var previousSongInAlbumNumber;
    if (currentSongFromAlbum == null) {
        previousSongInAlbum = currentAlbum.songs[0];
        previousSongInAlbumNumber = 1;
    } else if (trackIndex(currentAlbum, currentSongFromAlbum) === 0) {
        previousSongInAlbum = currentAlbum.songs[currentAlbum.songs.length - 1];
        previousSongInAlbumNumber = currentAlbum.songs.length;
    } else {
        previousSongInAlbum = currentAlbum.songs[trackIndex(currentAlbum, currentSongFromAlbum) - 1];
        previousSongInAlbumNumber = trackIndex(currentAlbum, currentSongFromAlbum);
    }
    var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
    currentlyPlayingCell.html(currentlyPlayingSongNumber);
    var previousPlayingCell = getSongNumberCell(previousSongInAlbumNumber);
    previousPlayingCell.html(pauseButtonTemplate);
    setSong(previousSongInAlbumNumber);
    updatePlayerBarSong();
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
};
$('.ion-skip-backward').click(previousSong);
$('.ion-skip-forward').click(nextSong);