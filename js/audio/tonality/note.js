const InvalidArgumentError = require('invalid-argument-error.js');

const letters = 'CDEFGAB';
const alterations = ['', '#', 'b', '##', 'bb'];
const regex = /([A-G])((?:#|b){0,2})(\d*)/;

function nextLetter(l) {
    return letters[(letters.indexOf(l) + 1) % letters.length];
}

function prevLetter(l) {
    return letters[(letters.indexOf(l) + letters.length - 1) % letters.length];
}

function Note(letter, alteration, octave) {
    if (letter instanceof Note) {
        const note = letter;
        this.letter = note.letter;
        this.alteration = note.alteration;
        this.octave = note.octave;
        return this;
    }

    if ((alteration === undefined) && (octave === undefined)) {

        if ((typeof letter) !== (typeof '')) {
            throw new TypeError('' + letter + ' is not a string');
        } 

        const values = regex.exec(letter);

        if (values)
        {
            this.letter = values[1];
            this.alteration = values[2] ? values[2] : '';
            if (values[3] !== undefined) {
                this.octave = parseInt(values[3]);
            }
        } else {
            throw new InvalidArgumentError("'" + letter + "' is not a valid note string");
        }

    } else {

        if ((typeof letter) !== (typeof '')) {
            throw new TypeError("" + letter + " is not a valid note name");
        } else if ((letter.length > 1) || (!letter.includes(letter))) {
            throw new InvalidArgumentError("'" + letter + "' is not a valid note name");
        }
        this.letter = letter;

        if ((typeof alteration) !== (typeof '')) {
            throw new TypeError('' + alteration + ' is not a valid note alteration');
        } else if (!alterations.includes(alteration)) {
            throw new InvalidArgumentError("'" + alteration + "' is not a valid note alteration");
        }

        this.alteration = alteration;

        if (octave !== undefined) {
            if ((typeof octave) === (typeof '')) {
                const o = parseInt(octave);
                if (isNaN(o)) {
                    throw new TypeError("'" + o + "' is not a valid note octave");
                }
                octave = o;
            }
            if ((typeof octave) === (typeof 1)) {
                if (octave < 0) {
                    throw new InvalidArgumentError("" + octave + " is not a valid note octave");
                }
            } else {
                throw new TypeError('' + octave + ' is not a valid note octave');
            }
            this.octave = octave;
        }
    }

    if (((this.alteration === '##') && ((this.letter === 'E') || (this.letter === 'B')))
        || ((this.alteration === 'bb') && ((this.letter === 'C') || (this.letter === 'F')))) {
        throw new InvalidArgumentError(this.toString() + " is not a note");
    }

    return this;
};

Note.letters = letters;
Note.alterations = alterations;
Note.prevLetter = prevLetter;
Note.nextLetter = nextLetter;

Note.prototype.incr = function() {
    var note = new Note(this);
    if (note.alteration === '##' || note.alteration === 'bb') {
        note = note.equivalent('');
    }
    if ((note.letter === 'E') && (note.alteration === '')) {
        note.letter = 'F';
    } else if ((note.letter === 'E') && (note.alteration === '#')) {
        note.letter = 'F';
        note.alteration = '#';
    } else if (note.letter === 'B' && (note.alteration === '')){
        note.letter = 'C';
        note.octave = note.octave + 1;
    } else if (note.letter === 'B' && note.alteration === '#'){
        note.letter = 'C';
        note.alteration = '#';
        note.octave = note.octave + 1;
    } else if (note.alteration === 'b') {
        note.alteration = '';
    } else if (note.alteration === '') {
        note.alteration = '#';
    } else if (note.alteration === '#') {
        note.letter = nextLetter(note.letter);
        note.alteration = '';
    }

    return note;
};

Note.prototype.decr = function() {
    var note = new Note(this);
    if (note.alteration === '##' || note.alteration === 'bb') {
        note = note.equivalent('');
    }
    if (note.letter === 'C' && (note.alteration === '')) {
        note.letter = 'B';
        note.octave = note.octave - 1;
    } else if (note.letter === 'C' && note.alteration === 'b') {
        note.letter = 'B';
        note.alteration = 'b';
        note.octave = note.octave - 1;
    } else if (note.letter === 'F' && (note.alteration === '')){
        note.letter = 'E';
    } else if (note.letter === 'F' && note.alteration === 'b'){
        note.letter = 'E';
        note.alteration = 'b';
    } else if (note.alteration === '#') {
        note.alteration = '';
    } else if (note.alteration === '') {
        note.alteration = 'b';
    } else if (note.alteration === 'b') {
        note.letter = prevLetter(note.letter);
        note.alteration = '';
    }

    return note;
};

Note.prototype.add = function(val) {
    var note = new Note(this);
    for (var i = 0; i < val; i++) {
        note = note.incr();
    }
    return note;
};

Note.prototype.sub = function(val) {
    var note = new Note(this);
    for (var i = 0; i < val; i++) {
        note = note.decr();
    }
    return note;
};

Note.prototype.enharmonic = function() {
    if (this.alteration === '#') {
        return this.equivalent('b');
    } else if (this.alteration === 'b') {
        return this.equivalent('#');
    } else {
        return null;
    }
};

Note.prototype.equivalent = function(eq) {
    if (alterations.includes(eq)) {
        return this._equivalentAlteration(eq);
    } else if (letters.includes(eq)) {
        return this._equivalentLetter(eq);
    } else {
        return null;
    }
}

Note.prototype._equivalentAlteration = function(alteration) {
    if (alteration === this.alteration) {
        return new Note(this);
    }
    
    var d = 0;
    if (alteration === '') {
        if ((this.alteration === '##')
            || ((this.alteration === '#') && (this.letter === 'E' || this.letter === 'B'))) {
            d = 1;
        } else if ((this.alteration === 'bb')
                   || ((this.alteration === 'b') && (this.letter === 'F' || this.letter === 'C'))) {
            d = -1;
        }
    } else if (alteration === '#') {
        if ((this.alteration === '')
            && (this.letter === 'F' || this.letter === 'C')) {
            d = -1;
        } else if ((this.alteration === 'b')
                   && (this.letter !== 'F' && this.letter !== 'C')) {
            d = -1; 
        } else if ((this.alteration === 'bb')
                   && (this.letter === 'G' || this.letter === 'D')) {
            d = -2; 
        }
    } else if (alteration === 'b') {
        if ((this.alteration === '')
            && (this.letter === 'E' || this.letter === 'B')) {
            d = 1;
        } else if ((this.alteration === '#')
                   && (this.letter !== 'E' && this.letter !== 'B')) {
            d = 1; 
        } else if ((this.alteration === '##')
                   && (this.letter === 'D' || this.letter === 'A')) {
            d = 2; 
        }
    } else if (alteration === '##') {
        if (this.alteration === ''
            && (this.letter !== 'C' && this.letter !== 'F')) {
            d = -1;
        } else if (this.alteration === 'b'
                   && (this.letter === 'C' || this.letter === 'F')) {
            d = -2;
        } else if (this.alteration === 'bb'
                   && (this.letter !== 'D' && this.letter !== 'G')) {
            d = -2;
        }
    } else if (alteration === 'bb') {
        if (this.alteration === ''
            && (this.letter !== 'E' && this.letter !== 'B')) {
            d = 1; 
        } else if (this.alteration === '#'
            && (this.letter === 'E' || this.letter === 'B')) {
            d = 2; 
        } else if (this.alteration === '##'
                   && (this.letter !== 'D' && this.letter !== 'A')) {
            d = 2
        }
    }

    var letter = this.letter;
    var octave = this.octave;
    if (d > 0) {
        for (var i = 0; i < d; i++) {
            letter = nextLetter(letter);
            if (octave !== undefined && letter === letters[0]) {
                octave++;
            }
        }
        return new Note(letter, alteration, octave);
    } else if (d < 0) {
        for (var i = 0; i < -d; i++) {
            letter = prevLetter(letter);
            if (octave !== undefined && letter === letters[letters.length-1]) {
                octave--;
            }
        }
        return new Note(letter, alteration, octave);
    } else {
        return null;
    }
}

Note.prototype._equivalentLetter = function(letter) {
    if (this.letter === letter) {
        return new Note(this);
    }

    var alteration;
    var octave = this.octave;
    if (letter === prevLetter(this.letter)) {
        if (this.alteration === 'b') {
            if (this.letter === 'F' || this.letter === 'C') {
                alteration = '';
            } else {
                alteration = '#';
            }
        } else if (this.alteration === '') {
            if (this.letter === 'F' || this.letter === 'C') {
                alteration = '#';
            } else {
                alteration = '##';
            }
        } else if (this.alteration === 'bb') {
            alteration = '';
        }
        if (octave !== undefined && letter === letters[letters.length-1]) {
            octave--;
        }
    } else if (letter === nextLetter(this.letter)) {
        if (this.alteration === '#') {
            if (this.letter === 'E' || this.letter === 'B') {
                alteration = '';
            } else {
                alteration = 'b';
            }
        } else if (this.alteration === '') {
            if (this.letter === 'E' || this.letter === 'B') {
                alteration = 'b';
            } else {
                alteration = 'bb';
            }
        } else if (this.alteration === '##') {
            alteration = '';
        }
        if (octave !== undefined && letter === letters[0]) {
            octave++;
        }
    }

    if (alteration !== undefined) {
        return new Note(letter, alteration, octave);
    } else {
        return null;
    }
}

Note.prototype.toString = function() {
    if (this.octave === undefined) {
        return this.letter + this.alteration;
    } else {
        return this.letter + this.alteration + this.octave;
    }
}

module.exports = Note;