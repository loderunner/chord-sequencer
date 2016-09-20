const Tone = require('tone');

const $ = require('jquery');
const Song = require('model/song.js');
const SongView = require('view/song-view.js');
const Audio = require('audio/controller.js');
const Tonality = require('audio/tonality/tonality.js');



var song = new Song();

const audio = new Audio(song);

const songView = new SongView({
    model : song
});

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
    song.set({"sequence":{"chordList":[{"step":0,"seventh":true,"start":"0","duration":"4n"},{"step":"1","seventh":true,"start":"2n","duration":"4n"}],"key":"D","mode":"Dorian","tempo":46,"loopLength":"1m","grid":"16n","zoom":"1m"},"title":"New Song","instrument":"pad"})

    this.song = song;
    this.Tonality = Tonality;
});