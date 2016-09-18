var assert = require('assert');
var Note = require('audio/tonality/note.js');

const next = {
    "C1"   : "C#1",
    "C#1"  : "D1",
    "Cb1"  : "C1",
    "C##1" : "D#1",
    "D1"   : "D#1",
    "D#1"  : "E1",
    "Db1"  : "D1",
    "D##1" : "F1",
    "Dbb1" : "C#1",
    "E1"   : "F1",
    "E#1"  : "F#1",
    "Eb1"  : "E1",
    "Ebb1" : "D#1",
    "F1"   : "F#1",
    "F#1"  : "G1",
    "Fb1"  : "F1",
    "F##1" : "G#1",
    "G1"   : "G#1",
    "G#1"  : "A1",
    "Gb1"  : "G1",
    "G##1" : "A#1",
    "Gbb1" : "F#1",
    "A1"   : "A#1",
    "A#1"  : "B1",
    "Ab1"  : "A1",
    "A##1" : "C2",
    "Abb1" : "G#1",
    "B1"   : "C2",
    "B#1"  : "C#2",
    "Bb1"  : "B1",
    "Bbb1" : "A#1"
}

const prev = {
    "C1"   : "B0",
    "C#1"  : "C1",
    "Cb1"  : "Bb0",
    "C##1" : "Db1",
    "D1"   : "Db1",
    "D#1"  : "D1",
    "Db1"  : "C1",
    "D##1" : "Eb1",
    "Dbb1" : "B0",
    "E1"   : "Eb1",
    "E#1"  : "E1",
    "Eb1"  : "D1",
    "Ebb1" : "Db1",
    "F1"   : "E1",
    "F#1"  : "F1",
    "Fb1"  : "Eb1",
    "F##1" : "Gb1",
    "G1"   : "Gb1",
    "G#1"  : "G1",
    "Gb1"  : "F1",
    "G##1" : "Ab1",
    "Gbb1" : "E1",
    "A1"   : "Ab1",
    "A#1"  : "A1",
    "Ab1"  : "G1",
    "A##1" : "Bb1",
    "Abb1" : "Gb1",
    "B1"   : "Bb1",
    "B#1"  : "B1",
    "Bb1"  : "A1",
    "Bbb1" : "Ab1"
}

function assertEqual(actual, expected) {
    return function() {
        assert.equal(actual ? actual.toString() : actual, expected);
    }
}

describe('Note', function() {
    describe('#incr()', function() {
        for (var l of Note.letters) {
            for (var a of Note.alterations) {
                try {
                    var note = new Note(l, a, 1);
                } catch (e) {
                    continue;
                }

                it(note.toString() + ' incr() should be ' + next[note.toString()],
                    assertEqual(note.incr(), next[note.toString()]));
            }
        }
    });

    describe('#decr()', function() {
        for (var l of Note.letters) {
            for (var a of Note.alterations) {
                try {
                    var note = new Note(l, a, 1);
                } catch (e) {
                    continue;
                }

                it(note.toString() + ' decr() should be ' + prev[note.toString()],
                    assertEqual(note.decr(), prev[note.toString()]));
            }
        }
    });
});