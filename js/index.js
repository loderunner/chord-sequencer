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
        loopLength : '2m',
        chordList : [
            {
                step : 0,
                seventh : false,
                start : '16n',
                duration : '4n'
            }
        ],
        grid : '16n',
        zoom : '1m'
    }
});

window.song = song;