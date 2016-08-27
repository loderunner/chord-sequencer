var RomanNumerals = {
    numbers : ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
    
    parseNumber : function(romanNumeral) {
        return this.numbers.indexOf(romanNumeral);
    },
    
    toRoman : function(num) {
        return this.numbers[num];
    }
}

var Modes = {
    Major : '-------',
    Ionian : '-------',
    Dorian : '--b---b',
    Phrygian : '-bb--bb',
    Lydian : '---#---',
    Mixolydian : '------b',
    Aeolian : '--b--bb',
    Locrian : '-bb-bbb',
    Minor : '--b--bb',
    Harmonic : '--b--b-',
    Melodic : '--b----',
}

var Scales = {
    'C'  : ['C' , 'D' , 'E' , 'F' , 'G' , 'A' , 'B' ],
    'C#' : ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#'],
    'Db' : ['Db', 'Eb', 'F' , 'Gb', 'Ab', 'Bb', 'C' ],
    'D'  : ['D' , 'E' , 'F#', 'G' , 'A' , 'B' , 'C#'],
    'Eb' : ['Eb', 'F' , 'G' , 'Ab', 'Bb', 'C' , 'D' ],
    'E'  : ['E' , 'F#', 'G#', 'A' , 'B' , 'C#', 'D#'],
    'F'  : ['F' , 'G' , 'A' , 'Bb', 'C' , 'D' , 'E' ],
    'F#' : ['F#', 'G#', 'A#', 'B' , 'C#', 'D#', 'E#'],
    'Gb' : ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F' ],
    'G'  : ['G' , 'A' , 'B' , 'C' , 'D' , 'E' , 'F#'],
    'Ab' : ['Ab', 'Bb', 'C' , 'Db', 'Eb', 'F' , 'G' ],
    'A'  : ['A' , 'B' , 'C#', 'D' , 'E' , 'F#', 'G#'],
    'Bb' : ['Bb', 'C' , 'D' , 'Eb', 'F' , 'G' , 'A' ],
    'B'  : ['B' , 'C#', 'D#', 'E' , 'F#', 'G#', 'A#'],
    'Cb' : ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb']
}

var Tonality = {
    key : "C",
    mode : "Major",
    
    noteForStep : function(step) {
        if (typeof(step) == 'string') {
            step = RomanNumerals.parseNumber(step);
        }
        
        const scale = Scales[this.key];
        const accidentals = Modes[this.mode];
        
        var note = scale[step];
        var acc = accidentals[step];
        if (acc == '#') {
            if (note[note.length - 1] == 'b') {
                note = note[0];
            } else if (note[note.length - 1] == '#') {
                // double-#: increment letter by one, wrapping at G
                //           letter "number"   
                //               character code of letter - character code of 'A'(65) 
                //           increment by 1
                //               + 1
                //           wrapping at G, the 7th note
                //               % 7
                //           back to letter
                //               + character code of 'A'(65)
                note = String.fromCharCode(((note.charCodeAt(0) - 64) % 7) + 65);
                // fix for C and F (B## <=> C#)
                if ((note == 'C') || (note == 'F')) {
                    note += '#';
                }
            } else {
                note += '#';
            }
        } else if (acc == 'b') {
            if (note[note.length - 1] == 'b') {
                // double-b: decrement letter by one, wrapping at A
                //           letter "number"   
                //               character code of letter - character code of 'A'(65) 
                //           decrement by 1
                //               - 1
                //           wrapping at A, the 0th note
                //               + 7) % 7
                //           back to letter
                //               + character code of 'A'(65)
                note = String.fromCharCode(((note.charCodeAt(0) - 59) % 7) + 65);
                // fix for B and E (Cbb <=> Bb)
                if ((note == 'B') || (note == 'E')) {
                    note += 'b';
                }
            } else if (note[note.length - 1] == '#') {
                note = note[0];
            } else {
                note += 'b';
            }
        }
        
        return note;
    }
}

var Chord = function(root, numberOfNotes) {
    this.root = root;
    this.numberOfNotes = numberOfNotes || 3;
};

Object.defineProperty(Chord.prototype, 'notes', {
    get : function() {
        var step = RomanNumerals.parseNumber(this.root);
        var notes = []
        for (var i = 0; i < this.numberOfNotes; i++) {
            notes.push(Tonality.noteForStep(step % 7));
            step += 2;
        }
        return notes;
    }
});