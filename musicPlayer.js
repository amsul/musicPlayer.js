/*!
    musicPlayer.js v0.3.8
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

            // merged options
            OPTIONS = $.extend( {}, $.fn.musicPlayer.options, options ),


            // elements
            PLAYLIST = playlist,
            $PLAYLIST = $( PLAYLIST ),
            $PLAYLIST_SONGS = $PLAYLIST.find( '[data-song]' ),

            PLAYER_AUDIO,
            $PLAYER_AUDIO,

            $PLAYER_PLAY,
            $PLAYER_PAUSE,
            $PLAYER_REWIND,
            $PLAYER_FORWARD,

            $SEEKER_BAR,
            $SEEKER_PROGRESS,
            $SEEKER_CONTROLLER,

            $TIMESTAMP_START,
            $TIMESTAMP_END,


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

            STRING_AUDIO_TYPE = 'audio/mp3',


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
                        // create an audio player
                        $wrappedAudio = _player.createAudio(),

                        // create player controls
                        $wrappedControls = _player.createControls(),

                        // create player seeker
                        $wrapperSeeker = _player.createSeeker(),

                        // create the time stamps
                        $wrappedTimestamps = _player.createTimestamps(),

                        // create a wrapper for the player
                        $wrapper = $( '<section class="' + CLASSNAME_WRAPPER_PLAYER + '" />' )


                    // add the stuff to the wrapper
                    $wrapper.append( $wrappedAudio, $wrappedControls, $wrapperSeeker, $wrappedTimestamps )


                    // put the player in the dom
                    $PLAYLIST.after( $wrapper )


                    // bind the songs click event
                    $PLAYLIST_SONGS.on( 'click', _player.onClickSong )
                }, //init



                /*
                    Create a player audio
                ======================================================================== */

                createAudio: function() {

                    // create the audio player
                    $PLAYER_AUDIO       =       $( '<audio controls />' ).

                                                    // bind the events
                                                    on({
                                                        'playing.firstplay': _player.onFirstplay,
                                                        playing: _player.onPlaying,
                                                        pause: _player.onPause,
                                                        timeupdate: _player.onTimeupdate,
                                                        loadedmetadata: _player.onLoadedmetadata,
                                                        ended: _player.onEnded,
                                                        error: _player.onError
                                                    }).

                                                    // add the source
                                                    html( '<source type="' + STRING_AUDIO_TYPE + '" />' ).

                                                    // wrap the audio player
                                                    wrap( '<div class="' + CLASSNAME_WRAPPER_AUDIO + '" style="display:none">' )

                    PLAYER_AUDIO = $PLAYER_AUDIO[ 0 ]

                    return $PLAYER_AUDIO.parent()
                }, //createAudio


                /*
                    Create player controls
                ======================================================================== */

                createControls: function() {

                    // create the play button
                    $PLAYER_PLAY        =       createElement( 'a', {
                                                    'data-control': 'play',
                                                    'class': CLASSNAME_CONTROLS_PLAY
                                                }, STRING_PLAY ).
                                                on( 'click.controller', _player.onClickControl )

                    // create the pause button
                    $PLAYER_PAUSE       =       createElement( 'a', {
                                                    'data-control': 'pause',
                                                    'class': CLASSNAME_CONTROLS_PAUSE,
                                                    'style': 'display:none'
                                                }, STRING_PAUSE )

                    // create the rewind button
                    $PLAYER_REWIND      =       createElement( 'a', {
                                                    'data-control': 'rewind',
                                                    'class': CLASSNAME_CONTROLS_REWIND,
                                                    'style': 'color:red'
                                                }, STRING_REWIND )

                    // create the forward button
                    $PLAYER_FORWARD     =       createElement( 'a', {
                                                    'data-control': 'forward',
                                                    'class': CLASSNAME_CONTROLS_FORWARD,
                                                    'style': 'color:red'
                                                }, STRING_FORWARD )

                    // return the wrapped controls
                    return $( '<div class="' + CLASSNAME_WRAPPER_CONTROLS + '" />' ).append( $PLAYER_PLAY, $PLAYER_PAUSE, $PLAYER_REWIND, $PLAYER_FORWARD )
                }, //createControls


                /*
                    Create audio seek bar
                ======================================================================== */

                createSeeker: function() {

                    // create the seekbar
                    $SEEKER_BAR         =       createElement( 'div', {
                                                    'class': CLASSNAME_SEEKBAR_BAR,
                                                    'style': 'display:block;height:20px;background:lightgrey'
                                                })

                    // create the seekbar progress
                    $SEEKER_PROGRESS    =       createElement( 'div', {
                                                    'class': CLASSNAME_SEEKBAR_PROGRESS,
                                                    'style': 'position:absolute;z-index:10;left:0;top:0;right:100%;bottom:0;background:red'
                                                })

                    // create the seekbar controller
                    $SEEKER_CONTROLLER  =       createElement( 'a', {
                                                    'class': CLASSNAME_SEEKBAR_PROGRESS,
                                                    'style': 'position:absolute;z-index:20;left:0;top:0;right:0;bottom:0'
                                                })

                    // return the wrapped seekbar
                    return $( '<div class="' + CLASSNAME_WRAPPER_SEEKBAR + '" style="position:relative" />' ).append( $SEEKER_BAR, $SEEKER_PROGRESS, $SEEKER_CONTROLLER )
                }, //createSeeker


                /*
                    Create the time stamps
                ======================================================================== */

                createTimestamps: function() {

                    // create the start stamp
                    $TIMESTAMP_START    =       createElement( 'div', {
                                                    'class': CLASSNAME_TIMESTAMPS_START,
                                                    'style': 'color:red'
                                                })

                    // create the end stamp
                    $TIMESTAMP_END      =       createElement( 'div', {
                                                    'class': CLASSNAME_TIMESTAMPS_END,
                                                    'style': 'color:red'
                                                })

                    // set the current time
                    _player.setTimestampStart( NUMBER_TIME_CURRENT )

                    // set the total time
                    _player.setTimestampEnd( NUMBER_TIME_TOTAL )


                    // return the wrapped timestamp
                    return $( '<div class="' + CLASSNAME_WRAPPER_TIMESTAMPS + '" />' ).append( $TIMESTAMP_START, $TIMESTAMP_END )
                }, //createTimestamps




                /*
                    Fire the audio player events
                ======================================================================== */

                onFirstplay: function( event ) {

                    // enable rewind and foward
                    $PLAYER_REWIND.css( 'color', '' ).on( 'click.controller', _player.onClickControl )
                    $PLAYER_FORWARD.css( 'color', '' ).on( 'click.controller', _player.onClickControl )

                    // enable the pause button
                    $PLAYER_PAUSE.on( 'click.controller', _player.onClickControl )

                    // enable the timestamps
                    $TIMESTAMP_START.css( 'color', '' )
                    $TIMESTAMP_END.css( 'color', '' )

                    // bind click events to the seekbar
                    $SEEKER_CONTROLLER.on( 'click.seekbar', _player.onClickSeekbar )

                    // switch off the listener
                    $PLAYER_AUDIO.off( '.firstplay' )
                },

                onPlaying: function( event ) {

                    // hide the play button
                    $PLAYER_PLAY.hide()

                    // show the pause button
                    $PLAYER_PAUSE.show()
                },

                onPause: function( event ) {

                    // hide the pause button
                    $PLAYER_PAUSE.hide()

                    // show the play button
                    $PLAYER_PLAY.show()
                },

                onTimeupdate: function( event ) {

                    var timeNow = event.target.currentTime

                    // update the start timestamp
                    _player.setTimestampStart( timeNow )

                    // update the seekbar progress
                    $SEEKER_PROGRESS.css( 'width', timeNow / event.target.duration * 100 + '%' )
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
                    Fire the seekbar click event
                ======================================================================== */

                onClickSeekbar: function( event ) {
                    PLAYER_AUDIO.currentTime = event.offsetX / $SEEKER_BAR[ 0 ].offsetWidth * PLAYER_AUDIO.duration
                },


                /*
                    Set the player timestamps
                ======================================================================== */

                setTimestampStart: function( time ) {

                    // set the text
                    $TIMESTAMP_START.text( formatTime( time ) )

                    return _player
                },

                setTimestampEnd: function( time ) {

                    // set the text
                    $TIMESTAMP_END.text( formatTime( time ) )

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
                        PLAYER_AUDIO.src = source
                    }

                    // play the source
                    if ( PLAYER_AUDIO.src ) {
                        PLAYER_AUDIO.play()
                        return _player
                    }

                    // otherwise, play the first song
                    _player.play( $PLAYLIST_SONGS[ 0 ].dataset.song )

                    return _player
                }, //play


                /*
                    Pause a song
                ======================================================================== */

                pause: function() {

                    // pause the song
                    PLAYER_AUDIO.pause()
                },


                /*
                    Rewind a song
                ======================================================================== */

                rewind: function() {

                    // check if it's greater than the start position
                    if ( PLAYER_AUDIO.currentTime - 5 > 0 ) {
                        PLAYER_AUDIO.currentTime -= 5
                    }

                    // otherwise rewind to start
                    else {
                        PLAYER_AUDIO.currentTime = 0
                    }
                },


                /*
                    Forward a song
                ======================================================================== */

                forward: function() {

                    // check if it's less than the total duration
                    if ( PLAYER_AUDIO.currentTime + 5 < PLAYER_AUDIO.duration ) {
                        PLAYER_AUDIO.currentTime += 5
                    }

                    // otherwise forward to the end
                    else {
                        PLAYER_AUDIO.currentTime = PLAYER_AUDIO.duration
                    }
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
        Helper functions
    ======================================================================== */

    function createElement( type, options, text ) {

        var
            tagOpen = '<' + type,
            tagClose = '</' + type + '>',
            tagOptions = options ? ' ' : '',
            tagText = text || ''

        // if there are any options
        if ( options.constructor === Object ) {

            for ( var option in options ) {
                if ( options.hasOwnProperty( option ) ) {
                    tagOptions += option + '="' + options[ option ] + '" '
                }
            }
        }

        // close the opening tag
        tagOptions += '>'

        return $( tagOpen + tagOptions + tagText + tagClose )
    } //createElement


    function formatTime( time ) {

        var minutes = Math.floor( time / 60 ),
            seconds = Math.floor( time % 60 )

        // pad the seconds if needed
        if ( seconds < 10 ) { seconds = '0' + seconds }

        return minutes + ':' + seconds
    } //formatTime



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







