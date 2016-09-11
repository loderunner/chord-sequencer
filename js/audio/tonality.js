const _ = require('underscore');
const Backbone = require('backbone-nested-models');

const letters = 'ABCDEFG';

const Tonality = {
    keys : ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
    modes : ['Major', 'Minor', 'Harmonic', 'Melodic', 'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'],
    incr : function(note, scale) {
        var letter = note[0];
        if (note[1] === '#' || note[1] === 'b') {
            var alteration = note[1];
            var octave = parseInt(note[2]);
        } else {
            var alteration = '';
            var octave = parseInt(note[1]);
        }

        if (letter === 'E' && alteration === '') {
            letter = 'F';
        } else if (letter === 'B' && alteration === ''){
            letter = 'C';
            octave++;
        } else if (alteration === 'b') {
            alteration = '';
        } else if (alteration === '') {
            alteration = '#';
        } else if (alteration === '#') {
            letter = letters[(letters.indexOf(letter) + 1) % letters.length];
            alteration = '';
        } else {
            throw new ValueError("'" + note + "'' is not a valid note");
        }

        return letter + alteration + octave;
    },
    decr : function(note, scale) {
        var letter = note[0];
        if (note[1] === '#' || note[1] === 'b') {
            var alteration = note[1];
            var octave = parseInt(note[2]);
        } else {
            var alteration = '';
            var octave = parseInt(note[1]);
        }

        if (letter === 'C' && alteration === '') {
            letter = 'B';
            octave--;
        } else if (letter === 'F' && alteration === ''){
            letter = 'E';
        } else if (alteration === '#') {
            alteration = '';
        } else if (alteration === '') {
            alteration = 'b';
        } else if (alteration === 'b') {
            letter = letters[(letters.indexOf(letter) + 7 - 1) % letters.length];
            alteration = '';
        } else {
            throw new ValueError("'" + note + "'' is not a valid note");
        }

        return letter + alteration + octave;
    },
    add : function(note, val, scale) {
        for (var i = 0; i < val; i++) {
            note = this.incr(note, scale);
        }
        return note;
    },
    sub : function(note, val, scale) {
        for (var i = 0; i < val; i++) {
            note = this.decr(note, scale);
        }
        return note;
    },
    enharmonic : function(note) {
        var letter = note[0];
        if (note[1] === '#') {
            letter = letters[letters.indexOf(letter) + 1];
            return letter + 'b' + note.substring(2);
        } else if (note[1] === 'b') {
            letter = letters[letters.indexOf(letter) - 1];
            return letter + '#' + note.substring(2);
        } else {
            return note;
        }
    }
}

module.exports = Tonality;