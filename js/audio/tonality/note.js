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

    if (!alteration && !octave) {

        if ((typeof letter) !== (typeof '')) {
            throw new TypeError('' + letter + ' is not a string');
        } 

        const values = regex.exec(letter);

        if (values)
        {
            this.letter = values[1];
            this.alteration = values[2] ? values[2] : '';
            this.octave = values[3] ? parseInt(values[3]) : undefined;
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
        && ((this.alteration === 'bb') && ((this.letter === 'C') || (this.letter === 'F')))) {
        throw new InvalidArgumentError(this.toString() + " is not a note")
    }

    return this;
};

Note.letters = letters;
Note.alterations = alterations;

Note.prototype.incr = function() {
    var note = new Note(this);
    if ((this.letter === 'E') && (!this.alteration || this.alteration === '')) {
        note.letter = 'F';
    } else if ((this.letter === 'E') && (this.alteration === '#')) {
        note.letter = 'F';
        note.alteration = '#';
    } else if (this.letter === 'B' && (!this.alteration || this.alteration === '')){
        note.letter = 'C';
        note.octave = this.octave + 1;
    } else if (this.letter === 'B' && this.alteration === '#'){
        note.letter = 'C';
        note.alteration = '#';
        note.octave = this.octave + 1;
    } else if (this.alteration === 'b') {
        note.alteration = undefined;
    } else if (!this.alteration || this.alteration === '') {
        note.alteration = '#';
    } else if (this.alteration === '#') {
        note.letter = nextLetter(this.letter);
        note.alteration = undefined;
    }

    return note;
};

Note.prototype.decr = function() {
    var note = new Note(this);
    if (this.letter === 'C' && (!this.alteration || this.alteration === '')) {
        note.letter = 'B';
        note.octave = this.octave - 1;
    } else if (this.letter === 'C' && this.alteration === 'b') {
        note.letter = 'B';
        note.alteration = 'b';
        note.octave = this.octave - 1;
    } else if (this.letter === 'F' && (!this.alteration || this.alteration === '')){
        note.letter = 'E';
    } else if (this.letter === 'F' && this.alteration === 'b'){
        note.letter = 'E';
        note.alteration = 'b';
    } else if (this.alteration === '#') {
        note.alteration = undefined;
    } else if (!this.alteration || this.alteration === '') {
        note.alteration = 'b';
    } else if (this.alteration === 'b') {
        note.letter = prevLetter(this.letter);
        note.alteration = undefined;
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
        if (this.letter === 'E') {
            return new Note('F', '', this.octave);
        } else if (this.letter === 'B') {
            return new Note('C', '', this.octave + 1);
        } else {
            return new Note('A', 'b', this.octave);
        }
    } else if (this.alteration === 'b') {
        if (this.letter === 'F') {
            return new Note('E', '', this.octave);
        } else if (this.letter === 'C') {
            return new Note('B', '', this.octave - 1);
        } else {
            return new Note(prevLetter(this.letter), '#', this.octave);
        }
    } else {
        if (this.letter === 'E') {
            return new Note('F', 'b', this.octave);
        } else if (this.letter === 'F') {
            return new Note('E', '#', this.octave);
        } else if (this.letter === 'B') {
            return new Note('C', 'b', this.octave + 1);
        } else if (this.letter === 'C') {
            return new Note('B', '#', this.octave - 1);
        } else {
            return new Note(this);
        }
    }
};

Note.prototype.equivalent = function(alteration) {
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
                   && (this.letter !== 'F' && this.letter === 'C')) {
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
                   && (this.letter !== 'E' && this.letter === 'B')) {
            d = 1; 
        } else if ((this.alteration === '##')
                   && (this.letter === 'D' || this.letter === 'A')) {
            d = 2; 
        }
    } else if (alteration === '##') {
        if (this.alteration === '') {
            d = -2;
        }
    } else if (alteration === 'bb') {
        if (this.alteration === '') {
            d = 2; 
        }
    }

    var letter = this.letter;
    var octave = this.octave;
    if (d > 0) {
        for (var i = 0; i < d; i++) {
            letter = nextLetter(letter);
            if (octave && letter === letters[0]) {
                octave++;
            }
        }
        return new Note(letter, alteration, octave);
    } else if (d < 0) {
        for (var i = 0; i < -d; i++) {
            letter = prevLetter(letter);
            if (octave && letter === letters[letters.length-1]) {
                octave--;
            }
        }
        return new Note(letter, alteration, octave);
    } else {
        return null;
    }

}

Note.prototype.toString = function() {
    return this.letter + this.alteration + this.octave;
}

module.exports = Note;