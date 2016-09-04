const $ = require('jquery');

const Song = require('model/song.js');
const SongView = require('view/song-view.js');
const Audio = require('audio/controller.js');



var song = new Song();

const audio = new Audio(song);

const songView = new SongView({
    model : song
});

$('body').prepend(songView.$el);

song.set({
    title : 'New Song',
    sequence : {
        key : 'C',
        mode : 'Major',
        tempo : 120,
        loopLength : '4m',
        chordList : [
            {
                step : 'I',
                seventh : false,
                start : '0m',
                duration : '1m'
            },
            {
                step : 'V',
                seventh : false,
                start : '1m',
                duration : '1m'
            },
            {
                step : 'VI',
                seventh : false,
                start : '2m',
                duration : '1m'
            },
            {
                step : 'IV',
                seventh : false,
                start : '3m',
                duration : '1m'
            }
        ]
    }
});

window.song = song;