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


 var createSongRow = function(songNumber, songName, songLength) {
     var template =
         '<tr class="album-view-song-item">' +
         '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' +
         '  <td class="song-item-title">' + songName + '</td>' +
         '  <td class="song-item-duration">' + songLength + '</td>' +
         '</tr>';

     return $(template);
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

 var findParentByClassName = function(element, classQuery) {
     var currentElement = element;
     var endFlag = false;
     if (currentElement.parentElement == null) {
         console.log("There is no parent element for" + element);
         return null;
     }
     while (endFlag == false) {
         if (currentElement.parentElement == null) {
             endFlag = true;
             console.log("No parent found with that class name");
             return null;
         } else if (currentElement.getAttribute('class') == classQuery) {
             endFlag = true;
             return currentElement;
         } else {
             currentElement = currentElement.parentElement;
         }
     }
 };

 var getSongItem = function(element) {
     switch (element.className) {
         case "album-song-button":
             return findParentByClassName(element, "song-item-number");
         case "ion-play":
             return findParentByClassName(element, "song-item-number");
         case "ion-pause":
             return findParentByClassName(element, "song-item-number");
         case "album-view-song-item":
             return element.querySelector('.song-item-number');
         case "song-item-title":
             return element.parentElement.querySelector('.song-item-number');
         case "song-item-duration":
             return element.parentElement.querySelector('.song-item-number');
         case "song-item-number":
             return element;
         default:
             return;
     }
 };

 window.onload = function() {
     setCurrentAlbum(albumPicasso);


     var clickHandler = function(targetElement) {
         var songItem = getSongItem(targetElement);
         if (currentlyPlayingSong === null) {
             songItem.innerHTML = pauseButtonTemplate;
             currentlyPlayingSong = songItem.getAttribute('data-song-number');
         } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
             songItem.innerHTML = playButtonTemplate;
             currentlyPlayingSong = null;
         } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
             var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
             currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
             songItem.innerHTML = pauseButtonTemplate;
             currentlyPlayingSong = songItem.getAttribute('data-song-number');
         }

     };

     var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

     var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
     var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

     var currentlyPlayingSong = null;

     var songRows = document.getElementsByClassName('album-view-song-item');


     songListContainer.addEventListener('mouseover', function(event) {
         if (event.target.parentElement.className === 'album-view-song-item') {
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');

             // #2
             if (songItemNumber !== currentlyPlayingSong) {
                 event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
             }
         }
     });

     for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');

             // #2
             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
         });

         songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
         });
     }

     var albumArray = [albumMarconi, albumPicasso, albumBobs];
     var albumIndex = 1;
     document.getElementsByClassName('album-cover-art')[0].addEventListener('click', function(event) {
         albumIndex++;
         if (albumIndex == (albumArray.length)) {
             albumIndex = 0;
         }
         setCurrentAlbum(albumArray[albumIndex]);


     });


 };