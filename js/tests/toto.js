const Note = require('audio/tonality/note.js');
const Scale = require('audio/tonality/scale.js');

var keys = ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'E#', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb', 'B#'];
console.log('{');
for (var m in Scale.modes) {
    console.log('    "' + m + '" : {');

    var iv = Scale.modes[m];
    for (var k of keys) {
        var scale = [];
        var note = new Note(k + '0');
        for (i of iv) {
            scale.push(note.toString());
            var prevNote = note;
            note = note.add(i);
            if (note.letter === prevNote.letter) {
                try {
                    note = note.enharmonic();
                } catch (e) {
                }
            }
        }
        scale.push(note.toString());
        console.log('        "' + k + '" : ' + JSON.stringify(scale) + ",");
    }
    console.log('    },\n');
}

console.log('}');