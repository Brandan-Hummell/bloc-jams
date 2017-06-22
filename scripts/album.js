var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

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
        '  <td class="song-item-duration">' + songLength + '</td>' +
        '</tr>';

    var $row = $(template);

    var clickHandler = function() {
        var songItem = $(this).find('.song-item-number');
        if (currentlyPlayingSongNumber === null) {
            songItem.html(pauseButtonTemplate);
            setSong(1);
            updatePlayerBarSong();
            currentSoundFile.play();
        } else if (currentlyPlayingSongNumber === parseInt(songItem.attr('data-song-number'))) {
            if (currentSoundFile.isPaused()) {
                currentSoundFile.play();
                songItem.html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                songItem.html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        } else if (currentlyPlayingSongNumber !== songItem.attr('data-song-number')) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
            songItem.html(pauseButtonTemplate);
            setSong(songItem.attr('data-song-number'));
            updatePlayerBarSong();
            currentSoundFile.play();
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
};

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);


    var albumArray = [albumMarconi, albumPicasso, albumBobs];
    var albumIndex = 1;
    document.getElementsByClassName('album-cover-art')[0].addEventListener('click', function(event) {
        albumIndex++;
        if (albumIndex == (albumArray.length)) {
            albumIndex = 0;
        }
        setCurrentAlbum(albumArray[albumIndex]);


    });

});

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

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
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
};
$('.ion-skip-backward').click(previousSong);
$('.ion-skip-forward').click(nextSong);