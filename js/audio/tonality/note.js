const letters = 'ABCDEFG';
const regex = /([A-G])(#|b)?(\d+)/;

function Note(letter, alteration, octave) {
    if (letter instanceof Note) {
        const note = letter;
        this.letter = note.letter;
        this.alteration = note.alteration;
        this.octave = note.octave;
    }

    if (!alteration && !octave) {
        const values = regex.exec(letter);
        this.letter = values[1];
        this.alteration = values[2];
        this.octave = parseInt(values[3]);
    } else {
        this.letter = letter;
        this.alteration = alteration;
        this.octave = octave;
    }

    return this;
};

Note.prototype.incr = function() {
    var note = new Note(this);
    if (this.letter === 'E' && !this.alteration) {
        note.letter = 'F';
    } else if (this.letter === 'B' && !this.alteration){
        note.letter = 'C';
        note.octave = this.octave + 1;
    } else if (this.alteration === 'b') {
        note.alteration = undefined;
    } else if (!this.alteration) {
        note.alteration = '#';
    } else if (this.alteration === '#') {
        note.letter = letters[(letters.indexOf(this.letter) + 1) % letters.length];
        note.alteration = undefined;
    }

    return note;
};

Note.prototype.decr = function() {
    var note = new Note(this);
    if (this.letter === 'C' && !this.alteration) {
        note.letter = 'B';
        note.octave = this.octave - 1;
    } else if (this.letter === 'F' && !this.alteration){
        note.letter = 'E';
    } else if (this.alteration === '#') {
        note.alteration = undefined;
    } else if (!this.alteration) {
        note.alteration = 'b';
    } else if (this.alteration === 'b') {
        note.letter = letters[(letters.indexOf(this.letter) + 7 - 1) % letters.length];
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
        return new Note(letters[letters.indexOf(letter) + 1], 'b', octave);
    } else if (this.alteration === 'b') {
        return new Note(letters[letters.indexOf(letter) - 1], '#', octave);
    } else {
        return new Note(this);
    }
};

Note.prototype.toString = function() {
    return this.letter + (this.alteration ? this.alteration : '') + this.octave.toString();
}

module.exports = Note;