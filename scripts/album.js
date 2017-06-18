 // Example Album
 var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21' },
         { title: 'Magenta', duration: '2:15' }
     ]
 };

 // Another Example Album
 var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21' },
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15' }
     ]
 };

 var albumBobs = {
     title: "Black on Both Sides",
     artist: "Mos Def",
     label: "Rawkus Records",
     year: 1999,
     albumArtUrl: "assets/images/album_covers/Bobs.jpg",
     songs: [
         { title: 'Fear Not of Man', duration: '4:30' },
         { title: 'Speed Law', duration: '4:16' },
         { title: 'New World Water', duration: '3:12' },
         { title: 'Love', duration: '4:23' },
         { title: 'Mathematics', duration: '4:06' }
     ]
 };

 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

 var currentlyPlayingSong = null;

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
         if (currentlyPlayingSong === null) {
             songItem.html(pauseButtonTemplate);
             currentlyPlayingSong = songItem.attr('data-song-number');
         } else if (currentlyPlayingSong === songItem.attr('data-song-number')) {
             songItem.html(playButtonTemplate);
             currentlyPlayingSong = null;
         } else if (currentlyPlayingSong !== songItem.attr('data-song-number')) {
             var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
             currentlyPlayingCell.html(currentlyPlayingSong);
             songItem.htm(pauseButtonTemplate);
             currentlyPlayingSong = songItem.attr('data-song-number');
         };
     }

     var onHover = function(event) {
         var songItem = $(this).find('.song-item-number');
         var songItemNumber = songItem.attr('data-song-number');

         // #2
         if (songItemNumber !== currentlyPlayingSong) {
             songItem.html(playButtonTemplate);
         }
     };

     var offHover = function(event) {
         var songItem = $(this).find('.song-item-number');
         var songItemNumber = songItem.attr('data-song-number');

         if (songItemNumber !== currentlyPlayingSong) {
             songItem.html(songItemNumber);
         }
     };

     $row.click(clickHandler);

     $row.hover(onHover, offHover);

     return $row;
 };

 var setCurrentAlbum = function(album) {

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