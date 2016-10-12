const Tone = require('tone');

const $ = require('jquery');
const Song = require('model/song.js');
const SongView = require('view/song-view.js');
const Audio = require('audio/controller.js');
const Tonality = require('audio/tonality/tonality.js');



var song = new Song();

const songView = new SongView({
    model : song
});

const audio = new Audio(song);

$('body').prepend(songView.$el);

$(window).on('load', function() {
    // song.set({
    //     title : 'New Song',
    //     instrument : 'pad',
    //     sequence : {
    //         key : 'C',
    //         mode : 'Major',
    //         tempo : 120,
    //         loopLength : '1m',
    //         chordList : [],
    //         grid : '16n',
    //         zoom : '1m'
    //     }
    // });
    song.set({"sequence":{"instrument":{},"chordList":[{"step":0,"seventh":false,"start":"0","duration":"4n + 16n"},{"step":"3","seventh":false,"start":"4n + 8n","duration":"2n + 16n"},{"step":"2","seventh":false,"start":"1m","duration":"4n + 16n"},{"step":"4","seventh":false,"start":"1m + 4n + 8n","duration":"2n + 16n"}],"key":"A","mode":"Minor","tempo":137,"loopLength":"2m","grid":"16n","zoom":"2m"},"title":"New Song"})

    this.song = song;
    this.Tonality = Tonality;
});