const $ = require('jquery');

const Song = require('model/song.js');
const SongView = require('view/song-view.js');
const Audio = require('audio/controller.js');



var song = new Song();

const audio = new Audio(song);

$(document).ready(function() {

    const songView = new SongView({
        model : song
    });

    $('body').prepend(songView.$el);

    $(window).on('load', function() {
        song.set({
            title : 'New Song',
            sequence : {
                key : 'C',
                mode : 'Major',
                tempo : 120,
                loopLength : '1m',
                chordList : [],
                grid : '16n',
                zoom : '1m'
            }
        });

        this.song = song;
    });
});