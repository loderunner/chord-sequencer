const InvalidArgumentError = require('invalid-argument-error.js');
const Note = require('./note.js');

const keys = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const modes = {
    'Major'     : [2,2,1,2,2,2,1],
    'Minor'     : [2,1,2,2,1,2,2],
    'Harmonic'  : [2,1,2,2,1,3,1],
    'Melodic'   : [2,1,2,2,2,2,1],
    'Ionian'    : [2,2,1,2,2,2,1],
    'Dorian'    : [2,1,2,2,2,1,2],
    'Phrygian'  : [1,2,2,2,1,2,2],
    'Lydian'    : [2,2,2,1,2,2,1],
    'Mixolydian': [2,2,1,2,2,1,2],
    'Aeolian'   : [2,1,2,2,1,2,2],
    'Locrian'   : [1,2,2,1,2,2,2]
};

const Scale = function(key, mode) {
    if (key instanceof Scale) {
        this.key = key;
        this.mode = mode;
        return this;
    }

    if ((typeof key) !== (typeof '')) {
        throw new TypeError('' + key + ' is not a valid key');
    } else if (!keys.includes(key)) {
        throw new InvalidArgumentError('' + key + ' is not a valid key');
    }
    this.key = key;

    if ((typeof mode) !== (typeof '')) {
        throw new TypeError('' + mode + ' is not a valid mode');
    } else if (!(mode in modes)) {
        throw new InvalidArgumentError('' + mode + ' is not a valid mode');
    }
    this.mode = mode;

    return this;
}

Scale.keys = keys;
Scale.modes = modes;

Scale.prototype.next = function(note) {
    note = new Note(note);

    if (Note.letters.indexOf(note.letter) >= Note.letters.indexOf(this.key[0])) {
        var octave = note.octave;
    } else {
        var octave = note.octave - 1;
    }

    const intervals = modes[this.mode];
    var prevNote = new Note(this.key[0], this.key[1], octave);
    for (var i = 0; i < intervals.length; i++) {
        var nextNote = prevNote.add(intervals[i]);
        // if (nextNote.letter !== Note.letters[(Note.letters.indexOf(prevNote.letter) + 1) % Note.letters.length]) {
        //     nextNote = nextNote.enharmonic();
        // }
        if (note.letter === prevNote.letter) {
            return nextNote;
        }
        prevNote = nextNote;
    }

    return nextNote;
}

module.exports = Scale;