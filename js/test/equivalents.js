var assert = require('assert');
var Note = require('audio/tonality/note.js');

//   natural #       b       ##      bb
const equivalents = [
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
    "B1",   null,   "Cb2",  "A##1", null  
];

describe('Note', function() {
  describe('#equivalent()', function() {
    for (var l of Note.letters) {
        for (var a of Note.alterations) {
            const note = new Note(l, a, 1);

            var index = equivalents.indexOf(note.toString()) - Note.alterations.indexOf(a);
            var expect = equivalents[index];
            it(note.toString() + ' natural equivalent should be ' + expect, function() {
                assert.equal(note.equivalent('').toString(), expect);
            });

            index = equivalents.indexOf(note.toString()) - Note.alterations.indexOf(a) + 1;
            expect = equivalents[index];
            it(note.toString() + ' # equivalent should be ' + expect, function() {
                assert.equal(note.equivalent('#').toString(), expect);
            });

            index = equivalents.indexOf(note.toString()) - Note.alterations.indexOf(a) + 2;
            expect = equivalents[index];
            it(note.toString() + ' b equivalent should be ' + expect, function() {
                assert.equal(note.equivalent('b').toString(), expect);
            });

            index = equivalents.indexOf(note.toString()) - Note.alterations.indexOf(a) + 3;
            expect = equivalents[index];
            it(note.toString() + ' ## equivalent should be ' + expect, function() {
                assert.equal(note.equivalent('##').toString(), expect);
            });

            index = equivalents.indexOf(note.toString()) - Note.alterations.indexOf(a) + 4;
            expect = equivalents[index];
            it(note.toString() + ' bb equivalent should be ' + expect, function() {
                assert.equal(note.equivalent('bb').toString(), expect);
            });
        }
    }
  });
});