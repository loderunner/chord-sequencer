var assert = require('assert');
var Note = require('audio/tonality/note.js');

//   natural #       b       ##      bb
const equivalents = [
    "B0",   null,   "Cb1",  "A##0", null,
    "C1",   "B#0",  null,   null,   "Dbb1",
    null,   "C#1",  "Db1",  null,   null,
    "D1",   null,   null,   "C##1", "Ebb1",
    null,   "D#1",  "Eb1",  null,   null,
    "E1",   null,   "Fb1",  "D##1", null,
    "F1",   "E#1",  null,   null,   "Gbb1",
    null,   "F#1",  "Gb1",  null,   null,
    "G1",   null,   null,   "F##1", "Abb1",
    null,   "G#1",  "Ab1",  null,   null,
    "A1",   null,   null,   "G##1", "Bbb1",
    null,   "A#1",  "Bb1",  null,   null,
    "B1",   null,   "Cb2",  "A##1", null,
    "C2",   "B#1",  null,   null,   "Dbb2"
];

function assertEqual(actual, expected) {
    return function() {
        assert.equal(actual ? actual.toString() : actual, expected);
    }
}

describe('Note', function() {
  describe('#equivalent()', function() {
    for (var l of Note.letters) {
        for (var a of Note.alterations) {
            try {
                var note = new Note(l, a, 1);
            } catch (e) {
                continue;
            }

            var index = equivalents.indexOf(note.toString()) - Note.alterations.indexOf(a);

            it(note.toString() + ' natural equivalent should be ' + equivalents[index],
                assertEqual(note.equivalent(''), equivalents[index]));

            it(note.toString() + ' # equivalent should be ' + equivalents[index + 1], 
                assertEqual(note.equivalent('#'), equivalents[index + 1]));

            it(note.toString() + ' b equivalent should be ' + equivalents[index + 2], 
                assertEqual(note.equivalent('b'), equivalents[index + 2]));

            it(note.toString() + ' ## equivalent should be ' + equivalents[index + 3], 
                assertEqual(note.equivalent('##'), equivalents[index + 3]));

            it(note.toString() + ' bb equivalent should be ' + equivalents[index + 4], 
                assertEqual(note.equivalent('bb'), equivalents[index + 4]));
        }
    }
  });
});