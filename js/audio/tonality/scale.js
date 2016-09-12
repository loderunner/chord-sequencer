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

    this.generate();

    return this;
}

Scale.keys = keys;
Scale.modes = modes;

Scale.prototype.generate = function() {
    const intervals = modes[this.mode];
    this.notes = [new Note(this.key + '0')];
    for (var i = 0; i < (intervals.length - 1); i++) {
        var note = this.notes[i].add(intervals[i]);
        if (note.letter === this.notes[i].letter) {
            note = note.enharmonic();
        }
        this.notes.push(note);
    }
}

Scale.prototype.next = function(g) {
    note = new Note(note);

    if (note.alteration === 'b') {
        note = note.enharmonic();
    }


}

module.exports = Scale;