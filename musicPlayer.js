/*!
    Author:         Amsul
    Author URI:     http://amsul.ca
    Description:    Main scripts
    Version:        0.3.0
    Created on:     13/09/2012
    Last Updated:   19 September, 2012
*/
/*jshint browser: true, devel: true, debug: true */


/* */
(function( $, window, document, undefined ) {
/* */

    'use strict';


    var

        /*
            Globals
        ======================================================================== */

        // classes
        CLASSNAME_PLAYER = 'music-player',
        CLASSNAME_PLAYLIST = 'music-playlist',
        CLASSNAME_CONTROLS = 'controls-player',
        CLASSNAME_CONTROLS_PLAY = 'control-play',
        CLASSNAME_CONTROLS_PAUSE = 'control-pause',
        CLASSNAME_SEEKBAR_BAR = 'seekbar-bar',
        CLASSNAME_SEEKBAR_PROGRESS = 'seekbar-progress',
        CLASSNAME_SEEKBAR_POINTER = 'seekbar-pointer',
        CLASSNAME_TIMESTAMPS_START = 'timestamp-start',
        CLASSNAME_TIMESTAMPS_END = 'timestamp-end',
        CLASSNAME_WRAPPER_AUDIO = 'wrapper-audio',
        CLASSNAME_WRAPPER_PLAYER = 'wrapper-player',
        CLASSNAME_WRAPPER_CONTROLS = 'wrapper-controls',
        CLASSNAME_WRAPPER_SEEKBAR = 'wrapper-seekbar',
        CLASSNAME_WRAPPER_TIMESTAMPS = 'wrapper-timestamps',

        // strings
        STRING_PLAY = 'Play',
        STRING_PAUSE = 'Pause',
        STRING_REWIND = 'Rewind',
        STRING_FORWARD = 'Forward',
        STRING_TIME_CURRENT = 'Current time',
        STRING_TIME_TOTAL = 'Total duration',

        // numbers
        NUMBER_TIME_CURRENT = 0,
        NUMBER_TIME_TOTAL = 0,




        /*
            PLAYER
        ======================================================================== */

        PLAYER = function( playlists ) {

            /*
                Private methods
            ======================================================================== */

            var _self = {


                /*
                    Initialize the player
                ======================================================================== */

                init: function( playlists ) {

                    var

                        // create a wrapper for the fragment
                        wrapper = _self.createPlayerWrapper(),

                        // create a document fragment
                        docfrag = document.createDocumentFragment(),

                        // create an audio player
                        playerAudio = _self.createPlayerAudio(),

                        // create the player controls
                        playerControls = _self.createPlayerControls(),

                        // create the seek bar
                        playerSeeker = _self.createSeeker(),

                        // create time stamps
                        playerTimestamps = _self.createPlayerTimestamps()


                    // put stuff in the document fragment
                    docfrag.appendChild( playerAudio )
                    docfrag.appendChild( playerControls )
                    docfrag.appendChild( playerSeeker )
                    docfrag.appendChild( playerTimestamps )


                    // go through all the playlists and bind events
                    for ( var i = 0; i < playlists.length; i += 1 ) {
                        _self.bindEvents( playlists[ i ] )
                    }


                    // put into the wrapper
                    wrapper.appendChild( docfrag )



                    // put stuff into the dom
                    document.body.appendChild( wrapper )


                    return playerAudio
                }, //init


                /*
                    Create a wrapper for the player
                ======================================================================== */

                createPlayerWrapper: function() {

                    // create the div
                    _self.audioWrapper = document.createElement( 'div' )

                    // add the class
                    _self.audioWrapper.className = CLASSNAME_WRAPPER_PLAYER

                    return _self.audioWrapper
                },


                /*
                    Create an audio player
                ======================================================================== */

                createPlayerAudio: function() {

                    var
                        // create an audio source
                        source = (function() {
                            _self.audioPlayerSource = document.createElement( 'source' )

                            // set the source type
                            _self.audioPlayerSource.type = 'audio/mp3'

                            return _self.audioPlayerSource
                        })(),

                        // create an audio player
                        audio = (function() {
                            _self.audioPlayer = document.createElement( 'audio' )

                            // set controls to true
                            _self.audioPlayer.controls = true

                            // append the source to the audio
                            _self.audioPlayer.appendChild( source )

                            return _self.audioPlayer
                        })(),

                        // create a wrapper div
                        wrapper = (function() {
                            _self.audioWrapper = document.createElement( 'div' )

                            // prepare the wrapper
                            _self.audioWrapper.className = CLASSNAME_WRAPPER_AUDIO

                            // hide the wrapper
                            _self.audioWrapper.style.display = 'none'

                            // append the audio to the wrapper
                            _self.audioWrapper.appendChild( audio )

                            return _self.audioWrapper
                        })()


                    return wrapper
                }, //createPlayerAudio


                /*
                    Create a pseudo player
                ======================================================================== */

                createPlayerControls: function() {

                    var
                        // create a play button
                        play = (function() {

                            _self.playerPlay = document.createElement( 'a' )

                            _self.playerPlay.textContent = STRING_PLAY

                            _self.playerPlay.className = CLASSNAME_CONTROLS_PLAY

                            _self.playerPlay.dataset.control = 'play'

                            _self.playerPlay.addEventListener( 'click', function( event ) {

                                event.preventDefault()

                                _self.playOrPause( event.target )

                            }, false )

                            return _self.playerPlay
                        })(),

                        // create a pause button
                        pause = (function() {

                            _self.playerPause = document.createElement( 'a' )

                            _self.playerPause.textContent = STRING_PAUSE

                            _self.playerPause.className = CLASSNAME_CONTROLS_PAUSE

                            _self.playerPause.dataset.control = 'pause'

                            _self.playerPause.style.display = 'none'

                            _self.playerPause.addEventListener( 'click', function( event ) {

                                event.preventDefault()

                                _self.playOrPause( event.target )

                            }, false )

                            return _self.playerPause
                        })(),

                        // create a rewind button
                        rewind = (function() {

                            _self.playerRewind = document.createElement( 'a' )

                            _self.playerRewind.textContent = STRING_REWIND

                            _self.playerRewind.dataset.control = 'rewind'

                            _self.playerRewind.style.color = 'red'

                            _self.playerRewind.addEventListener( 'click', function( event ) {

                                event.preventDefault()

                                _self.playOrPause( event.target )

                            }, false )

                            return _self.playerRewind
                        })(),

                        // create a forward button
                        forward = (function() {

                            _self.playerForward = document.createElement( 'a' )

                            _self.playerForward.textContent = STRING_FORWARD

                            _self.playerForward.dataset.control = 'forward'

                            _self.playerForward.style.color = 'red'

                            _self.playerForward.addEventListener( 'click', function( event ) {

                                event.preventDefault()

                                _self.playOrPause( event.target )

                            }, false )

                            return _self.playerForward
                        })(),

                        // create a wrapper div
                        wrapper = (function() {

                            _self.playerWrapper = document.createElement( 'div' )

                            // prepare the wrapper
                            _self.playerWrapper.className = CLASSNAME_WRAPPER_CONTROLS

                            // append the controls to the wrapper
                            _self.playerWrapper.appendChild( play )
                            _self.playerWrapper.appendChild( pause )
                            _self.playerWrapper.appendChild( rewind )
                            _self.playerWrapper.appendChild( forward )

                            return _self.playerWrapper
                        })()

                    return wrapper
                }, //createPlayerControls


                /*
                    Create an audio seek bar
                ======================================================================== */

                createSeeker: function() {

                    var
                        // create the seekbar
                        seekbar = (function() {

                            // create the element
                            _self.playerSeekbar = document.createElement( 'a' )

                            // add the class name
                            _self.playerSeekbar.className = CLASSNAME_SEEKBAR_BAR

                            // give it a display block
                            _self.playerSeekbar.style.display = 'block'

                            // give it a height
                            _self.playerSeekbar.style.height = '20px'

                            // give it a background
                            _self.playerSeekbar.style.background = 'lightgrey'

                            return _self.playerSeekbar
                        })(),

                        // create the progress bar
                        progressbar = (function() {

                            // create the element
                            _self.playerSeekbarProgress = document.createElement( 'a' )

                            // add the class name
                            _self.playerSeekbarProgress.className = CLASSNAME_SEEKBAR_PROGRESS

                            // position it absolutely
                            _self.playerSeekbarProgress.style.position = 'absolute'
                            _self.playerSeekbarProgress.style.zIndex = 10
                            _self.playerSeekbarProgress.style.left = 0
                            _self.playerSeekbarProgress.style.top = 0
                            _self.playerSeekbarProgress.style.right = '100%'
                            _self.playerSeekbarProgress.style.bottom = 0
                            _self.playerSeekbarProgress.style.background = 'red'

                            return _self.playerSeekbarProgress
                        })(),

                        // create a wrapper div
                        wrapper = (function() {

                            // create the element
                            _self.playerSeekbarWrapper = document.createElement( 'div' )

                            // prepare the wrapper
                            _self.playerSeekbarWrapper.className = CLASSNAME_WRAPPER_SEEKBAR

                            // position it relatively
                            _self.playerSeekbarWrapper.style.position = 'relative'

                            // append the controls
                            _self.playerSeekbarWrapper.appendChild( seekbar )
                            _self.playerSeekbarWrapper.appendChild( progressbar )

                            return _self.playerSeekbarWrapper
                        })()


                    // update the progress bar on update
                    _self.audioPlayer.addEventListener( 'timeupdate', function( event ) {
                        _self.setTimestampStart( _self.audioPlayer.currentTime )
                        _self.playerSeekbarProgress.style.width = event.target.currentTime / event.target.duration * 100 + '%'
                    }, false )

                    // update the status when a song starts
                    _self.audioPlayer.addEventListener( 'loadeddata', function( event ) {
                        _self.setTimestampStart( _self.audioPlayer.currentTime )
                        _self.setTimestampEnd( _self.audioPlayer.duration )
                    }, false )

                    // update the status when a song ends
                    _self.audioPlayer.addEventListener( 'ended', function( event ) {
                        console.log( 'song ended', event )
                    }, false )

                    return wrapper
                },


                /*
                    Create the player time stampes
                ======================================================================== */

                createPlayerTimestamps: function() {

                    var
                        // create the start stamp
                        stampstart = (function() {

                            // create the element
                            _self.playerTimestampsStart = document.createElement( 'div' )

                            // prepare the div
                            _self.playerTimestampsStart.className = CLASSNAME_TIMESTAMPS_START

                            // insert the label
                            //_self.playerTimestampsStart.innerHTML = STRING_TIME_CURRENT

                            // insert the current time
                            _self.setTimestampStart( NUMBER_TIME_CURRENT )

                            return _self.playerTimestampsStart
                        })(),

                        // create the end stamp
                        stampend = (function() {

                            // create the element
                            _self.playerTimestampsEnd = document.createElement( 'div' )

                            // prepare the div
                            _self.playerTimestampsEnd.className = CLASSNAME_TIMESTAMPS_START

                            // insert the label
                            //_self.playerTimestampsEnd.innerHTML = STRING_TIME_TOTAL

                            // insert the total time
                            _self.setTimestampEnd( NUMBER_TIME_TOTAL )

                            return _self.playerTimestampsEnd
                        })(),

                        // create a wrapper div
                        wrapper = (function() {

                            // create the element
                            _self.playerTimestampsWrapper = document.createElement( 'div' )

                            // prepare the wrapper
                            _self.playerTimestampsWrapper.className = CLASSNAME_WRAPPER_TIMESTAMPS

                            // append the timestamps to the wrapper
                            _self.playerTimestampsWrapper.appendChild( stampstart )
                            _self.playerTimestampsWrapper.appendChild( stampend )

                            return _self.playerTimestampsWrapper
                        })()


                    return wrapper
                },


                /*
                    Bind events to a playlist
                ======================================================================== */

                bindEvents: function( playlist ) {

                    var
                        // find all the songs
                        songs = playlist.querySelectorAll( '[data-song]' )

                    // bind click events to the songs
                    _self.onClickEvents( songs )

                    return _self
                }, //bindEvents


                /*
                    Bind click events to the songs
                ======================================================================== */

                onClickEvents: function( songs ) {

                    var song,
                        songsCount = songs.length,

                        // on click, play the song
                        onClick = function( e ) {
                            e.preventDefault()
                            _self.play( e.target.getAttribute( 'data-song' ) )
                        }

                    // bind the click on each song
                    for ( var i = 0; i < songsCount; i += 1 ) {
                        songs[ i ].onclick = onClick
                    }

                    return _self
                }, //onClickEvents


                /*
                    Bind click events to the seekbar
                ======================================================================== */

                onClickSeekbar: function() {

                    _self.playerSeekbar.addEventListener( 'click', function( event ) {
                        _self.audioPlayer.currentTime = event.offsetX / _self.playerSeekbar.offsetWidth * _self.audioPlayer.duration
                    }, false )

                    _self.playerSeekbarProgress.addEventListener( 'click', function( event ) {
                        _self.audioPlayer.currentTime = event.offsetX / _self.playerSeekbar.offsetWidth * _self.audioPlayer.duration
                    }, false )

                }, //onClickSeekbar


                /*
                    Set the player timestamps
                ======================================================================== */

                setTimestampStart: function( time ) {

                    var minutes = Math.floor( time / 60 ),
                        seconds = Math.floor( time % 60 )

                    // pad the seconds if needed
                    if ( seconds < 10 ) { seconds = '0' + seconds }

                    _self.playerTimestampsStart.textContent = minutes + ':' + seconds

                    return _self
                },

                setTimestampEnd: function( time ) {

                    var minutes = Math.floor( time / 60 ),
                        seconds = Math.floor( time % 60 )

                    // pad the seconds if needed
                    if ( seconds < 10 ) { seconds = '0' + seconds }

                    _self.playerTimestampsEnd.textContent =  minutes + ':' + seconds

                    return _self
                },


                /*
                    Play a song
                ======================================================================== */

                play: function( source ) {

                    if ( source ) {

                        console.log( source )

                        // set the source
                        _self.audioPlayer.src = source

                        debugger
                    }

                    // play the song
                    _self.audioPlayer.play()

                    // hide the play button
                    _self.playerPlay.style.display = 'none'

                    // show the pause button
                    _self.playerPause.style.display = ''

                    // enable rewind and forward
                    _self.playerRewind.style.color = ''
                    _self.playerForward.style.color = ''


                    // bind the seekbar click event
                    _self.onClickSeekbar()


                    return _self
                }, //play


                /*
                    Pause a song
                ======================================================================== */

                pause: function() {

                    // pause the song
                    _self.audioPlayer.pause()

                    // show the play button
                    _self.playerPlay.style.display = ''

                    // hide the pause button
                    _self.playerPause.style.display = 'none'

                    if ( !_self.audioPlayer.src.length ) {

                        // disable rewind and forward
                        _self.playerRewind.style.color = 'red'
                        _self.playerForward.style.color = 'red'
                    }

                    return _self
                }, //pause


                /*
                    Rewind a song
                ======================================================================== */

                rewind: function() {

                    // check if it's shorter than the total duration
                    if ( _self.audioPlayer.currentTime - 5 > 0 ) {
                        _self.audioPlayer.currentTime -= 5
                    }

                    // otherwise pause and then rewind
                    else {
                        _self.audioPlayer.currentTime = 0
                    }

                    return _self
                },


                /*
                    Forward a song
                ======================================================================== */

                forward: function() {

                    // check if it's shorter than the total duration
                    if ( _self.audioPlayer.currentTime + 6 < _self.audioPlayer.duration ) {
                        _self.audioPlayer.currentTime += 5
                    }

                    // otherwise pause and then rewind
                    else {
                        _self.pause()
                        _self.audioPlayer.currentTime = 0
                    }


                    return _self
                },


                /*
                    Play or pause a song
                ======================================================================== */

                playOrPause: function( button ) {

                    console.log( button.dataset.control )

                    if ( !_self.audioPlayer.src.length ) {

                        console.log( 'play the first song' )

                        return _self
                    }


                    if ( _self[ button.dataset.control ] ) {
                        _self[ button.dataset.control ]()
                    }

                    return _self
                }


            } //_self



            /*
                Public methods
            ======================================================================== */

            function MusicPlayer( playlists ) {
                return new _self.init( playlists )
            }


            return new MusicPlayer( playlists )
        } //PLAYER



        window.music = PLAYER( document.getElementsByClassName( CLASSNAME_PLAYLIST ) )




/* */
})( jQuery, window, document );
/* */







