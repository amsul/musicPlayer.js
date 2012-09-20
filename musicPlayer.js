/*!
    musicPlayer.js v0.3.0
    By Amsul (http://amsul.ca)

    Updated: 20 September, 2012

    (c) Amsul Naeem, 2012 - http://amsul.ca
    Licensed under MIT ("expat" flavour) license.
    Hosted on http://github.com/amsul/slideshow
*/
/*jshint browser: true, devel: true, debug: true */


/* */
(function( $, window, document, undefined ) {
/* */

    'use strict';


    var MusicPlayer = function( playlist, options ) {

        var

            /*
                Globals
            ======================================================================== */

            // options
            OPTIONS = $.extend( {}, $.fn.musicPlayer.options, options ),


            // elements
            $PLAYLIST = $( playlist ),


            // classes
            CLASSNAME_CONTROLS = OPTIONS.classControls,
            CLASSNAME_CONTROLS_PLAY = OPTIONS.classControlsPlay,
            CLASSNAME_CONTROLS_PAUSE = OPTIONS.classControlsPause,
            CLASSNAME_CONTROLS_REWIND = OPTIONS.classControlsRewind,
            CLASSNAME_CONTROLS_FORWARD = OPTIONS.classControlsForward,

            CLASSNAME_SEEKBAR_BAR = OPTIONS.classSeekbar,
            CLASSNAME_SEEKBAR_PROGRESS = OPTIONS.classSeekbarProgress,
            CLASSNAME_SEEKBAR_POINTER = OPTIONS.classSeekbarPointer,

            CLASSNAME_TIMESTAMPS_START = OPTIONS.classTimestampStart,
            CLASSNAME_TIMESTAMPS_END = OPTIONS.classTimestampEnd,

            CLASSNAME_WRAPPER_AUDIO = OPTIONS.classAudioWrapper,
            CLASSNAME_WRAPPER_PLAYER = OPTIONS.classPlayerWrapper,
            CLASSNAME_WRAPPER_CONTROLS = OPTIONS.classControlsWrapper,
            CLASSNAME_WRAPPER_SEEKBAR = OPTIONS.classSeekbarWrapper,
            CLASSNAME_WRAPPER_TIMESTAMPS = OPTIONS.classTimestampWrapper,


            // strings
            STRING_PLAY = OPTIONS.stringPlay,
            STRING_PAUSE = OPTIONS.stringPause,
            STRING_REWIND = OPTIONS.stringRewind,
            STRING_FORWARD = OPTIONS.stringForward,

            STRING_TIME_CURRENT = 'Current time',
            STRING_TIME_TOTAL = 'Total duration',


            // numbers
            NUMBER_TIME_CURRENT = 0,
            NUMBER_TIME_TOTAL = 0,



            /*
                Private methods
            ======================================================================== */

            _player = {


                /*
                    Initialize the player
                ======================================================================== */

                init: function() {

                    var
                        // create a wrapper for the player
                        $wrapper = $( '<div class="' + CLASSNAME_WRAPPER_PLAYER + '" />' ),

                        // create an audio player
                        $wrappedAudio = _player.createAudio(),

                        // create player controls
                        $wrappedControls = _player.createControls(),

                        // create player seeker
                        $wrapperSeeker = _player.createSeeker(),

                        // create the time stamps
                        $wrappedTimestamps = _player.createTimestamps()


                    // add the stuff to the wrapper
                    $wrapper.append( $wrappedAudio, $wrappedControls, $wrapperSeeker, $wrappedTimestamps )


                    // do stuff with the playlist
                    $PLAYLIST.

                        // put the player in the dom
                        after( $wrapper ).

                        // query the songs
                        find( '[data-song]' ).on( 'click', _player.onClickSong )

                }, //init



                /*
                    Create a player audio
                ======================================================================== */

                createAudio: function() {

                    // create the audio player
                    _player.$playerAudio        =       $( '<audio controls />' ).

                                                            // bind the events
                                                            on({
                                                                playing: _player.onPlaying,
                                                                pause: _player.onPause,
                                                                timeupdate: _player.onTimeupdate,
                                                                loadedmetadata: _player.onLoadedmetadata,
                                                                ended: _player.onEnded,
                                                                error: _player.onError
                                                            }).

                                                            // add the source
                                                            html( '<source type="audio/mp3" />' ).

                                                            // wrap the audio player
                                                            wrap( '<div class="' + CLASSNAME_WRAPPER_AUDIO + '" style="display:none">' )

                    return _player.$playerAudio.parent()
                }, //createAudio


                /*
                    Create player controls
                ======================================================================== */

                createControls: function() {

                    // create the play button
                    _player.$playerPlay         =       $( '<a data-control="play" class="' + CLASSNAME_CONTROLS_PLAY + '">' + STRING_PLAY + '</a>' ).
                                                            on( 'click', _player.onClickControl )

                    // create the pause button
                    _player.$playerPause        =       $( '<a data-control="pause" class="' + CLASSNAME_CONTROLS_PAUSE + '" style="display:none">' + STRING_PAUSE + '</a>' ).
                                                            on( 'click', _player.onClickControl )

                    // create the rewind button
                    _player.$playerRewind       =       $( '<a data-control="rewind" class="' + CLASSNAME_CONTROLS_REWIND + '" style="color:red">' + STRING_REWIND + '</a>' ).
                                                            on( 'click', _player.onClickControl )

                    // create the forward button
                    _player.$playerForward      =       $( '<a data-control="forward" class="' + CLASSNAME_CONTROLS_FORWARD + '" style="color:red">' + STRING_FORWARD + '</a>' ).
                                                            on( 'click', _player.onClickControl )

                    // create the controls wrapper
                    _player.$playerControls     =       $( '<div class="' + CLASSNAME_WRAPPER_CONTROLS + '" />' ).
                                                            append( _player.$playerPlay, _player.$playerPause, _player.$playerRewind, _player.$playerForward )

                    return _player.$playerControls
                }, //createControls


                /*
                    Create audio seek bar
                ======================================================================== */

                createSeeker: function() {

                    // create the seekbar
                    _player.$playerSeekbar          =       $( '<a class="' + CLASSNAME_SEEKBAR_BAR + '" style="display:block;height:20px;background:lightgrey"></a>' ).
                                                                on( 'click', _player.onClickSeekbar )

                    // create the seekbar progress
                    _player.$playerSeekbarProgress  =       $( '<a class="' + CLASSNAME_SEEKBAR_PROGRESS + '" style="position:absolute;z-index:10;left:0;top:0;right:100%;bottom:0;background:red"></a>' ).
                                                                on( 'click', _player.onClickSeekbarProgress )

                    // create the seekbar wrapper
                    _player.$playerSeekbarWrapper   =       $( '<div class="' + CLASSNAME_WRAPPER_SEEKBAR + '" style="position:relative" />' ).
                                                                append( _player.$playerSeekbar, _player.$playerSeekbarProgress )

                    return _player.$playerSeekbarWrapper
                }, //createSeeker


                /*
                    Create the time stamps
                ======================================================================== */

                createTimestamps: function() {

                    // create the start stamp
                    _player.$playerTimestampsStart   =      $( '<div class="' + CLASSNAME_TIMESTAMPS_START + '" />' )

                    // create the end stamp
                    _player.$playerTimestampsEnd     =      $( '<div class="' + CLASSNAME_TIMESTAMPS_END + '" />' )

                    // create the timestamp wrapper
                    _player.$playerTimestampsWrapper =      $( '<div class="' + CLASSNAME_WRAPPER_TIMESTAMPS + '" />' ).
                                                                append( _player.$playerTimestampsStart, _player.$playerTimestampsEnd )


                    // set the current time
                    _player.setTimestampStart( NUMBER_TIME_CURRENT )

                    // set the total time
                    _player.setTimestampEnd( NUMBER_TIME_TOTAL )


                    return _player.$playerTimestampsWrapper
                }, //createTimestamps




                /*
                    Fire the audio player events
                ======================================================================== */

                onPlaying: function( event ) {

                    // hide the play button
                    _player.$playerPlay.hide()

                    // show the pause button
                    _player.$playerPause.show()

                    // enable rewind and foward
                    _player.$playerRewind.css( 'color', '' )
                    _player.$playerForward.css( 'color', '' )

                    // trigger a seekbar time update
                    //.........?
                },

                onPause: function( event ) {

                    // hide the pause button
                    _player.$playerPause.hide()

                    // show the play button
                    _player.$playerPlay.show()
                },

                onTimeupdate: function( event ) {

                    // update the start timestamp
                    _player.setTimestampStart( event.target.currentTime )

                    // update the seekbar progress
                    _player.$playerSeekbarProgress.css( 'width', event.target.currentTime / event.target.duration * 100 + '%' )
                },

                onLoadedmetadata: function( event ) {

                    // update the status when a song is ready
                    _player.setTimestampStart( event.target.currentTime )
                    _player.setTimestampEnd( event.target.duration )
                },

                onEnded: function( event ) {

                    // update the status when a song ends
                    console.log( 'song ended', event )
                },

                onError: function( event ) {

                    // notify when there is an error
                    console.log( 'there was an error loading the song', event )
                },


                /*
                    Fire the seekbar events
                ======================================================================== */

                onClickSeekbar: function( event ) {
                    _player.$playerAudio[ 0 ].currentTime = event.offsetX / _player.$playerSeekbar[ 0 ].offsetWidth * _player.$playerAudio[ 0 ].duration
                },

                onClickSeekbarProgress: function( event ) {
                    _player.$playerAudio[ 0 ].currentTime = event.offsetX / _player.$playerSeekbar[ 0 ].offsetWidth * _player.$playerAudio[ 0 ].duration
                },


                /*
                    Set the player timestamps
                ======================================================================== */

                setTimestampStart: function( time ) {

                    var minutes = Math.floor( time / 60 ),
                        seconds = Math.floor( time % 60 )

                    // pad the seconds if needed
                    if ( seconds < 10 ) { seconds = '0' + seconds }

                    // set the text
                    _player.$playerTimestampsStart.text( minutes + ':' + seconds )

                    return _player
                },

                setTimestampEnd: function( time ) {

                    var minutes = Math.floor( time / 60 ),
                        seconds = Math.floor( time % 60 )

                    // pad the seconds if needed
                    if ( seconds < 10 ) { seconds = '0' + seconds }

                    // set the text
                    _player.$playerTimestampsEnd.text( minutes + ':' + seconds )

                    return _player
                },


                /*
                    Handle the player control events
                ======================================================================== */

                onClickControl: function( event ) {

                    // prevent the default
                    event.preventDefault()

                    // do the controller action
                    _player.doControl( event.target )
                },


                /*
                    Fire the click control events
                ======================================================================== */

                doControl: function( button ) {

                    var action = button.dataset.control

                    // if the action is a function
                    if ( typeof _player[ action ] === 'function' ) {

                        // do the action
                        _player[ action ]()
                    }

                    return _player
                },



                /*
                    Click events on a song
                ======================================================================== */

                onClickSong: function( event ) {

                    // prevent the default event action
                    event.preventDefault()

                    // play the song
                    _player.play( event.target.dataset.song )
                },


                /*
                    Play a song
                ======================================================================== */

                play: function( source ) {

                    // if there's a source
                    if ( source ) {

                        console.log( source )

                        // set the source
                        _player.$playerAudio[ 0 ].src = source
                    }

                    // play the source or resume the song
                    _player.$playerAudio[ 0 ].play()

                    return _player
                },


                /*
                    Pause a song
                ======================================================================== */

                pause: function() {

                    // pause the song
                    _player.$playerAudio[ 0 ].pause()

                },


                /*
                    Rewind a song
                ======================================================================== */

                rewind: function() {

                    // check if it's greater than the start position
                    if ( _player.$playerAudio[ 0 ].currentTime - 5 > 0 ) {
                        _player.$playerAudio[ 0 ].currentTime -= 5
                    }

                    // otherwise rewind to start
                    else {
                        _player.$playerAudio[ 0 ].currentTime = 0
                    }

                    return _player
                },


                /*
                    Forward a song
                ======================================================================== */

                forward: function() {

                    // check if it's less than the total duration
                    if ( _player.$playerAudio[ 0 ].currentTime + 5 < _player.$playerAudio[ 0 ].duration ) {
                        _player.$playerAudio[ 0 ].currentTime += 5
                    }

                    // otherwise forward to the end
                    else {
                        _player.$playerAudio[ 0 ].currentTime = _player.$playerAudio[ 0 ].duration
                    }

                    return _player
                }



            }, //_player



            /*
                Public methods
            ======================================================================== */

            player = {

            } //player



        /*
            Initialize and return
        ======================================================================== */

        _player.init()


        // return the player methods
        return player
    } //MusicPlayer





    /*
        Extend jQuery
    ======================================================================== */

    $.fn.musicPlayer = function( options ) {
        return this.each( function() {

            if ( !$.data( this, 'music-player' )) {

                $.data(
                    this,
                    'music-player',
                    new MusicPlayer( this, options )
                )
            }

            return this
        })
    }




    /*
        Default options
    ======================================================================== */

    $.fn.musicPlayer.options = {

        // classes
        classAudioWrapper: 'wrapper-audio',

        classPlayer: 'music-player',
        classPlayerWrapper: 'wrapper-player',

        classControls: 'controls-player',
        classControlsPlay: 'control-play',
        classControlsPause: 'control-pause',
        classControlsRewind: 'control-rewind',
        classControlsForward: 'control-forward',
        classControlsWrapper: 'wrapper-controls',

        classSeekbar: 'seekbar-bar',
        classSeekbarProgress: 'seekbar-progress',
        classSeekbarPointer: 'seekbar-pointer',
        classSeekbarWrapper: 'wrapper-seekbar',

        classTimestampStart: 'timestamp-start',
        classTimestampEnd: 'timestamp-end',
        classTimestampWrapper: 'wrapper-timestamps',


        // strings
        stringPlay: 'Play',
        stringPause: 'Pause',
        stringRewind: 'Rewind',
        stringForward: 'Forward'
    }


/* */
})( jQuery, window, document );
/* */







