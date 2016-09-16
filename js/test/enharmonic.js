var assert = require('assert');
var Note = require('audio/tonality/note.js');

const enharmonic = {
    "C#1" : "Db1",
    "D#1" : "Eb1",
    "E#1" : null,
    "F#1" : "Gb1",
    "G#1" : "Ab1",
    "A#1" : "Bb1",
    "B#1" : null,
    "Cb1" : null,
    "Db1" : "C#1",
    "Eb1" : "D#1",
    "Fb1" : null,
    "Gb1" : "F#1",
    "Ab1" : "G#1",
    "Bb1" : "A#1"
}

function assertEqual(actual, expected) {
    return function() {
        assert.equal(actual ? actual.toString() : actual, expected);
    }
}

describe('Note', function() {
    describe('#enharmonic()', function() {
        for (var l of Note.letters) {
            for (var a of Note.alterations) {
                try {
                    var note = new Note(l, a, 1);
                } catch (e) {
                    continue;
                }

                if (note.alteration === '#') {
                    it(note.toString() + ' enharmonic should be ' + enharmonic[note.toString()],
                        assertEqual(note.enharmonic(), enharmonic[note.toString()]));
                } else if (note.alteration === 'b') {
                    it(note.toString() + ' enharmonic should be ' + enharmonic[note.toString()],
                        assertEqual(note.enharmonic(), enharmonic[note.toString()]));
                } else {
                    it(note.toString() + ' enharmonic should be null',
                        assertEqual(note.enharmonic(), null));
                }
            }
        }
    });
});