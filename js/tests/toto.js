const Note = require('audio/tonality/note.js');
const Scale = require('audio/tonality/scale.js');

var keys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'E#', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb', 'B#'];
for (var m in Scale.modes) {
    console.log('*** ' + m + ' ***');

    var iv = Scale.modes[m];
    for (var k of keys) {
        var scale = [];
        var note = new Note(k + '0');
        for (i of iv) {
            scale.push(note.toString());
            note = note.add(i);
        }
        scale.push(note.toString());
        console.log(k + ' : ' + JSON.stringify(scale));
    }

    console.log('\n');
}